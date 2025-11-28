import z from "zod";
import { X402ResponseSchema } from "./x402/types.js";

export const createParseX402RequirementsTool = () => ({
	name: "tezos_parse_x402_requirements",
	config: {
		title: "Parse x402 Payment Requirements",
		description: "Parses a 402 response body containing x402 payment requirements for Tezos payments. Returns structured payment information including scheme, network, asset, amount, and recipient.",
		inputSchema: z.object({
			responseBody: z.string().describe("The JSON response body from a 402 Payment Required response")
		}),
		annotations: {
			readOnlyHint: true,
			destructiveHint: false,
			idempotentHint: true,
			openWorldHint: false,
		}
	},
	handler: async (params: any) => {
		const { responseBody } = params as { responseBody: string };
		try {
			const parsed = JSON.parse(responseBody);
			const validated = X402ResponseSchema.parse(parsed);

			const tezosRequirements = validated.paymentRequirements.filter(
				req => req.scheme === 'exact-tezos'
			);

			if (tezosRequirements.length === 0) {
				return {
					content: [{
						type: "text" as const,
						text: "No Tezos payment requirements found in the response"
					}]
				};
			}

			const formattedRequirements = tezosRequirements.map(req => {
				const decimals = req.extra?.decimals ?? 6;
				const amountInUnits = Number(req.amount) / Math.pow(10, decimals);
				const assetName = req.extra?.name ?? req.asset;

				return {
					network: req.network,
					asset: req.asset,
					assetName,
					amount: req.amount,
					amountFormatted: `${amountInUnits} ${assetName}`,
					recipient: req.recipient,
					decimals
				};
			});

			return {
				content: [{
					type: "text" as const,
					text: JSON.stringify({
						x402Version: validated.x402Version,
						tezosPaymentRequirements: formattedRequirements
					}, null, 2)
				}]
			};
		} catch (error) {
			if (error instanceof z.ZodError) {
				throw new Error(`Invalid x402 response format: ${error.message}`);
			}
			if (error instanceof SyntaxError) {
				throw new Error(`Invalid JSON: ${error.message}`);
			}
			throw error;
		}
	}
});
