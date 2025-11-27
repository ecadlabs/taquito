// Taquito
import { importKey, InMemorySigner } from "@taquito/signer";
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

	const privateKey = process.env.SPENDING_PRIVATE_KEY;
	if (!privateKey) { throw new ReferenceError("privateKey could not be read from the env. Ensure you have SPENDING_PRIVATE_KEY set.") }

	importKey(Tezos, privateKey);

	await Tezos.setSignerProvider(await InMemorySigner.fromSecretKey(privateKey));

	const spendingContract = process.env.SPENDING_CONTRACT;
	if (!spendingContract) { throw new ReferenceError("Spending contract address could not be read from the env. Ensure you have SPENDING_CONTRACT set.") }

	const spendingAddress = await Tezos.signer.publicKeyHash();

	// Tools
	const tools = createTools(Tezos, spendingContract, spendingAddress);
	tools.forEach(tool => {
		server.registerTool(tool.name, tool.config, tool.handler);
	});

	const transport = new StdioServerTransport();
	await server.connect(transport);
}

init();
