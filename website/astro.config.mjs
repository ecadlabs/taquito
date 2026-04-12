// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import AutoImport from 'astro-auto-import';
import { remarkLiveCode } from './src/utils/remark-live-code.mjs';
import { remarkCallouts } from './src/utils/remark-callouts.mjs';
import { remarkRelativeLinks } from './src/utils/remark-relative-links.mjs';
import { fileURLToPath } from 'node:url';
import tailwindcss from "@tailwindcss/vite";

import sitemap from '@astrojs/sitemap';
import { DEFAULT_VERSION } from './src/config/versions.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://taquito.io',
  trailingSlash: 'never',
  integrations: [AutoImport({
    imports: [
      './src/components/SimpleCodeRunner.astro',
      './src/components/Tabs.astro',
      './src/components/TabItem.astro',
      './src/components/TezosConstant.astro',
    ],
  }), mdx({
    extendMarkdownConfig: true,
  }), sitemap({
    filter: (page) => {
      // Only include pages from the default version in sitemap
      // Exclude old versions and 'next' version to prevent duplicate content issues
      const url = new URL(page);
      const pathname = url.pathname;

      // Skip docs pages for old versions and 'next'
      if (pathname.startsWith('/docs/')) {
        const versionMatch = pathname.match(/^\/docs\/([^/]+)\//);
        if (versionMatch) {
          const version = versionMatch[1];
          // Only include the default version in sitemap
          return version === DEFAULT_VERSION;
        }
      }
      return true;
    },
  })],
  markdown: {
    remarkPlugins: [remarkRelativeLinks, remarkCallouts, remarkLiveCode],
    syntaxHighlight: false,
  },
  vite: {
    resolve: {
      alias: {
        // Component alias
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      },
    },
    plugins: [
      tailwindcss(),
    ],
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  },
});
