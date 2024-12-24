import { Router } from 'express';
import auth from '#services/auth';
import validator from '#middlewares/validator';
import schema from '#libs/schema/auth';

const route = Router();

const routes = (app: Router) => {
  app.use('/', route);  

  route.post('/login', validator(schema.login), auth.login);
  route.post('/register', validator(schema.register), auth.register);
  route.post('/resend', validator(schema.resend), auth.resend);
  route.post('/verify', validator(schema.verify), auth.verify);
  route.post('/forgot', validator(schema.forgot), auth.forgot);
  route.post('/reset', validator(schema.reset), auth.reset);
};

export default routes;
