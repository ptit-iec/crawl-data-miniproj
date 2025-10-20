"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ArticlesPageLayout from "@/components/layout/ArticlesPageLayout";
import { getPostByTag } from "@/api/posts";
import { getAllTags } from "@/api/tag";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Article } from "@/store/modules/post";
import { Tag } from "@/store/modules/Tag";
export default function NewsPageClient() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [categoryTitle, setCategoryTitle] = useState("Tech News");
  const [categoryDescription, setCategoryDescription] = useState(
    "Stay updated with the latest technology news, trends, and insights from around the world"
  );

    const loadArticles = useCallback(
      async (reset = false, customPage?: number) => {
        if (loading) return;
        setLoading(true);

        try {
          const targetPage = customPage ?? (reset ? 1 : page);
          let data: { items: Article[] };

          if (categoryParam && tags.length > 0) {
            const tag = tags.find(
              (t) => t.name.toLowerCase() === categoryParam.toLowerCase()
            );
            if (tag) {
              data = await getPostByTag(tag.id, targetPage, 5);
            } else {
              data = { items: [] };
            }
          } else if (tags.length > 0) {
            const fixedTags = ["ai", "khcn", "telecom", "robotics", "software", "security", "research"];
            const targetTags = tags.filter((t) => fixedTags.includes(t.name.toLowerCase()));
            const results = await Promise.all(targetTags.map((t) => getPostByTag(t.id, targetPage, 5)));
            const merged = results.flatMap((r) => r.items);
            merged.sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
            data = { items: merged };
          } else {
            data = { items: [] };
          }

          setArticles(data.items);
          setPage(targetPage);
          setHasMore(data.items.length > 0);
        } catch (err) {
          console.error("Error loading posts:", err);
        } finally {
          setLoading(false);
        }
      },
      [categoryParam, tags, page]
    );
  useEffect(() => {
      async function fetchTags() {
        try {
          const tagRes = await getAllTags();
          setTags(tagRes.items);
        } catch (err) {
          console.error("Error loading tags:", err);
        }
      }
      fetchTags();
    }, []);

  useEffect(() => {
    if (tags.length > 0) {
      loadArticles(true, 1);
    }
  }, [tags, categoryParam, loadArticles]);

  return (
    <div>
      <ArticlesPageLayout
        title={categoryTitle}
        description={categoryDescription}
        icon="news"
        articles={articles}
        variant="news"
        categoryParam={categoryParam}
        paginationControls={
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                if (page > 1) {
                  await loadArticles(true, page - 1);
                }
              }}
              disabled={page <= 1 || loading}
              className="border-slate-600 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                if (hasMore) {
                  await loadArticles(true, page + 1);
                }
              }}
              disabled={!hasMore || loading}
              className="border-slate-600 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        }
      />
    </div>
  );
}
