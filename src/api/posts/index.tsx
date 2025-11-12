import axios from "axios";
import { Article, RawArticle, ApiResponse, DataPostByTag } from "../../store/modules/post/index";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import callApi from "../callApi";
import { startRequestAllPosts,requestAllPostsSuccess,requestAllPostsFail,
  startRequestPostByTag, requestPostByTagSuccess, requestPostByTagFail,

} from "../../store/modules/post/index";
import { AppDispatch } from "@/store/configureStore";
import { AllPostData } from "../../store/modules/post/index";
export async function getPostById(
  id?: string
): Promise<ApiResponse<Article>> {
  const url = `${API_URL}/api/posts/${id}/`;

  const res = await axios.get<ApiResponse<RawArticle>>(url);

  const normalized: ApiResponse<Article> = {
    ...res.data,
    items: res.data.items.map((item) => ({
      id: item.id,
      name: item.title,
      field: item.topic?.[0] || "Chưa phân loại",
      des: item.description || "",
      tags: item.topic || [],
      supplier: item.domain || "Unknown",
      website: item.url,
      contact_info: item.contact_info || "contact@unknown.com",
      address: item.address || "Unknown",
      summarize: item.summary || "",
      internalLinks: item.internalLinks || [],
      externalLinks: item.externalLinks || [],
      imageUrl: item.images?.[0] || undefined,
      publishedAt: item.time,
    })),
  };

  return normalized;
}

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
export const getPostByTagId = (params?: { page?: number; pageSize?: number ;tag_id : string})  => async (dispatch : AppDispatch) => {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 3;
  const tag_id = params?.tag_id;
  const path = `/api/posts/by_tag/${tag_id}?page=${page}&pageSize=${pageSize}`
  return callApi ({
    method : 'GET',
    apiPath : path,
    actionTypes : [
      () => startRequestPostByTag,
      (payload) => requestPostByTagSuccess(payload as DataPostByTag), 
      () => requestPostByTagFail
    ] ,
    dispatch,
    variables : params,
  })
}