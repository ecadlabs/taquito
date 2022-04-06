/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure

   docs: [
    {
      "type": "category",
      "label": "General",
      "items": [
        "quick_start",
        "boilerplate",        
        "batch_API",
        "beaconwallet-singleton",
        "confirmation_event_stream",
        "set_delegate",
        "dapp_prelaunch",
        "estimate",
        "fa2_parameters",
        "lambda_view",
        "liquidity_baking",
        "maps_bigmaps",
        "michelsonmap",
        "originate",
        "global_constant",
        "rpc_nodes",
        "rpc_package",
        "signing",
        "smartcontracts",
        "tezos_domains",
        "tickets",
        "transaction_limits",
        "making_transfers",
        "on_chain_views",
        "tutorial_links",
        "tzip12",
        "metadata-tzip16",
        "validators",
        "wallet_API",
        "wallets",
        "web3js_taquito",
        "contracts_collection"
      ]
    },
    {
      "type": "category",
      "label": "Signer",
      "items": ["inmemory_signer", "tezbridge_signer", "ledger_signer"]
    },
    {
      "type": "category",
      "label": "Packages",
      "items": ["michelson_encoder", "contracts-library", "taquito_utils"]
    },
    {
      "type": "category",
      "label": "Advanced Examples",
      "items": ["complex_parameters", "storage_annotations", "drain_account"]
    },
    {
      "type": "category",
      "label": "Modules customization",
      "items": ["forger", "rpc-cache", "cancel_http_requests"]
    },
    {
      "type": "category",
      "label": "Running integration tests",
      "items": ["ledger_integration_test", "rpc_nodes_integration_test"]
    },
    {
      "Upgrading Guide": ["upgrading_guide"]
    },
    {
      "type": "link",
      "label": "TypeDoc Reference",
      "href": "https://tezostaquito.io/typedoc"
    }
  ]
};
  

module.exports = sidebars;
