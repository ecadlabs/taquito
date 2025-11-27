import { TezosToolkit } from "@taquito/taquito";
import { createGetAddressesTool } from "./get_addresses.js";
import { createGetBalanceTool } from "./get_balance.js";
import { createGetLimitsTool } from "./get_limits.js";
import { createSendXtzTool } from "./send_xtz.js";

export const createTools = (Tezos: TezosToolkit, spendingContract: string, spendingAddress: string) => [
	createGetAddressesTool(Tezos, spendingContract),
	createGetBalanceTool(Tezos, spendingContract, spendingAddress),
	createGetLimitsTool(Tezos, spendingContract),
	createSendXtzTool(Tezos, spendingContract, spendingAddress),
]