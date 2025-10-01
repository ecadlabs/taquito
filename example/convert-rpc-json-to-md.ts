/**
 * This script reads a JSON file containing public Tezos RPC node information
 * and generates a Markdown table suitable for inclusion in documentation.
 * The output includes network, provider, URL, and dynamic links for block status.
 * Run this script to print the Markdown table to stdout for copy-paste.
 */

const path = require('path');
const rpcData: RpcType = require(path.resolve(__dirname, '../website/static/docs/rpc_nodes.json'));

type Provider = {id: string, name: string, website: string, status_page: string};
type RpcEndpoint = {provider: string, url: string, net: string}
type RpcType = {providers: Provider[], rpc_endpoints: RpcEndpoint[]};

// Create a mapping of provider IDs to their names
const providers = rpcData.providers.reduce((providerMapping: Record<string, string>, provider) => {
  providerMapping[provider.id] = provider.name;
  return providerMapping;
}, {});

// Generate the markdown table header
let markdownTable = "| Network       | Provider         | URL                                   | Header                                                                        | Last Block                                                                           | Timestamp                                                                           | Block Received                                                                      |\n";
markdownTable += "| ------------- | ---------------- | ------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |\n";

rpcData.rpc_endpoints.sort((a, b) => a.net.localeCompare(b.net));

// Iterate over each RPC endpoint and generate the table rows
rpcData.rpc_endpoints.forEach(endpoint => {
  const providerName = providers[endpoint.provider] || "Unknown Provider";
  const url = endpoint.url;
  const net = endpoint.net;
  const headerUrl = `${url}/chains/main/blocks/head/header`;
  const row = `| ${net.padEnd(12)} | ${providerName.padEnd(16)} | ${url.padEnd(40)} | [Check](${headerUrl}) | <LastBlockLink network="${net}" rpcUrl="${url}" /> | <Timestamp network="${net}" rpcUrl="${url}" /> | <ReceivedTime network="${net}" rpcUrl="${url}" /> |\n`;
  markdownTable += row;
});

// Output the generated markdown table
console.log(markdownTable);