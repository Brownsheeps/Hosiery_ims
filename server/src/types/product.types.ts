export interface ProductSearchItem {
    variantId: number;
    sku: string;
    productName: string;
    color: string | null;
    size: string | null;
    currentStock: number;
}

export interface ProductSearchResponse {
    items: ProductSearchItem[];
}