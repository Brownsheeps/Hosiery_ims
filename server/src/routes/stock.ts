import { Router } from "express";
import { stockIn, stockOut, stockAdjust } from "../controllers/stockController.js";

const stockRouter = Router();

stockRouter.post("/in", stockIn);

stockRouter.post("/out", stockOut);

stockRouter.post("/adjust", stockAdjust);

export default stockRouter;
