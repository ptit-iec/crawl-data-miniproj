"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { User, LogOut, Settings, BookMarked } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login">
          <Button
            variant="ghost"
            className="text-slate-300 hover:text-orange-400"
          >
            Đăng nhập
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Đăng ký
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        className="flex items-center gap-2 text-slate-300 hover:text-orange-400"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:inline-block">{user?.name}</span>
      </Button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-2 z-50">
          <div className="px-4 py-2 border-b border-slate-700">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>

          <Link
            href="/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-orange-400 hover:bg-slate-700"
          >
            <User className="w-4 h-4" />
            Tài khoản
          </Link>

          <Link
            href="/saved"
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-orange-400 hover:bg-slate-700"
          >
            <BookMarked className="w-4 h-4" />
            Các bài viết đã lưu
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-700 w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
