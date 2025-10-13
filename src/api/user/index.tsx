import axios  from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UserTag {
  id: string;
  user_info: string;
  tag: string;
  post: string; 
}
export interface UserInfoResponse {
  message: string;
  status: string;
  data: UserTag[];
}

export interface SavePostResponse {
  message: string;
  status: string;
  data?: {
    id: string;
    user_info: string;
    post: string;
  };
}

export async function getUserInfoApi(token: string): Promise<UserInfoResponse> {
  if (!token) throw new Error("No token provided");

  try {
    const res = await axios.get<UserInfoResponse>(
      `${API_URL}/api/user_info_posts/`, 
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || "Fetch user info failed");
    }
    throw new Error("Unexpected error occurred");
  }
}


export async function savePostApi(
  token: string,
  postId: string
): Promise<SavePostResponse> {
  if (!token) throw new Error("No token provided");

  try {
    const res = await axios.post<SavePostResponse>(
      `${API_URL}api/user_info_posts/`,
      { post: postId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || "Save post failed");
    }
    throw new Error("Unexpected error occurred");
  }
}
