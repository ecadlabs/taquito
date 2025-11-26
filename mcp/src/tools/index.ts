import { TezosToolkit } from "@taquito/taquito";
import { createGetAddressTool } from "./get_address.js";
import { createGetBalanceTool } from "./get_balance.js";
import { createSendXtzTool } from "./send_xtz.js";

export const createTools = (Tezos: TezosToolkit) => [
	createGetAddressTool(Tezos),
	createGetBalanceTool(Tezos),
	createSendXtzTool(Tezos),
]