import express from 'express';
import { getHome } from '@controllers/home';

const userRoutes = express.Router();
userRoutes.post('/reg', getHome);

export { userRoutes };