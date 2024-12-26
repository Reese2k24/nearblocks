import { Router } from 'express';

import schema from '#libs/schema/profile';
import { jwtAuth } from '#middlewares/passport';
import validator from '#middlewares/validator';
import profile from '#services/profile';

const route = Router();

const routes = (app: Router) => {
  app.use('/', route);

  route.get('/profile', jwtAuth, profile.info);

  route.post('/profile/email', jwtAuth, validator(schema.email), profile.email);
  route.patch(
    '/profile/password',
    jwtAuth,
    validator(schema.password),
    profile.password,
  );
  route.delete('/profile', jwtAuth, validator(schema.destroy), profile.destroy);

  route.patch(
    '/profile/email',
    validator(schema.updateEmail),
    profile.updateEmail,
  );
};

export default routes;
