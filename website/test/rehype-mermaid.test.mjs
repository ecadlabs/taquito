import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { rehypeMermaid } from '../src/utils/rehype-mermaid.mjs';

const markdown = await createMarkdownProcessor({
  syntaxHighlight: false,
  rehypePlugins: [rehypeMermaid],
});

test('Mermaid fences trigger the renderer and keep the source focusable', async () => {
  const { code, metadata } = await markdown.render(
    '> ~~~mermaid\n> graph TD\n> A --> B\n> ~~~',
    { frontmatter: { title: 'Diagram example' } }
  );
  assert.deepEqual(metadata.frontmatter, { title: 'Diagram example', hasMermaid: true });
  assert.match(code, /<pre tabindex="0"><code class="language-mermaid">/);
});

test('a literal Mermaid example does not trigger the renderer', async () => {
  const { code, metadata } = await markdown.render(
    '````markdown\n```mermaid\ngraph TD\n```\n````'
  );
  assert.equal(metadata.frontmatter.hasMermaid, false);
  assert.doesNotMatch(code, /tabindex=/);
});
