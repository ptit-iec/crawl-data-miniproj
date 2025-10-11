import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Tag {
  id: string;
  name: string;
  description: string;
}

export interface ApiResponse<T> {
  items: T[];
}

interface RawTag {
  id: string;
  name: string;
  description?: string;
}

export async function getAllTags(): Promise<ApiResponse<Tag>> {
  const url = `${API_URL}/api/tags/`; 
  const res = await axios.get<{ data: RawTag[] }>(url);

  const rawItems: RawTag[] = res.data.data || [];

  const normalized: ApiResponse<Tag> = {
    items: rawItems.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description || "",
    })),
  };

  return normalized;
}
