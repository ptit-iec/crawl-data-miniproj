import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UserTag {
  id: string;
  user_info: string;
  tag: string;
}

export interface UserInfoResponse {
  message: string;
  status: string;
  data: UserTag[];
}
export async function getUserInfoApi(token: string): Promise<UserInfoResponse> {
  if (!token) throw new Error("No token provided");

  try {
    const res = await axios.get<UserInfoResponse>(`${API_URL}api/user_info_posts/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Fetch user info failed");
  }
}