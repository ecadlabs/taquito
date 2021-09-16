import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';
import { VIEW_LAMBDA } from '../packages/taquito/src/contract/view_lambda';
import {b58cdecode, Prefix, prefix} from '../packages/taquito-utils/src/taquito-utils'

const provider = 'https://granadanet.api.tez.ie';

async function example() {
  console.log(b58cdecode('p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV', prefix[Prefix.P2PK]))
  console.log(b58cdecode('p2pk65shUHKhx7zUSF7e8KZ2inmQ5aMS4jRBUmK6aCis4oaHoiWPXoT', prefix[Prefix.P2PK]))
  console.log(b58cdecode('edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g', prefix[Prefix.P2PK]))
  console.log(b58cdecode('edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g', prefix[Prefix.P2PK]))
}

// tslint:disable-next-line: no-floating-promises
example();
