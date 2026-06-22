#!/usr/bin/env bash
set -euo pipefail

if [[ -n "${TAQUITO_KEYGEN_URL:-}" ]]; then
  keygen_url="$TAQUITO_KEYGEN_URL"
elif [[ "${GITHUB_ACTIONS:-}" == "true" ]]; then
  keygen_url="http://keygen-direct.ecadinfra.com"
else
  keygen_url="https://keygen.ecadinfra.com"
fi
keygen_url="${keygen_url%/}"
auth_header="${TAQUITO_KEYGEN_AUTH_HEADER:-Authorization: Bearer taquito-example}"
networks="${TAQUITO_KEYGEN_NETWORKS:-shadownet}"
payload='{"require_unrevealed":false,"key_prefixes":["tz1"],"max_selection_attempts":1,"min_balance_mutez":1}'

connect_timeout_seconds="${TAQUITO_KEYGEN_PREFLIGHT_CONNECT_TIMEOUT_SECONDS:-5}"
max_time_seconds="${TAQUITO_KEYGEN_PREFLIGHT_MAX_TIME_SECONDS:-20}"
max_attempts="${TAQUITO_KEYGEN_PREFLIGHT_MAX_ATTEMPTS:-3}"

for network in $networks; do
  probe_url="${keygen_url}/v2/${network}"
  response_file="/tmp/keygen_preflight_response_${network}.txt"

  printf 'Keygen preflight: probing %s\n' "$probe_url"

  status_code=""
  for attempt in $(seq 1 "$max_attempts"); do
    status_code="$({
      curl \
        --silent \
        --show-error \
        --output "$response_file" \
        --write-out '%{http_code}' \
        --connect-timeout "$connect_timeout_seconds" \
        --max-time "$max_time_seconds" \
        --request POST \
        --header 'Content-Type: application/json' \
        --header "$auth_header" \
        --data "$payload" \
        "$probe_url"
    } || true)"

    if [[ "$status_code" =~ ^[2][0-9][0-9]$ ]]; then
      break
    fi

    echo "Keygen preflight attempt ${attempt}/${max_attempts} for ${network} returned HTTP ${status_code}"
    if [[ "$attempt" -lt "$max_attempts" ]]; then
      sleep 5
    fi
  done

  if [[ "$status_code" == "000" ]]; then
    echo "Keygen preflight failed: network/DNS/connectivity issue while reaching $probe_url"
    exit 1
  fi

  if [[ ! "$status_code" =~ ^[2][0-9][0-9]$ ]]; then
    echo "Keygen preflight failed: unexpected HTTP $status_code from $probe_url"
    echo "Response snippet:"
    sed -n '1,40p' "$response_file" || true
    exit 1
  fi

  echo "Keygen preflight passed: HTTP $status_code from $probe_url"
  rm -f "$response_file"
done
