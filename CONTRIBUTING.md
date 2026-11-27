# Contributions

Please use the [GitHub issue tracker](https://github.com/ecadlabs/taquito/issues) to report bugs or request features.

To contribute, please check the issue tracker to see if an existing issue exists for your planned contribution. If there's no issue, please create one first, and then submit a pull request with your contribution.

For a contribution to be merged, it is required to have complete documentation, come with unit tests, and integration tests where appropriate. Submitting a "work in progress" pull request for review/feedback is always welcome!

## Promise lint audit

Run `npm run lint:audit:promises` from the repository root to check package
source and tests for floating promises and promises passed where a synchronous
callback is expected. The audit runs on demand. Use its warnings to track
follow-up fixes.
