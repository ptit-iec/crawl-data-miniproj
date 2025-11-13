"use client";

import { Bookmark, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ArticleList from "@/components/ArticleList";
// import { useAuth } from "@/lib/auth/AuthContext";
// import { getUserInfoApi } from "@/api/user";
// import { getPostById } from "@/api/posts";
import { useState } from "react";
import { Article } from "@/store/modules/post";
export default function SavedPreview() {
  const router = useRouter();
  // const { isAuthenticated } = useAuth();
  // const [loading, setLoading] = useState(false);
  const [articles] = useState<Article[]>([]);


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
