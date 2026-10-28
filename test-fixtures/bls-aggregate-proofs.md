# Aggregate BLS proof fixtures

Generated independently with Octez 25.3, build e5d8a6b8. These two secret keys were already public Taquito test fixtures. Never fund or reuse them for an account.

The provenance file records the exact command arguments, outputs and exit status. Every command uses one fresh local mockup through the common options. No node, funded account or transaction was used. Raw signature bytes and generic-signature strings were decoded and encoded independently with Python base58 2.1.1.

Both original self proofs are checked before the keys are aggregated. Each member then creates a POP-domain proof over the raw aggregate key. Octez checks the resulting aggregate proof. Aggregating the original self proofs fails because their messages differ.

Octez accepts the canonical point-at-infinity encoding as an override input. That parser control is not a recommendation to use it as an account. The order-three point, invalid compression and noncanonical encoding are rejected. The implementation matches these parser cases without changing old key parsing.

Source contract: https://gitlab.com/tezos/tezos/-/blob/octez-v25.3/src/lib_shell_services/bls_services.ml
