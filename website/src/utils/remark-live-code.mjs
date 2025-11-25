import { visit } from 'unist-util-visit';

/**
 * Remark plugin to transform code blocks with 'live' meta into SimpleCodeRunner components
 */
export function remarkLiveCode() {
  return (tree) => {
    visit(tree, 'code', (node, index, parent) => {
      // Check if the code block has 'live' in its meta
      if (!node.meta || !node.meta.includes('live')) {
        return;
      }

      // Get the language (default to 'javascript')
      const language = node.lang || 'javascript';
      
      // Use the code as-is - Astro will handle proper escaping for JSX attributes
      const escapedCode = node.value;

      // Create a new MDX JSX node for SimpleCodeRunner
      const jsxNode = {
        type: 'mdxJsxFlowElement',
        name: 'SimpleCodeRunner',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'code',
            value: escapedCode
          },
          {
            type: 'mdxJsxAttribute',
            name: 'language',
            value: language
          }
        ],
        children: []
      };

      // Replace the code node with the JSX node
      parent.children[index] = jsxNode;
    });
  };
}

