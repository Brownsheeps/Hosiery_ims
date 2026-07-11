import prisma from "../utils/db.js";
import type { ProductSearchResponse } from "../types/product.types.js";

export async function searchProducts(
    query: string
): Promise<ProductSearchResponse> {

    const q = query.trim();

    if (!q) {
        return {
            items: [],
        };
    }

    const variants = await prisma.product_variants.findMany({
        where: {
            OR: [
                {
                    sku: {
                        contains: q,
                        mode: "insensitive",
                    },
                },
                {
                    product: {
                        product_name: {
                            contains: q,
                            mode: "insensitive",
                        },
                    },
                },
            ],
        },
        take: 8,
        orderBy: {
            sku: "asc",
        },
        select: {
            id: true,
            sku: true,
            colour: {
                select: {
                    name: true,
                },
            },
            size: {
                select: {
                    name: true,
                },
            },
            inventory: {
                select: {
                    quantity: true,
                },
            },
            product: {
                select: {
                    product_name: true,
                },
            },
        },
    });

    return {
        items: variants.map((item) => ({
            variantId: item.id,
            sku: item.sku,
            productName: item.product.product_name,
            color: item.colour?.name ?? null,
            size: item.size?.name ?? null,
            currentStock: item.inventory?.quantity ?? 0,
        })),
    };
}