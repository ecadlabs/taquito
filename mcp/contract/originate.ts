/**
 * Origination Script for Spending-Limited Wallet Contract
 *
 * This script deploys the compiled contract to a Tezos network using Taquito.
 *
 * Prerequisites:
 * - Contract must be compiled first (run: npm run compile)
 * - Environment variables set in .env file:
 *   - RPC_URL: Tezos RPC endpoint (e.g., https://ghostnet.ecadinfra.com)
 *
 * Usage:
 *   npx ts-node src/scripts/originate.ts <private-key> <owner-address> <spender-address>
 *   # or
 *   npm run originate -- <private-key> <owner-address> <spender-address>
 *
 * Example:
 *   npm run originate -- edsk... tz1OwnerAddress... tz1SpenderAddress...
 */

import { TezosToolkit } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";
import { readFileSync, existsSync, writeFileSync } from "fs";
import { join } from "path";
import { config } from "dotenv";

// Load environment variables
config();

// Storage type matching the contract
interface WalletStorage {
  owner: string;
  spender: string;
  daily_limit: number;      // in mutez
  per_tx_limit: number;     // in mutez
  spent_today: number;      // in mutez
  last_reset: string;       // ISO timestamp
}

const originate = async (): Promise<void> => {
  // Parse command line arguments
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.log("Usage: npm run originate -- <private-key> <owner-address> <spender-address>");
    console.log("");
    console.log("Arguments:");
    console.log("  <private-key>     Your wallet's private key (edsk...)");
    console.log("  <owner-address>   Address with full control (tz1...)");
    console.log("  <spender-address> Address with limited spending authority (tz1...)");
    console.log("");
    console.log("Optional environment variables:");
    console.log("  RPC_URL           Tezos RPC endpoint (default: https://ghostnet.ecadinfra.com)");
    console.log("  DAILY_LIMIT       Daily spending limit in XTZ (default: 100)");
    console.log("  PER_TX_LIMIT      Per-transaction limit in XTZ (default: 10)");
    console.log("");
    console.log("Example:");
    console.log("  npm run originate -- edsk3ABC... tz1Owner... tz1Spender...");
    process.exit(1);
  }

  const [privateKey, ownerAddress, spenderAddress] = args;

  // Configuration from environment or defaults
  const rpcUrl = process.env.RPC_URL || "https://ghostnet.ecadinfra.com";
  const dailyLimitXtz = parseFloat(process.env.DAILY_LIMIT || "100");
  const perTxLimitXtz = parseFloat(process.env.PER_TX_LIMIT || "10");

  // Convert XTZ to mutez (1 XTZ = 1,000,000 mutez)
  const dailyLimitMutez = Math.floor(dailyLimitXtz * 1_000_000);
  const perTxLimitMutez = Math.floor(perTxLimitXtz * 1_000_000);

  console.log("Originating spending-limited-wallet contract...\n");
  console.log(`RPC URL: ${rpcUrl}`);
  console.log(`Owner:   ${ownerAddress}`);
  console.log(`Spender: ${spenderAddress}`);
  console.log(`Daily Limit: ${dailyLimitXtz} XTZ (${dailyLimitMutez} mutez)`);
  console.log(`Per-TX Limit: ${perTxLimitXtz} XTZ (${perTxLimitMutez} mutez)`);
  console.log("");

  // Define paths
  const projectRoot = join(__dirname, "..", "..");
  const contractPath = join(projectRoot, "src", "contracts", "compiled", "spending-limited-wallet.tz");

  // Check if compiled contract exists
  if (!existsSync(contractPath)) {
    console.error("Error: Compiled contract not found.");
    console.error(`Expected at: ${contractPath}`);
    console.error("\nRun 'npm run compile' first to compile the contract.");
    process.exit(1);
  }

  // Read the compiled Michelson code
  const contractCode = readFileSync(contractPath, "utf8");
  console.log("Loaded compiled contract.\n");

  // Initialize Tezos toolkit with signer
  const Tezos = new TezosToolkit(rpcUrl);
  Tezos.setProvider({
    signer: new InMemorySigner(privateKey),
  });

  // Get the signer's address for logging
  const signerAddress = await Tezos.signer.publicKeyHash();
  console.log(`Signer address: ${signerAddress}\n`);

  // Prepare initial storage
  const storage: WalletStorage = {
    owner: ownerAddress,
    spender: spenderAddress,
    daily_limit: dailyLimitMutez,
    per_tx_limit: perTxLimitMutez,
    spent_today: 0,
    last_reset: new Date().toISOString(),
  };

  console.log("Initial storage:");
  console.log(JSON.stringify(storage, null, 2));
  console.log("");

  try {
    console.log("Sending origination operation...\n");

    // Originate the contract
    const originationOp = await Tezos.contract.originate({
      code: contractCode,
      storage: storage,
    });

    console.log(`Operation hash: ${originationOp.hash}`);
    console.log("Waiting for confirmation...\n");

    // Wait for the operation to be confirmed
    await originationOp.confirmation(1);

    const contractAddress = originationOp.contractAddress;
    console.log("Contract originated successfully!");
    console.log(`Contract address: ${contractAddress}`);
    console.log("");

    // Save the contract address to a config file
    const configPath = join(projectRoot, "src", "contracts", "contract-config.json");
    const configData = {
      contractAddress,
      network: rpcUrl.includes("ghost") ? "ghostnet" : rpcUrl.includes("mainnet") ? "mainnet" : "unknown",
      originatedAt: new Date().toISOString(),
      owner: ownerAddress,
      spender: spenderAddress,
      dailyLimit: `${dailyLimitXtz} XTZ`,
      perTxLimit: `${perTxLimitXtz} XTZ`,
    };

    writeFileSync(configPath, JSON.stringify(configData, null, 2));
    console.log(`Contract config saved to: ${configPath}`);

    // Print helpful next steps
    console.log("\n--- Next Steps ---");
    console.log(`1. Fund the contract by sending XTZ to: ${contractAddress}`);
    console.log(`2. The spender (${spenderAddress}) can now call 'Spend'`);
    console.log(`3. The owner (${ownerAddress}) can call 'Withdraw', 'Set_spender', or 'Set_limits'`);
    console.log("");
    console.log("View on explorer:");
    if (rpcUrl.includes("ghost")) {
      console.log(`  https://ghostnet.tzkt.io/${contractAddress}`);
    } else if (rpcUrl.includes("mainnet")) {
      console.log(`  https://tzkt.io/${contractAddress}`);
    }

  } catch (error) {
    console.error("Origination failed!");
    console.error(error);
    process.exit(1);
  }
};

// Run the origination
originate();
