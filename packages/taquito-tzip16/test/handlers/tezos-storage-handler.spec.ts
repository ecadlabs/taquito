import { TezosStorageHandler } from '../../src/handlers/tezos-storage-handler';
import { 
    InvalidMetadataType, 
    InvalidUri, 
    BigMapMetadataNotFound, 
    MetadataNotFound 
} from '../../src/tzip16-errors';

describe('Parse Tezos storage URI test', () => {
    const tezosStorageHandler = new TezosStorageHandler();

    it('Should extract smart contract address, network and path from the URI properly', () => {
        expect(tezosStorageHandler['parseTezosStorageUri']('//KT1RF4nXUitQb2G8TE5H9zApatxeKLtQymtg/here')).toMatchObject({
            contractAddress: 'KT1RF4nXUitQb2G8TE5H9zApatxeKLtQymtg',
            network: undefined,
            path: 'here'
        });

        expect(tezosStorageHandler['parseTezosStorageUri']('hello%2Fworld')).toMatchObject({
            contractAddress: undefined,
            network: undefined,
            path: 'hello/world'
        });

        expect(tezosStorageHandler['parseTezosStorageUri']('hello')).toMatchObject({
            contractAddress: undefined,
            network: undefined,
            path: 'hello'
        });

        expect(tezosStorageHandler['parseTezosStorageUri']('//KT1QDFEu8JijYbsJqzoXq7mKvfaQQamHD1kX/%2Ffoo')).toMatchObject({
            contractAddress: 'KT1QDFEu8JijYbsJqzoXq7mKvfaQQamHD1kX',
            network: undefined,
            path: '/foo'
        });

        expect(tezosStorageHandler['parseTezosStorageUri']('//KT1GPDQvmV37orH1XH3SZmVVKFaMuzzqsmN7.mainnet/contents')).toMatchObject({
            contractAddress: 'KT1GPDQvmV37orH1XH3SZmVVKFaMuzzqsmN7',
            network: 'mainnet',
            path: 'contents'
        });

        expect(tezosStorageHandler['parseTezosStorageUri']('hello/world')).toBeUndefined();
    });
});

describe('Tzip16 tezos storage handler test', () => {
    let mockContractAbstraction: any = {};
    let mockRpcClient: {
        getScript: jest.Mock<any, any>;
    };
    let mockContext: {
        rpc: any;
        contract: any;
    };
    let mockContractProvider: {
        getBigMapKeyByID: jest.Mock<any, any>;
    };

    const tezosStorageHandler = new TezosStorageHandler();

    beforeEach(() => {
        mockRpcClient = {
            getScript: jest.fn()
        };
        mockContractProvider = {
            getBigMapKeyByID: jest.fn()
        };
        mockContext = {
            rpc: mockRpcClient,
            contract: mockContractProvider
        };
    });

    it('Should succesfully find the metadata', async (done) => {
        mockRpcClient.getScript.mockResolvedValue({
            code: [{ prim: 'storage', args: [{ prim: 'pair', args: [{ prim: 'big_map', args: [{ prim: 'string' }, { prim: 'bytes' }], annots: ['%metadata'] }, {}] }] }, { prim: 'code', args: [] }],
            storage: { prim: 'Pair', args: [{ int: '32527' }, []] }
        });
        mockContractProvider.getBigMapKeyByID.mockResolvedValue(
            '7b226e616d65223a2274657374222c226465736372697074696f6e223a2241206d657461646174612074657374222c2276657273696f6e223a22302e31222c226c6963656e7365223a224d4954222c22617574686f7273223a5b225461717569746f203c68747470733a2f2f74657a6f737461717569746f2e696f2f3e225d2c22686f6d6570616765223a2268747470733a2f2f74657a6f737461717569746f2e696f2f227d'
        );

        const tzip16Uri = {
            sha256hash: undefined,
            protocol: 'tezos-storage',
            location: '//KT1RF4nXUitQb2G8TE5H9zApatxeKLtQymtg/here'
        };
        const metadata = await tezosStorageHandler.getMetadata(mockContractAbstraction, tzip16Uri, mockContext as any);

        expect(metadata).toEqual(
            `{"name":"test","description":"A metadata test","version":"0.1","license":"MIT","authors":["Taquito <https://tezostaquito.io/>"],"homepage":"https://tezostaquito.io/"}`
        );
        done();
    });

    it('Should fail with InvalidUri when the URI is invalid', async (done) => {
        mockRpcClient.getScript.mockResolvedValue({
            code: [{ prim: 'storage', args: [{ prim: 'pair', args: [{ prim: 'big_map', args: [{ prim: 'string' }, { prim: 'bytes' }], annots: ['%metadata'] }, {}] }] }, { prim: 'code', args: [] }],
            storage: { prim: 'Pair', args: [{ int: '32527' }, []] }
        });

        const tzip16Uri = {
            sha256hash: undefined,
            protocol: 'tezos-storage',
            location: 'hello/world' // invalid
        };
        try {
            await tezosStorageHandler.getMetadata(mockContractAbstraction, tzip16Uri as any, mockContext as any);
        } catch (ex) {
            expect(ex).toBeInstanceOf(InvalidUri);
        }
        done();
    });

    it('Should fail with BigMapMetadataNotFound when there is no big map %metadata in the storage', async (done) => {
        mockRpcClient.getScript.mockResolvedValue({
            code: [{ prim: 'storage', args: [{ prim: 'pair', args: [{}, {}] }] }],
            storage: { prim: 'Pair', args: [] }
        });

        const tzip16Uri = {
            sha256hash: undefined,
            protocol: 'tezos-storage',
            location: '//KT1RF4nXUitQb2G8TE5H9zApatxeKLtQymtg/here'
        };
        try {
            await tezosStorageHandler.getMetadata(mockContractAbstraction, tzip16Uri, mockContext as any);
        } catch (ex) {
            expect(ex).toBeInstanceOf(BigMapMetadataNotFound);
        }
        done();
    });

    it('Should fail with MetadataNotFound when the path extracted from the URI is not a key of the big map %metadata', async (done) => {
        mockRpcClient.getScript.mockResolvedValue({
            code: [{ prim: 'storage', args: [{ prim: 'pair', args: [{ prim: 'big_map', args: [{ prim: 'string' }, { prim: 'bytes' }], annots: ['%metadata'] }, {}] }] }, { prim: 'code', args: [] }],
            storage: { prim: 'Pair', args: [{ int: '32527' }, []] }
        });
        mockContractProvider.getBigMapKeyByID.mockResolvedValue(undefined);

        const tzip16Uri = {
            sha256hash: undefined,
            protocol: 'tezos-storage',
            location: '//KT1RF4nXUitQb2G8TE5H9zApatxeKLtQymtg/here'
        };
        try {
            await tezosStorageHandler.getMetadata(mockContractAbstraction, tzip16Uri as any, mockContext as any);
        } catch (ex) {
            expect(ex).toBeInstanceOf(MetadataNotFound);
        }
        done();
    });

    it('Should fail with InvalidMetadataType when metadata type is not bytes', async (done) => {
        mockRpcClient.getScript.mockResolvedValue({
            code: [{ prim: 'storage', args: [{ prim: 'pair', args: [{ prim: 'big_map', args: [{ prim: 'string' }, { prim: 'bytes' }], annots: ['%metadata'] }, {}] }] }, { prim: 'code', args: [] }],
            storage: { prim: 'Pair', args: [{ int: '32527' }, []] }
        });
        mockContractProvider.getBigMapKeyByID.mockResolvedValue(
            'NOT-BYTES'
        );

        const tzip16Uri = {
            sha256hash: undefined,
            protocol: 'tezos-storage',
            location: '//KT1RF4nXUitQb2G8TE5H9zApatxeKLtQymtg/here'
        };
        try {
            await tezosStorageHandler.getMetadata(mockContractAbstraction, tzip16Uri as any, mockContext as any);
        } catch (ex) {
            expect(ex).toBeInstanceOf(InvalidMetadataType);
        }
        done();
    });
});
