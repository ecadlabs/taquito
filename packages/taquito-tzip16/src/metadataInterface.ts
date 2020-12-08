import BigNumber from 'bignumber.js';
export interface MetadataInterface {
	[x: string]: any;
	name?: string;
	description?: string;
	version?: string;
	license?: { name: string; details?: string };
	authors?: string[];
	homepage?: string;
	source?: { tools?: string[]; location?: string };
	interfaces?: string[];
	errors?: Array<
		| { error: MichelineTzip16Expression; expansion: MichelineTzip16Expression; languages?: string[] }
		| { view: string; languages?: string[] }
	>;
	views?: Array<{
		name: string;
		description?: string;
		implementations: Array<
			| {
				'michelson-storage-view': {
					parameter?: MichelineTzip16Expression;
					'return-type': MichelineTzip16Expression;
					code: MichelineTzip16Expression;
					annotations?: Array<{ name: string; description: string }>;
					version?: string;
				};
			}
			| {
				'rest-api-query': {
					'specification-uri': string;
					'base-uri'?: string;
					path: string;
					method?: 'GET' | 'POST' | 'PUT';
				};
			}
		>;
		pure?: boolean;
	}>;
}

type MichelineTzip16Expression =
	| { 'int': BigNumber }
	| { 'string': string }
	| { 'bytes': string }
	| MichelineTzip16Expression[]
	| { prim: Unistring; args?: MichelineTzip16Expression[]; annots?: string[] };

type Unistring = string | { invalid_utf8_string: number[] }; // Add max and min
