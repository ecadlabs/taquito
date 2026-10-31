# FA2.1 reference fixture

The compiled Michelson comes from Nomadic Labs' Archetype FA2.1 reference:
https://gitlab.com/nomadic-labs-free-resources/fa2.1/archetype-fa2.1

Pin: 42e985a6aee9fafff6f2592415c3e1ad2f0085d2, types/fa21.code.ts.
provenance.json records the exact source URL and SHA-256 values. reference.json is
the parsed code field, with compact JSON formatting and a trailing newline. No
contract instructions were changed. The original wrapper's Edo protocol label is
not a compatibility claim. The script was typechecked and executed with Octez 25.3
Tallinn in these tests. Its README declares MIT and marks the reference as work in
progress. No standalone LICENSE file was present at this pin.

TZIP-26 remains marked Submitted. This fixture is one reference implementation,
not proof that every FA2.1 implementation has identical behavior or annotations.
In particular, its import parameter uses tickets_to_import. The current standard
and reference exempt owners and operators from allowance consumption. The older
developer guide's claim that owners must approve themselves is not used here.
The Ligo reference's compiled allowance interface was older than this one.

entrypoints.json is a fixed Octez RPC response for this script. Object parameters
and expected Micheline in the package tests are written separately. packed.json
records two fixed approve values independently packed by Octez 25.3, build e5d8a6b8.
The tests pack actual public methodsObject output against those constants.

Reproduce each approve vector with a fresh Tallinn mockup and the recorded
Michelson data from packed.json:

```sh
octez-client --base-dir /tmp/fa21-pack --mode mockup --protocol PtTALLiNtPec create mockup
octez-client --base-dir /tmp/fa21-pack --mode mockup hash data '<recorded Michelson>' of type 'list (pair address address nat (or nat nat))'
```

Compare Raw packed data, without the 0x prefix, with the corresponding constant.
The export_ticket type contains contract values, which Octez rejects as PACK data.
Its checks therefore compare fixed Micheline and execute real export/import calls;
they do not claim an independent PACK fixture for that un-packable type.

Sources:

- https://github.com/ecadlabs/taquito/issues/3004
- https://github.com/trilitech/tezos-developer-docs/pull/422
- https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-26/tzip-26.md
