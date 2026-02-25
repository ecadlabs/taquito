import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import { VERSIONS, DEFAULT_VERSION } from '../../../config/versions.mjs';

// Re-export for consumers that import from this file
export { VERSIONS, DEFAULT_VERSION };

export const getStaticPaths: GetStaticPaths = async () => {
  return VERSIONS.map((version) => ({
    params: { version },
  }));
};

export const GET: APIRoute = async ({ params }) => {
  const version = params.version;

  if (!version) {
    return new Response(JSON.stringify({ error: 'Version not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const allDocs = await getCollection('docs');

  const versionDocs = allDocs.filter((doc) => {
    const slug = doc.id.replace(/\.mdx?$/, '');
    const docVersion = slug.split('/')[0];
    return docVersion === version;
  });

  const searchIndex = versionDocs.map((doc) => {
    const slug = doc.id.replace(/\.mdx?$/, '');
    const bodyContent = doc.body || '';

    return {
      title: doc.data.title || slug.split('/').pop() || '',
      slug,
      url: `/docs/${slug}`,
      content: bodyContent.substring(0, 500),
      excerpt: bodyContent.substring(0, 150).replace(/[#*`\[\]]/g, '').trim(),
    };
  });

  return new Response(JSON.stringify(searchIndex), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  });
};
