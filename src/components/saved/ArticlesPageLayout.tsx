"use client";
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

export default function ArticlesPageLayout({
  title,
  description,
  icon,
  articles,
  variant,
  onSave,
  // categoryParam,
  paginationControls
}: ArticlesPageLayoutProps) {

  const IconComponent = getIconComponent(icon);
  const gradientClasses = getGradientClasses(variant);
  const accentColor = getAccentColor(variant);
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
