import type { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../utils/response.js";
import { getProductMetadata, createProduct, searchProducts } from "../services/productService.js";

function badRequest(res: Response, message: string): void {
  res.status(400).json({ success: false, message });
}

export async function getMetadataController(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    sendSuccess(res, await getProductMetadata(), "Metadata fetched");
  } catch (error) { next(error); }
}

export async function createProductController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { product, variants } = req.body;
    console.log(product, variants);

    if (!product?.name?.trim()) return void badRequest(res, "product.name is required");
    if (product.categoryId == null && !product.newCategory?.trim()) return void badRequest(res, "Provide categoryId or newCategory");
    if (product.brandId == null && !product.newBrand?.trim()) return void badRequest(res, "Provide brandId or newBrand");
    if (product.brandId == null && !product.newBrandCode?.trim()) return void badRequest(res, "Provide newBrandCode when creating a new brand");
    if (product.supplierId == null && !product.newSupplier?.trim()) return void badRequest(res, "Provide supplierId or newSupplier");
    if (!Array.isArray(variants) || variants.length === 0) return void badRequest(res, "At least one variant required");

    for (const v of variants) {
      if (v.colourId == null && !v.newColour?.trim()) return void badRequest(res, "Each variant needs colourId or newColour");
      if (v.colourId == null && !v.newColourCode?.trim()) return void badRequest(res, "Provide newColourCode when creating a new colour");
      if (v.sizeId == null && !v.newSize?.trim()) return void badRequest(res, "Each variant needs sizeId or newSize");
      if (v.sizeId == null && !v.newSizeCode?.trim()) return void badRequest(res, "Provide newSizeCode when creating a new size");
    }

    sendSuccess(res, await createProduct(req.body), "Product created", 201);
  } catch (error: any) {
    if (error.status) { res.status(error.status).json({ success: false, message: error.message }); return; }
    next(error);
  }
}

export async function searchProductsController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = typeof req.query.q === "string" ? req.query.q : "";
    const products = await searchProducts(query);
    sendSuccess(res, products, products.items.length === 0 ? "No matching products found" : "Products fetched");
  } catch (error) { next(error); }
}