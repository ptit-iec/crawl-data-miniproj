"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ArticleList from "@/components/ArticleList";
// import { Article } from "@/store/modules/post";
// import { Tag } from "@/store/modules/Tag";
import { useDispatch,useSelector } from "react-redux";
import { getAllPosts } from "@/api/posts";
import { AppDispatch, RootState } from "@/store/configureStore";
import { NewsArticle } from "@/types/news";
import { Post } from "@/store/modules/post";
export default function NewsPreview() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  // const [articles, setArticles] = useState<Article[]>([]);
  // const [tags, setTags] = useState<Tag[]>([]);
  // const [loading, setLoading] = useState(false);

  const listAllPost = useSelector((state : RootState) => state.post.allPosts.data);
  const mapPostToArticle = (post: Post): NewsArticle => ({
    id: post.id,
    name: post.title,
    field: post.domain,
    des: post.summary || post.highlight || "",
    tags: post.topic,
    supplier: post.newspaper_publisher,
    website: post.url,
    summarize: post.summary,
    externalLinks: post.references,
  });
  useEffect(() => {
    dispatch(getAllPosts({ page: 1, pageSize: 6 }));
  },[dispatch])
  // useEffect(() => {
  //   async function fetchArticles() {
  //     try {
  //       setLoading(true);

  //       const tagRes = await getAllTags();
  //       setTags(tagRes.items);

  //       const fixedTags = [
  //         "ai",
  //         "khcn",
  //         "telecom",
  //         "robotics",
  //         "software",
  //         "security",
  //         "research",
  //       ];

  //       const targetTags = tagRes.items.filter((t) =>
  //         fixedTags.includes(t.name.toLowerCase())
  //       );

  
  //       const results = await Promise.all(
  //         targetTags.map((t) => getPostByTag(t.id, 1, 3))
  //       );


  //       const merged = results.flatMap((r) => r.items);


  //       merged.sort((a, b) => {
  //         const dateA = new Date(a.publishedAt || 0).getTime();
  //         const dateB = new Date(b.publishedAt || 0).getTime();
  //         return dateB - dateA;
  //       });


  //       setArticles(merged.slice(0, 6));
  //     } catch (err) {
  //       console.error("Error loading preview articles:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchArticles();
  // }, []);

  // // Giữ nguyên logic like/save cũ
  // const toggleLike = (id: string) => {
  //   setArticles((prev) =>
  //     prev.map((article) =>
  //       article.id === id
  //         ? {
  //             ...article,
  //             isLiked: !article.isLiked,
  //             likes: article.isLiked ? article.likes - 1 : article.likes + 1,
  //           }
  //         : article
  //     )
  //   );
  // };

  // const toggleSave = (id: string) => {
  //   setArticles((prev) =>
  //     prev.map((article) =>
  //       article.id === id ? { ...article, isSaved: !article.isSaved } : article
  //     )
  //   );
  // };

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
          articles={listAllPost.map(mapPostToArticle)}
          layout="grid"
          variant="news"
          limit={6}
          enablePagination={false}
          // onLike={toggleLike}
          // onSave={toggleSave}
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
