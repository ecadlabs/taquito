import {
  buildEvmToMichelsonCall,
  buildMichelsonToEvmCall,
  toTransferParams,
} from '@taquito/tezosx';
import type { TransferParams } from '@taquito/taquito';

const transfer: TransferParams = toTransferParams(
  buildMichelsonToEvmCall({ to: '0x1111111111111111111111111111111111111111' })
);
const data: `0x${string}` = buildEvmToMichelsonCall({
  kind: 'transfer',
  destination: 'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
  amount: 0n,
}).data;
void [transfer, data];
