# Installed package consumers

These checks install built Taquito tarballs outside the workspace. They cover
public big-map methods, core and HTTP-utils compatibility, and Beacon wallet
imports and declarations during the module migration in
[#3345](https://github.com/ecadlabs/taquito/issues/3345). The core and HTTP-utils
pilot emits CommonJS modules, a native ESM bridge, declarations and a browser ESM
bundle. These two packages no longer emit UMD.

Browser bundlers resolve the `browser` condition before `require` or `import`, so
they receive the ESM bundle even for CommonJS input. Node selects `dist/lib` for
`require` and the native `.mjs` bridge for `import`. Both Node routes share the
same exported instances.

Removing these UMD files is breaking for script-tag consumers. The remaining
per-package Sapling, signer, utils and TZIP-12 UMD files depend on a core global
whose UMD build is removed by this pilot. Use package imports through a bundler
or the standalone Webpack bundles. The bundle guide describes those standalone
outputs, which are separate from the per-package UMD files.

Run on Linux, WSL or macOS. From the repository root:

```sh
npm ci
npm run build
npx playwright install --with-deps chromium # on macOS, omit --with-deps
npm run test:consumers
```

Build all packages because the big-map fixtures also use the SDK, RPC and encoder
packages. On Linux or WSL, `--with-deps` installs Chromium and its system
libraries and may request administrator access; on macOS, run
`npx playwright install chromium` without `--with-deps`. Rebuild after source or
manifest changes.

`scripts/test-installed-consumers.mjs` discovers the root `*.runtime.mjs`,
`*.types.ts` and `browser/*.js` fixtures here. It packs the packages they name and their workspace
dependencies, then installs them together in one temporary consumer. Resolution
checks require each package to come from that installation. The core/HTTP fixture
also checks that HTTP-utils resolves the consumer's copy of core.

Runtime fixtures export an async function that receives `assert`, `load` and
`mode`. The runner executes each fixture once with CommonJS `require` and once
with native ESM `import`. Import mode supplies the module namespace. The core/HTTP
fixture checks mixed-module constructor identity and the current CJS default
export. It runs a real local HTTP 404 request in each mode, without repeating the
request for mixed import combinations.

Declaration fixtures compile under strict NodeNext CJS, NodeNext ESM and bundler
resolution in a separate TypeScript program for each fixture, each with explicit `types: []` and `types: ["node"]`. Chrome types
required by Beacon must come from its published declarations and dependencies.
Separate root and `/types` fixtures prevent either entrypoint from supplying the
other's Chrome type reference.
The core/HTTP fixture includes invalid calls that must remain type
errors. The existing big-map fixtures retain custom-provider compatibility and
public result checks. The Sapling constructor fixture checks omitted, preserve
and randomized output order, and requires an unknown policy to remain a type
error. The root `typecheck:tests` command also checks that same fixture through
source aliases. The Sapling runtime fixture checks constructor creation and the
exported validation error through CommonJS and native ESM. It does not generate proofs,
load proving parameters or submit transactions. The builder fixture accepts native byte arrays as bound data. The browser fixture checks that importing Sapling leaves the global Buffer absent.

The runner also builds `browser/` with Vite and executes the result in Chromium
using the same installed tarballs. The build verifies that the core and HTTP-utils
`module` files participate without source aliases. The browser fixture checks
public errors, cross-package inheritance and Beacon wallet root/types exports. It
requires both Beacon paths to use their existing ESM files. Node runtime fixtures
load the Beacon root/types paths with default globals in require and native import
modes and compare their named exports. The Beacon fixtures do not construct a
wallet or perform wallet operations. The browser fixture does not perform HTTP transport.

Each child process has a three-minute timeout. HTTP and browser waits have shorter
timeouts. Servers, Chromium and temporary files are closed or removed after
ordinary success or failure. Forced termination can prevent cleanup.

The install can access the registry for transitive dependencies. It is not an
offline test. Set `TAQUITO_PACKAGE_REPORT_DIR` to retain the consumer lockfile and
provenance JSON, including Node and TypeScript versions, tarball hashes and
dependency records. CI uploads these files for Node 22, 24 and 26. The lockfile records
temporary tarball paths and is an audit record, not a standalone install recipe.

## Later migration steps

The native ESM default-export identity and browser `module` routes are checked
through the pilot. Apply the same compatibility checks when defining the exports
of other packages. The runtime fixtures exercise package roots; the pilot also
retains package metadata and existing compatible `dist` subpaths.

The Beacon wallet Node conditions currently use its existing UMD/CJS files. When
those outputs are removed, update the Node targets together with the require
targets. Browser imports retain the existing ESM routes.

Core and HTTP-utils now point `main` and `require` at `dist/lib`, route native
ESM imports through a generated `.mjs` bridge, and keep browser imports on their
ESM bundles. The bridge preserves CommonJS default/named export identity. Their
existing `dist` subpaths and package metadata remain accessible.

Their `start` commands use Rollup watch to update CommonJS, native ESM, browser
ESM and declarations in the same build. Extend the pattern to other packages
and remove obsolete CDN and Webpack tooling separately.

Browser globals, other browser engines, older TypeScript versions and the minimum
Node 22.0.0 runtime are outside this increment. No funded network operation is
needed for these package checks.
