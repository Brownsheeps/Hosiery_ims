export interface NamedEntity { id: number; name: string; }
export interface BrandMeta extends NamedEntity { brandCode: string; }
export interface ColourMeta extends NamedEntity { colourCode: string; }
export interface SizeMeta extends NamedEntity { sizeCode: string; }

export interface ProductMetadataResponse {
  categories: NamedEntity[];
  brands: BrandMeta[];
  suppliers: NamedEntity[];
  colours: ColourMeta[];
  sizes: SizeMeta[];
}
export interface CreateVariantInput {
  colourId: number | null;
  newColour: string | null;
  newColourCode: string | null;
  sizeId: number | null;
  newSize: string | null;
  newSizeCode: string | null;
  openingStock: number;
  purchasePrice: number;
  sellingPrice: number;
  minStock: number;
}

export interface CreateProductInput {
  product: {
    name: string;
    description?: string;
    categoryId: number | null;
    newCategory: string | null;
    brandId: number | null;
    newBrand: string | null;
    newBrandCode: string | null;
    supplierId: number | null;
    newSupplier: string | null;
  };
  variants: CreateVariantInput[];
}
export interface CreateProductResponse {
  productId: number;
  productSku: string;
  variants: { variantId: number; variantSku: string }[];
}
export interface ProductSearchResponse {
  items: {
    variantId: number;
    sku: string;
    productName: string;
    color: string | null;
    size: string | null;
    currentStock: number;
    selling_price: unknown;
  }[];
}