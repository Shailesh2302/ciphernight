"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  Loader2, 
  Send, 
  Sparkles, 
  MessageSquare, 
  User, 
  Copy, 
  CheckCircle,
  RefreshCw,
  Heart,
  Star,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { useCompletion } from "ai/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What&apos;s your favorite movie?||Do you have any pets?||What&apos;s your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [characterCount, setCharacterCount] = useState(0);
 const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);

  const [isMessageCopied, setIsMessageCopied] = useState(false);

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string, index: number) => {
    form.setValue("content", message);
    setSelectedMessageIndex(index);
    setCharacterCount(message.length);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sent-message", {
        ...data,
        username,
      });

      toast.success(response.data.message);
      form.reset({ ...form.getValues(), content: "" });
      setCharacterCount(0);
      setSelectedMessageIndex(null);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete("");
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsMessageCopied(true);
      setTimeout(() => setIsMessageCopied(false), 2000);
      toast.success("Message copied to clipboard!");
    } catch (err) {
      console.log(err)
      toast.error("Failed to copy message");
    }
  };

 const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const value = e.target.value;
  setCharacterCount(value.length);
  form.setValue("content", value);
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent)] animate-pulse"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500 rounded-3xl shadow-2xl shadow-purple-500/25 mb-6 animate-pulse">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Send Anonymous Message
          </h1>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 rounded-full border border-white/20 backdrop-blur-sm">
              <User className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold text-lg">@{username}</span>
            </div>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Share your thoughts anonymously with <span className="text-white font-semibold">@{username}</span>. 
            Your identity will remain completely private.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Message Form */}
          <Card className="bg-slate-800/90 backdrop-blur-2xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 mb-8">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Compose Message</h2>
                  <p className="text-slate-300">Write your anonymous message below</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-semibold text-lg flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-purple-400" />
                          Your Message
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              placeholder="Write your anonymous message here... Be kind and respectful!"
                              className="resize-none h-32 bg-slate-700/60 border-white/30 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent rounded-xl backdrop-blur-sm text-lg p-4"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleTextareaChange(e);
                              }}
                              maxLength={1000}
                            />
                            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                              <span className={`text-sm font-medium ${
                                characterCount > 800 ? 'text-red-400' : 
                                characterCount > 600 ? 'text-yellow-400' : 'text-slate-400'
                              }`}>
                                {characterCount}/1000
                              </span>
                              {messageContent && (
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(messageContent)}
                                  className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                                >
                                  {isMessageCopied ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-center pt-4">
                    {isLoading ? (
                      <Button 
                        disabled 
                        className="h-14 px-8 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-lg font-semibold rounded-xl shadow-lg"
                      >
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Sending Message...
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={isLoading || !messageContent}
                        className="h-14 px-8 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white border-0 shadow-xl shadow-purple-500/25 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 rounded-xl"
                      >
                        <Send className="mr-3 h-5 w-5" />
                        Send Anonymous Message
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Suggested Messages */}
          <Card className="bg-slate-800/90 backdrop-blur-2xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 mb-8">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Message Suggestions</h3>
                    <p className="text-slate-300">Get inspired with these conversation starters</p>
                  </div>
                </div>
                <Button
                  onClick={fetchSuggestedMessages}
                  disabled={isSuggestLoading}
                  className="h-12 px-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-105 rounded-xl"
                >
                  {isSuggestLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Get New Ideas
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-300 mb-6 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  Click on any message below to use it as your template
                </p>
                
                {error ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-red-400 text-lg font-medium">{error.message}</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {parseStringMessages(completion).map((message, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className={`p-6 h-auto text-left justify-start transition-all duration-300 hover:scale-105 rounded-xl ${
                          selectedMessageIndex === index
                            ? 'bg-gradient-to-r from-purple-600/20 to-violet-600/20 border-purple-400 text-white shadow-lg shadow-purple-500/25'
                            : 'bg-slate-700/60 border-white/20 text-slate-100 hover:bg-slate-600/60 hover:border-white/30'
                        }`}
                        onClick={() => handleMessageClick(message, index)}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            selectedMessageIndex === index
                              ? 'bg-purple-500'
                              : 'bg-slate-600'
                          }`}>
                            <MessageSquare className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base leading-relaxed break-words">{message}</p>
                            {selectedMessageIndex === index && (
                              <p className="text-sm text-purple-300 mt-2 flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                Selected
                              </p>
                            )}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white border-0 shadow-2xl shadow-purple-500/25 hover:shadow-3xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Want Your Own Anonymous Message Board?</h3>
              <p className="text-purple-100 mb-6 text-lg leading-relaxed max-w-2xl mx-auto">
                Create your own profile and start receiving anonymous messages from friends, 
                colleagues, and followers. It&apos;s completely free and takes less than a minute!
              </p>
              <Separator className="my-6 bg-white/20" />
              <Link href="/sign-up">
                <Button className="h-14 px-8 bg-white text-purple-600 hover:bg-gray-100 border-0 shadow-xl text-lg font-semibold transition-all duration-300 hover:scale-105 rounded-xl">
                  <Sparkles className="mr-3 h-5 w-5" />
                  Create Your Account Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}