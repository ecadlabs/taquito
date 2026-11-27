import { visit } from 'unist-util-visit';

export function rehypeMermaid() {
  return (tree, file) => {
    const frontmatter = file.data.astro.frontmatter;
    frontmatter.hasMermaid = false;
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'pre') return;
      const [code] = node.children;
      if (
        code?.type !== 'element' ||
        code.tagName !== 'code' ||
        !Array.isArray(code.properties.className) ||
        !code.properties.className.includes('language-mermaid')
      ) {
        return;
      }

      node.properties.tabIndex = 0;
      frontmatter.hasMermaid = true;
    });
  };
}
