export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categories: string[];
  tags: string[];
  image?: string;
  embedding?: number[];
}

export interface UserPreferences {
  style: string[];
  colors: string[];
  occasions: string[];
  priceRange: {
    min: number;
    max: number;
  };
  sizes: string[];
}

export interface SearchResult {
  product: Product;
  similarity: number;
  reason: string;
}

export interface AIStylistResponse {
  outfits: Array<{
    items: Product[];
    occasion: string;
    description: string;
    confidence: number;
  }>;
}
