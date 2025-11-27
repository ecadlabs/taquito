import { TezosToolkit } from "@taquito/taquito";
import z from "zod";

// Constants
const MUTEZ_PER_TEZ = 1_000_000;

// Types
interface ContractStorage {
	owner: string;
	spender: string;
	daily_limit: { toNumber: () => number };
	per_tx_limit: { toNumber: () => number };
	spent_today: { toNumber: () => number };
	last_reset: string;
}

/** Convert mutez to XTZ */
const mutezToXtz = (mutez: number): number => mutez / MUTEZ_PER_TEZ;

export const createGetLimitsTool = (Tezos: TezosToolkit, spendingContract: string) => ({
	name: "tezos_get_limits",
	config: {
		title: "Get Spending Limits",
		description:
			"Returns the spending limits and current usage from the contract: daily limit, per-transaction limit, amount spent today, and time until reset.",
		inputSchema: z.object({}),
		annotations: {
			readOnlyHint: true,
			destructiveHint: false,
			idempotentHint: true,
			openWorldHint: false,
		},
	},
	handler: async () => {
		const contract = await Tezos.contract.at(spendingContract);
		const storage = (await contract.storage()) as ContractStorage;

		const dailyLimitMutez = storage.daily_limit.toNumber();
		const perTxLimitMutez = storage.per_tx_limit.toNumber();
		const spentTodayMutez = storage.spent_today.toNumber();
		const lastReset = new Date(storage.last_reset);

		// Calculate time until next reset (24 hours from last_reset)
		const nextReset = new Date(lastReset.getTime() + 24 * 60 * 60 * 1000);
		const now = new Date();
		const msUntilReset = Math.max(0, nextReset.getTime() - now.getTime());
		const hoursUntilReset = Math.floor(msUntilReset / (1000 * 60 * 60));
		const minutesUntilReset = Math.floor((msUntilReset % (1000 * 60 * 60)) / (1000 * 60));

		const result = {
			dailyLimit: {
				xtz: mutezToXtz(dailyLimitMutez),
				mutez: dailyLimitMutez,
			},
			perTransactionLimit: {
				xtz: mutezToXtz(perTxLimitMutez),
				mutez: perTxLimitMutez,
			},
			spentToday: {
				xtz: mutezToXtz(spentTodayMutez),
				mutez: spentTodayMutez,
			},
			remainingDaily: {
				xtz: mutezToXtz(Math.max(0, dailyLimitMutez - spentTodayMutez)),
				mutez: Math.max(0, dailyLimitMutez - spentTodayMutez),
			},
			lastReset: storage.last_reset,
			timeUntilReset: `${hoursUntilReset}h ${minutesUntilReset}m`,
		};

		return {
			content: [
				{
					type: "text" as const,
					text: JSON.stringify(result, null, 2),
				},
			],
		};
	},
});
