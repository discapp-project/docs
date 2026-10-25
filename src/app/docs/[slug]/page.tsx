import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import SearchBar from "@/components/searchBar";
import { buildSearchIndex } from "@/lib/searchIndex";

const sidebarSections = [
  {
    title: "DISCAPP",
    items: [
      { id: "about-us", label: "About Us" },
      { id: "frequently-asked-questions", label: "Frequently Asked Questions" },
      { id: "contact-us", label: "Contact Us" },
      { id: "contributors", label: "Contributors" },
    ],
  },
  {
    title: "Guides",
    items: [
      { id: "webhook-builder", label: "Webhook Builder" },
      { id: "automod-library", label: "Automod Library" },
      { id: "role-icon-builder", label: "Role Icon Builder" },
      { id: "user-lookup", label: "User Lookup" },
      { id: "server-lookup", label: "Server Lookup" },
      { id: "vanity-checker", label: "Vanity Checker" },
      { id: "asset-stealer", label: "Asset Stealer" },
      { id: "snowflake-decoder", label: "Snowflake Decoder" },
      { id: "gradient-finder", label: "Gradient Finder" },
      { id: "markdown-cheatsheet", label: "Markdown Cheatsheet" },
      { id: "asset-compressor", label: "Asset Compressor" },
      { id: "soundboard-studio", label: "Soundboard Studio" },
      { id: "asset-resizer", label: "Asset Resizer" },
      { id: "permission-calculator", label: "Permission Calculator" },
      { id: "font-generator", label: "Font Generator" },
      { id: "space-generator", label: "Space Generator" },
      { id: "automod-decoder", label: "Automod Decoder" },
      { id: "automod-tester", label: "Automod Tester" },
      { id: "regex-creator", label: "Regex Creator" },
      { id: "json-formatter", label: "Json Formatter" },
      { id: "ansi-builder", label: "Ansi Builder" },
    ],
  },
];

export async function generateStaticParams() {
  const paths: { slug: string }[] = [];
  sidebarSections.forEach(sec => {
    sec.items.forEach(item => {
      paths.push({ slug: item.id });
    });
  });
  return paths;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getDocContent(slug: string) {
  const docsDirectory = path.join(process.cwd(), 'content/docs');
  const fullPath = path.join(docsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return { title: "Not Found", content: "<p>This documentation page does not exist yet or has been moved. Please report this to a maintainer.</p>" };
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  
  return {
    title: matterResult.data.title || slug.replace(/-/g, ' '),
    content: processedContent.toString(),
  };
}

async function DocContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = await getDocContent(slug);

  let currentLabel = slug;
  sidebarSections.forEach(sec => {
    sec.items.forEach(item => {
      if (item.id === slug) currentLabel = item.label;
    });
  });

  return (
    <div className="flex-1 flex max-w-7xl w-full mx-auto">
      <aside className="hidden md:block sticky top-14 left-0 h-[calc(100vh-3.5rem)] w-72 bg-[#111214] border-r border-zinc-800/80 p-5 overflow-y-auto z-40">
        <nav className="space-y-7 text-sm">
          {sidebarSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2.5 px-2">
                {section.title}
              </h3>
              <div className="relative ml-2 pl-3.5 border-l border-zinc-800 space-y-1.5">
                {section.items.map((item) => {
                  const isActive = slug === item.id;
                  return (
                    <div key={item.id} className="relative">
                      {isActive && (
                        <span className="absolute -left-3.75 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#acf6c8] rounded-r" />
                      )}
                      <Link
                        href={`/docs/${item.id}`}
                        className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-zinc-800/80 text-[#acf6c8] font-semibold"
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 max-w-3xl px-6 md:px-12 py-10">
        <nav className="flex items-center gap-1 text-xs text-zinc-500 mb-6">
          <Link href="/" className="hover:text-zinc-300">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#acf6c8] font-medium">{currentLabel}</span>
        </nav>

        <div 
          className="prose prose-invert max-w-none text-zinc-300 text-sm leading-6 space-y-4"
          dangerouslySetInnerHTML={{ __html: doc.content }}
        />
      </main>
    </div>
  );
}

export default function DocPage({ params }: PageProps) {
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

      <Suspense fallback={<div className="p-10 text-zinc-500 text-sm">Loading documentation...</div>}>
        <DocContent params={params} />
      </Suspense>
    </div>
  );
}