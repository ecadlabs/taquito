import { visit } from 'unist-util-visit';
import {
  inferLiveCodeRuntime,
  replaceLiveCodeFixturePlaceholders,
} from './live-code.mjs';

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

      // Check if the code block has 'wallet' or 'noConfig' in its meta
      const isWallet = node.meta.includes('wallet');
      const noConfig = node.meta.includes('noConfig');

      const runtime = inferLiveCodeRuntime({
        code: node.value,
        isWallet,
        noConfig,
      });

      // Replace fixture placeholders at build time so docs stay readable in source.
      const escapedCode = replaceLiveCodeFixturePlaceholders(node.value);

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
        },
        {
          type: 'mdxJsxAttribute',
          name: 'interactionMode',
          value: runtime.interactionMode
        },
        {
          type: 'mdxJsxAttribute',
          name: 'signerMode',
          value: runtime.signerMode
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

      if (noConfig) {
        attributes.push({
          type: 'mdxJsxAttribute',
          name: 'noConfig',
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
