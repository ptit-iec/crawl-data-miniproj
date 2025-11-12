import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
export interface Post {
  id : string;
  title : string;
  content : string;
  summary : string;
  domain : string;
  url : string;
  images : string[];
  highlight : string;
  references : string[];
  author : string;
  time : string;
  topic : string[];
  newspaper_publisher : string;
}
export interface AllPostData {
  items : Post[],
  total : number,
  page : number,
  size : number,
  pages : number,
}
export interface DataPostByTag {
  items : Post[],
  total : number,
  page : number,
  size : number,
  pages : number,
}
export interface PostState {
  allPosts: {
    data: Post[];
    pagination?: Omit<AllPostData, "items">;
    isLoading: boolean;
  };
  postsByTag: {
    data: Post[];
    pagination?: Omit<DataPostByTag, "items">;
    isLoading: boolean;
  };
}

const initialState: PostState = {
  allPosts: {
    data: [],
    pagination: undefined,
    isLoading: false,
  },
  postsByTag: {
    data: [],
    pagination: undefined,
    isLoading: false,
  },
};

export const postSlice = createSlice({
  name : 'post',
  initialState,
  reducers : {
    startRequestAllPosts : (state) => {
      state.allPosts.isLoading = true;
    },
    requestAllPostsSuccess: (state, action: PayloadAction<AllPostData>) => {
      state.allPosts.isLoading = false;
      state.allPosts.data = action.payload.items;
      state.allPosts.pagination = {
        total: action.payload.total,
        page: action.payload.page,
        size: action.payload.size,
        pages: action.payload.pages,
      };
    },
    requestAllPostsFail : (state) => {
      state.allPosts.isLoading = false;
    },
    startRequestPostByTag : (state) => {
      state.postsByTag.isLoading = true;
    },
    requestPostByTagSuccess: (state, action: PayloadAction<DataPostByTag>) => {
      state.postsByTag.isLoading = false;
      state.postsByTag.data = action.payload.items;
      state.postsByTag.pagination = {
        total: action.payload.total,
        page: action.payload.page,
        size: action.payload.size,
        pages: action.payload.pages,
      };
    },
    requestPostByTagFail : (state) => {
      state.postsByTag.isLoading = false;
    },
  },
});

export const {
  startRequestAllPosts, requestAllPostsSuccess, requestAllPostsFail,
  startRequestPostByTag, requestPostByTagSuccess, requestPostByTagFail,
} = postSlice.actions;

export default postSlice.reducer;