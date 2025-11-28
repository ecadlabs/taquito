import { TezosToolkit } from "@taquito/taquito";
import { createGetAddressesTool } from "./get_addresses.js";
import { createGetBalanceTool } from "./get_balance.js";
import { createGetLimitsTool } from "./get_limits.js";
import { createGetOperationHistoryTool } from "./get_operation_history.js";
import { createSendXtzTool } from "./send_xtz.js";

export const createTools = (Tezos: TezosToolkit, spendingContract: string, spendingAddress: string, tzktApi: string) => [
	createGetAddressesTool(Tezos, spendingContract),
	createGetBalanceTool(Tezos, spendingContract, spendingAddress),
	createGetLimitsTool(Tezos, spendingContract),
	createGetOperationHistoryTool(spendingContract, tzktApi),
	createSendXtzTool(Tezos, spendingContract, spendingAddress),
]