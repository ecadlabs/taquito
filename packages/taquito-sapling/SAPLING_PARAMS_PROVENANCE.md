## Sapling Parameter Provenance

The `saplingSpendParams.js` and `saplingOutputParams.js` files in this package are vendored copies of the Sapling proving parameters distributed by the Zcash project.

Source:
- `https://download.z.cash/downloads/sapling-spend.params`
- `https://download.z.cash/downloads/sapling-output.params`

Verification data:
- `sapling-spend.params`
  - Size: `47,958,396` bytes
  - SHA-256: `8e48ffd23abb3a5fd9c5589204f32d9c31285a04b78096ba40a79b75677efc13`
- `sapling-output.params`
  - Size: `3,592,860` bytes
  - SHA-256: `2f0ebbcbb9bb0bcffe95a397e7eba89c29eb4dde6191c339db88570e3f3fb0e4`

Why these files are vendored:
- `@taquito/sapling` previously fetched them during `postinstall`, which made installs network-dependent.
- Vendoring keeps published packages self-contained and makes builds reproducible.
- These parameters are treated as fixed trusted setup artifacts, not routine updatable assets.

Maintainer note:
- `fetch-sapling-params.js` is retained only as a repo-maintenance helper to regenerate the vendored wrapper files from the exact raw parameter files above.
- Any regeneration should be exceptional, manually reviewed, and accompanied by explicit provenance updates in this file.
