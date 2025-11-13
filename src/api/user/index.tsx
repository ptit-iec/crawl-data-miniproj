import { PostSaveData } from "@/store/modules/user";
import callApi from "../callApi";
import { AppDispatch } from "@/store/configureStore";
import { startRequestAllSavedPosts, requestAllSavedPostsSuccess, requestAllSavedPostsFail,
  startRequestSavePost,requestSavePostSuccess,requestSavePostFail

} from "@/store/modules/user";

export const getAllSavedPost = () => async (dispatch : AppDispatch) => {
  const path = '/api/user_info_posts/';
  return callApi ({
    method : 'GET',
    apiPath : path,
    actionTypes : [
      () => startRequestAllSavedPosts(),
      (payload) => requestAllSavedPostsSuccess({ data: (payload as { data: PostSaveData[] }).data }),
      () => requestAllSavedPostsFail(),
    ],
    dispatch
  })
}

export const handleSavePost = (post : string) => async (dispatch : AppDispatch) => {
  const path = '/api/user_info_posts/';
  const body = {
      post : post
  }
  return callApi ({
    method : 'POST',
    apiPath : path,
    actionTypes : [
      () => startRequestSavePost(),
      () => requestSavePostSuccess(),
      () => requestSavePostFail(),
    ],
    dispatch,
    variables : body,
  })
}