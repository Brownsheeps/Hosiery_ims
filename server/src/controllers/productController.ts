import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../utils/response.js";
import { searchProducts } from "../services/productService.js";

export async function searchProductsController(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {

    try {

        const query = typeof req.query.q === "string" ? req.query.q : "";

        const products = await searchProducts(query);

        sendSuccess(
            res,
            products,
            products.items.length === 0
            ? "No matching products found"
            : "Products fetched successfully"
        );

    } catch (error) {
        next(error);
    }

}