import fs from 'fs'


export const addContract =  fs.readFileSync(__dirname + '/../../packages/taquito-michel-codec/test/contracts_016/opcodes/and_bytes.tz').toString();
export const lslContract =  fs.readFileSync(__dirname + '/../../packages/taquito-michel-codec/test/contracts_016/opcodes/lsl_bytes.tz').toString();
export const lsrContract =  fs.readFileSync(__dirname + '/../../packages/taquito-michel-codec/test/contracts_016/opcodes/lsr_bytes.tz').toString();
export const notContract =  fs.readFileSync(__dirname + '/../../packages/taquito-michel-codec/test/contracts_016/opcodes/not_bytes.tz').toString();
export const orContract =  fs.readFileSync(__dirname + '/../../packages/taquito-michel-codec/test/contracts_016/opcodes/or_bytes.tz').toString();
export const xorContract =  fs.readFileSync(__dirname + '/../../packages/taquito-michel-codec/test/contracts_016/opcodes/xor_bytes.tz').toString();
