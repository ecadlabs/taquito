import { SignatureToken } from '../../src/tokens/signature';

describe('Signature token', () => {
    let token: SignatureToken;
    beforeEach(() => {
        token = new SignatureToken({ prim: 'signature', args: [], annots: [] }, 0, null as any);
    });

    describe('Execute', () => {
        it('Should transform Michelson signature data to js', () => {
            expect(token.Execute({ "string": "sigb1FKPeiRgPApxqBMpyBSMpwgnbzhaMcqQcTVwMz82MSzNLBrmRUuVZVgWTBFGcoWQcjTyhfJaxjFtfvB6GGHkfwpxBkFd" })).toEqual('sigb1FKPeiRgPApxqBMpyBSMpwgnbzhaMcqQcTVwMz82MSzNLBrmRUuVZVgWTBFGcoWQcjTyhfJaxjFtfvB6GGHkfwpxBkFd');
        });
    });

    describe('ToKey', () => {
        it('Should transform Michelson signature data to js', () => {
            expect(token.ToKey({ "string": "sigb1FKPeiRgPApxqBMpyBSMpwgnbzhaMcqQcTVwMz82MSzNLBrmRUuVZVgWTBFGcoWQcjTyhfJaxjFtfvB6GGHkfwpxBkFd" })).toEqual('sigb1FKPeiRgPApxqBMpyBSMpwgnbzhaMcqQcTVwMz82MSzNLBrmRUuVZVgWTBFGcoWQcjTyhfJaxjFtfvB6GGHkfwpxBkFd');
        });
    });

    describe('ToBigMapKey', () => {
        it('Should transform signature to a Michelson big map key', () => {
            expect(token.ToBigMapKey("sigb1FKPeiRgPApxqBMpyBSMpwgnbzhaMcqQcTVwMz82MSzNLBrmRUuVZVgWTBFGcoWQcjTyhfJaxjFtfvB6GGHkfwpxBkFd")).toEqual({
                key: { string: 'sigb1FKPeiRgPApxqBMpyBSMpwgnbzhaMcqQcTVwMz82MSzNLBrmRUuVZVgWTBFGcoWQcjTyhfJaxjFtfvB6GGHkfwpxBkFd' },
                type: { prim: 'signature' }
            });
        });
    });

    describe('Compare', () => {
        it('Should compare signature properly', () => {
            expect(token.compare('edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg', 'edsigteqgHGYbzsxxFmQjGSf9eeNjTML4g6GBqryKvy7uy6y2XczT6C3ehhfzCBgQBdAMy9NLoD6MZVzCUbtSUoSC1iWAgPXGdW')).toEqual(1);
            expect(token.compare('edsigteqgHGYbzsxxFmQjGSf9eeNjTML4g6GBqryKvy7uy6y2XczT6C3ehhfzCBgQBdAMy9NLoD6MZVzCUbtSUoSC1iWAgPXGdW', 'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg')).toEqual(-1);
        });
    });
});
