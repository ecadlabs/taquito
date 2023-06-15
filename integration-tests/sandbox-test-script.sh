#!/bin/sh

flextesa_docker_image='oxheadalpha/flextesa:latest'
name='nairobibox'

docker rm -f "$name"

docker run \
  --name "$name" \
  --detach \
  -p 20000:20000 \
  "$flextesa_docker_image" \
  flextesa mini-net \
    --root /tmp/mini-box \
    --size 1 \
    --set-history-mode N000:archive \
    --number-of-bootstrap-accounts 1 \
     --balance-of-bootstrap-accounts tez:100_000_000 \
    --time-b 2 \
    --add-bootstrap-account alice,edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn,tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb,unencrypted:edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq@2_000_000_000_000 \
    --add-bootstrap-account bob,edpkurPsQ8eUApnLUJ9ZPDvu98E8VNj4KtJa1aZr16Cr5ow5VHKnz4,tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6,unencrypted:edsk3RFfvaFaxbHx8BMtEW1rKQcPtDML3LXjNqMNLCzC3wLC1bWbAt@2_000_000_000_000 \
    --add-bootstrap-account charlie,edpkuvMuRuZ6ZbAquJH1XxBFfUmuBFz1zp9ENEqjCVgLp3NcY3Ww9M,tz1RDVcKmFcqzvTpJirvg4JaUVgZbjtnRT26,unencrypted:edsk3RgWvbKKA1atEUcaGwivge7QtckHkTL9nQJUXQKY5r8WKp4pF4@2_000_000_000_000 \
    --add-bootstrap-account donald,edpkvXGp1BMZxHkwg3mKnWfJYS6HTJ5JtufD8YXxLtH8UKqLZkZVun,tz1eSWp4B9s1qhtNMMNXAkaf2oqCnDHd2iAm,unencrypted:edsk3S8mG2sSBmSRbikAcZVLCz4SrCq4DjmsQRic6MGktqNFijfrS2@2_000_000_000_000 \
    --no-daemons-for=donald \
    --until-level=2_000_000 \
    --protocol-kind Nairobi \

export RUN_NAIROBINET_WITH_SECRET_KEY=true &&
export SECRET_KEY=edsk3S8mG2sSBmSRbikAcZVLCz4SrCq4DjmsQRic6MGktqNFijfrS2 &&
export TEZOS_RPC_NAIROBINET=http://localhost:20000 &&
export POLLING_INTERVAL_MILLISECONDS=100 &&
export RPC_CACHE_MILLISECONDS=0 &&
export TEZOS_BAKER=tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb &&
npm run test:originate-known-contracts &&
npm run test:nairobinet-secret-key -- --testPathIgnorePatterns ledger-signer-failing-tests.spec.ts ledger-signer.spec.ts contract-estimation-tests.spec.ts rpc-get-protocol-constants.spec.ts sandbox-ballot-operation.spec.ts

export RUN_NAIROBINET_WITH_SECRET_KEY=true &&
export SECRET_KEY=edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq &&
export TEZOS_RPC_NAIROBINET=http://localhost:20000 &&
export POLLING_INTERVAL_MILLISECONDS=100 &&
export RPC_CACHE_MILLISECONDS=0 &&
export TEZOS_BAKER=tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb &&
npm run test:nairobinet-secret-key sandbox-ballot-operation.spec.ts
