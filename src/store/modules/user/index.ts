import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

export interface PostSaveData {
  id : string;
  user_info : string;
  post : string;
}

export interface UserInfoState {
  listAllPosts : PostSaveData[],
  isLoadingAllPosts : boolean,
  isSavedPost : boolean,
}
const initialState : UserInfoState = {
  listAllPosts : [],
  isLoadingAllPosts : false,
  isSavedPost : false
}
export const userInfoSlice = createSlice({
  name : 'userInfo',
  initialState,
  reducers : {
    startRequestAllSavedPosts : (state) => {
      state.isLoadingAllPosts = true
    },
    requestAllSavedPostsSuccess : (state , action : PayloadAction<{data : PostSaveData[]}>) => {
      state.isLoadingAllPosts = false
      state.listAllPosts = action.payload.data;
    },
    requestAllSavedPostsFail : (state) => {
      state.isLoadingAllPosts = false
    },
    startRequestSavePost : (state) => {
      state.isLoadingAllPosts = true
    },
    requestSavePostSuccess : (state) => {
      state.isLoadingAllPosts = false
    },
    requestSavePostFail : (state) => {
      state.isLoadingAllPosts = false
    },
  }
});

export const {
  startRequestAllSavedPosts,requestAllSavedPostsSuccess,requestAllSavedPostsFail,
  startRequestSavePost,requestSavePostSuccess,requestSavePostFail,
} = userInfoSlice.actions;

export default userInfoSlice.reducer