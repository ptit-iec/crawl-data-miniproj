import { useState, useEffect } from "react";
import { Tag } from "@/store/modules/Tag";
import { useDispatch, useSelector } from "react-redux";
import { getAllTags } from "@/api/tag";
import { AppDispatch, RootState } from "@/store/configureStore";
import { getPostByTagId } from "@/api/posts";
import { Post, Article } from "@/store/modules/post";

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
  research: ["Đề tài","đề tài","ĐỀ TÀI","nghiên cứu", "study", "innovation", "development", "r&d","khoa học", "công nghệ", "science", "technology","kh&cn"],
};

export function useArticlesByTag(tagName: string, limit = 6) {
  const [articles, setArticles] = useState<Article[]>([]);
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

  const placeholderImages = [
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
  ];

  const mapPostToArticle = (post: Post): Article => {
    let imageUrl = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    if (post.images && post.images.length > 0) {
      const randomIndex = Math.floor(Math.random() * post.images.length);
      imageUrl = post.images[randomIndex] || placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    }

    return {
      id: post.id,
      name: post.title,
      field: post.domain,
      des: post.summary || post.highlight || "",
      tags: post.topic,
      supplier: post.newspaper_publisher,
      website: post.url,
      contact_info: "",
      address: "",
      summarize: post.summary,
      internalLinks: [],
      externalLinks: post.references,
      imageUrl: imageUrl,
      publishedAt: post.time || "",
    };
  };

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
    
    // Giải pháp tạm thời: Nếu số bài viết < limit, tạo nhân bản bằng cách random
    // Tất cả bài trong mappedArticles đã được filter theo đúng tag từ postData
    if (mappedArticles.length > 0 && mappedArticles.length < limit) {
      const articlesWithDuplicates = [...mappedArticles];
      const remaining = limit - mappedArticles.length;
      
      for (let i = 0; i < remaining; i++) {
        const randomIndex = Math.floor(Math.random() * mappedArticles.length);
        const originalArticle = mappedArticles[randomIndex];
        // Nhân bản toàn bộ article bao gồm tags, field và các thuộc tính khác
        const duplicateArticle = {
          ...originalArticle,
          id: `${originalArticle.id}_dup_${i}`, // Chỉ thay đổi id để unique
          // tags, field, và các thuộc tính khác giữ nguyên từ bài gốc
        };
        articlesWithDuplicates.push(duplicateArticle);
      }
      
      setArticles(articlesWithDuplicates);
    } else {
      setArticles(mappedArticles);
    }
  }, [postData, isValidTag, currentTagId, isLoadingData, limit]);

  return { articles, loading };
}