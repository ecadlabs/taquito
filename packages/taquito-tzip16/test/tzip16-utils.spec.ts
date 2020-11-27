import {
    bytes2Char,
    char2Bytes
} from '../src/utils';

/**
 * Tzip16 utils test
 */

describe('Tzip16 utils functions', () => {

    it('Test1: Should convert a string of char to a string of bytes, and convert it back to the same string of char', () => {
        const charString = 'tezos-storage:contents';
        const bytes = '74657a6f732d73746f726167653a636f6e74656e7473';

        expect(char2Bytes(charString)).toEqual(bytes);
        expect(bytes2Char(bytes)).toEqual(charString);
    });

    it('Test2: Should convert a string of char to a string of bytes, and convert it back to the same string of char', () => {
        const charString = 'tezos-storage:here';
        const bytes = '74657a6f732d73746f726167653a68657265';

        expect(char2Bytes(charString)).toEqual(bytes);
        expect(bytes2Char(bytes)).toEqual(charString);
    });

    it('Test3: Should convert a string of char to a string of bytes, and convert it back to the same string of char', () => {
        const charString = `{"version":"tzcomet-example v0.0.42"}`;
        const bytes = '7b2276657273696f6e223a22747a636f6d65742d6578616d706c652076302e302e3432227d';

        expect(char2Bytes(charString)).toEqual(bytes);
        expect(bytes2Char(bytes)).toEqual(charString);
    });
});

