import { Router } from "express";
import { searchProductsController } from "../controllers/productController.js";

const productRouter = Router();

productRouter.get("/search", searchProductsController);

export default productRouter;