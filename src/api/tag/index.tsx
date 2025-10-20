import axios from "axios";
import { Tag, RawTag, ApiResponse } from "../../store/modules/Tag/index";
const API_URL = process.env.NEXT_PUBLIC_API_URL;



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
