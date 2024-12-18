import jwt from 'jsonwebtoken';

import config from '#config';
import dayjs from '#libs/dayjs';
import { User } from '#types/types';

const sign = (user: User, remember = false) => {
  const exp = dayjs
    .utc()
    .add(1, remember ? 'week' : 'hour')
    .unix();

  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      exp,
    },
    config.jwtSecret,
  );
};

const verify = (token: string) => {
  return jwt.verify(token, config.jwtSecret);
};

export default { sign, verify };
