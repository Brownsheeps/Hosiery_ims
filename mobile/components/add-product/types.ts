export interface ProductDetails {
  name: string;
  sku: string;
  category: string;
  brand: string;
  supplier: string;
  description: string;
}

export interface ProductVariant {
  id: string;
  colour: string;
  size: string;
  openingStock: string;
  purchasePrice: string;
  sellingPrice: string;
  sku: string;
}
