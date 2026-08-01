import { Router } from "express";
import getInventoryData from "../controllers/inventoryController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { requireApproved } from "../middlewares/requireApproved.js";
import { authorize } from "../middlewares/authorize.js";
import { USER_ROLE } from "../constants/auth.constants.js";

const inventoryRouter = Router();

inventoryRouter.use(authMiddleware, requireApproved, authorize(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE));

inventoryRouter.get('/', getInventoryData);

export default inventoryRouter;