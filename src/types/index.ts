export interface Brand {
  id: string;
  name: string;
  category: "Women" | "Men" | "Western" | "Footwear" | "Kids";
  color: string;
  itemsLive: number;
  storeUrl: string;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Deal {
  id: string;
  brandId: string;
  brandName: string;
  category: "Women" | "Men" | "Western" | "Footwear" | "Kids";
  title: string;
  description?: string;
  image: string;
  images?: string[];
  options?: ProductOption[];
  productType?: string;
  vendor?: string;
  tags?: string[];
  originalPrice: number;
  discountPercent: number;
  salePrice: number;
  productUrl?: string;
}