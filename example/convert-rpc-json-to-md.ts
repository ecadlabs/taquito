/**
 * This script reads a JSON file containing public Tezos RPC node information
 * and generates a Markdown table suitable for inclusion in documentation.
 * The output includes network, provider, URL, and dynamic links for block status.
 * Run this script to print the Markdown table to stdout for copy-paste.
 */

const path = require('path');
const rpcData: RpcType = require(path.resolve(__dirname, '../website/static/docs/rpc_nodes.json'));

type Provider = { id: string, name: string, website: string, status_page: string };
type RpcEndpoint = { provider: string, url: string, net: string }
type RpcType = { providers: Provider[], rpc_endpoints: RpcEndpoint[] };

// Create a mapping of provider IDs to their names
const providers = rpcData.providers.reduce((providerMapping: Record<string, string>, provider) => {
  providerMapping[provider.id] = provider.name;
  return providerMapping;
}, {});

// Group endpoints by network
const endpointsByNetwork: Record<string, RpcEndpoint[]> = {};

rpcData.rpc_endpoints.forEach((endpoint: RpcEndpoint) => {
  if (!endpointsByNetwork[endpoint.net]) {
    endpointsByNetwork[endpoint.net] = [];
  }
  endpointsByNetwork[endpoint.net].push(endpoint);
});

// Determine network ordering (prefer mainnet, ghostnet, shadownet, seoulnet, tallinnnet)
const preferredOrder = ['mainnet', 'ghostnet', 'shadownet', 'seoulnet', 'tallinnnet'];
const networks = Object.keys(endpointsByNetwork).sort((a, b) => {
  const ai = preferredOrder.indexOf(a);
  const bi = preferredOrder.indexOf(b);
  if (ai === -1 && bi === -1) return a.localeCompare(b);
  if (ai === -1) return 1;
  if (bi === -1) return -1;
  return ai - bi;
});

const capitalize = (s: string) => (s.length ? s[0].toUpperCase() + s.slice(1) : s);

// Build Tabs values prop
const valuesArray = networks.map((net) => `{"label": "${capitalize(net)}", "value": "${net}"}`);
const defaultValue = networks.includes('mainnet') ? 'mainnet' : (networks[0] || 'mainnet');

let output = '';
output += `<Tabs defaultValue="${defaultValue}" values={[${valuesArray.join(',')}]}>\n`;

networks.forEach((network) => {
  const endpoints = endpointsByNetwork[network];

  output += `\n<TabItem value="${network}">\n\n`;
  output += `<div style={{"overflowX":"auto","width":"100%","display":"block"}}>` + "\n\n";
  output += `<div style={{"minWidth":"800px"}}>` + "\n\n";

  // Table header (6 columns, new style)
  output += `| Network       | Provider         | URL                                   | Last Block                                                                           | Timestamp                                                                           | Block Received                                                                      |\n`;
  output += `| ------------- | ---------------- | ------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |\n`;

  // Table rows
  endpoints.forEach((endpoint: RpcEndpoint) => {
    const providerName = providers[endpoint.provider] || 'Unknown Provider';
    const url = endpoint.url;
    const row = `| ${network.padEnd(12)} | ${providerName.padEnd(16)} | ${url.padEnd(40)} | <LastBlockHeaderLink network="${network}" rpcUrl="${url}" /> | <Timestamp network="${network}" rpcUrl="${url}" /> | <ReceivedTime network="${network}" rpcUrl="${url}" /> |\n`;
    output += row;
  });

  output += "\n";
  output += `</div>\n\n`;
  output += `</div>\n\n`;
  output += `</TabItem>\n`;
});

output += `\n</Tabs>\n`;

// Output the generated MDX snippet
console.log(output);