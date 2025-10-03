"use client";

import { Bookmark, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ArticleList from "@/components/ArticleList";
import { useAuth } from "@/lib/auth/AuthContext";
import { getUserInfoApi } from "@/api/user";
import { getPostById, Article } from "@/api/posts";
import { useEffect, useState } from "react";

export default function SavedPreview() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);

  async function fetchArticlesByIds(ids: string[]) {
  try {
    setLoading(true);

    // Gọi tất cả id song song
    console.log(ids);
    
    const results = await Promise.all(ids.map((id) => getPostById(id)));

    // Vì mỗi getPostById trả về { items: [...] }, nên cần flatMap
    const allArticles: Article[] = results.flatMap((res) => res.items ?? []);

    // Sắp xếp theo ngày
    allArticles.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });
    setArticles(allArticles.slice(0, 6));
  } catch (err) {
    console.error("Error loading preview articles:", err);
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

      const ids: string[] = userInfo.data.map((item: any) => item.post);

      if (ids.length > 0) {
        await fetchArticlesByIds(ids);
      }
    } catch (error: any) {
      console.error("Error fetching user info:", error.message);
    }
  }

  fetchAndLoad();
}, []);

  return (
    <section className="py-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <Bookmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Bài viết đã lưu</h2>
            <p className="text-slate-400">{articles.length} bài viết đã lưu</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
            onClick={() => router.push("/saved")}
          >
            Xem tất cả
          </Button>
        </div>
      </div>

      {/* Articles Grid */}
      <ArticleList
        articles={articles}
        layout="grid"
        variant="saved"
        limit={6}
        enablePagination={false}
        showActions={true}
      />

      {/* Load More Button */}
      <div className="text-center mt-8">
        <Button
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105"
          onClick={() => router.push("/saved")}
        >
          Xem tất cả bài viết đã lưu
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </section>
  );
}
