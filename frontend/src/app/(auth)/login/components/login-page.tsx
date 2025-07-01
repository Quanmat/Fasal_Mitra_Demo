"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Eye, EyeOff, Home } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";

export function LoginPageComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    try {
      await login({ email, password });
    } catch {
      // error is handled by auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full p-4 font-sans relative overflow-hidden bg-gradient-to-br from-blue-100 via-green-100 to-blue-200">
      <Link
        href="/"
        className="absolute top-4 left-4 p-2 text-green-700 hover:text-green-800 bg-white/80 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 hover:shadow-xl z-50"
      >
        <Home className="h-6 w-6" />
      </Link>

      <div className="mx-auto flex w-full items-center justify-center min-h-screen max-w-7xl relative z-10">
        <Card className="w-full max-w-md overflow-hidden shadow-2xl bg-white/80 backdrop-blur-sm border-0">
          <div className="p-6 lg:p-8 space-y-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2">
                <Sprout className="h-10 w-10 text-green-600" />
                <span className="text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-500 to-green-600 bg-clip-text text-transparent">
                  फसल मित्र
                </span>
              </div>
            </div>

            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-green-800">
                Welcome Back
              </h1>
              <p className="text-green-700/80">
                Login to continue your farming journey
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-green-200 bg-white/50 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-green-700">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 relative group"
                  >
                    Forgot password?
                    <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-green-200 bg-white/50 focus:border-blue-400 focus:ring-blue-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-blue-500 hover:text-blue-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg transition-all duration-300 ease-in-out"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <p className="text-sm text-center text-green-700">
              Don&apos;t have an account?{" "}
              <Link
                href={"/signup"}
                className="text-blue-600 hover:text-blue-700 relative group"
              >
                Sign up here
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
