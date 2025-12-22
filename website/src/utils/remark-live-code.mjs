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

      // Check if the code block has 'wallet' in its meta
      const isWallet = node.meta.includes('wallet');

      // Use the code as-is - Astro will handle proper escaping for JSX attributes
      const escapedCode = node.value;

      // Create a new MDX JSX node for SimpleCodeRunner
      const attributes = [
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
      ];

      // Add wallet attribute if present
      if (isWallet) {
        attributes.push({
          type: 'mdxJsxAttribute',
          name: 'wallet',
          value: null // boolean attribute (presence = true)
        });
      }

      const jsxNode = {
        type: 'mdxJsxFlowElement',
        name: 'SimpleCodeRunner',
        attributes,
        children: []
      };

      // Replace the code node with the JSX node
      parent.children[index] = jsxNode;
    });
  };
}

