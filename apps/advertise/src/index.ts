import { Worker } from 'bullmq';

import app from './app.js';
import config from '#config';
import redis from '#libs/redis';
import logger from '#libs/logger';
import sentry from '#libs/sentry';
import { emailQueueOptions } from '#libs/queue';
import emailJob from '#services/queues/email';

const emailWorker = new Worker('email', emailJob, emailQueueOptions);

app.listen(config.port, async () => {
  logger.info(`server listening on port ${config.port}`);
});

const onSignal = (signal: string | number) => {
  const handler = async () => {
    await redis.quit();
    await sentry.close(1000);
    await emailWorker.close();
  };

  handler()
    .catch(logger.error)
    .finally(() => process.kill(process.pid, signal));
};

process.once('SIGINT', onSignal);
process.once('SIGTERM', onSignal);
