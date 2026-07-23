import prisma from "../utils/db.js";
import type {
  DashboardData,
  LowStockProductData,
  RecentTransactionData,
} from "../types/dashboard.types.js";

export async function getDashboardData(): Promise<DashboardData> {
  const [
    totalSku,
    totalStockResult,
    outStock,
    lowStockCandidates,
    recentTransactions,
  ] = await Promise.all([

    prisma.product_variants.count(),

    prisma.inventory.aggregate({
      _sum: {
        quantity: true,
      },
    }),
    prisma.product_variants.count({
      where: {
        OR: [{ inventory: null }, { inventory: { quantity: 0 } }],
      },
    }),
    prisma.product_variants.findMany({
      where: {
        inventory: {
          quantity: {
            gt: 0,
          },
        },
      },
      select: {
        sku: true,
        min_stock: true,
        inventory: {
          select: {
            quantity: true,
          },
        },
        product: {
          select: {
            id: true,
            product_name: true
          },
        },
      },
    }),
    prisma.inventory_transactions.findMany({
      take: 10,
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        txn_type: true,
        quantity: true,
        created_at: true,
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
        users: {
          select: {
            full_name: true,
          },
        },
      },
    }),
  ]);

  const lowStockList = lowStockCandidates.filter((item) => {
    const quantity = item.inventory?.quantity ?? 0;
    const minStock = item.min_stock ?? 0;
    return quantity <= minStock;
  });

  const lowStockProducts: LowStockProductData[] = lowStockList
    .sort((a, b) => (a.inventory?.quantity ?? 0) - (b.inventory?.quantity ?? 0))
    .slice(0, 8)
    .map((item) => ({
      id: item.product.id,
      sku: item.sku,
      itemName: item.product.product_name,
      currentStock: item.inventory?.quantity ?? 0,
      minStock: item.min_stock ?? 0,
    }));

  const formattedTransactions: RecentTransactionData[] = recentTransactions.map((t) => ({
    id: t.id,
    productName: t.variant?.product?.product_name ?? "Unknown Product",
    sku: t.variant?.sku ?? "N/A",
    transactionType: t.txn_type ?? "unknown",
    quantity: t.quantity,
    employeeName: t.users?.full_name ?? "System",
    createdAt: (t.created_at ?? new Date()).toISOString(),
  }));

  return {
    stats: {
      totalSku,
      totalStock: totalStockResult._sum.quantity ?? 0,
      lowStock: lowStockList.length,
      outStock,
    },
    recentTransactions: formattedTransactions,
    lowStockProducts,
  };
}
