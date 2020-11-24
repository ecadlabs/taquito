import { MissingRefError } from "ajv/dist/compile/error_classes";
import { doesNotMatch, fail } from "assert";
import { MetaDataManager } from "../src/tzip16";
import { example005 } from "../test/data";


const mgr = new MetaDataManager();

// Validation
describe('metadata-validation', () => {
    it('should validate empty JSON as valid metadata JSON', (done) => {
        if (mgr.isValidMetadata(JSON.parse("{}"))) {
            done();
        } else {
            fail();
        }
    });
    it('should validate example005 of the spec', (done) => {
        const mgr = new MetaDataManager();
        if (mgr.isValidMetadata(JSON.parse(JSON.stringify(example005)))) {
            done();
        } else {
            fail();
        }
    });
});

describe('metadataURI-validation', () => {
    it('should validate https://example.com ', (done) => {
        if (mgr.isValidMetadataURI("https://example.com")) {
            done();
        } else {
            fail();
        }
    })
    it('should fail https://', (done) => {
        if (mgr.isValidMetadataURI("https://")) {
            fail();
        } else {
            done();
        }
    })
    // it('should validate ipfs ', (done) => {
    //     if (mgr.IsValidMetadataURI("ipfs://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/wiki/Vincent_van_Gogh.html")) {
    //         done();
    //     } else {
    //         fail();
    //     }
    // })
    it('should validate tezos-storage:here ', (done) => {
        if (mgr.isValidMetadataURI("tezos-storage:here")) {
            done();
        } else {
            fail();
        }
    })
    it('should validate complex tezos-storage uri ', (done) => {
        if (mgr.isValidMetadataURI("tezos-storage://KT1QDFEu8JijYbsJqzoXq7mKvfaQQamHD1kX/foo")) {
            done();
        } else {
            fail();
        }
    })
    it('should get info on complex tezos-storage uri', () => {
        expect(mgr.validateTezosStorage("tezos-storage://KT1QDFEu8JijYbsJqzoXq7mKvfaQQamHD1kX/foo")).toMatchObject(
            {
                host: 'KT1QDFEu8JijYbsJqzoXq7mKvfaQQamHD1kX',
                network: undefined,
                path: 'foo'
            }
        )
    })
    it('should get info on percent-encoded tezos-storage uri', () => {
        expect(mgr.validateTezosStorage("tezos-storage://KT1QDFEu8JijYbsJqzoXq7mKvfaQQamHD1kX/%2Ffoo")).toMatchObject(
            {
                host: 'KT1QDFEu8JijYbsJqzoXq7mKvfaQQamHD1kX',
                network: undefined,
                path: '%2Ffoo'
            }
        )
    })
    it('should successfuly throw on complex tezos-storage', () => {
        expect(() => { mgr.validateTezosStorage("tezos-storage://KT1QDFEu8JijYbsJqzoXq7mKvfaQQamHD1kX/foo/bar") })
            .toThrow("invalid key, slashes must be percent-encoded");
    })
    
});