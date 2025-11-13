import callApi from "../callApi";
import { startRequestAllTags,requestAllTagSuccess,requestAllTagFail, Tag } from "../../store/modules/Tag/index";
import { AppDispatch } from "@/store/configureStore";

export const getAllTags = () => async (dispatch : AppDispatch) => {
  const path = `/api/tags/`;
  return callApi ({
    method : 'GET',
    apiPath : path,
    actionTypes : [
      () => startRequestAllTags(),
      (payload) => requestAllTagSuccess({ data: (payload as { data: Tag[] }).data }),
      () => requestAllTagFail()
    ],
    dispatch,
  })
}
