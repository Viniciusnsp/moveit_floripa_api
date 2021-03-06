import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const uploads = multer(multerConfig);

routes.post('/users', UserController.store);

routes.get('/users', UserController.index);
routes.delete('/user/:id', UserController.delete);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/files', uploads.single('file'), FileController.store);

export default routes;
