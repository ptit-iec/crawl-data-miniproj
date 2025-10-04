"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArticleCard from "@/components/cards/ArticleCard";
import type { NewsArticle } from "@/types/news";
import type {
  SavedArticle,
  FavoriteArticle,
  NewsGridItem,
} from "@/data/articles";
import { savePostApi } from "@/api/user";
interface ArticleListProps {
  articles: (NewsArticle &
    Partial<SavedArticle & FavoriteArticle & NewsGridItem>)[];
  layout: "grid" | "list";
  variant: "favorites" | "saved" | "news";
  limit?: number;
  enablePagination?: boolean;
  itemsPerPage?: number;
  showActions?: boolean;
  onLike?: (id: string) => void;
  onSave?: (id: string) => void;
}

const ITEMS_PER_PAGE = 10;

export default function ArticleList({
  articles,
  layout,
  variant,
  limit,
  enablePagination = false,
  itemsPerPage = ITEMS_PER_PAGE,
  showActions = true,
  onLike,
  onSave,
}: ArticleListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Default handlers
  const defaultHandleLike = (id: string) => {
    console.log("Liked article:", id);
  };

const defaultHandleSave = async (id: string) => {
  try {
    const token = localStorage.getItem("techNewsToken");
    if (!token) {
      console.error("No token available");
      return;
    }

    console.log("Saving article:", id);
    await savePostApi(token, id);
    console.log("Saved successfully:", id);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Save failed:", error.message);
    } else {
      console.error("Save failed: Unknown error", error);
    }
  }
};

  // Merge custom or default
  // const handleLike = onLike || defaultHandleLike;
  const handleSave = onSave || defaultHandleSave;

  // Apply limit
  const limitedArticles = limit ? articles.slice(0, limit) : articles;

  // Pagination logic
  const totalPages = enablePagination
    ? Math.ceil(limitedArticles.length / itemsPerPage)
    : 1;
  const startIndex = enablePagination ? (currentPage - 1) * itemsPerPage : 0;
  const endIndex = enablePagination
    ? startIndex + itemsPerPage
    : limitedArticles.length;
  const currentArticles = limitedArticles.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getVariantColors = (variant: string) => {
    const colors = {
      favorites: "bg-pink-500 hover:bg-pink-600",
      saved: "bg-blue-500 hover:bg-blue-600",
      news: "bg-green-500 hover:bg-green-600",
    };
    return colors[variant as keyof typeof colors] || colors.news;
  };

  const buttonColor = getVariantColors(variant);

  return (
    <section className="py-8">
      {/* Articles Grid/List */}
      <div
        className={
          layout === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {currentArticles.map((article) => (
          <ArticleCard
            key={article.id || article.name}
            article={article}
            layout={layout}
            variant={variant}
            onSave={() => handleSave(article.id!)}   
            showActions={showActions}
          />
        ))}
      </div>

      {/* Empty State */}
      {currentArticles.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-white mb-2">
            No articles found
          </h3>
          <p className="text-slate-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Pagination */}
      {enablePagination && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-slate-600 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {currentPage > 3 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(1)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  1
                </Button>
                {currentPage > 4 && (
                  <span className="text-slate-400 px-2">...</span>
                )}
              </>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                return (
                  page === currentPage ||
                  page === currentPage - 1 ||
                  page === currentPage + 1 ||
                  (currentPage <= 2 && page <= 3) ||
                  (currentPage >= totalPages - 1 && page >= totalPages - 2)
                );
              })
              .map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className={
                    currentPage === page
                      ? `${buttonColor} text-white`
                      : "border-slate-600 text-slate-300 hover:bg-slate-800"
                  }
                >
                  {page}
                </Button>
              ))}

            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && (
                  <span className="text-slate-400 px-2">...</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(totalPages)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-slate-600 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </section>
  );
}
