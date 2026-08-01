import { Router } from "express";
import { stockIn, stockOut, stockAdjust } from "../controllers/stockController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { requireApproved } from "../middlewares/requireApproved.js";
import { authorize } from "../middlewares/authorize.js";
import { USER_ROLE } from "../constants/auth.constants.js";

const stockRouter = Router();

stockRouter.use(authMiddleware, requireApproved, authorize(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE));

stockRouter.post("/in", stockIn);
stockRouter.post("/out", stockOut);
stockRouter.post("/adjust", stockAdjust);

export default stockRouter;
