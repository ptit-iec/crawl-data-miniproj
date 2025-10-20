export interface Article {
  id: string;
  name: string;
  field: string;
  des: string;
  tags: string[];
  supplier: string;
  website: string;
  contact_info: string;
  address: string;
  summarize: string;
  internalLinks: string[];
  externalLinks: string[];
  imageUrl?: string;
  publishedAt?: string;
}

export interface ApiResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Dữ liệu thô từ API
export interface RawArticle {
  id: string;
  title: string;
  topic?: string[];
  description?: string;
  domain?: string;
  url: string;
  contact_info?: string;
  address?: string;
  summary?: string;
  internalLinks?: string[];
  externalLinks?: string[];
  images?: string[];
  time?: string;
}
