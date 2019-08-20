# Tezos Typescript Library Suite

Work In Progress

This is a mono repository from which several npm packages are built and published.

## NPM scripts

- `npm run test`: Run tests
- `npm run build`: Generate bundles and typings, create docs
- `npm run lint`: Lints code
- `npm run example`: Run an example node js app that does a tour of all the functionality
- `npm run commit`: Commit using conventional commit style

## How to contribute

- Install lerna globally `npm install -g lerna`

- Run `npm install`
- Run `lerna bootstrap`
- Run `npm run build`

Once you modified any project run

- Run `npm run lint`
- Run `npm run test`
- In order to commit please use `npm run commit`

## Packages overview

| Package                    |                        Responsibility                         |
| -------------------------- | :-----------------------------------------------------------: |
| tezos-ts                   | Regroup every other library and provide higher level utility  |
| tezos-ts-react-components  |  Set of premade react components for interacting with Tezos   |
| tezos-ts-rpc               | RPC client library, wrap every rpc endpoint in its own method |
| tezos-ts-michelson-encoder | Encode/Decode storage and parameter to/from michelson format  |
