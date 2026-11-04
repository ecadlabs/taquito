import { NetworkType, SigningType } from '@taquito/beacon-wallet/types';

const network: NetworkType = NetworkType.MAINNET;
const signingType: SigningType = SigningType.RAW;
// @ts-expect-error NetworkType remains an enum rather than accepting arbitrary strings.
const invalidNetwork: NetworkType = 'not-a-network';
void [network, signingType, invalidNetwork];
