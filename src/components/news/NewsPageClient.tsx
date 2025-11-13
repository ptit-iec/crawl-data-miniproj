"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ArticlesPageLayout from "@/components/layout/ArticlesPageLayout";
import { getAllTags } from "@/api/tag";
import { Article } from "@/store/modules/post";
import { Tag } from "@/store/modules/Tag";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/configureStore";
import { Post } from "@/store/modules/post";
import { getPostByTagId, getAllPosts } from "@/api/posts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resetPostsByTag, resetAllPosts } from "@/store/modules/post";
import { sortArticlesByTime, filterArticlesByTimeRange } from "@/lib/utils";

const fixedTags = [
  "ai",
  "khcn",
  "telecom",
  "robotics",
  "software",
  "security",
  "research",
];

export default function NewsPageClient() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [categoryTitle] = useState("Tech News");
  const [categoryDescription] = useState(
    "Stay updated with the latest technology news, trends, and insights from around the world"
  );
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [timeRange, setTimeRange] = useState<"all" | "today" | "week" | "month">("all");

  const listTags = useSelector((state: RootState) => state.tag.listAllTag);
  const postsByTag = useSelector((state: RootState) => state.post.postsByTag);
  const allPostData = useSelector((state: RootState) => state.post.allPosts);

  const [currentTagId, setCurrentTagId] = useState<string | null>(null);

  // Lấy pagination info dựa trên category
  const paginationInfo = categoryParam && currentTagId
    ? postsByTag[currentTagId]?.pagination
    : allPostData.pagination;

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

  const hasValidTopic = (topics: string[] | undefined): boolean => {
    if (!topics || topics.length === 0) return false;
    return topics.some((topic) =>
      fixedTags.some((fixedTag) =>
        topic.toLowerCase().includes(fixedTag.toLowerCase())
      )
    );
  };

  // Fetch tags on mount
  useEffect(() => {
    dispatch(getAllTags());
  }, [dispatch]);

  // Reset NGAY LẬP TỨC khi URL params thay đổi (chạy đầu tiên)
  useEffect(() => {
    // Reset tất cả state về trạng thái ban đầu
    dispatch(resetAllPosts());
    dispatch(resetPostsByTag());
    setArticles([]);
    setCurrentPage(1);
    setCurrentTagId(null);
    setLoading(true);
  }, [dispatch,categoryParam]);

  // Fetch data when category or page changes
  useEffect(() => {
    // Reset articles và set loading trước khi fetch
    setArticles([]);
    setLoading(true);

    // If no category, fetch all posts
    if (!categoryParam) {

      setCurrentTagId(null);
      dispatch(getAllPosts({ page: currentPage, pageSize }));
      return;
    }

    // Wait for tags to load
    if (!listTags || listTags.length === 0) {
      return;
    }

    // Find target tag
    const targetTag = listTags.find(
      (tag: Tag) => tag.name.toLowerCase() === categoryParam.toLowerCase()
    );

    if (!targetTag) {

      setCurrentTagId(null);
      setLoading(false);
      return;
    }

    const tagIdStr = targetTag.id.toString();
    setCurrentTagId(tagIdStr);

    dispatch(
      getPostByTagId({
        tag_id: tagIdStr,
        page: currentPage,
        pageSize,
      })
    );
  }, [dispatch, listTags, categoryParam, currentPage, pageSize]);

  // Update articles when data changes
  useEffect(() => {
    const dataSource = categoryParam && currentTagId
      ? postsByTag[currentTagId]?.data
      : allPostData.data;

    const isLoadingData = categoryParam && currentTagId
      ? postsByTag[currentTagId]?.isLoading
      : allPostData.isLoading;

    // Update loading state
    setLoading(isLoadingData ?? false);

    // Nếu đang loading và chưa có data, giữ articles rỗng
    if (isLoadingData) {
      if (!dataSource?.length) {
        setArticles([]);
      }
      return;
    }

    // Nếu không có data và không loading, clear articles
    if (!dataSource || !dataSource.length) {
      setArticles([]);
      return;
    }

    // Map data sang articles
    const filteredPosts = dataSource.filter((post) => hasValidTopic(post.topic));
    let mappedArticles = filteredPosts.map(mapPostToArticle);

    // Apply time range filter
    mappedArticles = filterArticlesByTimeRange(mappedArticles, timeRange);

    // Apply sorting
    if (sortBy === "newest" || sortBy === "oldest") {
      mappedArticles = sortArticlesByTime(
        mappedArticles,
        sortBy === "newest" ? "newest" : "oldest"
      );
    }
    // Các option khác (popular, trending) có thể implement sau

    setArticles(mappedArticles);
  }, [postsByTag, allPostData, categoryParam, currentTagId, sortBy, timeRange]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = paginationInfo?.pages || 0;
  const total = paginationInfo?.total || 0;
  const startItem = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, total);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = maxVisible - 1;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - (maxVisible - 2);
      }

      if (start > 2) pages.push("...");

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) pages.push("...");
      
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div>
      <ArticlesPageLayout
        title={categoryTitle}
        description={categoryDescription}
        icon="news"
        articles={articles}
        variant="news"
        categoryParam={categoryParam}
        sortBy={sortBy}
        onSortChange={setSortBy}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        // loading={loading}
        paginationControls={
          paginationInfo && total > 0 ? (
            <div className="flex flex-col items-center gap-4 mt-8 mb-4">
              {/* Pagination info */}
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>
                  Showing {startItem}-{endItem} of {total} results
                </span>
                <select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  disabled={loading}
                  className="bg-slate-800 border border-slate-600 text-slate-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={30}>30 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>

              {/* Pagination buttons */}
              <div className="flex items-center gap-2">
                {/* Previous button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || loading}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-slate-600 text-slate-300 rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    page === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-3 py-2 text-slate-500"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page as number)}
                        disabled={loading}
                        className={`min-w-[40px] px-3 py-2 text-sm rounded-md transition-colors ${
                          currentPage === page
                            ? "bg-blue-500 text-white border border-blue-500"
                            : "border border-slate-600 text-slate-300 hover:bg-slate-800"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages || loading}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-slate-600 text-slate-300 rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick jump */}
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>Go to page:</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = Number(e.target.value);
                    if (page >= 1 && page <= totalPages) {
                      handlePageChange(page);
                    }
                  }}
                  disabled={loading}
                  className="w-16 bg-slate-800 border border-slate-600 text-slate-300 rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span>of {totalPages}</span>
              </div>
            </div>
          ) : null
        }
      />
    </div>
  );
}