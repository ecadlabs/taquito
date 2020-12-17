import { HttpHandler } from '../../src/handlers/http-handler'

describe('Tzip16 http handler test', () => {
	let mockHttpBackend: {
        createRequest: jest.Mock<any, any>
    };
    let mockContractAbstraction: any = {};
    let mockContext: any = {};
    
    const httpHandler = new HttpHandler();

	beforeEach(() => {
		mockHttpBackend = {
            createRequest: jest.fn()
        };
        
        httpHandler['httpBackend'] = mockHttpBackend as any;
    })

	it('Should return a string representing the metadata fetched by the httpBackend', async (done) => {
        mockHttpBackend.createRequest.mockResolvedValue(`{ "name": "Taquito test" }`);
        const tzip16Uri = {
            sha256hash: undefined,
            protocol: 'https',
            location: '//storage.googleapis.com/tzip-16/emoji-in-metadata.json'
        }
        const metadata = await httpHandler.getMetadata(mockContractAbstraction, tzip16Uri, mockContext)
		
		expect(metadata).toEqual(`{ "name": "Taquito test" }`);
		done();
	});
});