"use client";

import Link from "next/link";
import {  ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArticleList from "@/components/ArticleList";
import { TrendingArticle } from "@/data/articles";

interface CategorySectionProps {
  title: string;
  categorySlug: string;
  articles: TrendingArticle[];
  icon?: React.ReactNode;
}

export default function CategorySection({
  title,
  categorySlug,
  articles,
  icon,
}: CategorySectionProps) {
  // Get a subset of articles
  const displayArticles = articles.slice(0, 6);

  return (
    <section className="py-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {title}
            </h2>
            <p className="text-slate-400">{articles.length} bài viết</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
            asChild
          >
            <Link href={`/news?category=${categorySlug}`}>Xem tất cả</Link>
          </Button>
        </div>
      </div>

      {/* Articles Grid */}
      <ArticleList
        articles={displayArticles}
        layout="grid"
        variant="news"
        limit={6}
        enablePagination={false}
        showActions={true}
      />

      {/* Load More Button */}
      <div className="text-center mt-8">
        <Button
          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105"
          asChild
        >
          <Link href={`/news?category=${categorySlug}`}>
            Xem tất cả bài viết
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
