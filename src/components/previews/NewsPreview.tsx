"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ArticleList from "@/components/ArticleList";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/api/posts";
import { AppDispatch, RootState } from "@/store/configureStore";
import { Article, Post } from "@/store/modules/post";

const fixedTags = [
  "ai",
  "kh&cn",
  "telecom",
  "robotics",
  "software",
  "security",
  "research",
];

const tagRelations: Record<string, string[]> = {
  ai: ["artificial intelligence", "machine learning", "deep learning", "neural network", "gpt", "llm", "generative ai"],
  "kh&cn": ["khoa học", "công nghệ", "science", "technology"],
  telecom: ["telecommunications", "5g", "6g", "network", "wireless", "communication"],
  robotics: ["robot", "automation", "autonomous", "self-driving", "fsd", "avs", "drone", "autonomous vehicles"],
  software: ["app", "application", "program", "code", "development", "erp", "saas"],
  security: ["cybersecurity", "cyber security", "encryption", "privacy", "hacking", "vulnerability"],
  research: ["nghiên cứu", "study", "innovation", "development", "r&d"],
};

export default function NewsPreview() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  const listAllPost = useSelector((state: RootState) => state.post.allPosts.data);

  const mapPostToArticle = (post: Post): Article => ({
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
    imageUrl: post.images?.[0] || "",
    publishedAt: post.time || "",
  });

  const isTagRelatedToFixedTag = (tagName: string, fixedTag: string): boolean => {
    const tagLower = tagName.toLowerCase();
    const fixedTagLower = fixedTag.toLowerCase();
    
    if (tagLower.includes(fixedTagLower)) {
      return true;
    }
    
    const relatedKeywords = tagRelations[fixedTag] || [];
    return relatedKeywords.some(keyword => tagLower.includes(keyword.toLowerCase()));
  };

  const hasValidTopic = (topics: string[] | undefined): boolean => {
    if (!topics || topics.length === 0) return false;
    return topics.some((topic) =>
      fixedTags.some((fixedTag) =>
        isTagRelatedToFixedTag(topic, fixedTag)
      )
    );
  };

  useEffect(() => {
    dispatch(getAllPosts({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  useEffect(() => {
    // Lọc các bài viết có topic thuộc fixedTags
    const filtered = listAllPost
      .filter((post) => hasValidTopic(post.topic))
      .map(mapPostToArticle);
    
    setFilteredArticles(filtered);
  }, [listAllPost]);

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
        articles={filteredArticles}
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