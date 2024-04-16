#!/bin/bash

tezbox_image="${1}"
protocol="${2}"
tezbox_name="${2}box"

docker run \
  --rm \
  --name "${tezbox_name}" \
  -d \
  -p 20000:20000 \
  "${tezbox_image}" \
  "${tezbox_name}"

sleep 40
docker exec "${tezbox_name}" octez-client rpc get chains/main/is_bootstrapped
