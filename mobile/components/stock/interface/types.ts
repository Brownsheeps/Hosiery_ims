export interface ProductSearchItem {
  variantId: number;
  sku: string;
  productName: string;
  color: string | null;
  size: string | null;
  currentStock: number;
}

export interface ProductDropdownProps {
  value?: ProductSearchItem | null;
  onSelect: (item: ProductSearchItem | null) => void;
  error?: string | null;
}

export interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

export interface QuantityValueState {
  boxQuantity: number;
  unitsPerBox: number;
  looseUnits: number;
  totalQuantity: number;
}

export interface QuantityInputProps {
  value: QuantityValueState;
  onChange: (value: QuantityValueState) => void;
  error?: string | null;
}

export interface RemarksInputProps {
  value: string;
  onChange: (value: string) => void;
}

export interface StockInResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    quantity: number;
    variant: {
      id: number;
      sku: string;
      product: { product_name: string };
    };
  };
}
export interface ProductSearchItem {
  variantId: number;
  sku: string;
  productName: string;
  color: string | null;
  size: string | null;
  currentStock: number;
}

export interface StockOutResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    quantity: number;
    variant: {
      id: number;
      sku: string;
      product: { product_name: string };
    };
  };
}

export interface ProductSearchItem {
  variantId: number;
  sku: string;
  productName: string;
  color: string | null;
  size: string | null;
  currentStock: number;
}