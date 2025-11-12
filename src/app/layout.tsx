import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { ReduxProvider } from "./Provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TechNews - Latest Technology News & Insights",
  description:
    "Stay ahead with the latest technology trends, innovations, and breaking news from the tech world. Your trusted source for AI, blockchain, mobile, and startup news.",
  keywords:
    "technology news, tech trends, AI news, blockchain, startups, mobile technology, web development",
  authors: [{ name: "TechNews Team" }],
  openGraph: {
    title: "TechNews - Latest Technology News & Insights",
    description:
      "Stay ahead with the latest technology trends, innovations, and breaking news from the tech world.",
    type: "website",
    locale: "en_US",
    siteName: "TechNews",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechNews - Latest Technology News & Insights",
    description:
      "Stay ahead with the latest technology trends, innovations, and breaking news from the tech world.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <ReduxProvider>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
