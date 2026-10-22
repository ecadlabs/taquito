# Detached operation fixtures

The TypeScript fixture files contain public data generated independently with Octez 25.3, build `e5d8a6b8`, dated 15 October 2026. Their types use `satisfies` and RPC operation kind constants. Conversion from the saved JSON source changes only the TypeScript representation, not the strings or numbers.

`detached-signing-vectors.ts` contains five transfer vectors. `detached-operation-vectors.ts` contains transfer, reveal and reveal-plus-transfer vectors for each of Ed25519, secp256k1, P-256, BLS and ML-DSA-44. Temporary mockup accounts generated these fixtures. No secret keys or funded accounts are included.

The first four schemes use Tallinn. ML-DSA uses Alpha because Tallinn rejects ML-DSA manager sources. Each vector records its protocol and branch. These fixtures establish byte and signature compatibility, not acceptance on every network.

Generation steps:

1. Create a fresh Octez mockup directory and generate an account of the chosen scheme.
2. Obtain its public key and hash. For BLS, create and verify its proof of possession with Octez.
3. Submit the fixed operation JSON to `/chains/main/blocks/head/helpers/forge/operations`.
4. Sign `0x03` followed by those unsigned bytes with `octez-client sign bytes ... for ...`. Check the returned signature with Octez.
5. Add the Base58 signature to the operation JSON and call `/chains/main/blocks/head/helpers/forge/signed_operations`. Store the complete returned bytes.
6. Compute the 32-byte digest with Python `hashlib.blake2b(bytes.fromhex(watermarkedBytes), digest_size=32)`.

The complete BLS operation includes `ff03` and a 96-byte signature. ML-DSA includes `ff04` and a 2420-byte signature. The other schemes append 64 bytes. Expected values must not be regenerated with the Taquito implementation under test.

The tests also exercise controlled local HTTP preapplication and injection. They do not send funded transactions, run a browser, or establish recovery from a real network outage.
