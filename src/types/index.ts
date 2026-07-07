export interface Brand {
  id: string;
  name: string;
  category: "Women" | "Men" | "Western" | "Footwear" | "Kids";
  color: string;
  itemsLive: number;
  storeUrl: string;
}

export interface Deal {
  id: number;
  brandId: string;
  brandName: string;
  category: "Women" | "Men" | "Western" | "Footwear" | "Kids";
  title: string;
  description?: string;
  image: string;
  originalPrice: number;
  discountPercent: number;
  salePrice: number;
}