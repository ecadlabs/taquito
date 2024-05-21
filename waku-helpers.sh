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

_err() { # write a (loud) message to stderr, if running interactively
    [[ -o interactive ]] && tput setaf 1
    echo "$@" 1>&2
}

# Read env vars from .env into current session
_read_dot_env_file() {
    [[ ! -f .env ]] && _err 'No .env file found' && return 1
    export $(grep -v '^#' .env | xargs)
}

_DEBUG=1  # 0=on, !0=off  # nb DEBUG printing sometimes causes a superfluous error to surface (in `gnm`)
_debugging() { (($_DEBUG == 0)); }

# Conveniently refresh current shell with any changes made to this file
_reload_waku_helpers() { source waku-helpers.sh; }
alias rwh=_reload_waku_helpers

# Start nwaku locally, connect to two known peers on localhost, enable rest{,-admin,-private}.
# See: https://github.com/status-im/nwaku/blob/master/docs/operators/how-to/connect.md
start_waku_node() {
    _read_dot_env_file
    (($+NWAKU_DIR)) || { _err 'NWAKU_DIR variable not set in .env' && return 2 }
    binary_not_found='build/wakunode2 not found (did you build?)' # Build it: https://is.gd/NXeAnv
    [[ ! -f $NWAKU_DIR/build/wakunode2 ]] && _err "${NWAKU_DIR}/${binary_not_found}" && return 3
    node1='/ip4/0.0.0.0/tcp/60002/p2p/16Uiu2HAkzjwwgEAXfeGNMKFPSpc6vGBRqCdTLG5q3Gmk2v4pQw7H'
    node2='/ip4/0.0.0.0/tcp/60003/p2p/16Uiu2HAmFBA7LGtwY5WVVikdmXVo3cKLqkmvVtuDu63fe8safeQJ'
    $NWAKU_DIR/build/wakunode2 \
        --staticnode:$node1 \
        --staticnode:$node2 \
        --rest=true --rest-admin=true --rest-private=true
}
alias swn=start_waku_node

# N.B. nwaku features both a JSON RPC api and a RESTful one; this calls JSON RPC
_call_json_rpc() {
    (($# != 1)) && _err 'Usage: _call_json_rpc <payload>' && return 1
    payload=$1
    _debugging && echo $payload
    # TODO Validate that localhost:8545 is an active TCP connection
    curl -d $payload --silent --header "Content-Type: application/json" http://localhost:8545
}

# Timestamps figure prominently within the waku api, here are some helpers
date_to_unix() { date -d "$1" +%s ; }  # `$ dtu "$(date)"` -> 1666373627
alias dtu=date_to_unix
unix_to_date() { date -d @$1; }  # `$ utd 1666373627`  # -> 2Fri Oct 21 10:33:47 AM PDT 2022
alias utd=unix_to_date

_make_payload() { echo "{ \"jsonrpc\":\"2.0\",\"id\":\"id\",\"method\":\"$1\", \"params\":[${@:2}] }"; }

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
    _call_json_rpc $payload
}
alias stt=subscribe_to_topics
# eg subscribe_to_topics t3 and t4: `stt '"t3","t4"`  # note the escaping!

# Publish a message to the given topic; `message` must be '{"payload:"0x...", "timestamp":1666373627}'
# The "timestamp" param is seconds since epoch, get it with `date_to_unix $(date)`
publish_to_topic() {
    (($# != 2)) && _err 'Usage: publish_to_topic <topic> <payload>' && return 1
    # TODO Validate the topic exists
    topic=$1
    # TODO Validate that message is enclosed {within curlies}
    message=$2
    payload=$(_make_payload 'post_waku_v2_relay_v1_message' \"$topic\"\, $message)
    _call_json_rpc $payload
}
alias ptt=publish_to_topic
# eg `ptt t3 '{"payload":"0x01", "timestamp":12345}'; ptt t3 '{"payload":"0x02", "timestamp":12346}'`

# Read new messages for the given topic. "Cannot iterate over null" means there are no new messages.
get_new_messages_for_topic() {
    (($# != 1)) && _err 'Usage: get_new_messages_for_topic <topic>' && return 1
    topic=$1
    payload=$(_make_payload 'get_waku_v2_relay_v1_messages' \"$topic\")
    result=$(_call_json_rpc $payload)
    # TODO Format the error that comes back if not subscribed to the given topic
    # TODO Fish for 'error' and print out the value if emitted
    echo $result | jq -c '.result[]|{payload: .payload, timestamp: .timestamp}'
}
alias gnm=get_new_messages_for_topic
# eg `gnm t3`

# Unsubscribe from the given topic(s) [via JSON RPC].
# Pass multiple topics as a single arg: `unsubscribe_from_topics '"topic_1","topic_2"'`
unsubscribe_from_topics() {
    (($# != 1)) && _err 'Usage: unsubscribe_from_topic '\''"t1","t2"'\''' && return 1
    payload=$(_make_payload 'delete_waku_v2_relay_v1_subscriptions' "[$@]")
    _call_json_rpc $payload
}
alias uft=unsubscribe_from_topics
# eg `uft '"t3"'  # note the escaping!
