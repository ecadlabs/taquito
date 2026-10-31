# Local FA2.1 reference integration tests

These tests apply public Taquito contract parameters to a real Octez mockup.
Each case originates a fresh reference contract and checks actual views. They
use public bootstrap accounts in disposable local state. No network node, Docker,
external account or keygen service is needed.

With Octez 25.3 installed, run from the repository root:

```sh
OCTEZ_CLIENT=/absolute/path/to/octez-client npm run test:fa21:local
```

The binary defaults to octez-client on PATH. Explicit runs fail if the client is
missing. Each run removes only its own temporary directory in the afterAll hook.
No Octez binary or private account is stored in this contribution.

Cases cover owner transfer, allowance consumption and rejected overspend, operator
permission and revocation, allowance decrease to zero, unknown-token views, and a
real ticket export/import round trip. Export targets the same contract's import
entrypoint, so the recipient balance proves the internal import applied. Supply
must remain unchanged. A separate run_code call checks structured event payloads
through the public Schema decoder.

Mockup applies actual local operations and internal calls. It does not test
Taquito injection, real-node prevalidation, network transport or confirmation
polling. The normal integration test at `__tests__/contract/fa21.spec.ts` covers
public originate/send, confirmations, views, events and ticket import on a node.
Run it with the repository's existing configured test account and RPC:

```sh
cd integration-tests
npm run test:shadownet-secret-key -- __tests__/contract/fa21.spec.ts
```

That network test requires a funded test account and follows existing CONFIGS
setup. Do not use public bootstrap keys on public networks. The local mockup
success does not establish that this network test passed.

See test-fixtures/fa21/README.md for the pinned reference, its work-in-progress
status, schema differences and independent approve byte fixtures. These tests add
coverage against unchanged production code; they do not claim a production fix or
complete FA2.1 conformance.
