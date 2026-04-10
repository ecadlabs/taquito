The `saplingSpendParams.js` file in this package is a vendored copy of the Sapling spend proving parameters distributed by the Zcash project.

Source artifacts:

- Download base: `https://download.z.cash/downloads/`
- Spend parameters: `sapling-spend.params`

Pinned source metadata:

- `sapling-spend.params`
  - SHA-256: `8e48ffd23abb3a5fd9c5589204f32d9c31285a04b78096ba40a79b75677efc13`
  - Size: `47,958,396` bytes

Why this file is vendored:

- `@taquito/sapling` previously fetched proving parameters during `postinstall`, which made installs network-dependent.
- Keeping the spend params in a dedicated package preserves offline installs while keeping the main `@taquito/sapling` publish artifact below the registry size limit.
- `packages/taquito-sapling/fetch-sapling-params.js` is retained as a repo-maintenance helper to regenerate this wrapper file from the exact raw parameter file above.
