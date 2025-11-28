import { TezosToolkit } from "@taquito/taquito";
import z from "zod";

// Constants
const MUTEZ_PER_TEZ = 1_000_000;
const CONFIRMATIONS_TO_WAIT = 3;
const TZKT_BASE_URL = "https://shadownet.tzkt.io";

// Types
const inputSchema = z.object({
	toAddress: z.string().describe("The address to send Tez to."),
	amount: z.number().describe("The amount of Tez to send to the address."),
});

type SendXtzParams = z.infer<typeof inputSchema>;

// Helper Functions

/** Convert XTZ to mutez */
const xtzToMutez = (xtz: number): number => xtz * MUTEZ_PER_TEZ;

/** Format mutez for display */
const formatMutez = (mutez: number): string => `${mutez} mutez`;

/**
 * MCP tool for sending XTZ via a spending contract.
 *
 * @param Tezos - Configured TezosToolkit instance (with signer set to spender key)
 * @param spendingContract - Address of the spending-limited wallet contract
 * @param spendingAddress - Address of the spender account (for fee payments)
 */
export const createSendXtzTool = (
	Tezos: TezosToolkit,
	spendingContract: string,
	spendingAddress: string
) => ({
	name: "tezos_send_xtz",
	config: {
		title: "Send Tez",
		description: "Sends a set amount of Tez to another address via the spending contract.",
		inputSchema,
		annotations: {
			readOnlyHint: false,
			destructiveHint: true,
			idempotentHint: false,
			openWorldHint: true,
		},
	},

	handler: async (params: any) => {
		params = params as SendXtzParams; 
		// Validate spender has funds for fees
		const spenderBalance = await Tezos.tz.getBalance(spendingAddress);
		if (spenderBalance.isZero()) {
			throw new Error(
				"Spending account balance is 0. " +
				"Please fund the spending address to cover transaction fees."
			);
		}

		// Validate contract has funds for transfer
		const contractBalance = await Tezos.tz.getBalance(spendingContract);
		const amountMutez = xtzToMutez(params.amount);

		if (contractBalance.toNumber() < amountMutez) {
			throw new Error(
				`Insufficient contract balance. ` +
				`Requested: ${formatMutez(amountMutez)}, ` +
				`Available: ${formatMutez(contractBalance.toNumber())}`
			);
		}

		// Prepare contract call
		const contract = await Tezos.contract.at(spendingContract);
		const contractCall = contract.methodsObject.spend({
			recipient: params.toAddress,
			amount: amountMutez,
		});

		// Estimate fees
		let estimate;
		try {
			estimate = await Tezos.estimate.contractCall(contractCall);
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			if (message.includes("balance_too_low")) {
				throw new Error(
					`Spender balance (${formatMutez(spenderBalance.toNumber())}) ` +
					`is too low to cover fees. Please fund the spending address.`
				);
			}
			throw err;
		}

		// Run another fee check because the first check is only estimating the fees, but still needs tez in the account to estimate.
		// This check is checking against the actual estimated fee value.
		if (spenderBalance.toNumber() < estimate.totalCost) {
			throw new Error(
				`Spender balance too low for fees. ` +
				`Required: ${formatMutez(estimate.totalCost)}, ` +
				`Available: ${formatMutez(spenderBalance.toNumber())}`
			);
		}

		// Execute transaction
		const operation = await contractCall.send();
		await operation.confirmation(CONFIRMATIONS_TO_WAIT);

		const tzktUrl = `${TZKT_BASE_URL}/${operation.hash}`;

		return {
			content: [{ type: "text" as const, text: tzktUrl }],
		};
	},
});
