import { Prefix } from '@taquito/utils';
import { prefixDecoder, prefixEncoder } from '../codec';

export const blockPayloadHashEncoder = prefixEncoder(Prefix.VH);
export const blockPayloadHashDecoder = prefixDecoder(Prefix.VH);
