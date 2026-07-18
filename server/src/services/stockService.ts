import { TransactionType } from "../constants/inventory.constants.js";
import type { StockMovementInput } from "../types/stock.types.js";
import prisma from "../utils/db.js";

function appError(message: string, statusCode: number) {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  return error;
}

const stockSelect = {
  id: true,
  quantity: true,
  variant: {
    select: {
      id: true,
      sku: true,
      product: {
        select: {
          product_name: true,
        },
      },
    },
  },
};

function variantWhere(data: StockMovementInput) {
  return data.variantId ? { id: data.variantId } : { sku: data.sku as string };
}

export async function stockIn(data: StockMovementInput) {
  return prisma.$transaction(async (tx) => {

    const variant = await tx.product_variants.findFirst({
      where: variantWhere(data),
      select: {
        id: true,
      },
    });

    if (!variant) {
      throw appError("Product variant not found", 404);
    }

    await tx.inventory_transactions.create({
      data: {
        variant_id: variant.id,
        txn_type: TransactionType.STOCK_IN,
        quantity: data.quantity,
        remarks: data.remarks,
      },
    });

    return tx.inventory.upsert({
      where: {
        variant_id: variant.id,
      },
      update: {
        quantity: {
          increment: data.quantity,
        },
      },
      create: {
        variant_id: variant.id,
        quantity: data.quantity,
      },
      select: stockSelect,
    });
  });
}

export async function stockOut(data: StockMovementInput) {
  return prisma.$transaction(async (tx) => {
    const variant = await tx.product_variants.findFirst({
      where: variantWhere(data),
      select: {
        id: true,
      },
    });

    if (!variant) {
      throw appError("Product variant not found", 404);
    }

    const updatedInventory = await tx.inventory.updateMany({
      where: {
        variant_id: variant.id,
        quantity: {
          gte: data.quantity,
        },
      },
      data: {
        quantity: {
          decrement: data.quantity,
        },
      },
    });

    if (updatedInventory.count === 0) {
      throw appError("Not enough stock available", 400);
    }

    await tx.inventory_transactions.create({
      data: {
        variant_id: variant.id,
        txn_type: TransactionType.STOCK_OUT,
        quantity: data.quantity,
        remarks: data.remarks,
      },
    });

    return tx.inventory.findUniqueOrThrow({
      where: {
        variant_id: variant.id,
      },
      select: stockSelect,
    });
  });
}

export async function stockAdjust(data: StockMovementInput) {
  return prisma.$transaction(async (tx) => {
    const variant = await tx.product_variants.findFirst({
      where: variantWhere(data),
      select: {
        id: true,
      },
    });

    if (!variant) {
      throw appError("Product variant not found", 404);
    }

    // Get current inventory (if any)
    const inventory = await tx.inventory.findUnique({
      where: {
        variant_id: variant.id,
      },
      select: {
        quantity: true,
      },
    });

    const currentStock = inventory?.quantity ?? 0;
    const difference = data.quantity - currentStock;

    // Update inventory (or create if it doesn't exist)
    const updatedInventory = await tx.inventory.upsert({
      where: {
        variant_id: variant.id,
      },
      update: {
        quantity: data.quantity,
      },
      create: {
        variant_id: variant.id,
        quantity: data.quantity,
      },
      select: stockSelect,
    });

    // Record adjustment transaction
    await tx.inventory_transactions.create({
      data: {
        variant_id: variant.id,
        txn_type: TransactionType.ADJUSTMENT,
        quantity: difference,
        remarks: data.remarks,
      },
    });

    return updatedInventory;
  });
}
