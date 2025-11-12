import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface Tag {
  id: string;
  name: string;
  description: string;
}

export interface ApiResponse<T> {
  items: T[];
}

export interface RawTag {
  id: string;
  name: string;
  description?: string;
}

export interface TagState {
  listAllTag : Tag[],
  isLoadingAllTag : boolean,
}
const initialState : TagState = {
  listAllTag : [],
  isLoadingAllTag : false,
}

export const TagSlice = createSlice({
  name : 'tag',
  initialState,
  reducers : {
    startRequestAllTags : (state) => {
      state.isLoadingAllTag = true;
    },
    requestAllTagSuccess : (state , action : PayloadAction<{data : Tag[]}>) => {
      state.isLoadingAllTag = false;
      state.listAllTag = action.payload.data;
    },
    requestAllTagFail : (state ) => {
      state.isLoadingAllTag = false;
    }
  },
});

export const {
  startRequestAllTags,requestAllTagSuccess,requestAllTagFail
} = TagSlice.actions;
export default TagSlice.reducer;