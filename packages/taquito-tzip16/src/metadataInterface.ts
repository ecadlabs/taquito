export interface MetadataInterface {
    name?: string;
    description?: string;
    version?: string;
    license?: { name: string; details?: string };
    authors?: Array<string>;
    homepage?: string;
    source?: { tools?: Array<string>; location?: string };
    interfaces?: Array<string>;
    errors?: Array<
        { error: any; expansion: any; languages?: Array<string> } | { view: string; languages?: Array<string> }
    >;
    views?: Array<{
        name: string;
        description?: string;
        implementations: Array<
            | {
                'michelson-storage-view': {
                    parameter?: any;
                    'return-type': any;
                    code: any;
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
