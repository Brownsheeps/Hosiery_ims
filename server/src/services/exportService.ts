import prisma from "../utils/db.js";

export async function getExportData(type: string) {

    switch(type){

        case "current-inventory":

            const inventory = await prisma.product_variants.findMany({
            orderBy: {
                sku: "asc",
            },
            select: {
                sku: true,
                purchase_price: true,
                selling_price: true,

                product: {
                select: {
                    product_name: true,
                },
                },

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
            },
            });
        return inventory.map(item => ({
            sku: item.sku,
            product: item.product.product_name,
            color: item.colour?.name ?? "",
            size: item.size?.name ?? "",
            purchasePrice: Number(item.purchase_price ?? 0),
            sellingPrice: Number(item.selling_price ?? 0),
            stock: item.inventory?.quantity ?? 0,
        }));

        case "low-stock":

        const data = await prisma.product_variants.findMany({
            orderBy: {
                sku: "asc",
            },
            select: {
                sku: true,
                min_stock: true,

                product: {
                select: {
                    product_name: true
                },
                },

                inventory: {
                select: {
                    quantity: true,
                },
                },
            },
        });

        const lowStock = data.filter(item => {
            const stock = item.inventory?.quantity ?? 0;
            const minStock = item.min_stock ?? 0;

            return stock <= minStock;
        });

        return lowStock.map(item => ({
            sku: item.sku,
            product: item.product.product_name,
            stock: item.inventory?.quantity ?? 0,
            minStock: item.min_stock ?? 0,
        }));
                

        case "stock-movements":

        const transactions = await prisma.inventory_transactions.findMany({
            orderBy: {
                created_at: "desc",
            },

            select: {
                created_at: true,
                txn_type: true,
                quantity: true,
                remarks: true,

                users: {
                select: {
                    full_name: true,
                },
                },

                variant: {
                select: {
                    sku: true,

                    product: {
                    select: {
                        product_name: true,
                    },
                    },
                },
                },
            },
        });

        return transactions.map(item => ({
            date: item.created_at,
            sku: item.variant.sku,
            product: item.variant.product.product_name,
            transactionType: item.txn_type,
            quantity: item.quantity,
            employee: item.users?.full_name ?? "System",
            remarks: item.remarks ?? "",
        }));

        case "category-wise":

        const products = await prisma.products.findMany({
            select: {
                categories: {
                select: {
                    name: true,
                },
                },

                variants: {
                select: {
                    inventory: {
                    select: {
                        quantity: true,
                    },
                    },
                },
                },
            },
        });

        const categoryMap = new Map<
            string,
            {
                skuCount: number;
                totalUnits: number;
            }
        >();
            
        for (const product of products) {

            const category =
                product.categories?.name ?? "Uncategorized";

            if (!categoryMap.has(category)) {

                categoryMap.set(category, {
                    skuCount: 0,
                    totalUnits: 0,
                });

            }

            const current = categoryMap.get(category)!;

            current.skuCount += product.variants.length;

            current.totalUnits += product.variants.reduce((sum, variant) => sum + (variant.inventory?.quantity ?? 0),0,);
        }   

        return Array.from(categoryMap.entries()).map(
            ([category, value]) => ({
                category,
                skuCount: value.skuCount,
                totalUnits: value.totalUnits,
            }),
        );

        default:

            throw new Error("Invalid export type");
    }

}