import { Router } from "express";
import getDashboardData from "../controllers/dashboardController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { requireApproved } from "../middlewares/requireApproved.js";
import { authorize } from "../middlewares/authorize.js";
import { USER_ROLE } from "../constants/auth.constants.js";

const dashboardRouter = Router();

dashboardRouter.use(authMiddleware, requireApproved, authorize(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE));

dashboardRouter.get('/', getDashboardData);

export default dashboardRouter;