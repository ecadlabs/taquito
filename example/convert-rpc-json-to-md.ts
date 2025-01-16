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
let markdownTable = "| Provider         | Net          | URL                                      | Header                                                                          |\n";
markdownTable += "|------------------|--------------|------------------------------------------|---------------------------------------------------------------------------------|\n";

// Iterate over each RPC endpoint and generate the table rows
rpcData.rpc_endpoints.forEach(endpoint => {
  const providerName = providers[endpoint.provider] || "Unknown Provider";
  const url = endpoint.url;
  const net = endpoint.net;
  const headerUrl = `${url}/chains/main/blocks/head/header`;
  const row = `| ${providerName.padEnd(16)} | ${net.padEnd(12)} | ${url.padEnd(40)} | [Check](${headerUrl}) |\n`;
  markdownTable += row;
});

// Output the generated markdown table
console.log(markdownTable);