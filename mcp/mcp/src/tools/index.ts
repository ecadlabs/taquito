import { TezosToolkit } from "@taquito/taquito";
import { createCreateX402PaymentTool } from "./create_x402_payment.js";
import { createFetchWithX402Tool } from "./fetch_with_x402.js";
import { createGetAddressesTool } from "./get_addresses.js";
import { createGetBalanceTool } from "./get_balance.js";
import { createGetLimitsTool } from "./get_limits.js";
import { createGetOperationHistoryTool } from "./get_operation_history.js";
import { createParseX402RequirementsTool } from "./parse_x402_requirements.js";
import { createSendXtzTool } from "./send_xtz.js";

export const createTools = (Tezos: TezosToolkit, spendingContract: string, spendingAddress: string, tzktApi: string) => [
	createCreateX402PaymentTool(Tezos),
	createFetchWithX402Tool(Tezos),
	createGetAddressesTool(Tezos, spendingContract),
	createGetBalanceTool(Tezos, spendingContract, spendingAddress),
	createGetLimitsTool(Tezos, spendingContract),
	createGetOperationHistoryTool(spendingContract, tzktApi),
	createParseX402RequirementsTool(),
	createSendXtzTool(Tezos, spendingContract, spendingAddress),
]