import { HTTPFetcher } from "../src/URIHandlers/httpHandler";
import { Validator } from "../src/URIHandlers/validator";
import { sha256 } from "../src/tzip16-utils";

describe('http tests', () => {
    let fetcher: HTTPFetcher;
    let validator: Validator;
    beforeAll((done) => {
        fetcher = new HTTPFetcher();
        validator = new Validator();
        done();
    })
    
    it('demonstrates the need for separate fetching required for hashing', async (done) => {
        const url = 'https://storage.googleapis.com/tzip-16/empty-metadata.json';
        const a = JSON.stringify(await fetcher.getMetadataHTTP(url));
        const b = JSON.stringify(await fetcher.getMetadataNonJSON(url));
        expect(sha256(a)).not.toMatch(sha256(b));
        done();
    })
})