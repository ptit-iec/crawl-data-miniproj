"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, Search, Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from "@/components/auth/UserMenu";
import { useAuth } from "@/lib/auth/AuthContext";
import Image from "next/image";
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: "Trang chủ", href: "/" },
    { name: "Đã lưu", href: "/saved", requireAuth: true },
  ];

  const categories = [
    { name: "Tất cả", href: "/news" },
    {
      name: "Thông tin hoạt động nghiên cứu khoa học",
      href: "/news?category=research",
    },
    { name: "Hoạt động bộ KH&CN", href: "/news?category=kh&cn" },
    { name: "Trí tuệ nhân tạo", href: "/news?category=ai" },
    { name: "Viễn thông và mạng", href: "/news?category=telecom" },
    { name: "Robotic và tự động hóa", href: "/news?category=robotics" },
    { name: "Phát triển phần mềm", href: "/news?category=software" },
    { name: "An toàn thông tin", href: "/news?category=security" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
             <Image
                src="/thongtinkhcn/Logo_PTIT.png"
                width={200}
                height={100}
                className="h-10"
                style={{ width: "auto" }} 
                alt="Logo PTIT"
              />
            <h1 className="text-xl font-bold gradient-text">TechNews</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-300 hover:text-orange-400 transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}

            {/* Categories Dropdown */}
            <div className="relative" ref={categoryRef}>
              <button
                className="flex items-center gap-1 text-slate-300 hover:text-orange-400 transition-colors font-medium"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                Danh mục
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-2 z-50">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="block px-4 py-2 text-sm text-slate-300 hover:text-orange-400 hover:bg-slate-700 transition-colors"
                      onClick={() => setIsCategoryOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.slice(2).map((link) =>
              !link.requireAuth || (link.requireAuth && isAuthenticated) ? (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-slate-300 hover:text-orange-400 transition-colors font-medium"
                >
                  {link.name}
                </Link>
              ) : null
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex text-slate-300 hover:text-orange-400"
            >
              <Search className="w-4 h-4" />
            </Button> */}
            {/* <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex text-slate-300 hover:text-orange-400"
            >
              <Bell className="w-4 h-4" />
            </Button> */}

            {/* User Menu */}
            <div className="hidden sm:block">
              <UserMenu />
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-slate-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 py-4">
            <div className="flex flex-col space-y-4">
              {navLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-slate-300 hover:text-orange-400 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Categories */}
              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-slate-400 text-sm font-medium mb-2">
                  Danh mục
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="block text-sm text-slate-300 hover:text-orange-400 transition-colors pl-4"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              {navLinks.slice(2).map((link) =>
                !link.requireAuth || (link.requireAuth && isAuthenticated) ? (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-slate-300 hover:text-orange-400 transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : null
              )}

              <div className="pt-4 border-t border-slate-800">
                <div className="md:hidden">
                  <UserMenu />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
