import { Tzip16ContractAbstraction } from '../src/tzip16ContractAbstraction';
import { MetadataNotFound, UriNotFound } from '../src/tzip16Errors';

describe('Tzip16 contract abstraction test', () => {
	let mockMetadataProvider: {
        provideMetadata: jest.Mock<any, any>;
    };
	let mockContractAbstraction: {
        storage: jest.Mock<any, any>;
    };
    let mockContext: any = {};

	beforeEach(() => {
		mockMetadataProvider = {
			provideMetadata: jest.fn()
		};

		mockContractAbstraction = {
			storage: jest.fn()
		};

		mockMetadataProvider.provideMetadata.mockResolvedValue({
			uri: 'https://test',
			metadata: { name: 'Taquito test' }
        });
        
        mockContext['metadataProvider'] = mockMetadataProvider;
	});

	it('Should get the metadata', async (done) => {
        const metadataBigMap = { get: () => Promise.resolve('cafe')};
        jest.spyOn(metadataBigMap, 'get');
		mockContractAbstraction.storage.mockResolvedValue({
			metadata: metadataBigMap,
			storage: {}
		});
		const tzip16Abs = new Tzip16ContractAbstraction(mockContractAbstraction as any, mockContext);
		const metadata = await tzip16Abs.getMetadata();

        expect(metadata.metadata).toEqual({ name: 'Taquito test' });
        expect(metadataBigMap.get).toHaveBeenLastCalledWith('')
		done();
	});

	it('Should fail with MetadataNotFound', async (done) => {
		mockContractAbstraction.storage.mockResolvedValue({
			valueMap: 'There is no bigmap called metadata'
		});
		const tzip16Abs = new Tzip16ContractAbstraction(mockContractAbstraction as any, mockContext);

		try {
			await tzip16Abs.getMetadata();
		} catch (e) {
			expect(e).toBeInstanceOf(MetadataNotFound);
		}
		done();
	});

	it('Should fail with UriNotFound', async (done) => {
		mockContractAbstraction.storage.mockResolvedValue({
			metadata: 'There is no empty string'
		});
		const tzip16Abs = new Tzip16ContractAbstraction(mockContractAbstraction as any, mockContext);

		try {
			await tzip16Abs.getMetadata();
		} catch (e) {
			expect(e).toBeInstanceOf(UriNotFound);
		}
		done();
	});
});
