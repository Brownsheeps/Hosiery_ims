import { Router } from "express";
import { reportController } from "../controllers/reportsController.js";
import { exportController } from "../controllers/exportController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { requireApproved } from "../middlewares/requireApproved.js";
import { authorize } from "../middlewares/authorize.js";
import { USER_ROLE } from "../constants/auth.constants.js";

const reportRouter = Router();

reportRouter.use(authMiddleware, requireApproved, authorize(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE));

reportRouter.get('/', reportController);
reportRouter.get('/export', exportController);

export default reportRouter;