'use client';

import { Mail, Sparkles, Shield, Eye, MessageCircle } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-12 py-12 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white relative overflow-hidden min-h-screen">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent)] animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-violet-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        <div className="relative z-10 w-full max-w-4xl">
          <section className="text-center mb-8 md:mb-8">
            {/* Logo/Icon */}
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent mb-6">
              Dive into the World of Anonymous CipherChat
            </h1>
            <p className="mt-3 md:mt-4 text-xl md:text-2xl text-slate-100 font-medium max-w-2xl mx-auto">
              CipherChat - Where your identity remains a secret.
            </p>
            
            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-slate-100 font-medium">Secure</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full">
                <Eye className="w-4 h-4 text-purple-400" />
                <span className="text-slate-100 font-medium">Anonymous</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full">
                <MessageCircle className="w-4 h-4 text-purple-400" />
                <span className="text-slate-100 font-medium">Private</span>
              </div>
            </div>
          </section>

          {/* Carousel for Messages */}
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full max-w-lg md:max-w-xl mx-auto"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="bg-slate-800/90 backdrop-blur-2xl border border-white/20 shadow-2xl hover:shadow-3xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-white font-bold text-lg bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent">
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl flex items-center justify-center border border-purple-400/30 flex-shrink-0">
                        <Mail className="w-5 h-5 text-purple-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-100 font-medium leading-relaxed">
                          {message.content}
                        </p>
                        <p className="text-sm text-slate-300 mt-3 font-medium">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-6 md:p-6 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-violet-900/20"></div>
        <p className="relative z-10 text-slate-200 font-medium">
          © 2023 CipherChat. All rights reserved.
        </p>
      </footer>
    </>
  );
}