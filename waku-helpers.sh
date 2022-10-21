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

_DEBUG=0  # 0=on, !0=off
_debugging() { (($_DEBUG == 0)); }
# Conveniently refresh current shell with changes made to this file
_reload_waku_helpers() { source waku-helpers.sh; }
alias rwh=_reload_waku_helpers

# Start a local nwaku node that connects to two known peers on localhost, 
# enabling rest, rest-admin and rest-private.
# See: https://github.com/status-im/nwaku/blob/master/docs/operators/how-to/connect.md
start_waku_node() {
    _read_dot_env_file
    (($+NWAKU_DIR)) || { _err 'NWAKU_DIR variable not set in .env' && return 2 }
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
    payload=$1
    # TODO Validate that localhost:8545 is an active TCP connection
    curl -d $payload --silent --header "Content-Type: application/json" http://localhost:8545
}

_make_payload() { echo "{ \"jsonrpc\":\"2.0\",\"id\":\"id\",\"method\":\"$1\", \"params\":[$2] }"; }

get_waku_debug_info() {
    payload=$(_make_payload 'get_waku_v2_debug_v1_info')
    _call_json_rpc $payload | jq
}
alias gwd=get_waku_debug_info

# RESTful alternative to the above JSON RPC. Seems tastier to me.
# See https://github.com/status-im/nwaku/blob/master/docs/api/v2/rest-api.md
get_waku_debug_info2() { curl http://localhost:8645/debug/v1/info -s | jq; }
alias gwd2=get_waku_debug_info2

# Subscribe to the given topic(s) [via JSON RPC].
# Pass multiple topics as a single arg: `subscribe_to_topic '"topic_1","topic_2"'`
subscribe_to_topics() {
    (($# != 1)) && _err 'Usage: subscribe_to_topic '\''"t1","t2"'\''' && return 1
    payload=$(_make_payload 'post_waku_v2_relay_v1_subscriptions' "[$@]")
    _debugging && echo $payload
    _call_json_rpc $payload
}
alias stt=subscribe_to_topics
