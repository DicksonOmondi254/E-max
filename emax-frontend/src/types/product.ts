export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  thumbnail: string;
  featured: boolean;
  active: boolean;
}

export interface ProductReview {
  id: number;
  rating: number;
  comment: string;
  productId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}

export interface RatingSummary {
  totalReviews: number;
  averageRating: number;
  distribution?: Record<number, number>;
}
