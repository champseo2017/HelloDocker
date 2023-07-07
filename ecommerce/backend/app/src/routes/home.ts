import express from 'express';
import { getHome } from '@controllers/home';

const homeRoutes = express.Router();
homeRoutes.get('/', getHome);

export { homeRoutes };