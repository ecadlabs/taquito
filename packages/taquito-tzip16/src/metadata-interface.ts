import { MichelsonV1Expression } from '@taquito/rpc';
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

export enum ViewImplementationType {
	MICHELSON_STORAGE = 'michelsonStorageView',
	REST_API_QUERY = 'restApiQuery'
}

export type ViewImplementation =
	| { [ViewImplementationType.MICHELSON_STORAGE]: MichelsonStorageViewType }
	| { [ViewImplementationType.REST_API_QUERY]: RestApiQueryType };

export interface ViewDefinition {
	name?: string;
	description?: string;
	implementations?: ViewImplementation[];
	pure?: boolean;
}

export type Views = ViewDefinition[];

export type MichelsonStorageViewType = {
	parameter?: MichelineTzip16Expression;
	returnType: MichelineTzip16Expression;
	code: MichelineTzip16Expression;
	annotations?: Array<{ name: string; description: string }>;
	version?: string;
};

export type RestApiQueryType = {
	specificationUri: string;
	baseUri?: string;
	path: string;
	method?: 'GET' | 'POST' | 'PUT';
};

export type MichelineTzip16Expression =
	| MichelsonV1Expression
	| MichelineTzip16Expression[]
	| { prim: Unistring; args?: MichelineTzip16Expression[]; annots?: string[] };

type Unistring = string | { invalid_utf8_string: number[] };
