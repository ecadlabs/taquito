import { TezosToolkit } from "@taquito/taquito";
import z from "zod";
import axios, { AxiosRequestConfig } from "axios";
import { X402ResponseSchema } from "./x402/types.js";
import { signX402Payment } from "./x402/sign.js";

export const createFetchWithX402Tool = (
	Tezos: TezosToolkit,
) => ({
	name: "tezos_fetch_with_x402",
	config: {
		title: "Fetch with x402 Payment",
		description: "Fetches a URL and automatically handles x402 payment requirements. If the server returns 402, it parses the requirements, creates a signed payment, and retries the request with the X-PAYMENT header.",
		inputSchema: z.object({
			url: z.string().describe("The URL to fetch"),
			maxAmountMutez: z.string().describe("Maximum amount in mutez willing to pay (e.g., '500000' for 0.5 XTZ)"),
			method: z.string().optional().describe("HTTP method (default: GET)"),
			body: z.string().optional().describe("Request body for POST/PUT requests"),
		}),
		annotations: {
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: true,
		}
	},
	handler: async (params: any) => {
		const { url, maxAmountMutez, method = "GET", body } = params as {
			url: string;
			maxAmountMutez: string;
			method?: string;
			body?: string;
		};

		const maxAmount = parseInt(maxAmountMutez, 10);
		if (isNaN(maxAmount) || maxAmount <= 0) {
			throw new Error(`Invalid maxAmountMutez: ${maxAmountMutez}. Must be a positive integer.`);
		}

		// Initial request config
		const axiosConfig: AxiosRequestConfig = {
			method,
			url,
			headers: { "Content-Type": "application/json" },
			validateStatus: () => true, // Don't throw on any status code
		};
		if (body && (method === "POST" || method === "PUT")) {
			axiosConfig.data = body;
		}

		const initialResponse = await axios(axiosConfig);

		// If not 402, return the response directly
		if (initialResponse.status !== 402) {
			return {
				content: [{
					type: "text" as const,
					text: JSON.stringify({
						status: initialResponse.status,
						statusText: initialResponse.statusText,
						paymentMade: false,
						body: typeof initialResponse.data === 'string'
							? initialResponse.data
							: JSON.stringify(initialResponse.data)
					}, null, 2)
				}]
			};
		}

		// Parse 402 response
		let x402Response;
		try {
			const responseData = typeof initialResponse.data === 'string'
				? JSON.parse(initialResponse.data)
				: initialResponse.data;
			x402Response = X402ResponseSchema.parse(responseData);
		} catch (error) {
			throw new Error(`Failed to parse x402 response: ${error}`);
		}

		// Find Tezos payment requirement
		const tezosRequirement = x402Response.paymentRequirements.find(
			req => req.scheme === "exact-tezos"
		);

		if (!tezosRequirement) {
			throw new Error("No Tezos payment option available in x402 response");
		}

		const requiredAmount = parseInt(tezosRequirement.amount, 10);

		// Check if amount is within limit
		if (requiredAmount > maxAmount) {
			const decimals = tezosRequirement.extra?.decimals ?? 6;
			const requiredFormatted = requiredAmount / Math.pow(10, decimals);
			const maxFormatted = maxAmount / Math.pow(10, decimals);
			throw new Error(
				`Payment amount ${requiredFormatted} XTZ exceeds maximum allowed ${maxFormatted} XTZ`
			);
		}

		// Get source address from signer
		const source = await Tezos.signer.publicKeyHash();

		// Validate source has sufficient funds
		const sourceBalance = await Tezos.tz.getBalance(source);
		if (sourceBalance.toNumber() < requiredAmount + 10000) { // Add buffer for fees
			throw new Error(
				`Insufficient balance. ` +
				`Required: ${requiredAmount + 10000} mutez (including fees), ` +
				`Available: ${sourceBalance.toNumber()} mutez`
			);
		}

		// Sign the payment using shared utility
		const signed = await signX402Payment(Tezos, {
			network: tezosRequirement.network,
			amount: requiredAmount,
			recipient: tezosRequirement.recipient,
		});

		// Retry with payment header
		const paidConfig: AxiosRequestConfig = {
			...axiosConfig,
			headers: {
				...axiosConfig.headers,
				"X-PAYMENT": signed.base64,
			},
		};

		const paidResponse = await axios(paidConfig);

		const decimals = tezosRequirement.extra?.decimals ?? 6;
		const amountFormatted = requiredAmount / Math.pow(10, decimals);

		return {
			content: [{
				type: "text" as const,
				text: JSON.stringify({
					status: paidResponse.status,
					statusText: paidResponse.statusText,
					paymentMade: true,
					paymentDetails: {
						amount: tezosRequirement.amount,
						amountFormatted: `${amountFormatted} XTZ`,
						recipient: tezosRequirement.recipient,
						network: tezosRequirement.network,
					},
					body: typeof paidResponse.data === 'string'
						? paidResponse.data
						: JSON.stringify(paidResponse.data)
				}, null, 2)
			}]
		};
	}
});
