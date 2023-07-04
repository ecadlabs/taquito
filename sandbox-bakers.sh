#!/bin/bash

# Generate Flextesa bootstrap accounts
flextesa_docker_image="${1}"

# Set environment variables
export RUN_"${testnet_uppercase}"_WITH_SECRET_KEY=true
export SECRET_KEY="${secret_key}"
export TEZOS_RPC_"${testnet_uppercase}"="http://localhost:20000"
export POLLING_INTERVAL_MILLISECONDS=100
export RPC_CACHE_MILLISECONDS=0
export TEZOS_BAKER=tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb

alice=$(docker run --rm "${flextesa_docker_image}" flextesa key alice)
bob=$(docker run --rm "${flextesa_docker_image}" flextesa key bob)
charlie=$(docker run --rm "${flextesa_docker_image}" flextesa key charlie)
dave=$(docker run --rm "${flextesa_docker_image}" flextesa key dave)

export "alice=${alice}"
export "bob=${bob}"
export "charlie=${charlie}"
export "dave=${dave}"

# Provision Flextesa container
protocol="${2}"
testnet="${3}"
testnet_uppercase="${4}"
secret_key="edsk3S8mG2sSBmSRbikAcZVLCz4SrCq4DjmsQRic6MGktqNFijfrS2"

docker run \
  --rm \
  --name baking-sandbox \
  --detach \
  -p 20000:20000 \
  "${flextesa_docker_image}" \
  flextesa mini-net \
  --root /tmp/mini-box --size 1 \
  --set-history-mode N000:archive \
  --number-of-b 1 \
  --balance-of-bootstrap-accounts tez:100_000_000 \
  --time-b 1 \
  --add-bootstrap-account="${alice}@2_000_000_000_000" \
  --add-bootstrap-account="${bob}@2_000_000_000_000" \
  --add-bootstrap-account="${charlie}@2_000_000_000_000" \
  --add-bootstrap-account="${dave}@2_000_000_000_000" \
  --no-daemons-for=dave \
  --until-level 200_000_000 \
  --protocol-kind "${protocol}"