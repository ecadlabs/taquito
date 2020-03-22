"use strict";
exports.__esModule = true;
var setDelegate = function (key) {
    return [
        { prim: 'DROP' },
        { prim: 'NIL', args: [{ prim: 'operation' }] },
        {
            prim: 'PUSH',
            args: [{ prim: 'key_hash' }, { string: key }]
        },
        { prim: 'SOME' },
        { prim: 'SET_DELEGATE' },
        { prim: 'CONS' },
    ];
};
var transferImplicit = function (key, mutez) {
    return [
        { prim: 'DROP' },
        { prim: 'NIL', args: [{ prim: 'operation' }] },
        {
            prim: 'PUSH',
            args: [{ prim: 'key_hash' }, { string: key }]
        },
        { prim: 'IMPLICIT_ACCOUNT' },
        {
            prim: 'PUSH',
            args: [{ prim: 'mutez' }, { int: "" + mutez }]
        },
        { prim: 'UNIT' },
        { prim: 'TRANSFER_TOKENS' },
        { prim: 'CONS' },
    ];
};
var removeDelegate = function () {
    return [
        { prim: 'DROP' },
        { prim: 'NIL', args: [{ prim: 'operation' }] },
        { prim: 'NONE', args: [{ prim: 'key_hash' }] },
        { prim: 'SET_DELEGATE' },
        { prim: 'CONS' },
    ];
};
var transferToContract = function (key, amount) {
    return [
        { prim: 'DROP' },
        { prim: 'NIL', args: [{ prim: 'operation' }] },
        {
            prim: 'PUSH',
            args: [{ prim: 'address' }, { string: key }]
        },
        { prim: 'CONTRACT', args: [{ prim: 'unit' }] },
        [
            {
                prim: 'IF_NONE',
                args: [[[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]], []]
            },
        ],
        {
            prim: 'PUSH',
            args: [{ prim: 'mutez' }, { int: "" + amount }]
        },
        { prim: 'UNIT' },
        { prim: 'TRANSFER_TOKENS' },
        { prim: 'CONS' },
    ];
};
exports.MANAGER_LAMBDA = {
    setDelegate: setDelegate,
    removeDelegate: removeDelegate,
    transferImplicit: transferImplicit,
    transferToContract: transferToContract
};
