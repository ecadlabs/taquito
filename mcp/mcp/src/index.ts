// Taquito
import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";

// MCP
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createTools } from "./tools/index.js";

// Network configurations
const NETWORKS = {
	mainnet: {
		rpcUrl: 'https://mainnet.tezos.ecadinfra.com',
		tzktApi: 'https://api.tzkt.io',
	},
	shadownet: {
		rpcUrl: 'https://shadownet.tezos.ecadinfra.com',
		tzktApi: 'https://api.shadownet.tzkt.io',
	},
} as const;

type NetworkName = keyof typeof NETWORKS;

const init = async () => {
	const server = new McpServer({
		name: "tezos-wallet-mcp",
		version: "1.0.0"
	});

	// Network configuration
	const networkName = (process.env.TEZOS_NETWORK || 'mainnet') as NetworkName;
	const network = NETWORKS[networkName];
	if (!network) {
		throw new ReferenceError(`Invalid network: ${networkName}. Valid options: ${Object.keys(NETWORKS).join(', ')}`);
	}

	// Taquito setup
	const Tezos = new TezosToolkit(network.rpcUrl);

	const privateKey = process.env.SPENDING_PRIVATE_KEY?.trim();
	if (!privateKey) {
		throw new ReferenceError("SPENDING_PRIVATE_KEY not set in environment");
	}

	// Validate private key format
	if (!privateKey.startsWith('edsk') && !privateKey.startsWith('spsk') && !privateKey.startsWith('p2sk')) {
		throw new Error(`Invalid SPENDING_PRIVATE_KEY format. Must start with edsk, spsk, or p2sk. Got: ${privateKey.substring(0, 10)}...`);
	}

	try {
		const signer = await InMemorySigner.fromSecretKey(privateKey);
		Tezos.setSignerProvider(signer);
	} catch (error) {
		throw new Error(`Failed to initialize signer from SPENDING_PRIVATE_KEY: ${error instanceof Error ? error.message : 'Unknown error'}. Check that the key is valid and properly formatted.`);
	}

	const spendingContract = process.env.SPENDING_CONTRACT;
	if (!spendingContract) { throw new ReferenceError("Spending contract address could not be read from the env. Ensure you have SPENDING_CONTRACT set.") }

	const spendingAddress = await Tezos.signer.publicKeyHash();

	// Tools
	const tools = createTools(Tezos, spendingContract, spendingAddress, network.tzktApi);
	tools.forEach(tool => {
		server.registerTool(tool.name, tool.config, tool.handler);
	});

	const transport = new StdioServerTransport();
	await server.connect(transport);
}

init();
