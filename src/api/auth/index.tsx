import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
interface LoginResponse {
  access_token: string;
  token_type: string;
}
export async function loginApi(username: string, password: string): Promise<LoginResponse> {
  try {
    const res = await axios.post<LoginResponse>(
      `${API_URL}/api/authentication/token`,
      new URLSearchParams({
        username,
        password,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ detail?: string }>;
    throw new Error(err.response?.data?.detail || "Login failed");
  }
}

export async function registerApi(
  username: string,
  email: string,
  password: string
) {
  try {
    const res = await axios.post(
      `${API_URL}/api/authentication/register`,
      { username, email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError<{ detail?: string }>;
    throw new Error(err.response?.data?.detail || "Register failed");
  }
}

