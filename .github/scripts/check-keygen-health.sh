#!/usr/bin/env bash
set -euo pipefail

keygen_url="${TAQUITO_KEYGEN_URL:-https://keygen.ecadinfra.com}"
keygen_url="${keygen_url%/}"
probe_url="${keygen_url}/v2/tallinnnet"
auth_header="${TAQUITO_KEYGEN_AUTH_HEADER:-Authorization: Bearer taquito-example}"

connect_timeout_seconds="${TAQUITO_KEYGEN_PREFLIGHT_CONNECT_TIMEOUT_SECONDS:-5}"
max_time_seconds="${TAQUITO_KEYGEN_PREFLIGHT_MAX_TIME_SECONDS:-20}"

printf 'Keygen preflight: probing %s\n' "$probe_url"

status_code="$({
  curl \
    --silent \
    --show-error \
    --output /tmp/keygen_preflight_response.txt \
    --write-out '%{http_code}' \
    --connect-timeout "$connect_timeout_seconds" \
    --max-time "$max_time_seconds" \
    --request POST \
    --header 'Content-Type: application/json' \
    --header "$auth_header" \
    --data '{' \
    "$probe_url"
} || true)"

if [[ "$status_code" == "000" ]]; then
  echo "Keygen preflight failed: network/DNS/connectivity issue while reaching $probe_url"
  exit 1
fi

if [[ "$status_code" =~ ^[5][0-9][0-9]$ ]]; then
  echo "Keygen preflight failed: server-side error HTTP $status_code from $probe_url"
  exit 1
fi

if [[ "$status_code" == "401" || "$status_code" == "403" || "$status_code" == "404" ]]; then
  echo "Keygen preflight failed: unexpected HTTP $status_code from $probe_url"
  echo "Response snippet:"
  sed -n '1,40p' /tmp/keygen_preflight_response.txt || true
  exit 1
fi

echo "Keygen preflight passed: HTTP $status_code from $probe_url"
