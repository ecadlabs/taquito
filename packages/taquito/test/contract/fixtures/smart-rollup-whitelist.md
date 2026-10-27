# Smart rollup whitelist byte fixtures

`smart-rollup-whitelist.json` contains fixed unsigned operation bytes returned by
the Octez 25.3 forge RPC. These expectations were obtained outside Taquito.

The client version was `e5d8a6b8`, Octez 25.3. A fresh local mockup was created with
`--protocol PsUshuai`; its next protocol was
`PsUshuai9QapM5TGj1JpuVGkdxz5GykdnEvS6Rh8SUVrARvZLCY`.

```sh
octez-client --base-dir "$mockup" --mode mockup --protocol PsUshuai create mockup
octez-client --base-dir "$mockup" --mode mockup rpc post \
  /chains/main/blocks/head/helpers/forge/operations with "$(cat operation.json)"
```

The JSON fixture's `operation` is the complete public operation input. For private
input, add its `whitelist` array unchanged. For empty-list encoding, use `[]`.
For the mixed batch, use the private operation with counter `1`, followed by the
public operation with counter `2`. Use the fixture's `branch` in each request.

The unsorted private list covers tz5, tz2, tz4, tz1 and tz3 in that order. No source
sorting, filtering, or SDK codec was used to derive the expected bytes.

The kernel `00` is only an encoding fixture. These RPC calls do not establish a
valid deployable WASM kernel or successful origination. In particular, Octez can
forge an empty whitelist but rejects it when originating a rollup. Omission and
an empty array have different encodings. Explicit JSON null is rejected by the
forge RPC and is not part of the new TypeScript API.

Protocol semantics were checked against [Octez 25.3 operation encoding](https://github.com/tezos/tezos-mirror/blob/octez-v25.3/src/proto_025_PsUshuai/lib_protocol/operation_repr.ml)
and [rollup storage checks](https://github.com/tezos/tezos-mirror/blob/octez-v25.3/src/proto_025_PsUshuai/lib_protocol/sc_rollup_storage.ml).
