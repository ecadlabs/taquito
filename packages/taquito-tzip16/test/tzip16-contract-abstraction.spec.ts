import { Tzip16ContractAbstraction } from '../src/tzip16-contract-abstraction';
import { BigMapMetadataNotFound, UriNotFound } from '../src/tzip16-errors';

describe('Tzip16 contract abstraction test', () => {
	let mockMetadataProvider: {
		provideMetadata: jest.Mock<any, any>;
	};
	let mockContractAbstraction: any = {};
	let mockSchema: {
		FindFirstInTopLevelPair: jest.Mock<any, any>;
	};
	let mockContext: any = {};

	let mockRpcContractProvider: {
		getBigMapKeyByID: jest.Mock<any, any>;
	};

	beforeEach(() => {
		mockMetadataProvider = {
			provideMetadata: jest.fn()
		};

		mockSchema = {
			FindFirstInTopLevelPair: jest.fn()
		};

		mockRpcContractProvider = {
			getBigMapKeyByID: jest.fn()
		};

		mockMetadataProvider.provideMetadata.mockResolvedValue({
			uri: 'https://test',
			metadata: { name: 'Taquito test' }
		});

		mockContext['metadataProvider'] = mockMetadataProvider;
		mockContext['contract'] = mockRpcContractProvider;

		mockContractAbstraction['schema'] = mockSchema;
		mockContractAbstraction['script'] = {
			script: {
				code: [],
				storage: {
					prim: 'Pair',
					args: [
						{
							int: '20350'
						},
						[]
					]
				}
			}
		};
	});

	it('Should get the metadata', async (done) => {
		mockSchema.FindFirstInTopLevelPair.mockReturnValue({ int: '20350' });
		mockRpcContractProvider.getBigMapKeyByID.mockResolvedValue('cafe');

		const tzip16Abs = new Tzip16ContractAbstraction(mockContractAbstraction as any, mockContext);
		const metadata = await tzip16Abs.getMetadata();

		expect(metadata.metadata).toEqual({ name: 'Taquito test' });
		done();
	});

	it('Should fail with BigMapMetadataNotFound', async (done) => {
		mockSchema.FindFirstInTopLevelPair.mockReturnValue(undefined);

		const tzip16Abs = new Tzip16ContractAbstraction(mockContractAbstraction as any, mockContext);

		try {
			await tzip16Abs.getMetadata();
		} catch (e) {
			expect(e).toBeInstanceOf(BigMapMetadataNotFound);
		}
		done();
	});

	it('Should fail with UriNotFound', async (done) => {
		mockSchema.FindFirstInTopLevelPair.mockReturnValue({ int: '20350' });
		mockRpcContractProvider.getBigMapKeyByID.mockResolvedValue(undefined);
		
		const tzip16Abs = new Tzip16ContractAbstraction(mockContractAbstraction as any, mockContext);

		try {
			await tzip16Abs.getMetadata();
		} catch (e) {
			expect(e).toBeInstanceOf(UriNotFound);
		}
		done();
	});
});
