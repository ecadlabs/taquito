import axios from "axios";
import z from "zod";

interface TzktOperation {
	id: number;
	hash: string;
	timestamp: string;
	type: string;
	sender: { address: string };
	target: { address: string };
	amount: number;
	status: string;
	parameter?: {
		entrypoint: string;
		value: unknown;
	};
}

export const createGetOperationHistoryTool = (spendingContract: string, tzktApi: string) => ({
	name: "tezos_get_operation_history",
	config: {
		title: "Get Operation History",
		description:
			"Returns the last 100 transaction operations for the spending contract from TzKT API, ordered from most recent to oldest.",
		inputSchema: z.object({}),
		annotations: {
			readOnlyHint: true,
			destructiveHint: false,
			idempotentHint: true,
			openWorldHint: true,
		},
	},
	handler: async () => {
		try {
			const url = `${tzktApi}/v1/accounts/${spendingContract}/operations?type=transaction&limit=100`;
			const response = await axios.get<TzktOperation[]>(url);
			const allOperations = response.data;

			// Filter to only incoming/outgoing transfers, exclude spend calls
			const operations = allOperations.filter((op) => {
				const entrypoint = op.parameter?.entrypoint;
				const isSpendCall = op.target.address === spendingContract && entrypoint === "spend";
				const isOutgoing = op.sender.address === spendingContract;
				const isIncoming = op.target.address === spendingContract && !isSpendCall;
				return isIncoming || isOutgoing;
			});

			if (operations.length === 0) {
				return {
					content: [
						{
							type: "text" as const,
							text: `No transaction history found for contract ${spendingContract}`,
						},
					],
				};
			}

			const formattedOperations = operations.map((op, index) => {
				const amount = (op.amount / 1_000_000).toFixed(6);
				const date = new Date(op.timestamp).toISOString();
				const direction = op.sender.address === spendingContract ? "OUT" : "IN";

				return `${index + 1}. [${direction}] [${date}] ${op.hash}
   From: ${op.sender.address}
   To: ${op.target.address}
   Amount: ${amount} XTZ
   Status: ${op.status}`;
			});

			const summary = `Operation history for ${spendingContract} (${operations.length} transactions):\n\n${formattedOperations.join("\n\n")}`;

			return {
				content: [{ type: "text" as const, text: summary }],
			};
		} catch (error) {
			throw new ReferenceError(`Failed to fetch operation history: ${error}`);
		}
	},
});
