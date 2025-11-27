import { TezosToolkit } from "@taquito/taquito";
import z from "zod";

type Params = {
	toAddress: string,
	amount: number,
}

export const createSendXtzTool = (Tezos: TezosToolkit, spendingContract: string, spendingAddress: string) => ({
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
			readOnlyHint: false,
			destructiveHint: true,
			idempotentHint: false,
			openWorldHint: true
		}
	},
	handler: async (params: any) => {
		const typedParams: Params = params;
		try {
			const spendingAddressMutezBalance = await Tezos.tz.getBalance(spendingAddress);

			if (spendingAddressMutezBalance.isZero()) {
				throw new Error("Spending account balance is 0. Please fund the spending address with a balance to cover transaction fees and to reveal it.")
			}

			const spendingContractBalance = (await Tezos.tz.getBalance(spendingContract)).toNumber();

			if (spendingContractBalance < typedParams.amount * 1_000_000) {
				throw new Error("Not enough spendable balance in spending contract to cover transaction");
			}

			const contract = await Tezos.contract.at(spendingContract);

			const contractCall = contract.methodsObject.spend({
				recipient: typedParams.toAddress,
				amount: typedParams.amount * 1000000
			});

			let estimate;
			try {
				estimate = await Tezos.estimate.contractCall(contractCall);
			} catch (err: any) {
				if (err.message?.includes('balance_too_low')) {
					throw new Error(
						`Spending address balance (${spendingAddressMutezBalance.toNumber()} mutez) ` +
						`is too low to cover fees. Please fund the spending address.`
					);
				}
				throw err;
			}

			const totalCost = estimate.totalCost;
			if (spendingAddressMutezBalance.toNumber() < totalCost) {
				throw new Error(`Spending address account balance is too low to cover transaction fees (${totalCost} mutez). Please fund the spending address via the web interface.`)
			}

			const operation = await contractCall.send();
			await operation.confirmation(3);
			const tzktUrl = `https://ghostnet.tzkt.io/${operation.hash}`;

			return {
				content: [{ type: "text" as const, text: tzktUrl }]
			};
		} catch (error) {
			throw new Error(`Error: ${error} ${JSON.stringify(error, null, 2)}`);
		}
	}
});