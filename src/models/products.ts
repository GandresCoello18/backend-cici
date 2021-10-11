import { ResProductCategory } from './category';

export interface Product {
  idProducts: string;
  title: string;
  source: string;
  price: number;
  status: string;
  description: string;
  available: number;
  sold: number;
  stars: number;
  brand: string;
  size: string;
  model: string;
  related_sources: SourcesProduct[];
  categorys?: ResProductCategory[];
  created_at: Date | string;
  updated_at: Date | string;
  discount: number;
  starsPeople: number;
  colors?: string | null;
  offer_expires_date?: string | Date;
}

export interface SourcesProduct {
  idSourceProduct: string;
  source: string;
  kind: string;
  idProduct: string;
  isDescription: number;
}

export interface ProductReviews {
  idProductReviews: string;
  commentary: string;
  stars: number;
  created_at: Date | string;
  idUser: string;
  idProduct: string;
  received: number;
  recommendation: number;
  approved: number;
  source: string | null;
}

export interface ProductReviewByUser {
  idProductReviews: string;
  commentary: string;
  stars: number;
  created_at: Date | string;
  userName: string;
  avatar: string;
}
