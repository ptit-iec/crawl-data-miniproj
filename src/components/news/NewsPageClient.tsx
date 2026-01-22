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
  research: ["Đề tài","đề tài","ĐỀ TÀI","nghiên cứu", "study", "innovation", "development", "r&d","khoa học", "công nghệ", "science", "technology","kh&cn"],
};

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

  const paginationInfo = categoryParam && currentTagId
    ? postsByTag[currentTagId]?.pagination
    : allPostData.pagination;

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

  // Helper function: Kiểm tra tag có liên quan đến fixedTag không
  const isTagRelatedToFixedTag = (tagName: string, fixedTag: string): boolean => {
    const tagLower = tagName.toLowerCase();
    const fixedTagLower = fixedTag.toLowerCase();
    
    // Kiểm tra trùng khớp trực tiếp
    if (tagLower.includes(fixedTagLower)) {
      return true;
    }
    
    // Kiểm tra các từ khóa liên quan
    const relatedKeywords = tagRelations[fixedTag] || [];
    return relatedKeywords.some(keyword => tagLower.includes(keyword.toLowerCase()));
  };

  const hasValidTopic = (topics: string[] | undefined, post?: Post): boolean => {
    // Đặc biệt cho research: tự động nhận domain từ mst.gov.vn và nafosted.gov.vn
    if (categoryParam?.toLowerCase() === "research" && post) {
      const domain = post.domain?.toLowerCase() || "";
      if (domain.includes("mst.gov.vn") || domain.includes("nafosted.gov.vn")) {
        return true;
      }
    }
    
    if (!topics || topics.length === 0) return false;
    return topics.some((topic) =>
      fixedTags.some((fixedTag) =>
        isTagRelatedToFixedTag(topic, fixedTag)
      )
    );
  };

  useEffect(() => {
    dispatch(getAllTags());
    dispatch(resetAllPosts());
    dispatch(resetPostsByTag());
    setArticles([]);
    setCurrentPage(1);
    setCurrentTagId(null);
    setLoading(true);
  }, [dispatch,categoryParam]);
  
  useEffect(() => {
    setArticles([]);
    setLoading(true);

    if (!categoryParam) {
      setCurrentTagId(null);
      dispatch(getAllPosts({ page: currentPage, pageSize }));
      return;
    }

    if (!listTags || listTags.length === 0) {
      return;
    }

    const categoryLower = categoryParam.toLowerCase();
    let targetTag = listTags.find((tag: Tag) => {
      const tagNameLower = tag.name.toLowerCase();
      if (tagNameLower === categoryLower) {
        return true;
      }
      return false;
    });

    if (!targetTag && fixedTags.includes(categoryLower)) {
      targetTag = listTags.find((tag: Tag) => {
        const tagNameLower = tag.name.toLowerCase();
        if (tagNameLower === categoryLower) {
          return true;
        }
        return false;
      });
    }
    
    if (!targetTag) {
      targetTag = listTags.find((tag: Tag) => {
        const tagNameLower = tag.name.toLowerCase();
        
        if (tagNameLower.includes(categoryLower)) {
          return true;
        }
        
        if (isTagRelatedToFixedTag(tag.name, categoryLower)) {
          return true;
        }
        
        return false;
      });
    }
    
    if (!targetTag) {
      const matchingFixedTag = fixedTags.find(fixedTag => 
        categoryLower.includes(fixedTag.toLowerCase())
      );
      
      if (matchingFixedTag) {
        targetTag = listTags.find((tag: Tag) => {
          const tagNameLower = tag.name.toLowerCase();
          
          if (tagNameLower.includes(matchingFixedTag.toLowerCase())) {
            return true;
          }
          
          if (isTagRelatedToFixedTag(tag.name, matchingFixedTag)) {
            return true;
          }
          
          return false;
        });
      }
    }

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
    
    // Với research, gọi thêm getAllPosts để lấy bài từ mst.gov.vn và nafosted.gov.vn
    if (categoryLower === "research") {
      dispatch(getAllPosts({ page: 1, pageSize: 100 }));
    }
  }, [dispatch, listTags, categoryParam, currentPage, pageSize]);

  useEffect(() => {
    let dataSource = categoryParam && currentTagId
      ? postsByTag[currentTagId]?.data
      : allPostData.data;

    const isLoadingData = categoryParam && currentTagId
      ? postsByTag[currentTagId]?.isLoading
      : allPostData.isLoading;

    setLoading(isLoadingData ?? false);

    if (isLoadingData) {
      if (!dataSource?.length) {
        setArticles([]);
      }
      return;
    }

    if (!dataSource || !dataSource.length) {
      setArticles([]);
      return;
    }

    // Với research: merge thêm các bài từ allPostData có domain mst.gov.vn hoặc nafosted.gov.vn
    if (categoryParam?.toLowerCase() === "research" && allPostData.data) {
      const researchDomainPosts = allPostData.data.filter(post => {
        const domain = post.domain?.toLowerCase() || "";
        return domain.includes("mst.gov.vn") || domain.includes("nafosted.gov.vn");
      });
      
      // Merge và loại bỏ duplicate dựa trên id
      const mergedData = [...(dataSource || []), ...researchDomainPosts];
      const uniquePosts = Array.from(
        new Map(mergedData.map(post => [post.id, post])).values()
      );
      dataSource = uniquePosts;
    }

    const filteredPosts = categoryParam 
      ? dataSource.filter((post) => hasValidTopic(post.topic, post))
      : dataSource;
    let mappedArticles = filteredPosts.map(mapPostToArticle);

    mappedArticles = filterArticlesByTimeRange(mappedArticles, timeRange);

    if (sortBy === "newest" || sortBy === "oldest") {
      mappedArticles = sortArticlesByTime(
        mappedArticles,
        sortBy === "newest" ? "newest" : "oldest"
      );
    }

    // Giải pháp tạm thời: Nếu trang 1 và số bài < pageSize, thêm tối đa 5 bài nhân bản
    if (currentPage === 1 && mappedArticles.length > 0 && mappedArticles.length < pageSize) {
      const articlesWithDuplicates = [...mappedArticles];
      const maxDuplicates = 5;
      const needed = pageSize - mappedArticles.length;
      const duplicatesToAdd = Math.min(maxDuplicates, needed);
      
      for (let i = 0; i < duplicatesToAdd; i++) {
        const randomIndex = Math.floor(Math.random() * mappedArticles.length);
        const originalArticle = mappedArticles[randomIndex];
        const duplicateArticle = {
          ...originalArticle,
          id: `${originalArticle.id}_dup_${i}`, // Chỉ thay đổi id để unique
        };
        articlesWithDuplicates.push(duplicateArticle);
      }
      
      setArticles(articlesWithDuplicates);
    } else {
      setArticles(mappedArticles);
    }
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
        paginationControls={
          paginationInfo && total > 0 && articles.length > 0 ? (
            <div className="flex flex-col items-center gap-4 mt-8 mb-4">
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

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || loading}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-slate-600 text-slate-300 rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

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

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages || loading}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-slate-600 text-slate-300 rounded-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

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