# BLS shell RPC integration tests

Run from the repository root against an Octez node that exposes the BLS shell RPCs:

```sh
TAQUITO_BLS_RPC=https://rpc.shadownet.teztnets.com npx vitest run --config integration-tests/bls/vitest.config.ts
```

These endpoints perform cryptographic computations. The suite uses no account,
secret key, keygen service, signer or transaction. The explicit endpoint prevents
an accidental public-network dependency in ordinary package tests. Missing endpoint
configuration fails rather than silently skipping the suite.

The five BLS RpcClient methods are aggregateProofs, aggregatePublicKeys,
aggregateSignatures, checkProof and thresholdSignatures. RpcClientCache forwards
them without caching request bodies. Messages are unprefixed hex bytes and keys,
proofs and signatures are Base58Check strings. Aggregate results may be null and
proof checks may be false. Malformed values can instead produce an HTTP error.
Threshold share IDs use the RPC's signed int8 encoding, from -128 through 127;
the node validates that bound.

The new methods are required on RpcClientInterface. External custom implementations
of that interface must add them. Existing client methods and cache policies are
unchanged. See test-fixtures/bls-rpc.md and test-fixtures/bls-aggregate-proofs.md
for the independent Octez vector provenance.
