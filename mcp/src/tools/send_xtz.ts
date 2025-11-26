import { TezosToolkit } from "@taquito/taquito";
import z from "zod";

type Params = {
	toAddress: string,
	amount: number,
}

export const createSendXtzTool = (Tezos: TezosToolkit) => ({
	name: "tezos_send_xtz",
	config:
	{
		title: "Send Tez",
		description: "Sends a set amount of Tez to another address.",
		inputSchema: z.object({
			toAddress: z.string().describe("The address to send Tez to."),
			amount: z.number().describe("The amount of Tez to send to the address."),
		}),
		annotations: {
			readOnlyHint: true,
			destructiveHint: false
		}
	},
	handler: async (params: any) => {
		const typedParams: Params = params;
		try {
			const senderAddress = await Tezos.signer.publicKeyHash();
			const spendableBalance = (await Tezos.tz.getSpendable(senderAddress)).toNumber();

			if (spendableBalance < typedParams.amount) {
				throw new Error("Not enough spendable balance to cover transaction");
			}

			const operation = await Tezos.contract.transfer({ to: typedParams.toAddress, amount: typedParams.amount });
			const hash = (await operation.confirmation(1)).toString();

			const tzktUrl = `https://ghostnet.tzkt.io/${hash}/operations`

			return {
				content: [{ type: "text" as const, text: tzktUrl }]
			};
		} catch (error) {
			throw new Error(`Error: ${error} ${JSON.stringify(error, null, 2)}`);
		}
	}
});