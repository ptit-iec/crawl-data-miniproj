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