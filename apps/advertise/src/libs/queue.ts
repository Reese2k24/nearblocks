import { Queue, WorkerOptions } from 'bullmq';
import { RedisOptions } from 'nb-redis';
import redis from '#libs/redis';

const DELAY = 10 * 1000; 

export const emailQueue = new Queue('email', {
  connection: {
    host: redis.client().options.host,
    port: redis.client().options.port,
    password: redis.client().options.password,
  } as RedisOptions,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: DELAY,
    },
    removeOnFail: true,
    removeOnComplete: true,
  },
});

export const emailQueueOptions: WorkerOptions = {
  connection: {
    host: redis.client().options.host,
    port: redis.client().options.port,
    password: redis.client().options.password,
  } as RedisOptions,
  limiter: {
    max: 1,
    duration: 1000,
  },
};
