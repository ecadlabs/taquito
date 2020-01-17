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
  secret: val => toHexString(val.consume(20)),
  raw: val => toHexString(val.consume(32)),
  tz1: tz1Decoder,
  branch: branchDecoder,
  zarith: zarithDecoder,
  public_key: publicKeyDecoder,
  pkh: pkhDecoder,
  delegate: delegateDecoder,
  int32: int32Decoder,
  script: scriptDecoder,
  ballotStmt: ballotDecoder,
  proposal: proposalDecoder,
  proposalArr: proposalsDecoder,
  parameters: parametersDecoder,
  address: addressDecoder,
};

decoders['operation'] = operationDecoder(decoders);
decoders['activate_account'] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(ActivationSchema)(val);
decoders['delegation'] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(DelegationSchema)(val);
decoders['transaction'] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(TransactionSchema)(val);
decoders['origination'] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(OriginationSchema)(val);
decoders['ballot'] = (val: Uint8ArrayConsumer) => schemaDecoder(decoders)(BallotSchema)(val);
decoders['endorsement'] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(EndorsementSchema)(val);
decoders['seed_nonce_revelation'] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decoders)(SeedNonceRevelationSchema)(val);
decoders['proposals'] = (val: Uint8ArrayConsumer) => schemaDecoder(decoders)(ProposalsSchema)(val);
decoders['reveal'] = (val: Uint8ArrayConsumer) => schemaDecoder(decoders)(RevealSchema)(val);
decoders['manager'] = schemaDecoder(decoders)(ManagerOperationSchema);
