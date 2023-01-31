import fs from 'fs';
import path from 'path';

export const bytesAndInt =  fs.readFileSync(path.resolve(`${__dirname}/../../packages/taquito-michel-codec/test/contracts_016/opcodes/bytes_of_int.tz`)).toString();
export const bytesAndNat =  fs.readFileSync(path.resolve(`${__dirname}/../../packages/taquito-michel-codec/test/contracts_016/opcodes/bytes_of_nat.tz`)).toString();
