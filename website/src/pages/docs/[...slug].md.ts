import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';
import { cleanDocMarkdown } from '../../utils/clean-doc-markdown.mjs';

export async function getStaticPaths() {
  const docs = await getCollection('docs');

  return docs.map((doc) => {
    const slug = doc.id.replace('src/content/docs/', '').replace(/\.mdx?$/, '');
    return {
      params: { slug },
      props: { docId: doc.id, slug },
    };
  });
}

export const GET: APIRoute = async ({ props }) => {
  const { slug } = props as { docId: string; slug: string };
  const parts = slug.split('/');
  const version = parts[0] || 'next';
  const pageSlug = parts.slice(1).join('/');

  const mdxPath = path.resolve(process.cwd(), 'src/content/docs', `${slug}.mdx`);
  const rawContent = fs.readFileSync(mdxPath, 'utf-8');
  const { markdown } = cleanDocMarkdown(rawContent, { slug: pageSlug, version });

  return new Response(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
};
