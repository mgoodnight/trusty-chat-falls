import { Router } from 'express';

import healthcheckController from './controllers/healthcheck';

const mainRouter = Router();
mainRouter.get('/healthcheck', healthcheckController);

export default mainRouter;
