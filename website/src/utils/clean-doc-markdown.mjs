import { replaceLiveCodeFixturePlaceholders } from './live-code.mjs';

const TAB_VALUE_LABELS = {
  contractAPI: 'Contract API',
  wallet: 'Wallet API',
  walletAPI: 'Wallet API',
};

/**
 * Extract frontmatter fields (title, description, author) and markdown body from raw MDX content.
 */
export function parseMdxFrontmatter(rawContent) {
  const match = rawContent.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) {
    return {
      title: null,
      description: null,
      body: rawContent,
    };
  }

  const frontmatter = match[1];
  const body = match[2];

  const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
  const descMatch = frontmatter.match(/^description:\s*(.+)$/m);

  const title = titleMatch ? titleMatch[1].replace(/^["']|["']$/g, '').trim() : null;
  const description = descMatch ? descMatch[1].replace(/^["']|["']$/g, '').trim() : null;

  return { title, description, body };
}

/**
 * Extract a concise one-line summary from the cleaned markdown body when frontmatter has no description.
 */
export function extractOneLineSummary(cleanedBody, fallbackTitle = '') {
  const lines = cleanedBody.split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (
      !line ||
      line.startsWith('#') ||
      line.startsWith('>') ||
      line.startsWith('```') ||
      line.startsWith('|') ||
      line.startsWith('-') ||
      line.startsWith('*') ||
      line.startsWith('<') ||
      line.startsWith('import ') ||
      /^\d+\./.test(line)
    ) {
      continue;
    }

    // Strip inline markdown links and formatting for a clean summary sentence
    const plain = line
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();

    if (plain.length >= 25) {
      const firstSentenceMatch = plain.match(/^(.+?[.!?])(\s|$)/);
      const summary = firstSentenceMatch ? firstSentenceMatch[1] : plain;
      return summary.length > 160 ? `${summary.slice(0, 157)}...` : summary;
    }
  }

  return fallbackTitle ? `Documentation for ${fallbackTitle} in Taquito.` : 'Taquito documentation guide.';
}

/**
 * Clean raw MDX content into LLM-friendly standard Markdown:
 * - Resolves `__FIXTURE_*__` placeholders to real Shadownet contract addresses
 * - Replaces `<Tabs>` / `<TabItem>` JSX wrappers with standard Markdown headings
 * - Strips interactive code fence modifiers (`live`, `wallet`, `noConfig`)
 */
export function cleanDocMarkdown(rawContent, { slug = '', version = 'next' } = {}) {
  const { title, description, body } = parseMdxFrontmatter(rawContent);

  // 1. Replace live-code fixture tokens with real contract addresses
  let cleaned = replaceLiveCodeFixturePlaceholders(body);

  // 2. Remove top-level MDX import statements outside code blocks
  cleaned = cleaned.replace(/^import\s+[^;\n]+;?\s*$/gm, '');

  // 3. Convert <Tabs ...> and <TabItem value="..."> JSX into standard Markdown subheadings
  cleaned = cleaned.replace(/<Tabs[\s\S]*?>/g, '');
  cleaned = cleaned.replace(/<\/Tabs>/g, '');
  cleaned = cleaned.replace(/<TabItem\s+[^>]*value=["']([^"']+)["'][^>]*>/g, (_m, val) => {
    const label = TAB_VALUE_LABELS[val] || val;
    return `\n#### ${label}\n`;
  });
  cleaned = cleaned.replace(/<\/TabItem>/g, '');

  // 4. Clean code fence meta (` ```js live wallet ` -> ` ```js `)
  cleaned = cleaned.replace(/^```(\w+)(?:\s+(?:live|wallet|noConfig))+\s*$/gm, '```$1');

  // 5. Collapse 3+ consecutive blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

  const headerLines = [];
  if (title) {
    headerLines.push(`# ${title}`);
  }
  if (slug) {
    headerLines.push(`> Source: https://taquito.io/docs/${version}/${slug}`);
  }

  const fullMarkdown =
    headerLines.length > 0 ? `${headerLines.join('\n\n')}\n\n${cleaned}\n` : `${cleaned}\n`;

  const summary = description || extractOneLineSummary(cleaned, title || slug);

  return {
    title: title || slug,
    summary,
    markdown: fullMarkdown,
  };
}
