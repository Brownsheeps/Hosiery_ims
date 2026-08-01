import { Router } from "express";
import {
  getMetadataController,
  createProductController,
  searchProductsController,
} from "../controllers/productController.js";
import { authMiddleware } from "../middlewares/auth.js";
import { requireApproved } from "../middlewares/requireApproved.js";
import { authorize } from "../middlewares/authorize.js";
import { USER_ROLE } from "../constants/auth.constants.js";

const productRouter = Router();

productRouter.use(authMiddleware, requireApproved, authorize(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE));

productRouter.get("/metadata", getMetadataController);
productRouter.post("/", createProductController);
productRouter.get("/search", searchProductsController);

export default productRouter;