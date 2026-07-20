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