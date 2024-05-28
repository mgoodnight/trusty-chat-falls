import { Router } from 'express';

const mainRouter = Router();
mainRouter.get('/healthcheck', (req, res) => res.send());

export default mainRouter;
