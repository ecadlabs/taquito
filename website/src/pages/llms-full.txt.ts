import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { getAllDocSlugs } from '../config/docs-sidebar.mjs';
import { cleanDocMarkdown } from '../utils/clean-doc-markdown.mjs';

export const GET: APIRoute = async () => {
  const llmsHeaderPath = path.resolve(process.cwd(), 'public/llms.txt');
  const header = fs.existsSync(llmsHeaderPath)
    ? fs.readFileSync(llmsHeaderPath, 'utf-8').trim()
    : '# Taquito Documentation';

  const docsRoot = path.resolve(process.cwd(), 'src/content/docs/next');
  const orderedSlugs = getAllDocSlugs();
  const allFiles = fs
    .readdirSync(docsRoot)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));

  const seen = new Set<string>();
  const slugs = [
    ...orderedSlugs.filter((s: string) => allFiles.includes(s)),
    ...allFiles.filter((s) => !orderedSlugs.includes(s)).sort(),
  ].filter((s) => {
    if (seen.has(s)) return false;
    seen.add(s);
    return true;
  });

  const sections: string[] = [header, '\n---\n\n# Full Documentation Corpus (`next`)\n'];

  for (const slug of slugs) {
    const filePath = path.join(docsRoot, `${slug}.mdx`);
    if (!fs.existsSync(filePath)) continue;
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { markdown } = cleanDocMarkdown(raw, { slug, version: 'next' });
    sections.push(markdown.trim(), '\n---\n');
  }

  return new Response(sections.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
};
