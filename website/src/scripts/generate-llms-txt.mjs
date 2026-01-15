import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { sidebarConfig, getAllDocSlugs } from "../config/docs-sidebar.mjs";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "..");
const docsRoot = path.join(projectRoot, "content", "docs", "next");
const outputPath = path.join(projectRoot, "..", "public", "llms.txt");

// Extract title from MDX frontmatter
function extractTitle(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = match[1];
  const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
  if (!titleMatch) return null;

  return titleMatch[1].replace(/^["']|["']$/g, "").trim();
}

function generateLlmsTxt() {
  // Read all mdx files and build doc info map
  const files = fs.readdirSync(docsRoot).filter((f) => f.endsWith(".mdx"));
  const docInfo = new Map();

  for (const file of files) {
    const slug = file.replace(".mdx", "");
    const content = fs.readFileSync(path.join(docsRoot, file), "utf-8");
    const title = extractTitle(content) || slug;
    docInfo.set(slug, { slug, title, file });
  }

  // Track which docs are in the sidebar
  const sidebarSlugs = new Set(getAllDocSlugs());

  // Find docs not in sidebar
  const uncategorized = [...docInfo.keys()].filter(
    (slug) => !sidebarSlugs.has(slug)
  );

  // Generate output
  let output = `# Taquito Documentation

> Official documentation for Taquito, a TypeScript library for building DApps on the Tezos blockchain.

This file lists all documentation pages available at https://taquito.io. Use this to understand the documentation structure and find relevant pages.

## URL Structure

Documentation pages follow this pattern:
- \`/docs/{version}/{page}\` - Versioned documentation
- Example: \`/docs/next/quick_start\` or \`/docs/next/making_transfers\`

The \`next\` version contains the latest unreleased documentation.

## Documentation Pages

`;

  // Output each category from sidebar config
  for (const category of sidebarConfig) {
    output += `### ${category.name}\n`;

    for (const item of category.items) {
      if (typeof item === "string") {
        const info = docInfo.get(item);
        if (info) {
          output += `- \`${item}\` - ${info.title}\n`;
        }
      } else if (item.items) {
        // Subcategory
        output += `- **${item.title}**\n`;
        for (const subItem of item.items) {
          const info = docInfo.get(subItem);
          if (info) {
            output += `  - \`${subItem}\` - ${info.title}\n`;
          }
        }
      }
    }

    output += "\n";
  }

  // Output uncategorized if any
  if (uncategorized.length > 0) {
    output += `### Other\n`;
    for (const slug of uncategorized.sort()) {
      const info = docInfo.get(slug);
      if (info) {
        output += `- \`${slug}\` - ${info.title}\n`;
      }
    }
    output += "\n";
  }

  output += `## API Reference

TypeDoc-generated API documentation is available at \`/typedoc\`.

## Resources

- GitHub: https://github.com/ecadlabs/taquito
- npm: https://www.npmjs.com/package/@taquito/taquito
`;

  // Write output
  fs.writeFileSync(outputPath, output);
  console.log(`Generated ${outputPath}`);
  console.log(`Total docs: ${docInfo.size}`);

  if (uncategorized.length > 0) {
    console.log("");
    console.log("\x1b[43m\x1b[30m\x1b[1m ⚠️  WARNING \x1b[0m");
    console.log("\x1b[33m\x1b[1m┌─────────────────────────────────────────────────────────────┐\x1b[0m");
    console.log("\x1b[33m\x1b[1m│  The following docs are NOT in the sidebar configuration:   │\x1b[0m");
    console.log("\x1b[33m\x1b[1m└─────────────────────────────────────────────────────────────┘\x1b[0m");
    for (const slug of uncategorized) {
      console.log(`\x1b[33m   • ${slug}\x1b[0m`);
    }
    console.log("");
    console.log("\x1b[36m   Add them to: src/config/docs-sidebar.mjs\x1b[0m");
    console.log("");
  }
}

generateLlmsTxt();
