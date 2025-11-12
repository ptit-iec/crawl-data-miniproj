import { useState, useEffect } from "react";
import { Tag } from "@/store/modules/Tag";
import { useDispatch, useSelector } from "react-redux";
import { getAllTags } from "@/api/tag";
import { AppDispatch, RootState } from "@/store/configureStore";
import { getPostByTagId } from "@/api/posts";
import { Post } from "@/store/modules/post";
import { NewsArticle } from "@/types/news";
export function useArticlesByTag(tagName: string, limit = 6) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isValidTag, setIsValidTag] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const listTags = useSelector((state : RootState) => state.tag.listAllTag);
  const postData = useSelector((state : RootState) => state.post.postsByTag.data);
  const mapPostToArticle = (post: Post): NewsArticle => ({
      id: post.id,
      name: post.title,
      field: post.domain,
      des: post.summary || post.highlight || "",
      tags: post.topic,
      supplier: post.newspaper_publisher,
      website: post.url,
      summarize: post.summary,
      externalLinks: post.references,
  });
  useEffect(() => {
    dispatch(getAllTags());
  },[dispatch])
  // useEffect(() => {
  //   console.log(listTags);
  // },[listTags])
  useEffect(() => {
    if (!listTags.length) {
      setIsValidTag(false);
      return;
    }

    const targetTag = listTags.find(
      (tag: Tag) => tag.name.toLowerCase() === tagName.toLowerCase()
    );    
    if (!targetTag) {
      setIsValidTag(false);
      setArticles([]);  
      setLoading(false);
      return;
    }

    setIsValidTag(true);
    setLoading(true);
    dispatch(getPostByTagId({ tag_id: targetTag.id }));
  }, [dispatch, listTags, tagName]);

  useEffect(() => {
    if (!isValidTag) {
      setArticles([]);
      setLoading(false);
      return;
    }

    if (!postData || !postData.length) {
      setArticles([]);
      setLoading(false);
      return;
    }

    const mappedArticles = postData.map(mapPostToArticle);
    setArticles(mappedArticles);
    setLoading(false);
  }, [postData, isValidTag]);


  return { articles, loading };
}
