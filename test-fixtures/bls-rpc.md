# BLS RPC vectors

The public constants in bls-rpc.ts were verified with Octez 25.3, build e5d8a6b8,
on 21 October 2026. They contain no secret key or secret shares. The public key and
proof come from the existing Taquito signer test fixture. The message is the four
bytes 00 01 02 03, represented as unprefixed hexadecimal in RPC requests.

Octez signed that message with the fixture key. A local Shamir split generated
three secret shares with threshold two. The first two signed shares are recorded
in the fixture. Octez independently reconstructed the original signature from
those shares. A public Shadownet RPC returned exactly the same Base58Check signature
for the aggregate and threshold requests. Tests compare these fixed outputs;
they do not generate expected signatures using Taquito.

To verify the committed public payloads without any secret material, create a
fresh Tallinn mockup with Octez 25.3, then pass the aggregate and threshold JSON
objects from bls-rpc.ts to these commands:

```sh
octez-client --base-dir /tmp/bls-rpc-check --mode mockup --protocol PtTALLiNtPec create mockup
octez-client --base-dir /tmp/bls-rpc-check --mode mockup --protocol PtTALLiNtPec aggregate bls signatures '<aggregate JSON>'
octez-client --base-dir /tmp/bls-rpc-check --mode mockup --protocol PtTALLiNtPec threshold bls signatures '<threshold JSON>'
```

Both commands must return the signature constant. The live suite checks proof
verification, singleton key aggregation and invalid-crypto responses as well.
These are RPC wire and result checks, not tests of operation forging or signing.

Sources:

- https://github.com/ecadlabs/taquito/issues/3166
- https://octez.tezos.com/docs/_static/rpc-openapi.html
- https://github.com/tezos/tezos-mirror/blob/master/src/lib_shell_services/bls_services.ml
- https://github.com/tezos/tezos-mirror/blob/master/src/lib_shell/bls_directory.ml
