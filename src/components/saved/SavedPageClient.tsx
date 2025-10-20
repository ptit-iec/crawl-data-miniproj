"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArticlesPageLayout from "@/components/layout/ArticlesPageLayout";
import { useAuth } from "@/lib/auth/AuthContext";
import { getUserInfoApi } from "@/api/user";
import { getPostById } from "@/api/posts";
import { Article } from "@/store/modules/post";
import { UserTag } from "@/store/modules/user";
export default function SavedPageClient() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);

  async function fetchArticlesByIds(ids: string[]) {
    try {
      setLoading(true);
      console.log("fetchArticlesByIds called with ids:", ids);

      // Gọi tất cả id song song
      const results = await Promise.all(
        ids.map((id) => {
          console.log("Calling getPostById with:", id);
          return getPostById(id);
        })
      );

      // Gộp tất cả items
      const allArticles: Article[] = results.flatMap((res) => res.items ?? []);

      // Sắp xếp theo ngày
      allArticles.sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      });

      console.log("Fetched articles:", allArticles);
      setArticles(allArticles);
    } catch (err) {
      console.error("Error loading articles:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("techNewsToken");
    if (!token) return;

    async function fetchAndLoad() {
      try {
        const userInfo = await getUserInfoApi(token!);
        console.log("User info:", userInfo);

        const ids: string[] = userInfo.data.map((item: UserTag) => item.post);

        console.log("Extracted ids from userInfo:", ids);

        if (ids.length > 0) {
          await fetchArticlesByIds(ids);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching user info:", error.message);
        } else {
          console.error("Error fetching user info: Unknown error", error);
        }
      }
    }

    fetchAndLoad();
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <ArticlesPageLayout
      title="Bài viết đã lưu"
      description="Xem và quản lý các bài viết công nghệ bạn đã lưu"
      icon="saved"
      articles={articles}
      variant="saved"
    />
  );
}
