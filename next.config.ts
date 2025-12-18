import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // Tắt optimization cho tất cả ảnh
    domains: [
      "picsum.photos",
      "techcrunch.com",
      "*.techcrunch.com",
      "*.wp-content.uploads",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  assetPrefix: '/thongtinkhcn/',
  basePath: '/thongtinkhcn',
};

export default nextConfig;
