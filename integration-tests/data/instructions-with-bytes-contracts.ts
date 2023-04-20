import fs from 'fs';
import path from 'path';

export const addContract =  fs.readFileSync(path.resolve(`${__dirname}/../../packages/taquito-michel-codec/test/contracts_016/opcodes/and_bytes.tz`)).toString();
export const lslContract =  fs.readFileSync(path.resolve(`${__dirname}/../../packages/taquito-michel-codec/test/contracts_016/opcodes/lsl_bytes.tz`)).toString();
export const lsrContract =  fs.readFileSync(path.resolve(`${__dirname}/../../packages/taquito-michel-codec/test/contracts_016/opcodes/lsr_bytes.tz`)).toString();
export const notContract =  fs.readFileSync(path.resolve(`${__dirname}/../../packages/taquito-michel-codec/test/contracts_016/opcodes/not_bytes.tz`)).toString();
export const orContract =  fs.readFileSync(path.resolve(`${__dirname}/../../packages/taquito-michel-codec/test/contracts_016/opcodes/or_bytes.tz`)).toString();
export const xorContract =  fs.readFileSync(path.resolve(`${__dirname}/../../packages/taquito-michel-codec/test/contracts_016/opcodes/xor_bytes.tz`)).toString();
