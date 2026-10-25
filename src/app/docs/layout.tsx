import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <aside className="hidden md:block sticky top-14 left-0 h-[calc(100vh-3.5rem)] w-72 bg-[#111214] border-r border-zinc-800/80 p-5 overflow-y-auto z-40 shrink-0">
          <nav className="space-y-7 text-sm">
            {sidebarSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2.5 px-2">
                  {section.title}
                </h3>
                <div className="relative ml-2 pl-3.5 border-l border-zinc-800 space-y-1.5">
                  {section.items.map((item) => (
                    <div key={item.id} className="relative">
                      <Link
                        href={`/docs/${item.id}`}
                        className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                      >
                        {item.label}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <div className="flex-1 flex min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}