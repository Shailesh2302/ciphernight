"use client";

import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { 
  Loader2, 
  User, 
  Mail, 
  Lock, 
  CheckCircle, 
  XCircle, 
  Sparkles,
  UserPlus,
  ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage(""); // Reset message
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);

      toast.success("Success", {
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);

      setIsSubmitting(false);
    } catch (error) {
      console.error("Error during sign-up:", error);

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      const errorMessage =
        axiosError.response?.data.message ||
        "There was a problem with your sign-up. Please try again.";

      toast.error("Sign Up Failed", {
        description: errorMessage,
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent)] animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

      <Card className="w-full max-w-lg shadow-2xl border border-white/20 bg-slate-800/90 backdrop-blur-2xl relative z-10 mx-4 py-6">

        <CardHeader className="pb-6 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/25">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent mb-3">
            Join True CipherChat
          </CardTitle>
          <p className="text-slate-50 text-lg font-medium">
            Sign up to start your anonymous adventure
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-semibold text-base flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Choose a unique username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                          }}
                          className="h-12 px-4 bg-slate-700/80 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm text-white placeholder-slate-300 font-medium transition-all duration-300 focus:scale-105"
                        />
                        {isCheckingUsername && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    {!isCheckingUsername && usernameMessage && (
                      <div className={`flex items-center gap-2 text-sm font-medium p-3 rounded-lg backdrop-blur-sm ${
                        usernameMessage === "Username is unique"
                          ? "text-emerald-400 bg-emerald-500/20 border border-emerald-500/30"
                          : "text-red-400 bg-red-500/20 border border-red-500/30"
                      }`}>
                        {usernameMessage === "Username is unique" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        {usernameMessage}
                      </div>
                    )}
                    <FormMessage className="text-red-400 font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-semibold text-base flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        {...field}
                        className="h-12 px-4 bg-slate-700/80 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm text-white placeholder-slate-300 font-medium transition-all duration-300 focus:scale-105"
                      />
                    </FormControl>
                    <p className="text-slate-100 text-sm font-medium flex items-center gap-2 p-3 bg-slate-700/60 rounded-lg backdrop-blur-sm border border-white/20">
                      <Mail className="w-4 h-4 text-blue-400" />
                      We will send you a verification code
                    </p>
                    <FormMessage className="text-red-400 font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-semibold text-base flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Create a secure password"
                        type="password"
                        {...field}
                        className="h-12 px-4 bg-slate-700/80 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm text-white placeholder-slate-300 font-medium transition-all duration-300 focus:scale-105"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 font-medium" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white border-0 shadow-xl shadow-purple-500/25 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-3 h-5 w-5" />
                    Create Account
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center pt-4">
            <div className="flex items-center justify-center space-x-4 p-4 bg-slate-700/60 rounded-xl backdrop-blur-sm border border-white/20">
              <p className="text-slate-50 font-medium">
                Already a member?
              </p>
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 font-semibold"
                >
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;