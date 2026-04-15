## Sapling Parameter Provenance

Taquito now treats the Sapling proving parameters as immutable release artifacts served from the first-party host at `https://sapling.taquito.io`, not as vendored package payloads.

Original source:
- `https://download.z.cash/downloads/sapling-spend.params`
- `https://download.z.cash/downloads/sapling-output.params`

Hosted release paths:
- `https://sapling.taquito.io/params/groth16-mainnet-1/spend.params`
- `https://sapling.taquito.io/params/groth16-mainnet-1/output.params`
- `https://sapling.taquito.io/manifests/groth16-mainnet-1.json`

Pinned verification data:
- `sapling-spend.params`
  - Size: `47,958,396` bytes
  - SHA-256: `8e48ffd23abb3a5fd9c5589204f32d9c31285a04b78096ba40a79b75677efc13`
- `sapling-output.params`
  - Size: `3,592,860` bytes
  - SHA-256: `2f0ebbcbb9bb0bcffe95a397e7eba89c29eb4dde6191c339db88570e3f3fb0e4`

Release source of truth:
- the pinned manifest lives in `src/sapling-params-manifest.json`
- `src/sapling-params-loader.ts` imports that manifest for the default runtime URLs and digests
- `prepare-sapling-release-artifacts.js` emits the exact upload set for the current parameter version

Operational note:
- upload only immutable, versioned objects
- verify the public bytes against the pinned hashes after upload
- the Cloudflare rollout and verification steps are documented in `docs/infra/sapling-cloudflare-r2-rollout.md`
