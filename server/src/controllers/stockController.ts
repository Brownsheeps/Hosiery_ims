import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../utils/response.js";
import * as stockService from "../services/stockService.js";
import type { StockMovementInput } from "../types/stock.types.js";


function getStockMovementBody(req: Request): StockMovementInput {

    const body = req.body ?? {};

    const variantId = Number(body.variantId);
    const quantity = Number(body.quantity);

    return {
        variantId,
        quantity,
        remarks: body.remarks?.trim() || null
    };
}

export async function stockIn(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const data = await stockService.stockIn(getStockMovementBody(req));
        sendSuccess(res, data, "Stock in recorded successfully", 201);
    } catch (error) {
        next(error);
    }
}

export async function stockOut(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const data = await stockService.stockOut(getStockMovementBody(req));
        sendSuccess(res, data, "Stock out recorded successfully", 201);
    } catch (error) {
        next(error);
    }
}

export async function stockAdjust(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const data = await stockService.stockAdjust(getStockMovementBody(req));
    sendSuccess(res, data, "Stock adjustment recorded successfully", 201);
}
