"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInSchema } from "@/schemas/signInSchema";
import { Loader2, LogIn, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Page = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
  setIsSubmitting(true);
  try {
    const result = await signIn("credentials", {
      identifier: data.identifier, // ✅ Use form data
      password: data.password,     // ✅ Use form data
      redirect: false,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast.error("Login Failed", {
          description: "Incorrect username or password",
        });
      } else {
        toast.error("Error", {
          description: result.error,
        });
      }
    } else if (result?.ok) {
      toast.success("Sign in successful!");
      router.push("/dashboard");
    }
  } catch (error) {
    console.log(error)
    toast.error("Something went wrong", {
      description: "Please try again later",
    });
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent)] animate-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="w-full max-w-md relative z-10">
        <Card className="w-full max-w-lg shadow-2xl border border-white/20 bg-slate-800/90 backdrop-blur-2xl relative z-10 mx-4 py-6">
          <CardHeader className="text-center pb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/25">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent mb-3">
              Welcome Back
            </CardTitle>
            <p className="text-slate-50 text-lg font-medium">
              Sign in to continue your secret conversations
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  name="identifier"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-semibold text-base flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email/Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email or username"
                          {...field}
                          className="h-12 bg-slate-700/80 border-white/30 text-white placeholder-slate-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm font-medium"
                        />
                      </FormControl>
                      <FormMessage className="text-red-300 font-medium" />
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
                          placeholder="Enter your password"
                          type="password"
                          {...field}
                          className="h-12 bg-slate-700/80 border-white/30 text-white placeholder-slate-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm font-medium"
                        />
                      </FormControl>
                      <FormMessage className="text-red-300 font-medium" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white border-0 shadow-xl shadow-purple-500/25 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-3 h-5 w-5" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-800/90 text-slate-100 font-medium">
                  New to CipherChat?
                </span>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold text-lg transition-colors duration-200 hover:underline decoration-2 underline-offset-4"
              >
                Create an account
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Additional info card */}
        <div className="mt-6 text-center">
          <p className="text-slate-300 text-sm font-medium">
            Secure • Anonymous • Private
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
