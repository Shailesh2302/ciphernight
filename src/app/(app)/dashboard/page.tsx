"use client";

import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Message } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import {
  Loader2,
  RefreshCcw,
  Copy,
  CheckCircle,
  MessageCircle,
  Settings,
  Share2,
  Users,
  TrendingUp,
  LogIn,
  Eye,
  EyeOff,
  Sparkles,
  Bell,
  Link2,
} from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages") ?? false;

  // Set base URL on client side to avoid SSR issues
  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);

  // In your dashboard component, add this useEffect:
  useEffect(() => {
    console.log("Dashboard - Session status:", status, "Session:", !!session);
  }, [session, status]);

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description:
          axiosError.response?.data.message ??
          "Failed to fetch message settings",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
      if (refresh) {
        toast.success("Messages Refreshed", {
          description: "Showing latest messages",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description:
          axiosError.response?.data.message ?? "Failed to fetch messages",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success("Settings Updated", {
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description:
          axiosError.response?.data.message ??
          "Failed to update message settings",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  // Memoize expensive calculations
  const recentMessages = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return messages.filter((msg) => new Date(msg.createdAt) >= oneWeekAgo)
      .length;
  }, [messages]);

  const totalMessages = messages.length;

  if (!session || !session.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent)] animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <Card className="w-full max-w-md text-center shadow-2xl border border-white/20 bg-slate-800/90 backdrop-blur-2xl relative z-10">
          <CardHeader className="pb-6">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/25 animate-pulse">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <p className="text-slate-50 leading-relaxed text-lg font-medium">
              Sign in to access your dashboard and manage anonymous messages
            </p>
            <Link href="/sign-in">
              <Button className="w-full h-12 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white border-0 shadow-xl shadow-purple-500/25 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40">
                <LogIn className="w-5 h-5 mr-3" />
                Sign In to Continue
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const username = session.user.username;
  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <Card className="w-full max-w-md text-center shadow-2xl border border-white/20 bg-slate-800/90 backdrop-blur-2xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
            <p className="text-slate-50 mb-6">
              Username not found. Please try signing in again.
            </p>
            <Link href="/sign-in">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white">
                Sign In Again
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const profileUrl = baseUrl ? `${baseUrl}/u/${username}` : "";

  const copyToClipboard = async () => {
    if (!profileUrl) {
      toast.error("Profile URL not ready", {
        description: "Please wait a moment and try again",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("URL Copied!", {
        description: "Profile URL has been copied to clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy URL", {
        description: "Please try copying manually",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent)] animate-pulse"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-slate-50 mt-1 text-lg font-medium">
                  Welcome back,{" "}
                  <span className="text-white font-semibold">{username}</span>!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="text-sm px-4 py-2 bg-slate-700/80 text-white border-white/20 backdrop-blur-sm font-medium">
                <Users className="w-4 h-4 mr-2" />
                {totalMessages} Messages
              </Badge>
              <div className="w-10 h-10 bg-slate-700/80 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Bell className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white border-0 shadow-2xl shadow-purple-500/25 hover:shadow-3xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-2">
                    Total Messages
                  </p>
                  <p className="text-4xl font-bold">{totalMessages}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white border-0 shadow-2xl shadow-emerald-500/25 hover:shadow-3xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium mb-2">
                    This Week
                  </p>
                  <p className="text-4xl font-bold">{recentMessages}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white border-0 shadow-2xl shadow-red-500/25 hover:shadow-3xl hover:shadow-red-500/40 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium mb-2">
                    Status
                  </p>
                  <p className="text-xl font-semibold">
                    {acceptMessages ? "Accepting" : "Paused"}
                  </p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  {acceptMessages ? (
                    <Eye className="w-8 h-8" />
                  ) : (
                    <EyeOff className="w-8 h-8" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Link Card */}
            <Card className="bg-slate-800/80 backdrop-blur-2xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-white">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-white" />
                  </div>
                  Share Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-slate-700/60 rounded-2xl border border-white/20 backdrop-blur-sm">
                  <p className="text-sm text-slate-50 mb-4 flex items-center gap-2 font-medium">
                    <Link2 className="w-4 h-4" />
                    Your unique link:
                  </p>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={profileUrl}
                      readOnly
                      className="flex-1 px-4 py-3 text-sm bg-slate-600/80 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm text-white placeholder-slate-300 font-mono"
                      aria-label="Profile URL"
                    />
                    <Button
                      onClick={copyToClipboard}
                      size="sm"
                      className="h-12 px-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-0 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                      aria-label={copied ? "URL copied" : "Copy URL"}
                      disabled={!profileUrl}
                    >
                      {copied ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-slate-100 leading-relaxed font-medium">
                  Share this link with others so they can send you anonymous
                  messages.
                </p>
              </CardContent>
            </Card>

            {/* Message Settings Card */}
            <Card className="bg-slate-800/80 backdrop-blur-2xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl text-white">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  Message Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-slate-700/60 rounded-2xl border border-white/20 backdrop-blur-sm">
                  <div className="flex-1">
                    <p className="font-semibold text-white text-lg">
                      Accept Messages
                    </p>
                    <p className="text-sm text-slate-100 mt-1 font-medium">
                      {acceptMessages
                        ? "You're currently accepting new messages"
                        : "Message reception is paused"}
                    </p>
                  </div>
                  <Switch
                    {...register("acceptMessages")}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                    className="data-[state=checked]:bg-gradient-to-r from-emerald-500 to-teal-500"
                    aria-label={`${acceptMessages ? "Disable" : "Enable"} message acceptance`}
                  />
                </div>

                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                  }}
                  className="w-full h-12 bg-slate-700/80 hover:bg-slate-600/80 text-white border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 font-semibold"
                  disabled={isLoading}
                  aria-label="Refresh messages"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="w-5 h-5 mr-3" />
                      Refresh Messages
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Messages Section */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/80 backdrop-blur-2xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-2xl text-white">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    Your Messages
                  </CardTitle>
                  <Badge className="text-sm px-4 py-2 bg-slate-700/80 text-white border-white/20 backdrop-blur-sm font-medium">
                    {messages.length}{" "}
                    {messages.length === 1 ? "message" : "messages"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {messages.length > 0 ? (
                  <div className="space-y-4" role="list" aria-label="Messages">
                    {messages.map((message) => (
                      <div key={String(message._id)} role="listitem">
                        <MessageCard
                          message={message}
                          onMessageDelete={handleDeleteMessage}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                      <MessageCircle className="w-16 h-16 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      No messages yet
                    </h3>
                    <p className="text-slate-50 mb-8 max-w-md mx-auto text-lg leading-relaxed font-medium">
                      Share your profile link to start receiving anonymous
                      messages from others.
                    </p>
                    <Button
                      onClick={copyToClipboard}
                      className="h-12 px-8 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white border-0 shadow-xl shadow-purple-500/25 transition-all duration-300 hover:scale-105 text-lg font-semibold"
                      disabled={!profileUrl}
                      aria-label="Share profile link"
                    >
                      <Share2 className="w-5 h-5 mr-3" />
                      Share Profile Link
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
