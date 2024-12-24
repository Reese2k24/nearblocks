import { cleanEnv, str, num } from 'envalid';

import { Config } from '#types/types';

const env = cleanEnv(process.env, {
  API_URL: str({ default: 'https://api.exploreblocks.io/api' }),
  AWS_URL: str(),
  DATABASE_URL: str(),
  JWT_SECRET: str(),
  REDIS_URL: str(),
  SENTRY_DSN: str({ default: '' }),
  SMTP_HOST: str(),
  SMTP_PORT: num(),
  SMTP_USER: str(),
  SMTP_PASS: str(),
  SMTP_EMAIL: str(),
  REDIS_PASSWORD: str({ default: '' }),
  REDIS_SENTINEL_NAME: str({ default: '' }),
  REDIS_SENTINEL_PASSWORD: str({ default: '' }),
  REDIS_SENTINEL_URLS: str({ default: '' }),
});

const config: Config = {
  apiUrl: env.API_URL,
  awsUrl: env.AWS_URL,
  dbUrl: env.DATABASE_URL,
  port: 3008,
  jwtSecret: env.JWT_SECRET,
  redisUrl: env.REDIS_URL,
  sentryDsn: env.SENTRY_DSN,
  smtpHost: env.SMTP_HOST,
  smtpPort: env.SMTP_PORT,
  smtpUser: env.SMTP_USER,
  smtpPass: env.SMTP_PASS,
  smtpMail: env.SMTP_EMAIL,
  redisPassword: env.REDIS_PASSWORD,
  redisSentinelName: env.REDIS_SENTINEL_NAME,
  redisSentinelPassword: env.REDIS_SENTINEL_PASSWORD,
  redisSentinelUrls: env.REDIS_SENTINEL_URLS,
};

export default config;
