import { Tzip12ContractAbstraction } from '../src/tzip12-contract-abstraction';

describe('Tzip12 contract abstraction test', () => {

    let mockContractAbstraction: any = {};
    let mockContext: any = {};
    let mockTzip16ContractAbstraction: any = {};
    let tzip12Abs: Tzip12ContractAbstraction;

	beforeEach(() => {
        mockTzip16ContractAbstraction = {
            getMetadata: jest.fn(),
            metadataViews: jest.fn()
        };
        tzip12Abs = new Tzip12ContractAbstraction(mockContractAbstraction, mockContext);
        tzip12Abs['_tzip16ContractAbstraction'] = mockTzip16ContractAbstraction;
	});

	it('Test 1 for getContractMetadata(): Should return the `Tzip-016` contract metadata', async (done) => {
        mockTzip16ContractAbstraction.getMetadata.mockResolvedValue({
            uri: 'https://test',
            metadata: { name: 'Taquito test' }
        });

		expect(await tzip12Abs.getContractMetadata()).toEqual({
            uri: 'https://test',
            metadata: { name: 'Taquito test' }
        });
		done();
    });
    
    it('Test 2 for getContractMetadata(): Should return undefined when the contract has no `Tzip-016` metadata', async (done) => {
        mockTzip16ContractAbstraction.getMetadata.mockImplementation(() => {
            throw new Error();
        });

		expect(await tzip12Abs.getContractMetadata()).toBeUndefined();
		done();
    });
    
    it('Test 1 for isTzip12Compliant(): Should return true', async (done) => {
        mockTzip16ContractAbstraction.getMetadata.mockResolvedValue({
            uri: 'https://test',
            metadata: { 
                name: 'Taquito test',
                interfaces: ["TZIP-012[-<version-info>]"]
            }
        });

		expect(await tzip12Abs.isTzip12Compliant()).toEqual(true);
		done();
    });

    it('Test 2 for isTzip12Compliant(): Should return true', async (done) => {
        mockTzip16ContractAbstraction.getMetadata.mockResolvedValue({
            uri: 'https://test',
            metadata: { 
                name: 'Taquito test',
                interfaces: ["TZIP-test", "TZIP-012[-<version-info>]", "TZIP-test2"]
            }
        });

		expect(await tzip12Abs.isTzip12Compliant()).toEqual(true);
		done();
    });
    
    it('Test 3 for isTzip12Compliant(): Should return false when no interfaces property', async (done) => {
        mockTzip16ContractAbstraction.getMetadata.mockResolvedValue({
            uri: 'https://test',
            metadata: { 
                name: 'Taquito test'
            }
        });

		expect(await tzip12Abs.isTzip12Compliant()).toEqual(false);
		done();
    });
    
    it('Test 4 for isTzip12Compliant(): Should return false when no TZIP-012 in interfaces property', async (done) => {
        mockTzip16ContractAbstraction.getMetadata.mockResolvedValue({
            uri: 'https://test',
            metadata: { 
                name: 'Taquito test',
                interfaces: ["TZIP-test"]
            }
        });

		expect(await tzip12Abs.isTzip12Compliant()).toEqual(false);
		done();
	});
});
