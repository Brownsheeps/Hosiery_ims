export interface ProductSearchItem {
    variantId: number;
    sku: string;
    productName: string;
    color: string | null;
    size: string | null;
    currentStock: number;
    sellingPrice: number | null;
}

export interface ProductSearchResponse {
    items: ProductSearchItem[];
}

export interface ProductData {
    sku: string;
    productName: string;
    categoryId: number;
    brandId: number;
    supplierId?: number;
    productDescription?: string;
}

export interface VariantData {
    colorId?: number;
    sizeId?: number;
    purchasePrice: number;
    sellingPrice: number;
    openingStock: number;
    minStock: number;
}