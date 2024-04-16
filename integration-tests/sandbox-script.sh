#!/bin/bash

# Generate Tezbox bootstrap accounts
tezbox_image="${1}"
protocol="${2}"
tezbox_name="${2}box"

export RUN_OXFORDNET_WITH_SECRET_KEY=true
export SECRET_KEY=edsk3RFfvaFaxbHx8BMtEW1rKQcPtDML3LXjNqMNLCzC3wLC1bWbAt
export TEZOS_RPC_OXFORDNET=http://localhost:20000
export POLLING_INTERVAL_MILLISECONDS=100
export RPC_CACHE_MILLISECONDS=0
export TEZOS_BAKER=tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb

docker run \
  --rm \
  --name "${tezbox_name}" \
  -d \
  -p 20000:20000 \
  "${tezbox_image}" \
  "${tezbox_name}"

sleep 40
docker exec "${tezbox_name}" octez-client rpc get chains/main/is_bootstrapped
