import { BLSKey } from '../src/bls-key';

describe('BLS', () => {
    it('should decode the secret key (tezos uses little endian format)', async () => {
        const signer = new BLSKey('BLsk2jjZe6wQH9TwtBzJwL7xLePfEgUxsV6BfwDP8dGfsosgnekSgC');
        expect(await signer.publicKey()).toEqual('BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt');
        expect(await signer.publicKeyHash()).toEqual('tz4AQcKaQU1sUzsmPTX43qnK4ddkCeeknJnf');
    });
});