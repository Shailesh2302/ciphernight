"use client";

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
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { Shield, Key, CheckCircle, ArrowRight, Sparkles } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast.success("Success", {
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Verification Failed", {
        description:
          axiosError.response?.data.message ??
          "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent)] animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>

      <Card className="w-full max-w-lg shadow-2xl border border-white/20 bg-slate-800/90 backdrop-blur-2xl relative z-10 mx-4">
        <CardHeader className="pb-6 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/25">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            Verify Your Account
          </CardTitle>
          <p className="text-slate-50 text-lg font-medium">
            Enter the verification code sent to your email
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-semibold text-base flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Verification Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="code"
                        {...field}
                        className="h-14 px-4 bg-slate-700/80 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm text-white placeholder-slate-300 font-mono text-lg text-center tracking-widest transition-all duration-300 focus:scale-105"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 font-medium" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white border-0 shadow-xl shadow-emerald-500/25 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/40 rounded-xl"
              >
                <CheckCircle className="mr-3 h-5 w-5" />
                Verify
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </form>
          </Form>

          <div className="text-center pt-4">
            <div className="p-4 bg-slate-700/60 rounded-xl backdrop-blur-sm border border-white/20">
              <p className="text-slate-100 text-sm font-medium flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Check your email for the verification code
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
