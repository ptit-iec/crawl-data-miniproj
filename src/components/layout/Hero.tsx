"use client";

import { TrendingUp, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAllTags } from "@/api/tag";
import { getPostByTag } from "@/api/posts";
import type { Article } from "@/store/modules/post";
import { formatDate } from "@/lib/utils";
export default function Hero() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);

        const tagRes = await getAllTags();
        const fixedTags = [
          "ai",
          "khcn",
          "telecom",
          "robotics",
          "software",
          "security",
          "research",
        ];

        const targetTags = tagRes.items.filter((t) =>
          fixedTags.includes(t.name.toLowerCase())
        );

        const results = await Promise.all(
          targetTags.map((t) => getPostByTag(t.id, 1, 3))
        );

        const merged = results.flatMap((r) => r.items);

        merged.sort((a, b) => {
          const dateA = new Date(a.publishedAt || 0).getTime();
          const dateB = new Date(b.publishedAt || 0).getTime();
          return dateB - dateA;
        });

        setArticles(merged.slice(0, 6));
      } catch (err) {
        console.error("Error loading articles:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-white">Đang tải dữ liệu...</div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-10 text-white">Không có bài viết nào.</div>
    );
  }

  const featuredArticle = articles[0];
  const secondaryArticles = articles.slice(1, 4);

  // Helper để chọn link
  const getArticleLink = (article: Article) => {
    if (article.internalLinks && article.internalLinks.length > 0) {
      return article.internalLinks[0]; // link nội bộ
    }
    if (article.website) {
      return article.website; // link website ngoài
    }
    return "#"; // fallback
  };

  const isExternalLink = (article: Article) =>
    !(
      article.internalLinks &&
      article.internalLinks.length > 0
    );

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-6 pb-8 md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Featured Article */}
          <div className="lg:col-span-2">
            <div className="group relative overflow-hidden rounded-2xl h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] border border-slate-700 hover:border-slate-600 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

              <Image
                src={
                  featuredArticle.imageUrl ||
                  `https://picsum.photos/1200/600?random=${featuredArticle.name.length}`
                }
                alt={featuredArticle.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />

              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-20">
                <div className="flex items-center gap-3 mb-2 md:mb-3">
                  <span className="px-2 py-0.5 md:px-3 md:py-1 bg-green-500/90 text-white text-xs font-semibold rounded-full">
                    {featuredArticle.field}
                  </span>
                  {/* nếu có cờ hot */}
                  {featuredArticle.summarize && (
                    <span className="flex items-center text-xs font-medium text-white/80 bg-orange-500/20 px-2 py-0.5 rounded-full">
                      <TrendingUp className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1 text-orange-400" />
                      Xu hướng
                    </span>
                  )}
                </div>

                <Link
                  href={getArticleLink(featuredArticle)}
                  target={isExternalLink(featuredArticle) ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3 group-hover:text-green-400 transition-colors line-clamp-2">
                    {featuredArticle.name}
                  </h2>
                </Link>

                <p className="text-slate-300 mb-3 md:mb-4 max-w-3xl line-clamp-2 text-xs sm:text-sm md:text-base">
                  {featuredArticle.des}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-1 md:gap-y-2 text-xs text-slate-400">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1 md:mr-1.5" />
                      {(() => {

                        return formatDate(featuredArticle.publishedAt ?? "");
                        
                      })()}
                  </span>
                  {featuredArticle.supplier && (
                    <Link
                      href={featuredArticle.website || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:opacity-80 transition-colors flex items-center gap-1"
                    >
                      {featuredArticle.supplier}
                      <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Articles */}
          <div className="lg:col-span-1 flex flex-col gap-4 md:gap-5">
            {secondaryArticles.map((article, idx) => (
              <div
                key={idx}
                className="group bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700 hover:border-slate-600 transition-all duration-300 flex flex-row h-[110px] sm:h-[120px] md:h-[135px] lg:h-[140px]"
              >
                <div className="relative w-[120px] sm:w-[130px] md:w-[140px]">
                  <Image
                    src={
                      article.imageUrl ||
                      `https://picsum.photos/600/400?random=${article.name.length}`
                    }
                    alt={article.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 200px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <div className="mb-1.5">
                      <span className="px-1.5 py-0.5 bg-green-500/90 text-white text-[10px] md:text-xs font-medium rounded-full">
                        {article.field}
                      </span>
                    </div>
                    <Link
                      href={getArticleLink(article)}
                      target={isExternalLink(article) ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <h3 className="font-bold text-white text-sm md:text-base line-clamp-2 group-hover:text-green-400 transition-colors">
                        {article.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-0.5" />
                      {(() => {

                        return formatDate(article.publishedAt ?? "");
                        
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
