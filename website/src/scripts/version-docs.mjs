import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, ".."); // adjust if scripts/ is deeper
const docsRoot = path.join(projectRoot, "content", "docs");

const version = process.argv[2];

if (!version) {
  console.error("Usage: npm run docs:version <version>");
  process.exit(1);
}

const srcDir = path.join(docsRoot, "next");
const destDir = path.join(docsRoot, version);

// sanity check
if (!fs.existsSync(srcDir)) {
  console.error(`Source docs folder does not exist: ${srcDir}`);
  process.exit(1);
}

if (fs.existsSync(destDir)) {
  console.error(`Version folder already exists: ${destDir}`);
  process.exit(1);
}

// recursive copy
fs.cp(srcDir, destDir, { recursive: true, errorOnExist: true }, (err) => {
  if (err) {
    console.error("Error copying docs:", err);
    process.exit(1);
  }
  console.log(`Docs versioned: next -> ${version}`);
});
