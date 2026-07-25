import { Router } from "express";
import {
  getMetadataController,
  createProductController,
  searchProductsController,
} from "../controllers/productController.js";

const productRouter = Router();

productRouter.get("/metadata", getMetadataController);
productRouter.post("/", createProductController);
productRouter.get("/search", searchProductsController);

export default productRouter;