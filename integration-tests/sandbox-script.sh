#!/bin/bash

# Generate Flextesa bootstrap accounts
flextesa_image="${1}"
protocol="${2}"
flextesa_name="${2}box"

docker run \
  --rm \
  --name "${flextesa_name}" \
  --detach \
  -p 20000:20000 \
  "${flextesa_image}" \
  flextesa mini-net \
  --root /tmp/mini-box \
  --size 1 \
  --set-history-mode N000:archive \
  --number-of-b 1 \
  --balance-of-bootstrap-accounts tez:100_000_000 \
  --time-b 1 \
  --add-bootstrap-account alice,edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn,tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb,unencrypted:edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq@2_000_000_000_000 \
  --add-bootstrap-account bob,edpkurPsQ8eUApnLUJ9ZPDvu98E8VNj4KtJa1aZr16Cr5ow5VHKnz4,tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6,unencrypted:edsk3RFfvaFaxbHx8BMtEW1rKQcPtDML3LXjNqMNLCzC3wLC1bWbAt@2_000_000_000_000 \
  --add-bootstrap-account charlie,edpkuvMuRuZ6ZbAquJH1XxBFfUmuBFz1zp9ENEqjCVgLp3NcY3Ww9M,tz1RDVcKmFcqzvTpJirvg4JaUVgZbjtnRT26,unencrypted:edsk3RgWvbKKA1atEUcaGwivge7QtckHkTL9nQJUXQKY5r8WKp4pF4@2_000_000_000_000 \
  --add-bootstrap-account dave,edpkvXGp1BMZxHkwg3mKnWfJYS6HTJ5JtufD8YXxLtH8UKqLZkZVun,tz1eSWp4B9s1qhtNMMNXAkaf2oqCnDHd2iAm,unencrypted:edsk3S8mG2sSBmSRbikAcZVLCz4SrCq4DjmsQRic6MGktqNFijfrS2@2_000_000_000_000 \
  --no-daemons-for=dave \
  --until-level 200_000_000 \
  --protocol-kind "${protocol}"

sleep 3
docker exec "${flextesa_name}" octez-client rpc get chains/main/is_bootstrapped