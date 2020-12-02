import { TezosToolkit } from '@taquito/taquito';
import { Tzip16ContractAbstraction } from '../src/tzip16ContractAbstraction';
import { MetadataNotFound, UriNotFound } from '../src/tzip16Errors';
import { script } from './data/script-metadata';
import { scriptNoMetadata } from './data/script-no-metadata';

describe('Tzip16 contract abstraction test', () => {
    let mockRpcClient: any;
    let toolkit: TezosToolkit;
    let mockFetcher: any;

    beforeEach(() => {
        mockRpcClient = {
            getScript: jest.fn(),
            getEntrypoints: jest.fn(),
            getBlockHeader: jest.fn(),
            getStorage: jest.fn(),
            packData: jest.fn(),
            getBigMapExpr: jest.fn()
        };

        mockFetcher = {
            fetchMetadata: jest.fn()
        };

        mockRpcClient.getEntrypoints.mockResolvedValue({
            entrypoints: {
                default: { args: [{ prim: 'nat' }] }
            }
        });
        mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });

        mockFetcher.fetchMetadata.mockResolvedValue({
            uri: 'https://test',
            metadata: { name: 'Taquito test' }
        });

        toolkit = new TezosToolkit(mockRpcClient);
        toolkit['_context'].rpc = mockRpcClient;
    });

    it('Should get the metadata', async (done) => {
        mockRpcClient.getScript.mockResolvedValue(script);
        mockRpcClient.getStorage.mockResolvedValue({
            prim: 'Pair',
            args: [
                { int: '32358' },
                [{ prim: 'Elt', args: [{ int: '1' }, { prim: 'Pair', args: [{ int: '10000' }, { int: '50' }] }] }]
            ]
        });
        mockRpcClient.packData.mockResolvedValue({ gas: 'unaccounted', packed: '050100000000' });
        mockRpcClient.getBigMapExpr.mockResolvedValue({
            bytes:
                '68747470733a2f2f73746f726167652e676f6f676c65617069732e636f6d2f747a69702d31362f7461636f2d73686f702d6d657461646174612e6a736f6e'
        });

        const abs = await toolkit.contract.at('test');
        const tzip16Abs = new Tzip16ContractAbstraction(abs);
        tzip16Abs['_fetcher'] = mockFetcher;
        const metadata = await tzip16Abs.getMetadata();

        expect(metadata.metadata).toEqual({ name: 'Taquito test' });
        done();
    });

    it('Should fail with MetadataNotFound', async (done) => {
        mockRpcClient.getScript.mockResolvedValue(scriptNoMetadata);
        mockRpcClient.getStorage.mockResolvedValue([
            { prim: 'Elt', args: [{ int: '1' }, { prim: 'Pair', args: [{ int: '9983' }, { int: '50' }] }] },
            { prim: 'Elt', args: [{ int: '2' }, { prim: 'Pair', args: [{ int: '120' }, { int: '20' }] }] },
            { prim: 'Elt', args: [{ int: '3' }, { prim: 'Pair', args: [{ int: '50' }, { int: '60' }] }] }
        ]);

        const abs = await toolkit.contract.at('test');
        const tzip16Abs = new Tzip16ContractAbstraction(abs);
        tzip16Abs['_fetcher'] = mockFetcher;

        try {
            await tzip16Abs.getMetadata();
        } catch (e) {
            expect(e).toBeInstanceOf(MetadataNotFound);
        }
        done();
    });

    it('Should fail with UriNotFound', async (done) => {
        mockRpcClient.getScript.mockResolvedValue(script);
        mockRpcClient.getStorage.mockResolvedValue({
            prim: 'Pair',
            args: [
                { int: '32488' },
                [
                    {
                        prim: 'Elt',
                        args: [{ int: '1' }, { prim: 'Pair', args: [{ int: '10000' }, { int: '50' }] }]
                    },
                    { prim: 'Elt', args: [{ int: '2' }, { prim: 'Pair', args: [{ int: '120' }, { int: '20' }] }] },
                    { prim: 'Elt', args: [{ int: '3' }, { prim: 'Pair', args: [{ int: '50' }, { int: '60' }] }] }
                ]
            ]
        });

        const abs = await toolkit.contract.at('test');
        const tzip16Abs = new Tzip16ContractAbstraction(abs);
        tzip16Abs['_fetcher'] = mockFetcher;

        try {
            await tzip16Abs.getMetadata();
        } catch (e) {
            expect(e).toBeInstanceOf(UriNotFound);
        }
        done();
    });
});
