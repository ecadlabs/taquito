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
  } from './codecPsrsRVg1';
  import { CODEC } from './constantsPsrsRVg1';
  import { scriptDecoder } from '../michelson/codec';
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
  } from '../schema/operation';
  import { Uint8ArrayConsumer } from '../uint8array-consumer';
  import { toHexString } from '../utils';
  
  export type Decoder = (val: Uint8ArrayConsumer) => string | number | {} | undefined;
  
  export const decodersPsrsRVg1: { [key: string]: Decoder } = {
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
  
  decodersPsrsRVg1[CODEC.OPERATION] = operationDecoder(decodersPsrsRVg1);
  decodersPsrsRVg1[CODEC.OP_ACTIVATE_ACCOUNT] = (val: Uint8ArrayConsumer) =>
    schemaDecoder(decodersPsrsRVg1)(ActivationSchema)(val);
  decodersPsrsRVg1[CODEC.OP_DELEGATION] = (val: Uint8ArrayConsumer) =>
    schemaDecoder(decodersPsrsRVg1)(DelegationSchema)(val);
  decodersPsrsRVg1[CODEC.OP_TRANSACTION] = (val: Uint8ArrayConsumer) =>
    schemaDecoder(decodersPsrsRVg1)(TransactionSchema)(val);
  decodersPsrsRVg1[CODEC.OP_ORIGINATION] = (val: Uint8ArrayConsumer) =>
    schemaDecoder(decodersPsrsRVg1)(OriginationSchema)(val);
  decodersPsrsRVg1[CODEC.OP_BALLOT] = (val: Uint8ArrayConsumer) => schemaDecoder(decodersPsrsRVg1)(BallotSchema)(val);
  decodersPsrsRVg1[CODEC.OP_ENDORSEMENT] = (val: Uint8ArrayConsumer) =>
    schemaDecoder(decodersPsrsRVg1)(EndorsementSchema)(val);
  decodersPsrsRVg1[CODEC.OP_SEED_NONCE_REVELATION] = (val: Uint8ArrayConsumer) =>
    schemaDecoder(decodersPsrsRVg1)(SeedNonceRevelationSchema)(val);
  decodersPsrsRVg1[CODEC.OP_PROPOSALS] = (val: Uint8ArrayConsumer) =>
    schemaDecoder(decodersPsrsRVg1)(ProposalsSchema)(val);
  decodersPsrsRVg1[CODEC.OP_REVEAL] = (val: Uint8ArrayConsumer) => schemaDecoder(decodersPsrsRVg1)(RevealSchema)(val);
  decodersPsrsRVg1[CODEC.MANAGER] = schemaDecoder(decodersPsrsRVg1)(ManagerOperationSchema);
  