import {
  addressDecoder,
  ballotDecoder,
  branchDecoder,
  delegateDecoder,
  int32Decoder,
  parametersDecoder,
  pkhDecoder,
  proposalDecoder,
  proposalsDecoder,
  publicKeyDecoder,
  tz1Decoder,
  zarithDecoder,
} from './codec';
import { CODEC } from './constants';
import { scriptDecoder } from './michelson/codec';
import {
  ActivationSchema,
  BallotSchema,
  DelegationSchema,
  EndorsementSchema,
  ManagerOperationSchema,
  operationDecoder,
  OriginationSchema,
  ProposalsSchema,
  RevealSchema,
  schemaDecoder,
  SeedNonceRevelationSchema,
  TransactionSchema,
} from './schema/operation';
import { Uint8ArrayConsumer } from './uint8array-consumer';
import { toHexString } from './utils';

export type Decoder = (val: Uint8ArrayConsumer) => string | number | {} | undefined;

export const decoders: { [key: string]: Decoder } = {
  [CODEC.SECRET]: val => toHexString(val.consume(20)),
  [CODEC.RAW]: val => toHexString(val.consume(32)),
  [CODEC.TZ1]: tz1Decoder,
  [CODEC.BRANCH]: branchDecoder,
  [CODEC.ZARITH]: zarithDecoder,
  [CODEC.PUBLIC_KEY]: publicKeyDecoder,
  [CODEC.PKH]: pkhDecoder,
  [CODEC.DELEGATE]: delegateDecoder,
  [CODEC.INT32]: int32Decoder,
  [CODEC.SCRIPT]: scriptDecoder,
  [CODEC.BALLOT_STATEMENT]: ballotDecoder,
  [CODEC.PROPOSAL]: proposalDecoder,
  [CODEC.PROPOSAL_ARR]: proposalsDecoder,
  [CODEC.PARAMETERS]: parametersDecoder,
  [CODEC.ADDRESS]: addressDecoder,
};

decoders[CODEC.OPERATION] = operationDecoder(decoders);
decoders[CODEC.OP_ACTIVATE_ACCOUNT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(ActivationSchema)(val);
decoders[CODEC.OP_DELEGATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(DelegationSchema)(val);
decoders[CODEC.OP_TRANSACTION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(TransactionSchema)(val);
decoders[CODEC.OP_ORIGINATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(OriginationSchema)(val);
decoders[CODEC.OP_BALLOT] = (val: Uint8ArrayConsumer) => schemaDecoder(decoders)(BallotSchema)(val);
decoders[CODEC.OP_ENDORSEMENT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(EndorsementSchema)(val);
decoders[CODEC.OP_SEED_NONCE_REVELATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(SeedNonceRevelationSchema)(val);
decoders[CODEC.OP_PROPOSALS] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(ProposalsSchema)(val);
decoders[CODEC.OP_REVEAL] = (val: Uint8ArrayConsumer) => schemaDecoder(decoders)(RevealSchema)(val);
decoders[CODEC.MANAGER] = schemaDecoder(decoders)(ManagerOperationSchema);
