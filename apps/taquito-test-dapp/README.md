# Taquito Test dApp

![Built with Taquito][logo]

A minimal end-to-end testing setup for developing Tezos DApps with Taquito and Beacon to manage signing and wallet operations.
## Getting Started
#### Initial setup:
1. Clone the Taquito repository: `git clone git@github.com:ecadlabs/taquito.git`
1. Change your current working directory to the newly cloned repository.
1. Install dependencies: `npm i`
1. Build Taquito: `npm run build`
1. Change your current working directory to `apps/taquito-test-dapp`.
1. Start development or production server as shown below.

#### Start development server:
1. `npm run dev`
1. Open http://localhost:3030 in your browser to see a sample application.

#### Start production server:
1. `npm run build && npm run preview`
1. Open http://localhost:4173 in your browser to see a preview application.
