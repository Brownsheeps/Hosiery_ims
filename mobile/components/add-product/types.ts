export interface MetaOption {
  id: number | null;
  name: string;
  isNew?: boolean;
  brandCode?: string;
  colourCode?: string;
  sizeCode?: string;
}

export interface ProductDetails {
  name: string;
  category: MetaOption | null;
  brand: MetaOption | null;
  supplier: MetaOption | null;
  description: string;
}

export interface ProductVariant {
  id: string;
  colour: MetaOption | null;
  size: MetaOption | null;
  openingStock: string;
  purchasePrice: string;
  sellingPrice: string;
  minStock: string;
}

export interface ProductMetadata {
  categories: MetaOption[];
  brands: MetaOption[];
  suppliers: MetaOption[];
  colours: MetaOption[];
  sizes: MetaOption[];
}
