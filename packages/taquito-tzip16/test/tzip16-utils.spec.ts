import {
    bytes2Char,
    char2Bytes
} from '../src/utils';

/**
 * Tzip16 utils test
 */

describe('Tzip16 utils functions', () => {

    it('Should convert bytes to char', () => {
        const bytes = '74657a6f732d73746f726167653a636f6e74656e7473';
        const bytesToChar = bytes2Char(bytes);
        expect(bytesToChar).toEqual(
            'tezos-storage:contents'
        );
    });

    it('Should convert bytes to char', () => {
        const bytes = '7b2276657273696f6e223a22747a636f6d65742d6578616d706c652076302e302e3432227d';
        const bytesToChar = bytes2Char(bytes);
        var obj = JSON.parse(bytesToChar);
        expect(obj).toEqual(
            {"version":"tzcomet-example v0.0.42"}
        );
    });

    it('Should convert bytes to char', () => {
        const bytes = '74657a6f732d73746f726167653a68657265';
        const bytesToChar = bytes2Char(bytes);
        expect(bytesToChar).toEqual(
            'tezos-storage:here'
        );
    });

    it('Should convert char to bytes', () => {
        const charString = 'tezos-storage:contents';
        const charToBytes = char2Bytes(charString);
        expect(charToBytes).toEqual(
            '74657a6f732d73746f726167653a636f6e74656e7473'
        );
    });

    it('Should convert char to bytes', () => {
        const charString = 'tezos-storage:here';
        const charToBytes = char2Bytes(charString);
        expect(charToBytes).toEqual(
            '74657a6f732d73746f726167653a68657265'
        );
    });

    it('Should convert char to bytes', () => {
        const charString = `{"version":"tzcomet-example v0.0.42"}`;
        const charToBytes = char2Bytes(charString);
        expect(charToBytes).toEqual(
            '7b2276657273696f6e223a22747a636f6d65742d6578616d706c652076302e302e3432227d'
        );
    });
});

