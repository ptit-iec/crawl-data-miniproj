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
    [tagId: string]: {
      data: Post[];
      pagination?: Omit<DataPostByTag, "items">;
      isLoading: boolean;
    };
  };
  postDetail: Post | undefined;
  isLoadingPostDetail: boolean;
  savedPosts: Post[];
}

const initialState: PostState = {
  allPosts: {
    data: [],
    pagination: undefined,
    isLoading: false,
  },
  postsByTag: {}, // Đổi thành object rỗng
  postDetail: undefined,
  isLoadingPostDetail: false,
  savedPosts: [],
};
export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    startRequestAllPosts: (state) => {
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
    requestAllPostsFail: (state) => {
      state.allPosts.isLoading = false;
    },
    
    // Thêm tagId vào payload
    startRequestPostByTag: (state, action: PayloadAction<{ tagId: string }>) => {
      if (!state.postsByTag[action.payload.tagId]) {
        state.postsByTag[action.payload.tagId] = {
          data: [],
          pagination: undefined,
          isLoading: false,
        };
      }
      state.postsByTag[action.payload.tagId].isLoading = true;
    },
    
    requestPostByTagSuccess: (
      state,
      action: PayloadAction<{ tagId: string; data: DataPostByTag }>
    ) => {
      const { tagId, data } = action.payload;
      if (!state.postsByTag[tagId]) {
        state.postsByTag[tagId] = {
          data: [],
          pagination: undefined,
          isLoading: false,
        };
      }
      state.postsByTag[tagId].isLoading = false;
      state.postsByTag[tagId].data = data.items;
      state.postsByTag[tagId].pagination = {
        total: data.total,
        page: data.page,
        size: data.size,
        pages: data.pages,
      };
    },
    
    requestPostByTagFail: (state, action: PayloadAction<{ tagId: string }>) => {
      if (state.postsByTag[action.payload.tagId]) {
        state.postsByTag[action.payload.tagId].isLoading = false;
      }
    },
    
    startRequestPostByPostId: (state) => {
      state.isLoadingPostDetail = true;
    },
    requestPostByPostIdSuccess: (state, action: PayloadAction<{ data: Post }>) => {
      state.isLoadingPostDetail = false;
      state.postDetail = action.payload.data;
      const exists = state.savedPosts.some(post => post.id === action.payload.data.id);
      if (!exists) {
        state.savedPosts.push(action.payload.data);
      }
    },
    requestPostByPostIdFail: (state) => {
      state.isLoadingPostDetail = false;
    },
    resetPostsByTag: (state) => {
      state.postsByTag = {};
    },
  
    // Reset một tag cụ thể
    resetPostsByTagId: (state, action: PayloadAction<{ tagId: string }>) => {
      if (state.postsByTag[action.payload.tagId]) {
        delete state.postsByTag[action.payload.tagId];
      }
    },
    
    // Reset allPosts
    resetAllPosts: (state) => {
      state.allPosts = {
        data: [],
        pagination: undefined,
        isLoading: false,
      };
  },
  },
});
export const {
  startRequestAllPosts, requestAllPostsSuccess, requestAllPostsFail,
  startRequestPostByTag, requestPostByTagSuccess, requestPostByTagFail,
  startRequestPostByPostId,requestPostByPostIdSuccess,requestPostByPostIdFail,
  resetPostsByTag, resetPostsByTagId, resetAllPosts,
} = postSlice.actions;

export default postSlice.reducer;