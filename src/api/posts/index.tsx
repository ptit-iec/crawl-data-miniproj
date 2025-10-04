import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
interface RawArticle {
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

export async function getAllPosts(
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<Article>> {
  const url = `${API_URL}/api/posts?page=${page}&limit=${limit}`;

  const res = await axios.get<ApiResponse<RawArticle>>(url);

  const normalized: ApiResponse<Article> = {
    ...res.data,
    items: res.data.items.map((item) => ({
      id: item.id,
      name: item.title,
      field: item.topic?.[0] || "Chưa phân loại",
      des: item.description || "",
      tags: item.topic || [],
      supplier: item.domain || "Unknown",
      website: item.url,
      contact_info: item.contact_info || "contact@unknown.com",
      address: item.address || "Unknown",
      summarize: item.summary || "",
      internalLinks: item.internalLinks || [],
      externalLinks: item.externalLinks || [],
      imageUrl: item.images?.[0] || undefined,
      publishedAt: item.time,
    })),
  };

  return normalized;
}

export async function getPostByTag(
  tag_id?: string,
  page = 1,
  limit = 3
): Promise<ApiResponse<Article>> {
  const url = `${API_URL}/api/posts/by_tag/${tag_id}?page=${page}&limit=${limit}`;

  const res = await axios.get<ApiResponse<RawArticle>>(url);

  const normalized: ApiResponse<Article> = {
    ...res.data,
    items: res.data.items.map((item) => ({
      id: item.id,
      name: item.title,
      field: item.topic?.[0] || "Chưa phân loại",
      des: item.description || "",
      tags: item.topic || [],
      supplier: item.domain || "Unknown",
      website: item.url,
      contact_info: item.contact_info || "contact@unknown.com",
      address: item.address || "Unknown",
      summarize: item.summary || "",
      internalLinks: item.internalLinks || [],
      externalLinks: item.externalLinks || [],
      imageUrl: item.images?.[0] || undefined,
      publishedAt: item.time,
    })),
  };

  return normalized;
}

export async function getPostById(
  id?: string
): Promise<ApiResponse<Article>> {
  const url = `${API_URL}/api/posts/${id}`;

  const res = await axios.get<ApiResponse<RawArticle>>(url);

  const normalized: ApiResponse<Article> = {
    ...res.data,
    items: res.data.items.map((item) => ({
      id: item.id,
      name: item.title,
      field: item.topic?.[0] || "Chưa phân loại",
      des: item.description || "",
      tags: item.topic || [],
      supplier: item.domain || "Unknown",
      website: item.url,
      contact_info: item.contact_info || "contact@unknown.com",
      address: item.address || "Unknown",
      summarize: item.summary || "",
      internalLinks: item.internalLinks || [],
      externalLinks: item.externalLinks || [],
      imageUrl: item.images?.[0] || undefined,
      publishedAt: item.time,
    })),
  };

  return normalized;
}
