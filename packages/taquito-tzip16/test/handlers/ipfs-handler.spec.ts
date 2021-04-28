import { IpfsHttpHandler } from '../../src/handlers/ipfs-handler'

describe('Tzip16 http handler test', () => {
	let mockHttpBackend: {
        createRequest: jest.Mock<any, any>
    };
    let mockContractAbstraction: any = {};
    let mockContext: any = {};
    
    const ipfsHandler = new IpfsHttpHandler();

	beforeEach(() => {
		mockHttpBackend = {
            createRequest: jest.fn()
        };
        
        ipfsHandler['_httpBackend'] = mockHttpBackend as any;
    })

	it('Should return a string representing the metadata fetched by the httpBackend', async (done) => {
        mockHttpBackend.createRequest.mockResolvedValue(`{ "name": "Taquito test" }`);
        const tzip16Uri = {
            sha256hash: undefined,
            protocol: 'ipfs',
            location: '//QmcMUKkhXowQjCPtDVVXyFJd7W9LmC92Gs5kYH1KjEisdjn'
        }
        const metadata = await ipfsHandler.getMetadata(mockContractAbstraction, tzip16Uri, mockContext)
		
		expect(metadata).toEqual(`{ "name": "Taquito test" }`);
		done();
	});
});