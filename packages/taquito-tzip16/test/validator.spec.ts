import { Validator } from "../src/URIHandlers/validator";
import { tzip16spec } from "../assets/proposals_tzip-16_metadata-schema"

const validator: Validator = new Validator();


describe('validatorTests', () => {
    it('Test1: validates valid uris', () => {
        expect(validator.isValidUrl('http://example.com')).toBeTruthy();
        expect(validator.isValidUrl('https://example.com')).toBeTruthy();
    });

    it('Test2: fails ivalid uri', () => {
        expect(validator.isValidUrl('')).toBeFalsy();
    });

    it('validates JSON with schema', () => {
        const metadataJSON = { name: 'test' }
        const _schema = JSON.parse(JSON.stringify(tzip16spec));
        _schema["$id"] = "http://json-schema.org/draft-04/schema#";
        expect(validator['isJsonValidWithSchema'](metadataJSON, _schema)).toBeTruthy();
    })

    it('invalid metadataJSON with schema', () => {
        const metadataJSON = { test: 'test' }
        const _schema = JSON.parse(JSON.stringify(tzip16spec));
        _schema["$id"] = "http://json-schema.org/draft-04/schema#";
        expect(validator['isJsonValidWithSchema'](metadataJSON, _schema)).toBeTruthy();
    })
    it('Extract host, network and path from uri', () => {
        expect(validator.validateTezosStorage('tezos-storage://KT1RF4nXUitQb2G8TE5H9zApatxeKLtQymtg/here')).toMatchObject(
            {
                host: 'KT1RF4nXUitQb2G8TE5H9zApatxeKLtQymtg',
                network: undefined,
                path: 'here'
            });
    });
    it('Extract host, network and path from uri', () => {
        expect(validator.validateTezosStorage('tezos-storage:hello%2Fworld')).toMatchObject(
            {
                host: undefined,
                network: undefined,
                path: 'hello%2Fworld'
            });
    });

    
})