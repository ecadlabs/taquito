#!/usr/bin/env bash
# Polls a Tezos RPC node's health for a bounded window and emits a JSONL
# timeline plus a human-readable verdict. Built to run alongside the shadownet
# integration tests in CI (which can take up to ~30 min) so RPC flakiness can be
# correlated with test failures after the fact. The node is public HTTPS, so
# this needs no tailnet access.
#
# All knobs are env-driven so it doubles as a local debugging tool:
#   RPC_URL=https://rpc.shadownet.teztnets.com \
#   POLL_MAX_DURATION_SECONDS=120 POLL_INTERVAL_SECONDS=10 \
#   bash .github/scripts/poll-rpc-health.sh
set -euo pipefail

rpc_url="${RPC_URL:-https://rpc.shadownet.teztnets.com}"
rpc_url="${rpc_url%/}"
interval_seconds="${POLL_INTERVAL_SECONDS:-15}"
# 31 min: a touch over the ~30 min integration-test ceiling so the timeline
# always covers the whole run rather than cutting off just before the end.
max_duration_seconds="${POLL_MAX_DURATION_SECONDS:-1860}"
connect_timeout_seconds="${POLL_CONNECT_TIMEOUT_SECONDS:-5}"
max_time_seconds="${POLL_MAX_TIME_SECONDS:-15}"
out_dir="${POLL_OUTPUT_DIR:-ci-metrics}"
out_file="${POLL_OUTPUT_FILE:-${out_dir}/rpc-health.jsonl}"
stop_when_run_jobs_complete="${POLL_STOP_WHEN_RUN_JOBS_COMPLETE:-false}"
stop_check_after_seconds="${POLL_STOP_CHECK_AFTER_SECONDS:-120}"
monitor_job_name_prefix="${POLL_MONITOR_JOB_NAME_PREFIX:-rpc-health-monitor-}"
github_api_url="${GITHUB_API_URL:-https://api.github.com}"
run_jobs_api_url="${POLL_RUN_JOBS_API_URL:-}"

mkdir -p "$(dirname "$out_file")"
: > "$out_file"

probe_url="${rpc_url}/chains/main/blocks/head/header"
start_epoch="$(date +%s)"
deadline=$((start_epoch + max_duration_seconds))

printf 'RPC health monitor: polling %s every %ss for up to %ss\n' \
  "$probe_url" "$interval_seconds" "$max_duration_seconds"

# Summarize on exit no matter how we leave the loop (deadline, SIGTERM when run
# as a background sidecar, etc.) so a killed monitor still leaves a verdict.
summarize() {
  if [ ! -s "$out_file" ]; then
    echo "RPC health monitor: no samples collected."
    return 0
  fi

  local summary
  summary="$(jq -s -r '
    (length) as $n
    | (map(select(.http_code != "200" or .level == null)) | length) as $errs
    | (map(select(.level != null) | .level)) as $levels
    | (map(select(.head_lag_s != null) | .head_lag_s)) as $lags
    | (map(.total_s)) as $totals
    | {
        samples: $n,
        errors: $errs,
        error_rate_pct: (if $n > 0 then (($errs / $n) * 100 | floor) else 0 end),
        first_level: ($levels | first),
        last_level: ($levels | last),
        levels_advanced: (if ($levels | length) > 1 then (($levels | last) - ($levels | first)) else 0 end),
        max_head_lag_s: ($lags | max),
        max_total_s: ($totals | max)
      }' "$out_file")"

  local samples errors error_rate first_level last_level advanced max_lag max_total
  samples="$(jq -r '.samples' <<<"$summary")"
  errors="$(jq -r '.errors' <<<"$summary")"
  error_rate="$(jq -r '.error_rate_pct' <<<"$summary")"
  first_level="$(jq -r '.first_level // "n/a"' <<<"$summary")"
  last_level="$(jq -r '.last_level // "n/a"' <<<"$summary")"
  advanced="$(jq -r '.levels_advanced' <<<"$summary")"
  max_lag="$(jq -r '.max_head_lag_s // "n/a"' <<<"$summary")"
  max_total="$(jq -r '.max_total_s // "n/a"' <<<"$summary")"

  # Verdict: HEALTHY = no failed probes and the head advanced; DEGRADED = some
  # failures but the chain still moved; OUTAGE = every probe failed or the head
  # never advanced across the window (node up but stuck).
  local verdict
  if [ "$errors" -eq 0 ] && [ "$advanced" -gt 0 ]; then
    verdict='HEALTHY'
  elif [ "$errors" -ge "$samples" ] || { [ "$advanced" -le 0 ] && [ "$samples" -gt 1 ]; }; then
    verdict='OUTAGE'
  else
    verdict='DEGRADED'
  fi

  local report
  report="$(
    echo "### RPC health monitor: ${verdict}"
    echo "- node: ${rpc_url}"
    echo "- samples: ${samples} (errors: ${errors}, ${error_rate}%)"
    echo "- level: ${first_level} -> ${last_level} (advanced ${advanced})"
    echo "- max head lag: ${max_lag}s"
    echo "- slowest response: ${max_total}s"
  )"
  echo "$report"
  if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
    echo "$report" >> "$GITHUB_STEP_SUMMARY"
  fi

  if [ "$verdict" = 'OUTAGE' ] && [ "${POLL_FAIL_ON_OUTAGE:-false}" = 'true' ]; then
    return 1
  fi
  return 0
}
trap summarize EXIT

run_jobs_url() {
  if [ -n "$run_jobs_api_url" ]; then
    printf '%s' "$run_jobs_api_url"
    return 0
  fi
  if [ -z "${GITHUB_REPOSITORY:-}" ] || [ -z "${GITHUB_RUN_ID:-}" ]; then
    return 1
  fi
  printf '%s/repos/%s/actions/runs/%s/jobs?per_page=100' \
    "$github_api_url" "$GITHUB_REPOSITORY" "$GITHUB_RUN_ID"
}

should_stop_for_completed_run_jobs() {
  [ "$stop_when_run_jobs_complete" = 'true' ] || return 1
  [ "$(( $(date +%s) - start_epoch ))" -ge "$stop_check_after_seconds" ] || return 1
  [ -n "${GITHUB_TOKEN:-}" ] || return 1

  local base_url
  base_url="$(run_jobs_url)" || return 1

  local page=1
  local non_monitor_seen=0
  local incomplete_non_monitor_seen=0
  while :; do
    local response
    response="$(
      curl -fsS \
        -H "Authorization: Bearer ${GITHUB_TOKEN}" \
        -H 'Accept: application/vnd.github+json' \
        -H 'X-GitHub-Api-Version: 2022-11-28' \
        "${base_url}&page=${page}" 2>/dev/null || true
    )"
    [ -n "$response" ] || return 1

    local page_jobs page_non_monitor page_incomplete_non_monitor
    page_jobs="$(jq -r '.jobs | length' <<<"$response")"
    page_non_monitor="$(
      jq -r --arg prefix "$monitor_job_name_prefix" \
        '[.jobs[] | select((.name | startswith($prefix)) | not)] | length' \
        <<<"$response"
    )"
    page_incomplete_non_monitor="$(
      jq -r --arg prefix "$monitor_job_name_prefix" \
        '[.jobs[] | select(((.name | startswith($prefix)) | not) and .status != "completed")] | length' \
        <<<"$response"
    )"

    non_monitor_seen="$((non_monitor_seen + page_non_monitor))"
    incomplete_non_monitor_seen="$((incomplete_non_monitor_seen + page_incomplete_non_monitor))"

    [ "$page_jobs" -lt 100 ] && break
    page="$((page + 1))"
  done

  [ "$non_monitor_seen" -gt 0 ] || return 1
  [ "$incomplete_non_monitor_seen" -eq 0 ] || return 1

  echo "RPC health monitor: all non-monitor jobs completed; stopping early."
  return 0
}

while :; do
  now="$(date +%s)"
  [ "$now" -ge "$deadline" ] && break

  iso="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
  body_file="$(mktemp)"

  set +e
  metrics="$(
    curl -sS -o "$body_file" \
      --connect-timeout "$connect_timeout_seconds" \
      --max-time "$max_time_seconds" \
      -w '%{http_code} %{time_starttransfer} %{time_total} %{remote_ip}' \
      "$probe_url" 2>/dev/null
  )"
  curl_rc=$?
  set -e
  if [ "$curl_rc" -ne 0 ] || [ -z "$metrics" ]; then
    metrics='000 0 0 -'
  fi
  read -r http_code ttfb total remote_ip <<<"$metrics"

  line=''
  if [ "$http_code" = '200' ]; then
    # jq parses the head header for level + timestamp and derives head lag
    # (wall-clock seconds behind the chain) in one pass. A 200 with an
    # unexpected body fails here and falls through to the error branch below.
    line="$(
      jq -c \
        --arg ts "$iso" \
        --arg code "$http_code" \
        --argjson ttfb "$ttfb" \
        --argjson total "$total" \
        --arg ip "$remote_ip" \
        '{ts: $ts, http_code: $code, ttfb_s: $ttfb, total_s: $total, remote_ip: $ip,
          level: .level, head_ts: .timestamp,
          head_lag_s: ((now - (.timestamp | fromdateiso8601)) | floor)}' \
        "$body_file" 2>/dev/null || echo ''
    )"
  fi
  if [ -z "$line" ]; then
    line="$(
      jq -nc \
        --arg ts "$iso" \
        --arg code "$http_code" \
        --argjson ttfb "${ttfb:-0}" \
        --argjson total "${total:-0}" \
        --arg ip "$remote_ip" \
        '{ts: $ts, http_code: $code, ttfb_s: $ttfb, total_s: $total, remote_ip: $ip,
          level: null, head_ts: null, head_lag_s: null}'
    )"
  fi
  echo "$line" >> "$out_file"
  echo "$line"

  rm -f "$body_file"

  should_stop_for_completed_run_jobs && break

  # Stop sleeping if the next interval would run past the deadline anyway.
  [ "$(( $(date +%s) + interval_seconds ))" -ge "$deadline" ] && break
  sleep "$interval_seconds"
done
