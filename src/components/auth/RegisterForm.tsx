"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const success = await register(name, email, password);
      if (success) {
        router.push("/");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-slate-800 rounded-xl shadow-xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Tạo tài khoản</h1>
        <p className="text-slate-400 text-sm">
          Join TechNews to stay updated with the latest technology news
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
            Username
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John"
            className="w-full bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
            Mật khẩu
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">
            Nhập lại mật khẩu
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2"
          disabled={isLoading}
        >
          {isLoading ? "Đang Tạo tài khoản..." : "Tạo tài khoản"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-slate-400 text-sm">
          Đã có tài khoản?{" "}
          <Link href="/auth/login" className="text-orange-400 hover:text-orange-300">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
