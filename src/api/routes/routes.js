import authController from '../controllers/authController';
import taskController from '../controllers/taskController';
import restRoutes from './restRoutes';
import authRoutes from './authRoutes';

const routes = (app) => {
  authRoutes(app, authController);
  restRoutes(app, taskController, 'tasks');
};

export default routes;
