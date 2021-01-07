import { MichelsonV1Expression } from '@taquito/rpc';
import BigNumber from 'bignumber.js';

export interface MetadataInterface {
	name?: string;
	description?: string;
	version?: string;
	license?: { name: string; details?: string };
	authors?: string[];
	homepage?: string;
	source?: { tools?: string[]; location?: string };
	interfaces?: string[];
	errors?: ErrorsTzip16;
	views?: Views;
}

export type ErrorsTzip16 = Array<
	| { error: MichelineTzip16Expression; expansion: MichelineTzip16Expression; languages?: string[] }
	| { view: string; languages?: string[] }
>;

export type Views = Array<{
	name: string;
	description?: string;
	implementations: Array<
		| {
			michelsonStorageView: MichelsonStorageView;
		}
		| {
			restApiQuery: RestApiQuery;
		}
	>;
	pure?: boolean;
}>;

export type MichelsonStorageView = {
	parameter?: MichelineTzip16Expression;
	returnType: MichelineTzip16Expression;
	code: MichelineTzip16Expression;
	annotations?: Array<{ name: string; description: string }>;
	version?: string;
};

export type RestApiQuery = {
	specificationUri: string;
	baseUri?: string;
	path: string;
	method?: 'GET' | 'POST' | 'PUT';
};

export type MichelineTzip16Expression =
	| MichelsonV1Expression
	| MichelineTzip16Expression[]
	| { prim: Unistring; args?: MichelineTzip16Expression[]; annots?: string[] };

type Unistring = string | { invalid_utf8_string: number[] }; // Add max and min
