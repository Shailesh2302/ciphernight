"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";
import { Sparkles, LogOut, LogIn, User as UserIcon } from "lucide-react";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="py-4 px-6 md:py-3 md:px-4 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 text-white relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-violet-900/20"></div>

      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center relative z-10">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-2xl font-bold mb-4 md:mb-0 group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            CipherChat
          </span>
        </Link>

        {session ? (
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Welcome message */}
            <div className="flex items-center gap-3 bg-slate-800/60 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-full flex items-center justify-center border border-purple-400/30">
                <UserIcon className="w-4 h-4 text-purple-300" />
              </div>
              <span className="text-slate-100 font-medium">
                Welcome, {user.username || user.email}
              </span>
            </div>

            {/* Logout button */}
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold backdrop-blur-xl"
              variant="outline"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 text-white border-0 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 font-semibold transition-all duration-300 hover:scale-105"
              variant={"outline"}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
