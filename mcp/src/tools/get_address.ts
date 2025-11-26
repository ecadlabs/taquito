import { TezosToolkit } from "@taquito/taquito";
import z from "zod";

export const createGetAddressTool = (Tezos: TezosToolkit) => ({
	name: "tezos_get_address",
	config:
	{
		title: "Get Tezos Address",
		description: "Returns the currently configured Tezos address",
		inputSchema: z.object({}),
		annotations: {
			readOnlyHint: true,
			destructiveHint: false
		}
	},
	handler: async () => {
		try {
			const address = await Tezos.signer.publicKeyHash();
			return {
				content: [{ type: "text" as const, text: address }]
			};
		} catch {
			throw new ReferenceError("Failed to get public key from signer.")
		}
	}
});