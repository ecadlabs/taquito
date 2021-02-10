/*
 * Some code in this file is originally from sotez
 * Copyright (c) 2018 Andrew Kishino
 */

import { pad } from './utils';

// See: https://tezos.gitlab.io/protocols/005_babylon.html#transactions-now-have-an-entrypoint
export const ENTRYPOINT_MAX_LENGTH = 31;

export enum CODEC {
  SECRET = 'secret',
  RAW = 'raw',
  TZ1 = 'tz1',
  BRANCH = 'branch',
  ZARITH = 'zarith',
  PUBLIC_KEY = 'public_key',
  PKH = 'pkh',
  DELEGATE = 'delegate',
  SCRIPT = 'script',
  BALLOT_STATEMENT = 'ballotStmt',
  PROPOSAL = 'proposal',
  PROPOSAL_ARR = 'proposalArr',
  INT32 = 'int32',
  PARAMETERS = 'parameters',
  ADDRESS = 'address',
  OPERATION = 'operation',
  OP_ACTIVATE_ACCOUNT = 'activate_account',
  OP_DELEGATION = 'delegation',
  OP_TRANSACTION = 'transaction',
  OP_ORIGINATION = 'origination',
  OP_BALLOT = 'ballot',
  OP_ENDORSEMENT = 'endorsement',
  OP_SEED_NONCE_REVELATION = 'seed_nonce_revelation',
  OP_REVEAL = 'reveal',
  OP_PROPOSALS = 'proposals',
  MANAGER = 'manager',
}

// See https://tezos.gitlab.io/whitedoc/michelson.html#full-grammar
export const opMapping: { [key: string]: string } = {
  '00': 'parameter',
  '01': 'storage',
  '02': 'code',
  '03': 'False',
  '04': 'Elt',
  '05': 'Left',
  '06': 'None',
  '07': 'Pair',
  '08': 'Right',
  '09': 'Some',
  '0a': 'True',
  '0b': 'Unit',
  '0c': 'PACK',
  '0d': 'UNPACK',
  '0e': 'BLAKE2B',
  '0f': 'SHA256',
  '10': 'SHA512',
  '11': 'ABS',
  '12': 'ADD',
  '13': 'AMOUNT',
  '14': 'AND',
  '15': 'BALANCE',
  '16': 'CAR',
  '17': 'CDR',
  '18': 'CHECK_SIGNATURE',
  '19': 'COMPARE',
  '1a': 'CONCAT',
  '1b': 'CONS',
  '1c': 'CREATE_ACCOUNT', // Removed in Edo
  '1d': 'CREATE_CONTRACT', // Removed in Edo
  '1e': 'IMPLICIT_ACCOUNT',
  '1f': 'DIP',
  '20': 'DROP',
  '21': 'DUP',
  '22': 'EDIV',
  '23': 'EMPTY_MAP',
  '24': 'EMPTY_SET',
  '25': 'EQ',
  '26': 'EXEC',
  '27': 'FAILWITH',
  '28': 'GE',
  '29': 'GET',
  '2a': 'GT',
  '2b': 'HASH_KEY',
  '2c': 'IF',
  '2d': 'IF_CONS',
  '2e': 'IF_LEFT',
  '2f': 'IF_NONE',
  '30': 'INT',
  '31': 'LAMBDA',
  '32': 'LE',
  '33': 'LEFT',
  '34': 'LOOP',
  '35': 'LSL',
  '36': 'LSR',
  '37': 'LT',
  '38': 'MAP',
  '39': 'MEM',
  '3a': 'MUL',
  '3b': 'NEG',
  '3c': 'NEQ',
  '3d': 'NIL',
  '3e': 'NONE',
  '3f': 'NOT',
  '40': 'NOW',
  '41': 'OR',
  '42': 'PAIR',
  '43': 'PUSH',
  '44': 'RIGHT',
  '45': 'SIZE',
  '46': 'SOME',
  '47': 'SOURCE',
  '48': 'SENDER',
  '49': 'SELF',
  '4a': 'STEPS_TO_QUOTA', // Removed in Edo
  '4b': 'SUB',
  '4c': 'SWAP',
  '4d': 'TRANSFER_TOKENS',
  '4e': 'SET_DELEGATE',
  '4f': 'UNIT',
  '50': 'UPDATE',
  '51': 'XOR',
  '52': 'ITER',
  '53': 'LOOP_LEFT',
  '54': 'ADDRESS',
  '55': 'CONTRACT',
  '56': 'ISNAT',
  '57': 'CAST',
  '58': 'RENAME',
  '59': 'bool',
  '5a': 'contract',
  '5b': 'int',
  '5c': 'key',
  '5d': 'key_hash',
  '5e': 'lambda',
  '5f': 'list',
  '60': 'map',
  '61': 'big_map',
  '62': 'nat',
  '63': 'option',
  '64': 'or',
  '65': 'pair',
  '66': 'set',
  '67': 'signature',
  '68': 'string',
  '69': 'bytes',
  '6a': 'mutez',
  '6b': 'timestamp',
  '6c': 'unit',
  '6d': 'operation',
  '6e': 'address',
  '6f': 'SLICE',
  '70': 'DIG',
  '71': 'DUG',
  '72': 'EMPTY_BIG_MAP',
  '73': 'APPLY',
  '74': 'chain_id',
  '75': 'CHAIN_ID',
  '76': 'LEVEL',
  '77': 'SELF_ADDRESS',
  '78': 'never',
  '79': 'NEVER',
  '7a': 'UNPAIR',
  '7b': 'VOTING_POWER',
  '7c': 'TOTAL_VOTING_POWER',
  '7d': 'KECCAK',
  '7e': 'SHA3',
  '7f': 'PAIRING_CHECK',
  '80': 'bls12_381_g1',
  '81': 'bls12_381_g2',
  '82': 'bls12_381_fr',
  '83': 'sapling_state',
  '84': 'sapling_transaction',
  '85': 'SAPLING_EMPTY_STATE',
  '86': 'SAPLING_VERIFY_UPDATE',
  '87': 'ticket',
  '88': 'TICKET',
  '89': 'READ_TICKET',
  '8a': 'SPLIT_TICKET',
  '8b': 'JOIN_TICKETS',
  '8c': 'GET_AND_UPDATE'
};

export const opMappingReverse = (() => {
  const result: { [key: string]: string } = {};
  Object.keys(opMapping).forEach((key: string) => {
    result[opMapping[key]] = key;
  });
  return result;
})();

// See https://tezos.gitlab.io/api/p2p.html
export const kindMapping: { [key: number]: string } = {
  0x04: 'activate_account',
  0x6b: 'reveal',
  0x6e: 'delegation',
  0x6c: 'transaction',
  0x6d: 'origination',
  0x06: 'ballot',
  0x00: 'endorsement',
  0x01: 'seed_nonce_revelation',
  0x05: 'proposals',
};

export const kindMappingReverse = (() => {
  const result: { [key: string]: string } = {};
  Object.keys(kindMapping).forEach((key: number | string) => {
    const keyNum = typeof key === 'string' ? parseInt(key, 10) : key;
    result[kindMapping[keyNum]] = pad(keyNum, 2);
  });
  return result;
})();

// See https://tezos.gitlab.io/protocols/005_babylon.html#transactions-now-have-an-entrypoint
export const entrypointMapping: { [key: string]: string } = {
  '00': 'default',
  '01': 'root',
  '02': 'do',
  '03': 'set_delegate',
  '04': 'remove_delegate',
};

export const entrypointMappingReverse = (() => {
  const result: { [key: string]: string } = {};
  Object.keys(entrypointMapping).forEach((key: string) => {
    result[entrypointMapping[key]] = key;
  });
  return result;
})();
