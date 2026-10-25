"use client";

import { useState, useRef, useEffect } from "react";
import { Search, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { SearchDoc } from "@/lib/searchIndex";

interface SearchBarProps {
  docs: SearchDoc[];
}

export default function SearchBar({ docs }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const searchQuery = query.toLowerCase().trim();

  const filteredResults = searchQuery === "" ? [] : docs.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery) || 
    doc.content.toLowerCase().includes(searchQuery) ||
    doc.id.toLowerCase().includes(searchQuery)
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSnippet = (content: string, searchTerm: string) => {
    const index = content.toLowerCase().indexOf(searchTerm);
    if (index === -1) return content.slice(0, 90) + "...";
    
    const start = Math.max(0, index - 20);
    const end = Math.min(content.length, index + 70);
    return (start > 0 ? "..." : "") + content.slice(start, end) + "...";
  };

  return (
    <div className="relative w-72 hidden sm:block" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search docs and guides..." 
          className="w-full bg-[#16171a] border border-zinc-800 rounded-md py-1.5 pl-9 pr-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
        />
      </div>

      {isOpen && searchQuery !== "" && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#16171a] border border-zinc-800 rounded-md shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
          {filteredResults.length > 0 ? (
            <div className="p-1.5 space-y-1">
              {filteredResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => {
                    router.push(`/docs/${result.id}`);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className="w-full text-left px-3 py-2 rounded hover:bg-zinc-800/70 transition flex items-start gap-2.5 group"
                >
                  <FileText className="w-4 h-4 text-zinc-500 group-hover:text-[#acf6c8] mt-0.5 shrink-0" />
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-zinc-200 group-hover:text-white flex items-center justify-between gap-2">
                      <span className="truncate">{result.title}</span>
                      <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded shrink-0">
                        {result.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5 leading-tight truncate">
                      {getSnippet(result.content, searchQuery)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-zinc-500">
              No matching text found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}