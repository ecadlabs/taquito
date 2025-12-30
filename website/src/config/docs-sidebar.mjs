/**
 * Sidebar configuration for documentation.
 * Used by both DocsSidebar.astro and generate-llms-txt.mjs
 */

export const sidebarConfig = [
  {
    name: "Getting Started",
    items: [
      "quick_start",
      "tutorial",
      "operation_flow",
      "rpc_nodes",
      "web3js_taquito",
      "fallback_rpc",
      "rpc_analytics_headers",
    ],
  },
  {
    name: "Taquito Providers",
    items: ["prepare", "estimate"],
  },
  {
    name: "Operations",
    items: [
      "making_transfers",
      "originate",
      "consensus_key",
      "global_constant",
      "increase_paid_storage",
      "set_delegate",
      "smart_rollups",
      "proposal_and_ballot",
      "failing_noop",
      "staking",
    ],
  },
  {
    name: "Smart Contracts",
    items: [
      "smartcontracts",
      "contract_call_parameters",
      "fa2_parameters",
      "manager_lambda",
      "multisig_doc",
    ],
  },
  {
    name: "Wallets",
    items: [
      "walletconnect",
      "wallets",
      "transaction_limits",
    ],
  },
  {
    name: "Michelson",
    items: ["maps_bigmaps", "michelsonmap", "tickets"],
  },
  {
    name: "Views",
    items: ["lambda_view", "on_chain_views"],
  },
  {
    name: "Contract and Token Metadata",
    items: ["tzip12", "metadata-tzip16"],
  },
  {
    name: "Signers",
    items: ["signing", "inmemory_signer", "ledger_signer"],
  },
  {
    name: "Packages",
    items: [
      "rpc_package",
      "michelson_encoder",
      "michel_codec",
      "contracts-library",
      "timelock",
      "taquito_utils",
      {
        title: "Sapling",
        items: [
          "sapling",
          "sapling_in_memory_spending_key",
          "sapling_in_memory_viewing_key",
        ],
      },
    ],
  },
  {
    name: "Advanced Scenarios",
    items: [
      "ophash_before_injecting",
      "drain_account",
      "complex_parameters",
      "confirmation_event_stream",
      "events",
      "liquidity_baking",
      "storage_annotations",
      "tezos_domains",
    ],
  },
  {
    name: "Modules customization",
    items: ["forger", "rpc-cache", "cancel_http_requests"],
  },
  {
    name: "Running integration tests",
    items: ["ledger_integration_test", "rpc_nodes_integration_test"],
  },
  {
    name: "Dapp Development",
    items: ["package_bundle", "dapp_template", "dapp_prelaunch"],
  },
  {
    name: "Taquito Public API",
    items: ["wallet_API", "batch-api"],
  },
  {
    name: "Misc",
    items: ["tutorial_links", "contract-test-collection", "validators", "ballot"],
  },
];

/**
 * Flatten sidebar config to get all doc slugs
 */
export function getAllDocSlugs(config = sidebarConfig) {
  const slugs = [];
  for (const category of config) {
    for (const item of category.items) {
      if (typeof item === "string") {
        slugs.push(item);
      } else if (item.items) {
        slugs.push(...item.items);
      }
    }
  }
  return slugs;
}
