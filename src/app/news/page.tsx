import { Metadata } from "next";
import NewsPageClient from "@/components/news/NewsPageClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "All News - TechNews",
  description: "Browse all the latest technology news and updates",
};

export default function NewsPage() {
  return <Suspense fallback={<div>Loading...</div>}>
    <NewsPageClient />
  </Suspense>;
}
