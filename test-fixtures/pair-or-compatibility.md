# Pair/or compatibility fixtures

These cases characterize upstream main at `8c340feb277cd6db9518835f8b05909d90989589` for issue #2931. They do not define a new mapping policy or complete the issue's specification work.

The object and schema literals in `pair-or-compatibility.ts` were worked through using the numbering behavior introduced by PR #2929, then checked through public Schema and ParameterSchema methods on unchanged production code. They are not generated from the encoder under test. The cases cover both branches of pair inside or inside pair, named fields preceding unnamed comb-pair fields, and mixed names inside an annotated branch.

Legacy preserves offsets across composite boundaries. ResetFieldNumbersInNestedObjects restarts numbering at those boundaries. Latest currently matches the reset strategy. Named fields still occupy positions. The tests restore the global strategy after each test and must remain sequential.

## Independent packed bytes

The packed literals were obtained with Octez 25.3, build `e5d8a6b8`, using a local Tallinn mockup on 20 October 2026. No node, signing, or transaction is required. Use a fresh base directory:

```sh
octez-client --base-dir /tmp/pair-or-fixtures --mode mockup --protocol PtTALLiNtPec create mockup

octez-client --base-dir /tmp/pair-or-fixtures --mode mockup hash data \
  'Pair "h" (Left (Pair "a" "b"))' \
  of type 'pair string (or (pair string string) (pair string string))'

octez-client --base-dir /tmp/pair-or-fixtures --mode mockup hash data \
  'Pair "h" (Right (Pair "a" "b"))' \
  of type 'pair string (or (pair string string) (pair string string))'

octez-client --base-dir /tmp/pair-or-fixtures --mode mockup hash data \
  'Pair "a" "b" "c" "d"' \
  of type 'pair (string %first) (string %second) string string'

octez-client --base-dir /tmp/pair-or-fixtures --mode mockup hash data \
  'Pair "h" (Left (Pair "a" "b"))' \
  of type 'pair (string %header) (or %choice (pair %transfer (string %label) string) (string %cancel))'

octez-client --base-dir /tmp/pair-or-fixtures --mode mockup hash data \
  'Pair "h" (Right "x")' \
  of type 'pair (string %header) (or %choice (pair %transfer (string %label) string) (string %cancel))'
```

Each `Raw packed data` result, without its `0x` prefix, is stored in the fixture. The contract tests pack the actual `methodsObject.default(...).toTransferParams()` output. They compare both Micheline and bytes independently. The comb input has four arguments; its expected encoder output uses nested binary pairs. Octez produces the same packed value for those equivalent forms.

## Deliberate limits

These are five examples across three strategy names, not a generated mapping specification or an exhaustive proof. They do not test full operation forging, hashes or signatures.

Numeric annotation collisions need a separate specification decision. For `pair (string %1) string`, both fields map to key `1`, and the later decoded value replaces the earlier one. Re-encoding cannot recover the lost value. This lossy case is excluded from these lossless compatibility fixtures; changing or formally endorsing that behavior is outside this contribution.

Related: https://github.com/ecadlabs/taquito/issues/2931 and https://github.com/ecadlabs/taquito/pull/2929.
