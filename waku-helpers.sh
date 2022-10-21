# ! /usr/bin/env zsh
#
# Command-line utilities/helpers for WC2 development
# Source this file with `$ source ./go.sh`.
#
# Requirements:
#
# * You have `zsh` installed
# * Clone and build nwaku: https://is.gd/NXeAnv
# * Add a .env file with a variable NWAKU_DIR set to your nwaku directory

_err() { # write a (loud) message to stderr, if running interacively
    [[ -o interactive ]] && tput setaf 1
    echo "$@" 1>&2
}

# Read env vars from .env into current session
_read_dot_env_file() {
    [[ ! -f .env ]] && _err 'No .env file found' && return 1
    export $(grep -v '^#' .env | xargs)
}

# Start a local nwaku node that connects to two known peers on localhost, 
# enabling rest, rest-admin and rest-private.
# See: https://github.com/status-im/nwaku/blob/master/docs/operators/how-to/connect.md
start_waku_node() {
    _read_dot_env_file
    (($+NWAKU_LOCATION)) || { _err 'NWAKU_DIR variable not set in .env' && return 2 }
    binary_not_found='build/wakunode2 not found (did you build?)' # Build it: https://is.gd/NXeAnv
    [[ ! -f $NWAKU_DIR/build/wakunode2 ]] && _err "${NWAKU_DIR}/${binary_not_found}" && return 3
    $NWAKU_DIR/build/wakunode2 \
        --staticnode:/ip4/0.0.0.0/tcp/60002/p2p/16Uiu2HAkzjwwgEAXfeGNMKFPSpc6vGBRqCdTLG5q3Gmk2v4pQw7H \
        --staticnode:/ip4/0.0.0.0/tcp/60003/p2p/16Uiu2HAmFBA7LGtwY5WVVikdmXVo3cKLqkmvVtuDu63fe8safeQJ \
        --rest=true --rest-admin=true --rest-private=true
}
alias swn=start_waku_node

# N.B. nwaku features both a JSON RPC api and a RESTful one; this calls JSON RPC
_call_json_rpc() {
    (($# != 1)) && _err 'Usage: _call_json_rpc <payload>' && return 1
    curl -d $1 --silent --header "Content-Type: application/json" http://localhost:8545
}

perform_health_check() {
    payload='{"jsonrpc":"2.0","id":"id","method":"get_waku_v2_debug_v1_info", "params":[]}'
    _call_json_rpc $payload | jq
}
alias phc=perform_health_check

# RESTful alternative to the above JSON RPC. Seems tastier to me.
# See https://github.com/status-im/nwaku/blob/master/docs/api/v2/rest-api.md
perform_health_check2() { curl http://localhost:8645/debug/v1/info -s | jq; }
