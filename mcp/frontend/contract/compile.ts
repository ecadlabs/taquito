/**
 * Compile Script for Spending-Limited Wallet Contract
 *
 * This script compiles the JsLIGO contract to Michelson using the LIGO compiler.
 *
 * Prerequisites:
 * - LIGO must be installed and available in PATH
 *   Install via: brew install ligolang/ligo/ligo (macOS)
 *   Or: curl https://ligolang.org/bin/linux/ligo -o ligo && chmod +x ligo
 *
 * Usage:
 *   npx ts-node src/scripts/compile.ts
 *   # or
 *   npm run compile
 */

import { execSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compile = (): void => {
try {
  const input = join(__dirname, "spending-limited-wallet.jsligo");
  const output = join(__dirname, "spending-limited-wallet.tz");

  const command = `ligo compile contract "${input}" --output-file "${output}"`;

  execSync(command, {
      stdio: "inherit",
      cwd: __dirname,
    });
} catch (error) {
  throw new Error(`${error}`);
}
}

// Run the compile function
compile();
