# Packed package consumers

These tests characterize the published core and HTTP-utils packages before the
module migration in [#3345](https://github.com/ecadlabs/taquito/issues/3345).
They do not change package entrypoints or remove UMD builds.

Run on Linux or WSL, as in the Ubuntu CI jobs. From the repository root:

```sh
npm ci
npx nx build @taquito/http-utils
npx playwright install chromium
npm run test:packages:consumers
```

The HTTP build includes core. The command packs the built packages and installs
both tarballs in a temporary directory outside the workspace. It checks that HTTP
and the consumer resolve the same installed core package. It then runs:

- CommonJS and native ESM public error and local HTTP response checks.
- Mixed require/import constructor identity and cross-package error inheritance.
- Strict declaration consumers with NodeNext CJS, NodeNext ESM and bundler
  resolution. Invalid calls check that declarations have not degraded to `any`.
- A Vite bundle built from installed packages, executed in Chromium. The build
  checks that both installed ESM module files participate, without source aliases.

The CommonJS default export exposed through native ESM is recorded as existing
behavior. These checks do not define every namespace export as a permanent API.

Each child process has a three-minute timeout. HTTP requests and browser waits
have shorter timeouts. Servers, browser instances and temporary files are closed
or removed after success or failure.

The install can access the registry for transitive dependencies. This is not an
offline test. The command prints runtime and compiler versions, tarball hashes,
and dependency lock records. Set `TAQUITO_PACKAGE_REPORT_DIR` to retain the
generated lockfile and provenance JSON. CI uploads them for each Node version.
The lockfile records temporary tarball locations, so it is an audit record,
not a standalone installation recipe after those files are removed.

CI runs on current Node 22 and 24. Local verification used Node 22.23.4 and
24.21.0 with TypeScript 6.0.3. The Node 22.0.0 floor was not tested. Before a later
entrypoint migration, verify its supported minimum runtime explicitly.

The fixtures pass against unchanged production code. Disposable-install checks
also confirmed failures for a missing main entry, missing module bundle, missing
declaration entry and a separate ESM error constructor. This establishes coverage
of those faults, not completion of the module migration.

Other packages, browser globals, legacy deep imports, other browser engines and
older TypeScript versions remain outside this first contribution. Keep these
checks when proposing the pilot migration, and review export restrictions and
mixed-module constructor identity before changing package routes.
