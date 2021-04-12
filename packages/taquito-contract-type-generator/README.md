# Taquito Contract Type Generator

`@taquito/contract-type-generator` generates typescript types for a tezos contract.

See the top-level project [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) for details on reporting issues, contributing and versioning.

## Running

Run contract generator on every contract (.tz) in a folder `./example/contracts` and output types to another folder `./example/types`:

- `npx contract-type-generator --g ./example/contracts ./example/types`

## Cli Options

- `--types library`
    - Import strict contract type aliases from the taquito library
- `--types file`
    - Copy the strict contract type aliases to a file in the output directory
- `--types local`
    - Copy the strict contract type aliases to each generated contract
- `--types none`
    - Use simple typescript types with aliases defined in each generated contract


## Development

- Build Taquito
    - In repo root:
    - `npm run build`

- Generate Example Contract Types:
    - In this directory:
    - `npm run example`