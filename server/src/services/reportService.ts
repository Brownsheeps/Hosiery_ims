import prisma from "../utils/db.js";
import type { ReportsResponse } from "../types/report.types.js";

export async function getReportData(params: {
  page?: number;
  pageSize?: number;
}): Promise<ReportsResponse> {
  const page = Math.max(Number(params.page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(params.pageSize) || 20, 1), 100);
  const skip = (page - 1) * pageSize;

  const [ inventoryCount, categoryCount, transactionCount, lowStockVariants, transactions] = await Promise.all([
    
    prisma.product_variants.count(),

    prisma.categories.count(),

    prisma.inventory_transactions.count(),

    prisma.product_variants.findMany({
      select: {
        min_stock: true,
        inventory: {
          select: {
            quantity: true,
          },
        },
      },
    }),

    prisma.inventory_transactions.findMany({
      skip,
      take: pageSize,
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        txn_type: true,
        quantity: true,
        remarks: true,
        created_at: true,
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
    }),
  ]);

  const lowStock = lowStockVariants.filter((item) => {
    const stock = item.inventory?.quantity ?? 0;
    const minStock = item.min_stock ?? 0;

    return stock > 0 && stock <= minStock;
  }).length;

  return {
    summary: {
      currentInventory: inventoryCount,
      lowStock,
      stockMovements: transactionCount,
      categories: categoryCount,
    },

    recentTransactions: {
      items: transactions.map((item) => ({
        id: item.id,
        date: item.created_at,
        sku: item.variant.sku,
        product: item.variant.product.product_name,
        transactionType: item.txn_type ?? "",
        quantity: item.quantity,
        employee: item.users?.full_name ?? "System",
        remarks: item.remarks ?? null,
      })),

      pagination: {
        page,
        pageSize,
        totalItems: transactionCount,
        totalPages: Math.ceil(transactionCount / pageSize),
      },
    },
  };
}