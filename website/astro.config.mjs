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
import { DEFAULT_VERSION } from './src/config/versions.mjs';

const fetchPolyfillPath = fileURLToPath(
  new URL('./src/scripts/fetch-polyfill.ts', import.meta.url)
);

// Resolve shim paths to absolute ESM paths for monorepo compatibility
const nodePolyfillsDir = fileURLToPath(new URL('./node_modules/vite-plugin-node-polyfills', import.meta.url));
const shimPaths = {
  'vite-plugin-node-polyfills/shims/buffer': `${nodePolyfillsDir}/shims/buffer/dist/index.js`,
  'vite-plugin-node-polyfills/shims/global': `${nodePolyfillsDir}/shims/global/dist/index.js`,
  'vite-plugin-node-polyfills/shims/process': `${nodePolyfillsDir}/shims/process/dist/index.js`,
};

// Custom Rollup plugin to resolve polyfill shims from any location in the monorepo
function polyfillShimsResolver() {
  return {
    name: 'polyfill-shims-resolver',
    /** @param {string} source */
    resolveId(source) {
      if (source in shimPaths) {
        return shimPaths[/** @type {keyof typeof shimPaths} */ (source)];
      }
      return null;
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://taquito.io',
  trailingSlash: 'never',
  integrations: [AutoImport({
    imports: [
      './src/components/SimpleCodeRunner.astro',
      './src/components/Tabs.astro',
      './src/components/TabItem.astro',
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
        // Replace node-fetch with browser native fetch
        'node-fetch': fetchPolyfillPath,

        // Component alias
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),

        // Resolve polyfill shims for monorepo workspace packages
        ...shimPaths,
      },
    },
    plugins: [
      polyfillShimsResolver(),
      tailwindcss(),
      nodePolyfills({
        include: ['buffer', 'stream', 'crypto', 'path', 'http', 'https'],
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
      },
    },
    optimizeDeps: {
      exclude: [
        'vite-plugin-node-polyfills/shims/buffer',
        'vite-plugin-node-polyfills/shims/global',
        'vite-plugin-node-polyfills/shims/process',
      ],
    },
  },
});