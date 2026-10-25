import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SearchBar from "@/components/searchBar";
import { buildSearchIndex } from "@/lib/searchIndex";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchIndex = buildSearchIndex();

  return (
    <div className="min-h-screen bg-[#111214] text-zinc-300 flex flex-col font-sans">
      <header className="border-b border-zinc-800/80 bg-[#111214] h-14 flex items-center justify-between px-6 sticky top-0 z-50">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <span className="font-extrabold tracking-wider text-[#acf6c8] text-base flex items-center">
            <ArrowLeft className="w-4 h-4 inline-block mr-1.5"/> Back Home
          </span>
        </Link>

        <SearchBar docs={searchIndex} />
      </header>

      <div className="flex-1 flex w-full">
        {children}
      </div>
    </div>
  );
}