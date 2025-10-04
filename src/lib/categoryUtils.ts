import { useState, useEffect } from "react";
import { getAllTags,Tag } from "@/api/tag";
import { getPostByTag, type Article } from "@/api/posts";
import { TrendingArticle } from "@/data/articles";

export function useArticlesByTag(tagName: string, limit = 6) {
  const [articles, setArticles] = useState<TrendingArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {

        const tagsRes = await getAllTags();
        const targetTag = tagsRes.items.find(
          (tag: Tag) => tag.name.toLowerCase() === tagName.toLowerCase()
        );

        if (!targetTag) {
          console.warn(`Không tìm thấy tag '${tagName}'`);
          return;
        }


        const postsRes = await getPostByTag(targetTag.id, 1, limit);

        if (isMounted && postsRes?.items) {
  
          const mappedArticles: TrendingArticle[] = postsRes.items.map(
            (a: Article, index: number) => ({
              ...a,
              localId: String(index), // key phụ
              views: 0,
              readTime: "3 phút",
              trendingScore: 0,
            })
          );

          setArticles(mappedArticles);
        }
      } catch (err) {
        console.error(`Error fetching articles for tag '${tagName}':`, err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [tagName, limit]);

  return { articles, loading };
}
