"use client";

import CategorySection from "@/components/categories/CategorySection";
import { useArticlesByTag } from "@/lib/categoryUtils";
import { Building2 } from "lucide-react";

export default function KHCNSection() {
  const { articles, loading } = useArticlesByTag("kh&cn", 6);
  
  if (loading) {
    return <div className="text-slate-400">Đang tải dữ liệu...</div>;
  }
  return (
    <CategorySection 
      title="Hoạt động bộ KH&CN" 
      categorySlug="khcn" 
      articles={articles}
      icon={<Building2 className="w-6 h-6 text-white" />}
    />
  );
}
