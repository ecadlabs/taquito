# Browser tests

The existing Vite app loads the built Taquito ESM artifacts. Playwright runs the
package smoke scenarios and HTTP behavior tests in real browsers.

Use Node.js 22 or later and install the workspace dependencies with `npm ci`.
Install Chrome with `npx playwright install chrome` if it is not already present.
Install the other browsers and Linux libraries with:

```sh
npx playwright install --with-deps firefox webkit
```

Run the HTTP tests in Chrome, Firefox, and WebKit:

```sh
npm run test:browser:http
```

This command builds the packages and checks their ESM imports first. After a build,
run one browser without rebuilding:

```sh
npx playwright test --config browser-tests/playwright.config.ts browser-tests/tests/http-backend.spec.ts --project=firefox
```

`npm run test:browser:packages` runs all browser tests in Chrome. CI also runs the
HTTP tests in Firefox and WebKit.

The HTTP tests use a separate loopback server for each test. They check requests,
headers, response errors, timeouts, retries, and CORS without a public RPC endpoint.
The browser page checks that Node globals are absent before and after import.

Some browsers replay a dropped connection within one native fetch call, including
POST requests. The page counts calls through a transparent wrapper around native
fetch. It does not replace responses or errors. Recovery tests keep the server
unavailable until the browser reports a failed request, so success requires a
Taquito retry. Request records separately verify the bytes sent to the server.
Server sockets close at test teardown.
