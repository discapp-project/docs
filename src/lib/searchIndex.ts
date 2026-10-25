import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface SearchDoc {
  id: string;
  title: string;
  category: string;
  content: string;
}

export function buildSearchIndex(): SearchDoc[] {
  const docsDirectory = path.join(process.cwd(), 'content/docs');
  
  if (!fs.existsSync(docsDirectory)) return [];

  const filenames = fs.readdirSync(docsDirectory);

  const docs = filenames
    .filter((file) => file.endsWith('.md'))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, '');
      const fullPath = path.join(docsDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      const cleanContent = matterResult.content
        .replace(/```[\s\S]*?```/g, '')
        .replace(/#+\s+/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[*_~`]/g, '')
        .replace(/\n+/g, ' ')
        .trim();

      const isDiscappSection = ['about-us', 'frequently-asked-questions', 'contact-us', 'contributors'].includes(slug);

      return {
        id: slug,
        title: matterResult.data.title || slug.replace(/-/g, ' '),
        category: isDiscappSection ? 'DISCAPP' : 'Guides',
        content: cleanContent,
      };
    });

  return docs;
}