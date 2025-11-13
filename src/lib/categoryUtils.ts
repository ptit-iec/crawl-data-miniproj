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
  const [currentTagId, setCurrentTagId] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const listTags = useSelector((state: RootState) => state.tag.listAllTag);
  
  // Lấy data theo tagId cụ thể
  const postData = useSelector((state: RootState) => 
    currentTagId ? state.post.postsByTag[currentTagId]?.data : undefined
  );
  
  const isLoadingData = useSelector((state: RootState) => 
    currentTagId ? state.post.postsByTag[currentTagId]?.isLoading ?? true : true
  );

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
  }, [dispatch]);

  useEffect(() => {
    if (!listTags || !listTags.length) {
      setIsValidTag(false);
      setLoading(false);
      return;
    }

    const targetTag = listTags.find(
      (tag: Tag) => tag.name.toLowerCase() === tagName.toLowerCase()
    );

    if (!targetTag) {
      setIsValidTag(false);
      setCurrentTagId(null);
      setArticles([]);
      setLoading(false);
      return;
    }

    const tagIdStr = targetTag.id.toString();
    setIsValidTag(true);
    setCurrentTagId(tagIdStr);
    
    // Dispatch với tag_id là string
    dispatch(getPostByTagId({ tag_id: tagIdStr }));
  }, [dispatch, listTags, tagName]);

  useEffect(() => {
    if (!isValidTag || !currentTagId) {
      setArticles([]);
      setLoading(false);
      return;
    }

    setLoading(isLoadingData);

    if (!postData || !postData.length) {
      if (!isLoadingData) {
        setArticles([]);
      }
      return;
    }

    const mappedArticles = postData.slice(0, limit).map(mapPostToArticle);
    setArticles(mappedArticles);
  }, [postData, isValidTag, currentTagId, isLoadingData, limit]);

  return { articles, loading };
}