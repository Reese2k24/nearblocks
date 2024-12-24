import { Request } from 'express';
import { SafeParseSuccess } from 'zod';

import { VerificationKind } from '#types/enums';

export interface RequestValidators<T> extends Request {
  validator?: SafeParseSuccess<T>;
}

export type RequestValidator<T> = Required<RequestValidators<T>>;

export type Config = {
  apiUrl: string;
  awsUrl: string;
  dbUrl: string;
  port: number;
  jwtSecret: string;
  redisUrl: string;
  sentryDsn?: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpMail: string;
  redisPassword: string;
  redisSentinelName: string;
  redisSentinelPassword: string;
  redisSentinelUrls: string;
};

export type Campaign = {
  api_subscription_id: number;
  click_count: number;
  desktop_image_center: string;
  desktop_image_right: string;
  icon: string;
  id: number;
  impression_count: number;
  is_active: boolean;
  is_approved: boolean;
  link_name: string;
  mobile_image: string;
  site_name: string;
  start_date: string;
  text: string;
  title: string;
  url: string;
};

export type User = {
  id: number;
  stripe_cid?: string;
  email: string;
  username: string;
  verified: boolean;
  last_login_at: string;
  salt: string;
  password: string;
  plan?: Plan;
  keys?: Key[];
  verification?: Verification;
};

export type Plan = {
  id: number;
  stripe_pid?: string;
  stripe_mpid?: string;
  stripe_ypid?: string;
  title: string;
  limit_per_second: number;
  limit_per_minute: number;
  limit_per_day: number;
  limit_per_month: number;
  price_monthly: number;
  price_annually: number;
};

export type Key = {
  id: number;
  name: string;
  token: number;
  created_at: string;
  updated_at: string;
  user?: User;
};

export type Verification = {
  id: number;
  type: VerificationKind;
  email: string;
  code: string;
  expires_at: string;
  created_at: string;
  user?: User;
};

export type ValidationError = {
  message: string;
  path: string;
};
