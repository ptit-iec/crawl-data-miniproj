"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { loginApi , registerApi } from "@/api/auth";

// Define the user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("techNewsUser");
        const token = localStorage.getItem("techNewsToken");

        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await loginApi(username, password);
      // data = { access_token, token_type }

      // Lưu token
      localStorage.setItem("techNewsToken", data.access_token);

      // Tạo user mock từ username (vì API chưa có /me)
      const mockUser: User = {
        id: username,
        name: username,
        email: username.includes("@") ? username : "",
        role: "user",
      };

      localStorage.setItem("techNewsUser", JSON.stringify(mockUser));
      setUser(mockUser);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const data = await registerApi(name, email, password);

      // Lưu token + user từ response (nếu backend trả về)
      if (data?.access_token) {
        localStorage.setItem("techNewsToken", data.access_token);
      }

      const newUser: User = {
        id: email,
        name,
        email,
        role: "user",
      };

      localStorage.setItem("techNewsUser", JSON.stringify(newUser));
      setUser(newUser);

      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("techNewsUser");
    localStorage.removeItem("techNewsToken");
    setUser(null);
  };

  const isAuthenticated = !!user;

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
