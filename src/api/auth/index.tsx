import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// import callApi from "../callApi";
// import { AppDispatch } from "@/store/configureStore";
// import { startRequestLogin,requestLoginSuccess,requestLoginFail, LoginData } from "@/store/modules/auth";
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

// export const loginApi = (username: string, password: string) => async (dispatch: AppDispatch) => {
//   const path = '/api/authentication/token';


//   const formData = new URLSearchParams();
//   formData.append('username', username);
//   formData.append('password', password);

//   return callApi({
//     method: 'POST',
//     apiPath: path,
//     actionTypes: [
//       () => startRequestLogin(),
//       (payload) => requestLoginSuccess(payload as LoginData),
//       () => requestLoginFail(),
//     ],
//     variables: formData.toString(), 
//     dispatch,
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//   });
// };

