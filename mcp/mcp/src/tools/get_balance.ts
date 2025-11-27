import { TezosToolkit } from "@taquito/taquito";
import z from "zod";

export const createGetBalanceTool = (Tezos: TezosToolkit) => ({
	name: "tezos_get_balance",
	config:
	{
		title: "Get Tezos Balance",
		description: "Returns the balance of the current address",
		inputSchema: z.object({}),
		annotations: {
			readOnlyHint: true,
			destructiveHint: false
		}
	},
	handler: async () => {
		try {
			const address = await Tezos.signer.publicKeyHash();
			const balance = (await Tezos.tz.getBalance(address)).toString();
			return {
				content: [{ type: "text" as const, text: balance }]
			};
		} catch {
			throw new ReferenceError("Failed to get public key from signer.")
		}
	}
});