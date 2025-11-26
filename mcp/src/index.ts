// Taquito
import { importKey } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";

// MCP
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createTools } from "./tools/index.js";

const init = async () => {
	const server = new McpServer({
		name: "tezos-wallet-mcp",
		version: "1.0.0"
	});

	// Taquito setup
	const Tezos = new TezosToolkit('https://ghostnet.tezos.ecadinfra.com');

	const privateKey = process.env.WALLET_PRIVATE_KEY;
	if (!privateKey) { throw new ReferenceError("privateKey could not be read from the env. Ensure you have WALLET_PRIVATE_KEY set.") }

	importKey(Tezos, privateKey);

	// Tools
	const tools = createTools(Tezos);
	tools.forEach(tool => {
		server.registerTool(tool.name, tool.config, tool.handler);
	});

	const transport = new StdioServerTransport();
	await server.connect(transport);
}

init();
