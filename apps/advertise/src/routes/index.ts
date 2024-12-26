import { Router } from 'express';

import auth from '#routes/auth';
import campaigns from '#routes/campaigns';
import profile from '#routes/profile';

const routes = () => {
  const app = Router();

  campaigns(app);
  auth(app);
  profile(app);

  return app;
};

export default routes;
