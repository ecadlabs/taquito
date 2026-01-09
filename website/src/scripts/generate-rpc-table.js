#!/usr/bin/env node

/**
 * Script to convert rpc_nodes.json into MDX table format for community nodes
 * Usage: npm run generate:rpc
 * 
 * Copy output, replace the table tabs in rpc_nodes.mdx
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../../public/rpc_nodes.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Build a map of provider ID to provider name
const providerMap = {};
for (const provider of data.providers) {
  providerMap[provider.id] = provider.name;
}

// Group endpoints by network
const networkEndpoints = {};
for (const endpoint of data.rpc_endpoints) {
  if (!networkEndpoints[endpoint.net]) {
    networkEndpoints[endpoint.net] = [];
  }
  networkEndpoints[endpoint.net].push({
    provider: providerMap[endpoint.provider] || endpoint.provider,
    url: endpoint.url,
    net: endpoint.net,
  });
}

// Generate table for a network
function generateTable(network, endpoints) {
  const lines = [];

  lines.push(`| Provider         | URL                                   | Block | Protocol | Timestamp                                                                           | Received                                                                      |`);
  lines.push(`| ---------------- | ------------------------------------- | ----- | -------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |`);

  for (const ep of endpoints) {
    const providerPadded = ep.provider.padEnd(16);
    const urlPadded = ep.url.padEnd(37);
    const blockComponent = `<BlockLevel network="${network}" rpcUrl="${ep.url}" />`;
    const protocolComponent = `<BlockProtocol network="${network}" rpcUrl="${ep.url}" />`;
    const timestampComponent = `<BlockTimestamp network="${network}" rpcUrl="${ep.url}" />`;
    const receivedComponent = `<BlockReceivedAgo network="${network}" rpcUrl="${ep.url}" />`;

    lines.push(`| ${providerPadded} | ${urlPadded} | ${blockComponent} | ${protocolComponent} | ${timestampComponent} | ${receivedComponent} |`);
  }

  return lines.join('\n');
}

// Generate community nodes tables content
function generateCommunityTables() {
  const networks = Object.keys(networkEndpoints).sort((a, b) => {
    // Sort mainnet first, then ghostnet, then alphabetically
    const order = ['mainnet', 'ghostnet'];
    const aIdx = order.indexOf(a);
    const bIdx = order.indexOf(b);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return a.localeCompare(b);
  });

  for (const network of networks) {
    console.log(`<TabItem value="${network}">\n`);
    console.log(`<div style={{"overflowX":"auto","width":"100%","display":"block"}}>\n`);
    console.log(`<div style={{"minWidth":"1000px"}}>\n`);
    console.log('');
    console.log(generateTable(network, networkEndpoints[network]));
    console.log('');
    console.log(`</div>\n`);
    console.log(`</div>\n`);
    console.log(`</TabItem>\n`);
  }
}

generateCommunityTables();
