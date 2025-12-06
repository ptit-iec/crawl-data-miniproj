"use client";

import { useRouter } from "next/navigation";
import { Newspaper, Heart, Bookmark } from "lucide-react";
import ArticleList from "@/components/ArticleList";
import type { NewsArticle } from "@/types/news";
import type {
  SavedArticle,
  FavoriteArticle,
  NewsGridItem,
} from "@/data/articles";

interface ArticlesPageLayoutProps {
  title: string;
  description: string;
  icon: "news" | "favorites" | "saved";
  articles: (NewsArticle & Partial<SavedArticle & FavoriteArticle & NewsGridItem>)[];
  variant: "favorites" | "saved" | "news";
  onSave?: (id: string) => void;
  categoryParam?: string | null;
  paginationControls?: React.ReactNode;
  sortBy?: "newest" | "oldest";
  onSortChange?: (sortBy: "newest" | "oldest") => void;
  timeRange?: "all" | "today" | "week" | "month";
  onTimeRangeChange?: (timeRange: "all" | "today" | "week" | "month") => void;
}
const getGradientClasses = (variant: string) => {
  const gradients = {
    favorites: "from-slate-900 via-slate-800 to-pink-900",
    saved: "from-slate-900 via-slate-800 to-blue-900",
    news: "from-slate-900 via-slate-800 to-emerald-900",
  };
  return gradients[variant as keyof typeof gradients] || gradients.news;
};

const getAccentColor = (variant: string) => {
  const colors = {
    favorites: "text-pink-400",
    saved: "text-blue-400",
    news: "text-emerald-400",
  };
  return colors[variant as keyof typeof colors] || colors.news;
};
const getIconComponent = (icon: string) => {
  const icons = {
    news: Newspaper,
    favorites: Heart,
    saved: Bookmark,
  };
  return icons[icon as keyof typeof icons] || Newspaper;
};
const getFilterColors = (variant: string) => {
  const colors = {
    favorites: "focus:ring-pink-500 focus:border-pink-500",
    saved: "focus:ring-blue-500 focus:border-blue-500",
    news: "focus:ring-emerald-500 focus:border-emerald-500",
  };
  return colors[variant as keyof typeof colors] || colors.news;
};

export default function ArticlesPageLayout({
  title,
  description,
  icon,
  articles,
  variant,
  onSave,
  categoryParam,
  paginationControls,
  sortBy = "newest",
  onSortChange,
  timeRange = "all",
  onTimeRangeChange,
}: ArticlesPageLayoutProps) {
  const router = useRouter();

  const IconComponent = getIconComponent(icon);
  const gradientClasses = getGradientClasses(variant);
  const accentColor = getAccentColor(variant);
  const filterColors = getFilterColors(variant);

  const handleCategoryChange = (value: string) => {
    if (value) {
      router.push(`/news?category=${value}`);
    } else {
      router.push("/news");
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradientClasses}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <IconComponent className={`w-12 h-12 ${accentColor} mr-3`} />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {title}
            </h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Advanced Filters & Controls */}
        <section className="mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 max-w-3xl mx-auto p-3">
            <h2 className="text-lg font-semibold text-white mb-3">
              Bộ lọc nâng cao
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Danh mục
                </label>
                <select
                  title="Filter by category"
                  className={`w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 ${filterColors}`}
                  value={categoryParam || ""}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="">Tất cả danh mục</option>
                  <option value="research">
                    Thông tin hoạt động nghiên cứu khoa học
                  </option>
                  <option value="kh&cn">Hoạt động bộ KH&CN</option>
                  <option value="ai">Trí tuệ nhân tạo</option>
                  <option value="telecom">Viễn thông và mạng</option>
                  <option value="robotics">Robotic và tự động hóa</option>
                  <option value="software">Phát triển phần mềm</option>
                  <option value="security">An toàn thông tin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Sắp xếp theo
                </label>
                <select
                  title="Sort articles"
                  className={`w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 ${filterColors}`}
                  value={sortBy}
                  onChange={(e) => onSortChange?.(e.target.value as "newest" | "oldest" )}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  {/* <option value="popular">Phổ biến nhất</option>
                  <option value="trending">Xu hướng</option> */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Khoảng thời gian
                </label>
                <select
                  title="Select time range"
                  className={`w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 ${filterColors}`}
                  value={timeRange}
                  onChange={(e) => onTimeRangeChange?.(e.target.value as "all" | "today" | "week" | "month")}
                >
                  <option value="all">Tất cả</option>
                  <option value="today">Hôm nay</option>
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                </select>
              </div>
            </div>
          </div>
        </section>

         <ArticleList
          articles={articles}
          layout="list"
          variant={variant}
          showActions={true}
          onSave={onSave}
        />

        {paginationControls && (
          <div className="mt-8 flex justify-center">{paginationControls}</div>
        )}
      </div>
    </div>
  );
}
