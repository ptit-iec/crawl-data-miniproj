"use client";

import { useState, useRef, useEffect } from "react";
import {
  Heart,
  Clock,
  Eye,
  ExternalLink,
  Share2,
  Bookmark,
  Star,
  Brain,
  Link as LinkIcon,
  ExternalLink as ExternalLinkIcon,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { NewsArticle } from "@/types/news";
import type {
  SavedArticle,
  FavoriteArticle,
  NewsGridItem,
} from "@/data/articles";
import Link from "next/link";
import Image from "next/image";
interface ArticleCardProps {
  article: NewsArticle & Partial<SavedArticle & FavoriteArticle & NewsGridItem>;
  layout: "grid" | "list";
  variant: "favorites" | "saved" | "news";
  onSave?: (id: string) => void;
  showActions?: boolean;
}

export default function ArticleCard({
  article,
  layout,
  variant,
  onSave,
  showActions = true,
}: ArticleCardProps) {
  const [showSummary, setShowSummary] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (showSummary && articleRef.current) {
      const rect = articleRef.current.getBoundingClientRect();
      console.log("Article position:", rect);
      console.log("Window scroll:", window.scrollX, window.scrollY);

      // Tính toán vị trí - hiển thị ngay trên đầu bài viết
      const newPosition = {
        top: rect.top + window.scrollY - 10, // Chỉ lùi lên một chút so với bài viết
        left: rect.left + window.scrollX,
        width: rect.width,
      };

      console.log("Calculated popup position:", newPosition);
      setPosition(newPosition);
    }
  }, [showSummary]);

  const getVariantColors = (variant: string) => {
    const colors = {
      favorites: {
        accent: "text-pink-400",
        badge: "bg-pink-500/90",
        button: "bg-pink-500/80 hover:bg-pink-500",
      },
      saved: {
        accent: "text-blue-400",
        badge: "bg-blue-500/90",
        button: "bg-blue-500/80 hover:bg-blue-500",
      },
      news: {
        accent: "text-green-400",
        badge: "bg-green-500/90",
        button: "bg-green-500/80 hover:bg-green-500",
      },
    };
    return colors[variant as keyof typeof colors] || colors.news;
  };

  const colors = getVariantColors(variant);

  // Component Popup AI Summary
  const AISummaryPopup = () => {
    console.log("Rendering popup for", article.name);
    console.log("Popup position:", position);

    // Tính toán vị trí tốt nhất cho popup
    const viewportOffset = 20; // Khoảng cách từ đầu trang
    const popupHeight = 200; // Chiều cao ước tính của popup

    // Kiểm tra xem popup có nằm ngoài viewport phía trên không
    const isAboveViewport = position.top - popupHeight - viewportOffset < 0;

    const popupStyle = {
      position: "fixed",
      zIndex: 999999,
      // Nếu không đủ không gian phía trên, hiển thị bên dưới bài viết
      top: isAboveViewport
        ? `${position.top + 100}px` // Hiển thị bên dưới bài viết
        : `${position.top - 140}px`, // Hiển thị bên trên bài viết
      left: `${position.left}px`,
      width: `${position.width}px`,
      backgroundColor: "rgb(30, 41, 59)",
      borderRadius: "0.75rem",
      border: "1px solid rgb(51, 65, 85)",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
      padding: "1rem",
      maxWidth: "600px",
      maxHeight: "250px",
      overflowY: "auto",
    } as React.CSSProperties;

    // Mũi tên chỉ xuống/lên article, tùy thuộc vào vị trí của popup
    const arrowStyle = {
      position: "absolute",
      ...(isAboveViewport
        ? {
            top: "-10px",
            borderTop: "1px solid rgb(51, 65, 85)",
            borderLeft: "1px solid rgb(51, 65, 85)",
          } // Mũi tên chỉ lên
        : {
            bottom: "-10px",
            borderRight: "1px solid rgb(51, 65, 85)",
            borderBottom: "1px solid rgb(51, 65, 85)",
          }), // Mũi tên chỉ xuống
      left: "50%",
      transform: "translateX(-50%) rotate(45deg)",
      width: "16px",
      height: "16px",
      backgroundColor: "rgb(30, 41, 59)",
    } as React.CSSProperties;

    return (
      <div style={popupStyle} className="article-popup">
        <div className="mb-3 pb-2 border-b border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-green-400" />
            <h4 className="font-bold text-white">AI Tóm tắt</h4>
          </div>
          {article.summarize ? (
            <p className="text-slate-300 text-sm">{article.summarize}</p>
          ) : (
            <p className="text-slate-400 text-sm italic">
              Không có tóm tắt AI cho bài viết này
            </p>
          )}
        </div>

        {(article.internalLinks && article.internalLinks.length > 0) ||
        (article.externalLinks && article.externalLinks.length > 0) ? (
          <div>
            <h5 className="font-semibold text-white text-sm mb-2">Đọc thêm:</h5>
            {article.internalLinks && article.internalLinks.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center gap-1 mb-1">
                  <LinkIcon className="w-3 h-3 text-blue-400" />
                  <span className="text-xs text-blue-400">Nội bộ</span>
                </div>
                <ul className="space-y-1">
                  {article.internalLinks.map((link, index) => (
                    <li key={index} className="text-sm">
                      <Link href={link} className="text-blue-400 hover:underline">
                        {link.split("/").pop()}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {article.externalLinks && article.externalLinks.length > 0 && (
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <ExternalLinkIcon className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">Ngoại bộ</span>
                </div>
                <ul className="space-y-1">
                  {article.externalLinks.map((link, index) => (
                    <li key={index} className="text-sm">
                      <Link
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:underline"
                      >
                        {new URL(link).hostname}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-slate-400 text-sm italic">
            Không có liên kết liên quan
          </div>
        )}

        <div style={arrowStyle}></div>
      </div>
    );
  };

  const handleMouseEnter = () => {
    console.log(`Mouse enter on article: ${article.name} (${article.id})`);
    console.log(`Summarize available: ${Boolean(article.summarize)}`);
    console.log(`Summarize content: ${article.summarize}`);
    console.log(
      `Internal links: ${article.internalLinks?.length || 0}, External links: ${
        article.externalLinks?.length || 0
      }`
    );
    console.log(`Article data:`, article);
    setShowSummary(true);
  };

  const handleMouseLeave = () => {
    console.log(`Mouse leave from article: ${article.name}`);
    setShowSummary(false);
  };

  if (layout === "grid") {
    return (
      <article
        ref={articleRef}
        className="group bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-[1.02] relative z-10"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {showSummary && <AISummaryPopup />}
        <div className="relative overflow-hidden">
          <Image
            src={
              article.imageUrl ||
              `https://picsum.photos/400/250?random=${article.name.length}`
            }
            alt={article.name}
            width={400}
            height={250}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Action Buttons */}
          {showActions && (
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onSave && (
                <button
                  title="Save article"
                  onClick={() => onSave(article.id || "")}
                  className={`p-2 ${colors.button} backdrop-blur-sm rounded-full transition-colors`}
                >
                  <Bookmark className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="p-5">
          <Link
            href={article.website || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <h3
              className={`text-lg font-semibold text-white mb-2 group-hover:${colors.accent} transition-colors leading-tight line-clamp-2`}
            >
              {article.name}
            </h3>
          </Link>

          <p className="text-slate-300 text-sm mb-4 line-clamp-3 leading-relaxed">
            {article.des}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags?.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 bg-slate-700/70 text-slate-300 text-xs rounded-md hover:bg-slate-600 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {variant === "saved" && "savedAt" in article && article.savedAt
                  ? `Saved ${formatDate(article.savedAt)}`
                  : variant === "favorites" &&
                    "crawledAt" in article &&
                    article.crawledAt
                  ? `Added ${formatDate(article.crawledAt)}`
                  : "publishedAt" in article && article.publishedAt
                  ? `Published ${formatDate(article.publishedAt)}`
                  : "Recently"}
              </span>
            </div>
            <Link
              href={article.website || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`${colors.accent} hover:opacity-80 transition-colors flex items-center gap-1`}
            >
              {article.supplier}
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // List layout
  return (
    <article
      ref={articleRef}
      className="group bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700 hover:border-slate-600 transition-all duration-300 relative z-10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showSummary && <AISummaryPopup />}
      <div className="flex flex-col lg:flex-row">
        {/* Image */}
        <div className="lg:w-40 lg:flex-shrink-0">
          <div className="relative overflow-hidden h-32 lg:h-full">
            <Image
                src={
                  article.imageUrl ||
                  `https://picsum.photos/400/250?random=${article.name.length}`
                }
                alt={article.name}
                width={400}
                height={250}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />

            {/* Action Buttons */}
            {showActions && (
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {onSave && (
                  <button
                    title="Save article"
                    onClick={() => onSave(article.id || "")}
                    className={`p-2 ${colors.button} backdrop-blur-sm rounded-full transition-colors`}
                  >
                    <Bookmark className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <Link
              href={article.website || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block flex-1"
            >
              <h3
                className={`text-lg font-semibold text-white mb-1 group-hover:${colors.accent} transition-colors leading-tight`}
              >
                {article.name}
              </h3>
            </Link>
            <span
              className={`${colors.accent} font-medium text-xs ${colors.badge
                .replace("bg-", "bg-")
                .replace("/90", "/10")} px-2 py-1 rounded-full flex-shrink-0`}
            >
              {article.field}
            </span>
          </div>

          <p className="text-slate-300 text-sm mb-3 leading-relaxed">
            {article.des}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {article.tags?.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={`${tag}-${index}`}
                className="px-2 py-1 bg-slate-700/70 text-slate-300 text-xs rounded-md hover:bg-slate-600 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {variant === "saved" && "savedAt" in article && article.savedAt
                  ? `Saved ${formatDate(article.savedAt)}`
                  : variant === "favorites" &&
                    "crawledAt" in article &&
                    article.crawledAt
                  ? `Added ${formatDate(article.crawledAt)}`
                  : "publishedAt" in article && article.publishedAt
                  ? `Published ${formatDate(article.publishedAt)}`
                  : "Recently"}
              </span>
            </div>
            <Link
              href={article.website || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`${colors.accent} hover:opacity-80 transition-colors flex items-center gap-1`}
            >
              {article.supplier}
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
