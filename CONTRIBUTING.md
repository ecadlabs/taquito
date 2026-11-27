# Contributions

Please use the [GitHub issue tracker](https://github.com/ecadlabs/taquito/issues) to report bugs or request features.

To contribute, please check the issue tracker to see if an existing issue exists for your planned contribution. If there's no issue, please create one first, and then submit a pull request with your contribution.

For a contribution to be merged, it is required to have complete documentation, come with unit tests, and integration tests where appropriate. Submitting a "work in progress" pull request for review/feedback is always welcome!


## Lint

Run `npm run lint` for workspaces with a lint script and `npm run lint:tooling`
for the shared Vitest configuration and the browser test runner configuration.
CI runs both commands. Errors fail the checks. Warnings are advisory.

To inspect a file's active rules, use `npx eslint --print-config <file>`.
The root workspace command skips workspaces without a lint script, including
the examples and integration tests. The website is a separate project. The
shared flat config lists the generated files and Rollup configs it ignores.
