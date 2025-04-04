import Big from 'big.js';
import { Response } from 'express';

import catchAsync from '#libs/async';
import logger from '#libs/logger';
import { getProvider, viewBlock } from '#libs/near';
import sql from '#libs/postgres';
import redis from '#libs/redis';
import { List } from '#libs/schema/validators';
import {
  calculateAPY,
  calculateTotalStake,
  elapsedTime,
  epochProgress,
  EXTRA_PRECISION_MULTIPLIER,
  findStakeChange,
  FRACTION_DIGITS,
  getStakingStatus,
  networkHolderIndex,
  stakePercents,
  timeRemaining,
  validatorsSortFns,
} from '#libs/validators';
import { RequestValidator } from '#types/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
const list = catchAsync(async (req: RequestValidator<List>, res: Response) => {
  const page = req.validator.data.page;
  const perPage = req.validator.data.per_page;

  const data = await sql`
    SELECT
      *
    FROM
      validator_data
  `;

  const currentValidators = data?.[0]?.current_validators;
  const epochStartBlock = data?.[0]?.epoch_start_block;
  const epochStatsCheck = data?.[0]?.epoch_stats_check;
  const latestBlock = data?.[0]?.latest_block;
  const protocolConfig = data?.[0]?.protocol_config;
  const combinedData = data?.[0]?.validator_lists;
  const validatorTelemetry = data?.[0]?.validator_telemetry;

  if (combinedData && combinedData.length > 0) {
    const validatorPaginatedData = combinedData?.slice(
      page * perPage - perPage,
      page * perPage,
    );
    const totalStake = calculateTotalStake(combinedData);

    const sortedValidatorsData = validatorsSortFns.reduceRight(
      (acc, sortFn) => acc.sort(sortFn),
      [...combinedData],
    );
    const cumulativeAmounts = sortedValidatorsData.reduce<Big[]>(
      (acc: Big[], validator: any) => {
        const lastAmount = acc[acc.length - 1] ?? Big(0);
        return [
          ...acc,
          validator.currentEpoch
            ? lastAmount.plus(Big(validator.currentEpoch.stake))
            : lastAmount,
        ];
      },
      [],
    );

    const epochProgressData = epochProgress(
      latestBlock,
      epochStartBlock,
      protocolConfig,
    );
    const timeRemainingData = timeRemaining(
      latestBlock,
      epochStartBlock,
      epochProgressData,
    );
    const totalSeconds = timeRemainingData
      ? Math.floor(+timeRemainingData / 1000)
      : 0;
    const elapsedTimeData = elapsedTime(epochStartBlock);

    const validatorFullData = validatorPaginatedData.map(
      (validator: any, index: number) => {
        const currentStake = validator.currentEpoch?.stake;
        const stake = currentStake ? Big(currentStake) : Big(0);
        const extra = Big(EXTRA_PRECISION_MULTIPLIER);

        const ownPercent: Big.BigSource = stake
          .times(extra)
          .div(Big(+totalStake));
        const percent = ownPercent
          .div(extra)
          .times(Big(100))
          .toFixed(FRACTION_DIGITS);
        const pagedIndex = (page - 1) * perPage + index;

        const cumulativeStake = stakePercents(
          validator,
          currentStake,
          +totalStake,
          cumulativeAmounts[pagedIndex],
        );

        const isNetworkHolder = networkHolderIndex(
          totalStake,
          cumulativeAmounts,
        );
        const stakingStatus = getStakingStatus(validator, epochStatsCheck);

        const nextVisibleStake =
          validator.nextEpoch?.stake ?? validator.afterNextEpoch?.stake;

        const stakeDelta =
          validator.currentEpoch?.stake && nextVisibleStake
            ? Big(nextVisibleStake).minus(validator.currentEpoch.stake)
            : undefined;

        const stakeChange = findStakeChange(Number(stakeDelta));

        return {
          ...validator,
          cumulativeStake,
          percent,
          showWarning: isNetworkHolder === pagedIndex,
          stakeChange,
          stakingStatus,
          warning:
            isNetworkHolder === pagedIndex
              ? `Validators 1 - ${
                  index + 1
                } hold a cumulative stake above 33%. Delegating to the validators below improves the decentralization of the network.`
              : '',
        };
      },
    );

    let lastEpochApy = '0';
    const EPOCH_EXPIRY = 43200;

    try {
      const provider = getProvider();

      const cacheKey = `lastEpochApy`;

      const data = await redis.get(cacheKey);
      const cachedData = data ? JSON.parse(data) : null;

      let latestBlockResult = null;
      let latestBlockHeight = 0;
      let expireThreshold = 0;

      if (cachedData) {
        lastEpochApy = cachedData.apy;
        const cachedEpochId = cachedData.epochId;

        const blockQuery = sql`
          SELECT
            block_height
          FROM
            blocks
          WHERE
            block_hash = ${cachedEpochId}
          LIMIT
            1
        `;

        const blockResult = await blockQuery;
        const cachedBlockHeight = blockResult[0]?.block_height || 0;

        const latestBlockQuery = sql`
          SELECT
            block_height,
            block_hash
          FROM
            blocks
          ORDER BY
            block_height DESC
          LIMIT
            1
        `;

        [latestBlockResult] = await Promise.all([latestBlockQuery]);
        latestBlockHeight = latestBlockResult[0]?.block_height || {};

        expireThreshold = EPOCH_EXPIRY + parseInt(cachedBlockHeight, 10);
      }

      if (latestBlockHeight >= expireThreshold || !cachedData) {
        const block = await viewBlock(provider, { finality: 'final' });

        const [prevEpoch, epoch] = await Promise.all([
          viewBlock(provider, { blockId: block.header.epoch_id }),
          viewBlock(provider, { blockId: block.header.next_epoch_id }),
        ]);

        const apy = calculateAPY(
          totalStake,
          epoch.header.timestamp_nanosec,
          prevEpoch.header.timestamp_nanosec,
          block.header.total_supply,
        );

        const cacheData = {
          apy: apy,
          epochId: block.header.epoch_id,
        };

        await redis.set(cacheKey, JSON.stringify(cacheData));
        logger.info('Cache updated:', cacheData);
      }
    } catch (error) {
      console.log({ error });
      //
    }

    return res.status(200).json({
      currentValidators: currentValidators.length,
      elapsedTimeData,
      epochProgressData,
      epochStatsCheck,
      lastEpochApy,
      latestBlock,
      total: combinedData.length,
      totalSeconds,
      totalStake,
      validatorFullData,
      validatorTelemetry,
    });
  }

  return res.status(200).json({
    currentValidators: 0,
    elapsedTimeData: 0,
    epochProgressData: 0,
    epochStatsCheck: 0,
    lastEpochApy: 0,
    latestBlock: {},
    total: 0,
    totalSeconds: 0,
    totalStake: 0,
    validatorFullData: [],
    validatorTelemetry: [],
  });
});

export default { list };
