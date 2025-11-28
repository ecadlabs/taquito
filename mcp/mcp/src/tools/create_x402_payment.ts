import { TezosToolkit } from "@taquito/taquito";
import z from "zod";
import { signX402Payment } from "./x402/sign.js";

export const createCreateX402PaymentTool = (
	Tezos: TezosToolkit,
) => ({
	name: "tezos_create_x402_payment",
	config: {
		title: "Create x402 Payment",
		description: "Creates a signed Tezos payment for x402 protocol. Builds and signs a transfer operation without broadcasting it, then packages it as a base64-encoded X-PAYMENT header value.",
		inputSchema: z.object({
			network: z.string().describe("The Tezos network (e.g., 'shadownet', 'mainnet')"),
			asset: z.string().describe("The asset to pay with (e.g., 'XTZ')"),
			amount: z.string().describe("The amount in mutez to send"),
			recipient: z.string().describe("The recipient Tezos address (tz1...)")
		}),
		annotations: {
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: true,
		}
	},
	handler: async (params: any) => {
		const { network, asset, amount, recipient } = params as {
			network: string;
			asset: string;
			amount: string;
			recipient: string;
		};

		// Validate asset type
		if (asset !== "XTZ") {
			throw new Error(`Unsupported asset: ${asset}. Only XTZ is supported.`);
		}

		const amountMutez = parseInt(amount, 10);
		if (isNaN(amountMutez) || amountMutez <= 0) {
			throw new Error(`Invalid amount: ${amount}. Must be a positive integer in mutez.`);
		}

		// Get source address from signer
		const source = await Tezos.signer.publicKeyHash();

		// Validate source has sufficient funds
		const sourceBalance = await Tezos.tz.getBalance(source);
		if (sourceBalance.toNumber() < amountMutez + 10000) { // Add buffer for fees
			throw new Error(
				`Insufficient balance. ` +
				`Required: ${amountMutez + 10000} mutez (including fees), ` +
				`Available: ${sourceBalance.toNumber()} mutez`
			);
		}

		const signed = await signX402Payment(Tezos, {
			network,
			amount: amountMutez,
			recipient,
		});

		return {
			content: [{
				type: "text" as const,
				text: JSON.stringify({
					headerValue: signed.base64,
					payload: signed.payload,
				}, null, 2)
			}]
		};
	}
});
