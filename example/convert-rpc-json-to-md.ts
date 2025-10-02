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

// Group endpoints by network
const endpointsByNetwork: Record<string, RpcEndpoint[]> = {};

rpcData.rpc_endpoints.forEach((endpoint: RpcEndpoint) => {
  if (!endpointsByNetwork[endpoint.net]) {
    endpointsByNetwork[endpoint.net] = [];
  }
  endpointsByNetwork[endpoint.net].push(endpoint);
});

// Sort networks alphabetically
const sortedNetworks = Object.keys(endpointsByNetwork).sort();

let markdownTable = "";

// Generate a separate table for each network
sortedNetworks.forEach(network => {
  const endpoints = endpointsByNetwork[network];
  
  // Add table header for each network
  markdownTable += "| Network       | Provider         | URL                                   | Header                                                                        | Last Block                                                                           | Timestamp                                                                           | Block Received                                                                      |\n";
  markdownTable += "| ------------- | ---------------- | ------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |\n";
  
  // Add rows for this network
  endpoints.forEach((endpoint: RpcEndpoint) => {
    const providerName = providers[endpoint.provider] || "Unknown Provider";
    const url = endpoint.url;
    const headerUrl = `${url}/chains/main/blocks/head/header`;
    const row = `| ${network.padEnd(12)} | ${providerName.padEnd(16)} | ${url.padEnd(40)} | [Check](${headerUrl}) | <LastBlockLink network="${network}" rpcUrl="${url}" /> | <Timestamp network="${network}" rpcUrl="${url}" /> | <ReceivedTime network="${network}" rpcUrl="${url}" /> |\n`;
    markdownTable += row;
  });
  
  // Add spacing between networks
  markdownTable += "\n";
});

// Output the generated markdown table
console.log(markdownTable);