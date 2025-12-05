import { visit } from 'unist-util-visit';

/**
 * Remark plugin to transform GitHub-style callouts/admonitions
 *
 * Supports:
 * > [!NOTE] - Blue info callout
 * > [!TIP] - Green tip callout
 * > [!WARNING] - Yellow warning callout
 * > [!CAUTION] or [!DANGER] - Red danger callout
 */
export function remarkCallouts() {
  const calloutTypes = {
    NOTE: { class: 'callout-note', icon: 'info', title: 'Note' },
    TIP: { class: 'callout-tip', icon: 'lightbulb', title: 'Tip' },
    WARNING: { class: 'callout-warning', icon: 'alert-triangle', title: 'Warning' },
    CAUTION: { class: 'callout-danger', icon: 'alert-octagon', title: 'Caution' },
    DANGER: { class: 'callout-danger', icon: 'alert-octagon', title: 'Danger' },
  };

  return (tree) => {
    visit(tree, 'blockquote', (node, index, parent) => {
      // Get the first paragraph in the blockquote
      const firstChild = node.children[0];
      if (!firstChild || firstChild.type !== 'paragraph') return;

      // Get the first text node
      const firstText = firstChild.children[0];
      if (!firstText || firstText.type !== 'text') return;

      // Check for callout pattern [!TYPE]
      const match = firstText.value.match(/^\[!(NOTE|TIP|WARNING|CAUTION|DANGER)\]\s*/i);
      if (!match) return;

      const type = match[1].toUpperCase();
      const config = calloutTypes[type];
      if (!config) return;

      // Remove the [!TYPE] prefix from the text
      firstText.value = firstText.value.slice(match[0].length);

      // If the text is now empty, remove it
      if (firstText.value === '') {
        firstChild.children.shift();
      }

      // If the first paragraph is now empty, remove it
      if (firstChild.children.length === 0) {
        node.children.shift();
      }

      // Create the callout structure
      const calloutNode = {
        type: 'mdxJsxFlowElement',
        name: 'div',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'className',
            value: `callout ${config.class}`
          }
        ],
        children: [
          {
            type: 'mdxJsxFlowElement',
            name: 'div',
            attributes: [
              {
                type: 'mdxJsxAttribute',
                name: 'className',
                value: 'callout-title'
              }
            ],
            children: [
              {
                type: 'mdxJsxFlowElement',
                name: 'span',
                attributes: [
                  {
                    type: 'mdxJsxAttribute',
                    name: 'className',
                    value: `callout-icon callout-icon-${config.icon}`
                  }
                ],
                children: []
              },
              {
                type: 'text',
                value: config.title
              }
            ]
          },
          {
            type: 'mdxJsxFlowElement',
            name: 'div',
            attributes: [
              {
                type: 'mdxJsxAttribute',
                name: 'className',
                value: 'callout-content'
              }
            ],
            children: node.children
          }
        ]
      };

      // Replace the blockquote with the callout
      parent.children[index] = calloutNode;
    });
  };
}
