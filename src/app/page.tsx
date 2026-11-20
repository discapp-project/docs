import Link from 'next/link';
import { ExternalLink, ArrowRight, BookOpen, ShieldCheck, Wrench, BookText } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#111214] text-zinc-300 flex flex-col font-sans">
      
      <header className="border-b border-zinc-800/80 bg-[#111214] h-14 flex items-center justify-between px-6">
        <span className="font-extrabold tracking-wider text-[#acf6c8] text-base">
          <BookText className="w-4 h-4 inline-block mr-1.5"/> DISCAPP DOCS
        </span>
  
        <div className="flex items-center gap-4">
          <a href="https://discord.gg/zRrTVfuAMN" target="_blank" rel="noreferrer" className="text-xs font-medium text-zinc-400 hover:text-[#acf6c8] transition flex items-center gap-1">
            Join the Community
          </a>
          <a href="https://discapp.org" rel="noreferrer" className="text-xs font-medium text-zinc-400 hover:text-[#acf6c8] transition flex items-center gap-1">
            Back to Website
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 text-center flex flex-col items-center justify-center">

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Everything you need all in one place.
        </h1>
        
        <p className="text-zinc-400 text-base max-w-xl mb-8 leading-relaxed">
          Welcome to the official Discapp docs! Here you can find guides and information about all of our tools and more! We would love to also hear your feedback so if you notice any issues, let a maintainer know on our Discord server!
        </p>

        <div className="flex items-center gap-4">
          <Link 
            href="/docs/about-us" 
            className="px-5 py-2.5 bg-[#acf6c8] text-[#111214] font-semibold text-sm rounded-md hover:opacity-90 transition flex items-center gap-2"
          >
            Browse Documentation <ArrowRight className="w-4 h-4" />
          </Link>

          <Link 
            href="https://github.com/discapp-project/docs" 
            className="px-5 py-2.5 bg-[#acf6c8] text-[#111214] font-semibold text-sm rounded-md hover:opacity-90 transition flex items-center gap-2"
          >
            Contribute <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <footer className="border-t border-zinc-800/80 py-6 text-center text-xs text-zinc-600">
        <p>© 2026 Discapp. All rights reserved.</p>
      </footer>
    </div>
  );
}