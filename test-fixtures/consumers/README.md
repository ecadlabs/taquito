# Installed package consumers

These checks install built Taquito tarballs outside the workspace. They cover
public big-map methods and the core and HTTP-utils package compatibility needed
before the module migration in [#3345](https://github.com/ecadlabs/taquito/issues/3345).
They do not change package entrypoints or remove UMD builds.

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
resolution. The core/HTTP fixture includes invalid calls that must remain type
errors. The existing big-map fixtures retain custom-provider compatibility and
public result checks.

The runner also builds `browser/` with Vite and executes the result in Chromium
using the same installed tarballs. The build verifies that the core and HTTP-utils
`module` files participate without source aliases. The browser fixture checks
public errors and cross-package inheritance. It does not perform HTTP transport
or wallet operations.

Each child process has a three-minute timeout. HTTP and browser waits have shorter
timeouts. Servers, Chromium and temporary files are closed or removed after
ordinary success or failure. Forced termination can prevent cleanup.

The install can access the registry for transitive dependencies. It is not an
offline test. Set `TAQUITO_PACKAGE_REPORT_DIR` to retain the consumer lockfile and
provenance JSON, including Node and TypeScript versions, tarball hashes and
dependency records. CI uploads these files for Node 22 and 24. The lockfile records
temporary tarball paths and is an audit record, not a standalone install recipe.

## Later migration steps

The native ESM default-export identity and exact browser `module` routes record
current packaging. Agree default-export behavior and supported subpaths before
changing exports maps. These tests do not define every namespace export or bundle
filename as a permanent API, and they do not test direct `dist` or `package.json`
imports.

Next, pilot dedicated CJS, Node-valid ESM and explicit exports for core and
HTTP-utils, then remove their UMD output. Extend the agreed pattern to other
packages and remove obsolete CDN and Webpack tooling separately.

Browser globals, other browser engines, older TypeScript versions and the minimum
Node 22.0.0 runtime are outside this increment. No funded network operation is
needed for these package checks.
