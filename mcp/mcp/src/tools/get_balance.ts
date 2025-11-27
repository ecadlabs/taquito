import { TezosToolkit } from "@taquito/taquito";
import z from "zod";

export const createGetBalanceTool = (
	Tezos: TezosToolkit,
	spendingContract: string,
	spendingAddress: string
) => ({
	name: "tezos_get_balance",
	config:
	{
		title: "Get Balances",
		description: "Returns the balance of the spending contract (usable tokens) and spending address (tokens for fees)",
		inputSchema: z.object({}),
		annotations: {
			readOnlyHint: true,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: true,
		}
	},
	handler: async () => {
		try {
			const spendingAddressBalance = (await Tezos.tz.getBalance(spendingAddress)).toString();
			const spendingContractBalance = (await Tezos.tz.getBalance(spendingContract)).toString();

			return {
				content: [{ type: "text" as const, text: `Spending address balance: ${spendingAddressBalance} mutez. Spending contract balance: ${spendingContractBalance} mutez` }]
			};
		} catch (error) {
			throw new ReferenceError(`${error}`)
		}
	}
});