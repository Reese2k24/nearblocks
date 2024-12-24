import { Router } from 'express';

import campaigns from '#routes/campaigns';
import auth from '#routes/auth';

const routes = () => {
  const app = Router();

  campaigns(app);
  auth(app);

  return app;
};

export default routes;
