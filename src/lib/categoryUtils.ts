import { useState, useEffect } from "react";
import { Tag } from "@/store/modules/Tag";
import { useDispatch, useSelector } from "react-redux";
import { getAllTags } from "@/api/tag";
import { AppDispatch, RootState } from "@/store/configureStore";
import { getPostByTagId } from "@/api/posts";
import { Post } from "@/store/modules/post";
import { NewsArticle } from "@/types/news";

const fixedTags = [
  "ai",
  "kh&cn",
  "telecom",
  "robotics",
  "software",
  "security",
  "research",
];

const tagRelations: Record<string, string[]> = {
  ai: ["artificial intelligence", "machine learning", "deep learning", "neural network", "gpt", "llm", "generative ai"],
  "kh&cn": ["khoa học", "công nghệ", "science", "technology"],
  telecom: ["telecommunications", "5g", "6g", "network", "wireless", "communication"],
  robotics: ["robot", "automation", "autonomous", "self-driving", "fsd", "avs", "drone", "autonomous vehicles"],
  software: ["app", "application", "program", "code", "development", "erp", "saas"],
  security: ["cybersecurity", "cyber security", "encryption", "privacy", "hacking", "vulnerability"],
  research: ["nghiên cứu", "study", "innovation", "development", "r&d"],
};

export function useArticlesByTag(tagName: string, limit = 6) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isValidTag, setIsValidTag] = useState(false);
  const [currentTagId, setCurrentTagId] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const listTags = useSelector((state: RootState) => state.tag.listAllTag);
  
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

  const isTagRelatedToFixedTag = (tagNameStr: string, fixedTag: string): boolean => {
    const tagLower = tagNameStr.toLowerCase();
    const fixedTagLower = fixedTag.toLowerCase();
    
    if (tagLower.includes(fixedTagLower)) {
      return true;
    }
    
    const relatedKeywords = tagRelations[fixedTag] || [];
    return relatedKeywords.some(keyword => tagLower.includes(keyword.toLowerCase()));
  };

  useEffect(() => {
    dispatch(getAllTags());
  }, [dispatch]);

  useEffect(() => {
    if (!listTags || !listTags.length) {
      setIsValidTag(false);
      setLoading(false);
      return;
    }

    const categoryLower = tagName.toLowerCase();
    let targetTag = listTags.find((tag: Tag) => {
      const tagNameLower = tag.name.toLowerCase();
      if (tagNameLower === categoryLower) {
        return true;
      }
      return false;
    });

    if (!targetTag && fixedTags.includes(categoryLower)) {
      targetTag = listTags.find((tag: Tag) => {
        const tagNameLower = tag.name.toLowerCase();
        if (tagNameLower === categoryLower) {
          return true;
        }
        return false;
      });
    }
    
    if (!targetTag) {
      targetTag = listTags.find((tag: Tag) => {
        const tagNameLower = tag.name.toLowerCase();
        
        if (tagNameLower.includes(categoryLower)) {
          return true;
        }
        
        if (isTagRelatedToFixedTag(tag.name, categoryLower)) {
          return true;
        }
        
        return false;
      });
    }
    
    if (!targetTag) {
      const matchingFixedTag = fixedTags.find(fixedTag => 
        categoryLower.includes(fixedTag.toLowerCase())
      );
      
      if (matchingFixedTag) {
        targetTag = listTags.find((tag: Tag) => {
          const tagNameLower = tag.name.toLowerCase();
          
          if (tagNameLower.includes(matchingFixedTag.toLowerCase())) {
            return true;
          }
          
          if (isTagRelatedToFixedTag(tag.name, matchingFixedTag)) {
            return true;
          }
          
          return false;
        });
      }
    }

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