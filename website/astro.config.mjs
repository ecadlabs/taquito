// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import AutoImport from 'astro-auto-import';
import { remarkLiveCode } from './src/utils/remark-live-code.mjs';
import { remarkCallouts } from './src/utils/remark-callouts.mjs';
import { remarkRelativeLinks } from './src/utils/remark-relative-links.mjs';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { fileURLToPath } from 'node:url';
import tailwindcss from "@tailwindcss/vite";

import sitemap from '@astrojs/sitemap';

const fetchPolyfillPath = fileURLToPath(
  new URL('./src/scripts/fetch-polyfill.ts', import.meta.url)
);

// https://astro.build/config
export default defineConfig({
  trailingSlash: 'never',
  integrations: [AutoImport({
    imports: [
      './src/components/SimpleCodeRunner.astro',
      './src/components/Tabs.astro',
      './src/components/TabItem.astro',
    ],
  }), mdx({
    extendMarkdownConfig: true,
  }), sitemap()],
  markdown: {
    remarkPlugins: [remarkRelativeLinks, remarkCallouts, remarkLiveCode],
    syntaxHighlight: false,
  },
  vite: {
    resolve: {
      alias: {
        // Replace node-fetch with browser native fetch
        'node-fetch': fetchPolyfillPath,
        
        // Component alias
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      },
    },
    plugins: [
      tailwindcss(),
      nodePolyfills({
        include: ['buffer', 'stream', 'crypto', 'path'],
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
        protocolImports: true,
      }),
    ],
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      }
    }
  },
});