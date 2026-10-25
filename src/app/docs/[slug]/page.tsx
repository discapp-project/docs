import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Suspense } from 'react';

// Keep a helper to match slugs to labels for breadcrumbs
const allItems = [
  { id: "about-us", label: "About Us" },
  { id: "frequently-asked-questions", label: "Frequently Asked Questions" },
  { id: "contact-us", label: "Contact Us" },
  { id: "contributors", label: "Contributors" },
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
];

export async function generateStaticParams() {
  return allItems.map(item => ({ slug: item.id }));
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

  const matchedItem = allItems.find(i => i.id === slug);
  const currentLabel = matchedItem ? matchedItem.label : slug;

  return (
    <main className="flex-1 max-w-4xl px-8 md:px-12 py-10">
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
  );
}

export default function DocPage({ params }: PageProps) {
  return (
    <Suspense fallback={
      <main className="flex-1 max-w-4xl px-8 md:px-12 py-10 space-y-6 animate-pulse">
        <div className="h-3 bg-zinc-800 rounded w-28" />
        <div className="h-9 bg-zinc-800 rounded w-3/4" />
        <div className="space-y-3 pt-4">
          <div className="h-4 bg-zinc-800/50 rounded w-full" />
          <div className="h-4 bg-zinc-800/50 rounded w-5/6" />
          <div className="h-4 bg-zinc-800/50 rounded w-4/6" />
          <div className="h-24 bg-zinc-800/30 rounded w-full mt-6" />
          <div className="h-4 bg-zinc-800/50 rounded w-full" />
          <div className="h-4 bg-zinc-800/50 rounded w-3/4" />
        </div>
      </main>
    }>
      <DocContent params={params} />
    </Suspense>
  );
}