import { visit } from 'unist-util-visit';

/**
 * Remark plugin to fix relative links in MDX files
 *
 * Transforms links like [text](page_name) to absolute paths like [text](/docs/next/page_name)
 * based on the current file's location in the content directory.
 */
export function remarkRelativeLinks() {
  return (tree, file) => {
    // Get the file path relative to the content directory
    // e.g., /path/to/website/src/content/docs/next/quick_start.mdx
    const filePath = file.history[0] || '';

    // Extract the path after 'content/docs/'
    const match = filePath.match(/content\/docs\/([^/]+)\//);
    if (!match) return;

    const version = match[1]; // e.g., 'next' or '23.0.0'
    const basePath = `/docs/${version}`;

    visit(tree, 'link', (node) => {
      const url = node.url;

      // Skip if already absolute, is a hash link, has a protocol, or starts with ./ or ../
      if (
        url.startsWith('/') ||
        url.startsWith('#') ||
        url.startsWith('./') ||
        url.startsWith('../') ||
        url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('mailto:')
      ) {
        return;
      }

      // Convert to absolute path
      node.url = `${basePath}/${url}`;
    });
  };
}
