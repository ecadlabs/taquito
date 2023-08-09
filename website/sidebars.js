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
      type: 'category',
      label: 'Getting Started',
      className: 'sidebarHeader',
      collapsed: false,
      collapsible: false,
      items: [
        'quick_start',
        'react-template',
        'amendment_and_voting',
        'batch_API',
        'ballot',
        'beaconwallet-singleton',
        'confirmation_event_stream',
        'consensus_key',
        'contract_call_parameters',
        'set_delegate',
        'dapp_prelaunch',
        'estimate',
        'subscribe_event',
        'fa2_parameters',
        'global_constant',
        'increase_paid_storage',
        'lambda_view',
        'liquidity_baking',
        'local_forger',
        'manager_lambda',
        'maps_bigmaps',
        'michelsonmap',
        'multisig_doc',
        'on_chain_views',
        'originate',
        'prepare',
        'rpc_nodes',
        'rpc_package',
        'signing',
        'smartcontracts',
        'contracts_collection',
        'tezos_domains',
        'tickets',
        'transaction_limits',
        'making_transfers',
        'tutorial_links',
        'tzip12',
        'metadata-tzip16',
        'validators',
        'wallet_API',
        'wallets',
        'web3js_taquito',
        'smart_rollups',
        'failing_noop'
      ],
    },
    {
      type: 'category',
      label: 'Signer',
      className: 'sidebarHeader',
      collapsed: false,
      collapsible: false,
      items: ['inmemory_signer', 'ledger_signer'],
    },
    {
      type: 'category',
      label: 'Packages',
      className: 'sidebarHeader',
      collapsed: false,
      collapsible: false,
      items: [
        'michelson_encoder',
        'contracts-library',
        'taquito_utils',
        {
          type: 'category',
          label: 'Sapling',
          collapsed: true,
          collapsible: true,
          items: ['sapling', 'sapling_in_memory_spending_key', 'sapling_in_memory_viewing_key'],
        },
      ],
    },
    {
      type: 'category',
      label: 'Optimistic Rollups',
      className: 'sidebarHeader',
      collapsed: false,
      collapsible: false,
      items: ['tx_rollups'],
    },
    {
      type: 'category',
      label: 'Advanced Examples',
      className: 'sidebarHeader',
      collapsed: false,
      collapsible: false,
      items: ['complex_parameters', 'storage_annotations', 'drain_account'],
    },
    {
      type: 'category',
      label: 'Modules customization',
      className: 'sidebarHeader',
      collapsed: false,
      collapsible: false,
      items: ['forger', 'rpc-cache', 'cancel_http_requests'],
    },
    {
      type: 'category',
      label: 'Running integration tests',
      className: 'sidebarHeader',
      collapsed: false,
      collapsible: false,
      items: ['ledger_integration_test', 'rpc_nodes_integration_test'],
    },
    {
      type: 'category',
      label: 'Native Mobile Development',
      className: 'sidebarHeader',
      collapsed: false,
      collapsible: false,
      items: ['mobile_bundle'],
    },
    {
      'Upgrading Guide': ['upgrading_guide'],
    },
    {
      type: 'link',
      label: 'TypeDoc Reference',
      href: 'https://tezostaquito.io/typedoc',
    },
  ],
};

module.exports = sidebars;
