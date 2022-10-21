# ! /usr/bin/env zsh
#
# Command-line utilities/helpers for WC2 development
# Source this file with `$ source ./go.sh`.

_err() { # write a (loud) message to stderr, if running interacively
    [[ -o interactive ]] && tput setaf 1
    echo "$@" 1>&2
}

_call_json_rpc() {
    (($# != 1)) && _err 'Usage: _call_json_rpc <payload>' && return 1
    curl -d $1 --silent --header "Content-Type: application/json" http://localhost:8545
}

_read_dot_env_file() {
    [[ ! -f .env ]] && _err 'No .env file found' && return 1
    export $(grep -v '^#' .env | xargs)
}

start_waku_node() {
    _read_dot_env_file
    (($+NWAKU_LOCATION)) || { _err 'NWAKU_DIR variable not set in .env' && return 2 }
    binary_not_found='build/wakunode2 not found (did you build?)' # Build it: https://is.gd/NXeAnv
    [[ ! -f $NWAKU_DIR/build/wakunode2 ]] && _err $binary_not_found && return 3
    # Start an nwaku node that connects to two known peers on localhost
    # https://github.com/status-im/nwaku/blob/master/docs/operators/how-to/connect.md
    $NWAKU_DIR/build/wakunode2 \
        --staticnode:/ip4/0.0.0.0/tcp/60002/p2p/16Uiu2HAkzjwwgEAXfeGNMKFPSpc6vGBRqCdTLG5q3Gmk2v4pQw7H \
        --staticnode:/ip4/0.0.0.0/tcp/60003/p2p/16Uiu2HAmFBA7LGtwY5WVVikdmXVo3cKLqkmvVtuDu63fe8safeQJ
}

perform_health_check() {
    payload='{"jsonrpc":"2.0","id":"id","method":"get_waku_v2_debug_v1_info", "params":[]}'
    _call_json_rpc $payload | jq
}
