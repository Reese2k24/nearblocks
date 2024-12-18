import passport from 'passport';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';

import config from '#config';
import { jwtVerify } from '#services/passport';

const jwtOptions: StrategyOptions = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

export const jwtStrategy = new Strategy(jwtOptions, jwtVerify);

export const jwtAuth = passport.authenticate('jwt', { session: false });
