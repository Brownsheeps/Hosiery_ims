import prisma from "../utils/db.js";
import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  CreateProductInput,
  CreateProductResponse,
  ProductMetadataResponse,
  ProductSearchResponse,
} from "../types/product.types.js";

type Tx = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];


async function resolveCategory(tx: Tx, id: number | null, name: string | null): Promise<number> {
  if (id != null) return id;
  const r = await tx.categories.upsert({ where: { name: name! }, create: { name: name! }, update: {}, select: { id: true } });
  return r.id;
}

async function resolveBrand(
  tx: Tx,
  id: number | null,
  name: string | null,
  code: string | null
): Promise<{ brandId: number; brandCode: string }> {
  if (id != null) {
    const b = await tx.brands.findUniqueOrThrow({ where: { id }, select: { id: true, brand_code: true } });
    return { brandId: b.id, brandCode: b.brand_code };
  }
  const r = await tx.brands.upsert({
    where: { name: name! },
    create: { name: name!, brand_code: code! },
    update: {},
    select: { id: true, brand_code: true },
  });
  return { brandId: r.id, brandCode: r.brand_code };
}

async function resolveSupplier(tx: Tx, id: number | null, name: string | null): Promise<number> {
  if (id != null) return id;
  const r = await tx.suppliers.upsert({ where: { name: name! }, create: { name: name! }, update: {}, select: { id: true } });
  return r.id;
}

async function resolveColour(
  tx: Tx,
  id: number | null,
  name: string | null,
  code: string | null
): Promise<{ colourId: number; colourCode: string }> {
  if (id != null) {
    const c = await tx.colours.findUniqueOrThrow({ where: { id }, select: { id: true, colour_code: true } });
    return { colourId: c.id, colourCode: c.colour_code };
  }
  const r = await tx.colours.upsert({
    where: { name: name! },
    create: { name: name!, colour_code: code! },
    update: {},
    select: { id: true, colour_code: true },
  });
  return { colourId: r.id, colourCode: r.colour_code };
}

async function resolveSize(
  tx: Tx,
  id: number | null,
  name: string | null,
  code: string | null
): Promise<{ sizeId: number; sizeCode: string }> {
  if (id != null) {
    const s = await tx.sizes.findUniqueOrThrow({ where: { id }, select: { id: true, size_code: true } });
    return { sizeId: s.id, sizeCode: s.size_code };
  }
  const r = await tx.sizes.upsert({
    where: { name: name! },
    create: { name: name!, size_code: code! },
    update: {},
    select: { id: true, size_code: true },
  });
  return { sizeId: r.id, sizeCode: r.size_code };
}

// MetaData regarding changes :)

export async function getProductMetadata(): Promise<ProductMetadataResponse> {
  const [categories, brands, suppliers, colours, sizes] = await Promise.all([
    prisma.categories.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.brands.findMany({ select: { id: true, name: true, brand_code: true }, orderBy: { name: "asc" } }),
    prisma.suppliers.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.colours.findMany({ select: { id: true, name: true, colour_code: true }, orderBy: { name: "asc" } }),
    prisma.sizes.findMany({ select: { id: true, name: true, size_code: true }, orderBy: { name: "asc" } }),
  ]);
  return {
    categories,
    brands: brands.map((b) => ({ id: b.id, name: b.name, brandCode: b.brand_code })),
    suppliers,
    colours: colours.map((c) => ({ id: c.id, name: c.name, colourCode: c.colour_code })),
    sizes: sizes.map((s) => ({ id: s.id, name: s.name, sizeCode: s.size_code })),
  };
}

// Product Creation

export async function createProduct(input: CreateProductInput): Promise<CreateProductResponse> {
  const { product, variants } = input;

  return prisma.$transaction(async (tx) => {


    const categoryId = await resolveCategory(tx, product.categoryId, product.newCategory);
    const { brandId, brandCode } = await resolveBrand(tx, product.brandId, product.newBrand, product.newBrandCode);
    const supplierId = await resolveSupplier(tx, product.supplierId, product.newSupplier);

    const seqResult = await tx.products.aggregate({
      where: { brand_id: brandId },
      _max: { sequence: true },
    });
    
    const nextSequence = (seqResult._max.sequence ?? 0) + 1;
    const productSku = `${brandCode}-${String(nextSequence).padStart(6, "0")}`;

    const resolvedVariants = await Promise.all(
      variants.map(async (v) => {
        const { colourId, colourCode } = await resolveColour(tx, v.colourId, v.newColour, v.newColourCode);
        const { sizeId, sizeCode } = await resolveSize(tx, v.sizeId, v.newSize, v.newSizeCode);
        const variantSku = `${productSku}-${colourCode}-${sizeCode}`;
        return { colourId, sizeId, variantSku, v };
      })
    );

    const newProduct = await tx.products.create({
      data: {
        sku: productSku,
        sequence: nextSequence,
        product_name: product.name,
        product_description: product.description ?? null,
        category_id: categoryId,
        brand_id: brandId,
        supplier_id: supplierId,
      },
      select: { id: true, sku: true },
    });

    const createdVariants: { variantId: number; variantSku: string }[] = [];

    for (const { colourId, sizeId, variantSku, v } of resolvedVariants) {
      const newVariant = await tx.product_variants.create({
        data: {
          product_id: newProduct.id,
          sku: variantSku,
          color_id: colourId,
          size_id: sizeId,
          purchase_price: v.purchasePrice,
          selling_price: v.sellingPrice,
          min_stock: v.minStock,
        },
        select: { id: true },
      });

      await tx.inventory.create({
        data: { variant_id: newVariant.id, quantity: v.openingStock },
      });

      if (v.openingStock > 0) {
        await tx.inventory_transactions.create({
          data: {
            variant_id: newVariant.id,
            txn_type: "opening_stock",
            quantity: v.openingStock,
            remarks: "Opening stock on product creation",
          },
        });
      }

      createdVariants.push({ variantId: newVariant.id, variantSku });
    }

    return { productId: newProduct.id, productSku: newProduct.sku, variants: createdVariants };
  });
}

export async function searchProducts(query: string): Promise<ProductSearchResponse> {
  const q = query.trim();
  if (!q) return { items: [] };

  const variants = await prisma.product_variants.findMany({
    where: {
      OR: [
        { sku: { contains: q, mode: "insensitive" } },
        { product: { product_name: { contains: q, mode: "insensitive" } } },
      ],
    },
    take: 8,
    orderBy: { sku: "asc" },
    select: {
      id: true, sku: true, selling_price: true,
      colour: { select: { name: true } },
      size: { select: { name: true } },
      inventory: { select: { quantity: true } },
      product: { select: { product_name: true } },
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
      selling_price: item.selling_price,
    })),
  };
}