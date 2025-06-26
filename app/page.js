"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowRight,
  Ticket,
  QrCode,
  BarChart3,
  Eye,
  EyeOff,
  Users,
  Calendar,
  Shield,
  Zap,
  Star,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Footer from "@/components/Footer";

export default function VibezFusionPlatform() {
  const [currentView, setCurrentView] = useState("home");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { login } = useAuth();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      setCurrentView("dashboard");
    } catch (error) {
      setError(error.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Ticket,
      title: "Smart Ticket Generation",
      description:
        "Create beautiful, secure digital tickets with unique QR codes and anti-fraud protection.",
      color: "from-blue-500 to-cyan-500",
      link: "/register",
    },
    {
      icon: QrCode,
      title: "Lightning Fast Scanning",
      description:
        "Instant ticket validation with real-time verification and offline capability.",
      color: "from-purple-500 to-pink-500",
      link: "/scan",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Comprehensive insights with real-time reporting and predictive analytics.",
      color: "from-green-500 to-emerald-500",
      link: "/stats",
    },
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Events Managed" },
    { icon: Ticket, value: "2M+", label: "Tickets Issued" },
    { icon: Calendar, value: "99.9%", label: "Uptime" },
    { icon: Shield, value: "100%", label: "Secure" },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Event Director",
      company: "TechConf 2024",
      content:
        "Eventra transformed our event management. The seamless integration and real-time analytics helped us manage 10,000+ attendees effortlessly.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Festival Organizer",
      company: "Summer Beats",
      content:
        "The anti-fraud features and instant validation saved us from ticket scalping issues. Our attendees loved the smooth entry experience.",
      rating: 5,
    },
  ];

  if (currentView === "login") {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.1), transparent 40%)`,
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <Card className="w-[420px] backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl relative z-10">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <Ticket className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Welcome Back
            </CardTitle>
            <p className="text-gray-300">
              Sign in to your Eventra dashboard
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert
                variant="destructive"
                className="mb-6 bg-red-500/10 border-red-500/20"
              >
                <AlertDescription className="text-red-300">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-6">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                  aria-label="Email"
                />
              </div>
              <div className="space-y-2 relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors pr-10"
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setCurrentView("home")}
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                ← Back to home
              </button>
            </div>
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-300 text-center">
                Credentials: email / password
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Eventra</span>
            </div>
            <Button
              onClick={() => setCurrentView("login")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Admin Login
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-32 lg:pt-20">
          <div className="text-center space-y-12 animate-in">
            <div className="inline-block">
              <div className="relative">
                <div className="absolute inset-0 blur-3xl bg-blue-500/30 rounded-full animate-pulse" />
                <span className="relative inline-block px-8 py-3 text-sm text-blue-300 bg-blue-500/10 rounded-full border border-blue-500/30 backdrop-blur-sm">
                  ✨ Next-Generation Event Management
                </span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                Eventra
              </span>
              <span className="block mt-4 text-white">Digital Ticketing</span>
            </h1>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your events with our cutting-edge digital ticketing
              platform. Create, manage, and validate tickets with
              enterprise-grade security and real-time analytics.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-200"
              >
                Login to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
