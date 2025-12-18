"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ArticleList from "@/components/ArticleList";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/api/posts";
import { AppDispatch, RootState } from "@/store/configureStore";
import { Article, Post } from "@/store/modules/post";

export default function NewsPreview() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);

  const allPostData = useSelector((state: RootState) => state.post.allPosts);

  const placeholderImages = [
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
  ];

  const mapPostToArticle = (post: Post): Article => {
    let imageUrl = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    if (post.images && post.images.length > 0) {
      const randomIndex = Math.floor(Math.random() * post.images.length);
      imageUrl = post.images[randomIndex] || placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    }

    return {
      id: post.id,
      name: post.title,
      field: post.domain,
      des: post.summary || post.highlight || "",
      tags: post.topic,
      supplier: post.newspaper_publisher,
      website: post.url,
      contact_info: "",
      address: "",
      summarize: post.summary,
      internalLinks: [],
      externalLinks: post.references,
      imageUrl: imageUrl,
      publishedAt: post.time || "",
    };
  };

  useEffect(() => {
    dispatch(getAllPosts({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (!allPostData.data || allPostData.data.length === 0) {
      setArticles([]);
      return;
    }

    const mappedArticles = allPostData.data.map(mapPostToArticle);
    setArticles(mappedArticles);
  }, [allPostData.data]);

  return (
    <section className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Tin tức mới nhất</h2>
        <Button
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-800"
          onClick={() => router.push("/news")}
        >
          Xem tất cả
        </Button>
      </div>

      {/* Articles Grid */}
      <ArticleList
        articles={articles}
        layout="grid"
        variant="news"
        limit={6}
        enablePagination={false}
        showActions={true}
      />

      <div className="text-center mt-6">
        <Button
          className="bg-orange-500 hover:bg-orange-600 text-white px-6"
          onClick={() => router.push("/news")}
        >
          Xem thêm bài viết
        </Button>
      </div>
    </section>
  );
}