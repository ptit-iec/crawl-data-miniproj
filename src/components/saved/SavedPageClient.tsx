"use client";

import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import ArticlesPageLayout from "./ArticlesPageLayout";
// import { useAuth } from "@/lib/auth/AuthContext";
import { Article, Post } from "@/store/modules/post";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/configureStore";
import { getAllSavedPost } from "@/api/user";
import { RootState } from "@/store/configureStore";
import { getPostByPostId } from "@/api/posts";
export default function SavedPageClient() {
  const dispatch = useDispatch<AppDispatch>();
  // const { isAuthenticated, isLoading } = useAuth();
  // const router = useRouter();

  // const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);

  const listAllSavedPost = useSelector((state : RootState) => state.userInfo.listAllPosts);
  const savePosts = useSelector((state : RootState) => state.post.savedPosts);
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
  useEffect(() => {
    dispatch(getAllSavedPost());
  },[dispatch])
  useEffect(() => {
    if (listAllSavedPost && listAllSavedPost.length > 0) {
      listAllSavedPost.forEach((post) => {
        dispatch(getPostByPostId(post.post|| ""));
      });
    }
  },[dispatch, listAllSavedPost])
  useEffect(() => {
    if (savePosts && savePosts.length > 0) {
      const mappedArticles = savePosts.map(mapPostToArticle);
      setArticles(mappedArticles);
    }
  }, [savePosts]);
  return (
    <ArticlesPageLayout
      title="Bài viết đã lưu"
      description="Xem và quản lý các bài viết công nghệ bạn đã lưu"
      icon="saved"
      articles={articles}
      variant="saved"
    />
  );
}
