import { DataPostByTag, Post } from "../../store/modules/post/index";
import callApi from "../callApi";
import { startRequestAllPosts,requestAllPostsSuccess,requestAllPostsFail,
  startRequestPostByTag, requestPostByTagSuccess, requestPostByTagFail,
  startRequestPostByPostId,requestPostByPostIdSuccess,requestPostByPostIdFail,

} from "../../store/modules/post/index";
import { AppDispatch } from "@/store/configureStore";
import { AllPostData } from "../../store/modules/post/index";

export const getAllPosts = (params?: { page?: number; pageSize?: number }) => async (dispatch : AppDispatch) => {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const path = `/api/posts/?page=${page}&pageSize=${pageSize}`;

  return callApi ({
    method : 'GET',
    apiPath : path,
    actionTypes: [
      () => startRequestAllPosts(),
      (payload) => requestAllPostsSuccess(payload as AllPostData),
      () => requestAllPostsFail()
    ],
    dispatch,
    variables: params,
  })
}
export const getPostByTagId = (params: { page?: number; pageSize?: number; tag_id: string }) => 
  async (dispatch: AppDispatch) => {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 3;
    const tag_id = params.tag_id;
    const path = `/api/posts/by_tag/${tag_id}?page=${page}&pageSize=${pageSize}`;
    
    return callApi({
      method: 'GET',
      apiPath: path,
      actionTypes: [
        () => startRequestPostByTag({ tagId: tag_id }),
        (payload) => requestPostByTagSuccess({ 
          tagId: tag_id, 
          data: payload as DataPostByTag 
        }),
        () => requestPostByTagFail({ tagId: tag_id })
      ],
      dispatch,
      variables: params,
    });
  };
export const getPostByPostId = (id : string) => async (dispatch : AppDispatch) => {
  const path = `/api/posts/${id}`;
  return callApi ({
    method : 'GET',
    apiPath : path,
    actionTypes : [
      () => startRequestPostByPostId(),
      (payload) => requestPostByPostIdSuccess({data : (payload as {data : Post}).data}),
      () => requestPostByPostIdFail(),
    ],
    dispatch
  })
}