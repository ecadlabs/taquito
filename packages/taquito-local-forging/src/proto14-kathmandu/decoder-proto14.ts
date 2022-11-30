import {
  addressDecoder,
  ballotDecoder,
  blockPayloadHashDecoder,
  branchDecoder,
  burnLimitDecoder,
  delegateDecoder,
  entrypointNameDecoder,
  int16Decoder,
  int32Decoder,
  pkhDecoder,
  proposalDecoder,
  proposalsDecoder,
  publicKeyDecoder,
  smartContractAddressDecoder,
  txRollupBatchContentDecoder,
  txRollupIdDecoder,
  txRollupOriginationParamDecoder,
  tz1Decoder,
  zarithDecoder,
} from '../codec';
import { CODEC } from '../constants';
import { scriptDecoderProto14 } from './michelson/codec-proto14';
import { parametersDecoderProto14, valueParameterDecoderProto14 } from './codec-proto14';
import {
  ActivationSchema,
  BallotSchema,
  DelegationSchema,
  EndorsementSchema,
  IncreasePaidStorageSchema,
  ManagerOperationSchema,
  operationDecoder,
  OriginationSchema,
  ProposalsSchema,
  RegisterGlobalConstantSchema,
  RevealSchema,
  schemaDecoder,
  SeedNonceRevelationSchema,
  TransactionSchema,
  TransferTicketSchema,
  TxRollupOriginationSchema,
  TxRollupSubmitBatchSchema,
} from '../schema/operation';
import { Uint8ArrayConsumer } from '../uint8array-consumer';
import { toHexString } from '../utils';

export type Decoder = (val: Uint8ArrayConsumer) => string | number | object | undefined;

export const decodersProto14: { [key: string]: Decoder } = {
  [CODEC.SECRET]: (val) => toHexString(val.consume(20)),
  [CODEC.RAW]: (val) => toHexString(val.consume(32)),
  [CODEC.TZ1]: tz1Decoder,
  [CODEC.BRANCH]: branchDecoder,
  [CODEC.ZARITH]: zarithDecoder,
  [CODEC.PUBLIC_KEY]: publicKeyDecoder,
  [CODEC.PKH]: pkhDecoder,
  [CODEC.DELEGATE]: delegateDecoder,
  [CODEC.INT32]: int32Decoder,
  [CODEC.SCRIPT]: scriptDecoderProto14,
  [CODEC.BALLOT_STATEMENT]: ballotDecoder,
  [CODEC.PROPOSAL]: proposalDecoder,
  [CODEC.PROPOSAL_ARR]: proposalsDecoder,
  [CODEC.PARAMETERS]: parametersDecoderProto14,
  [CODEC.ADDRESS]: addressDecoder,
  [CODEC.SMART_CONTRACT_ADDRESS]: smartContractAddressDecoder,
  [CODEC.VALUE]: valueParameterDecoderProto14,
  [CODEC.INT16]: int16Decoder,
  [CODEC.BLOCK_PAYLOAD_HASH]: blockPayloadHashDecoder,
  [CODEC.ENTRYPOINT]: entrypointNameDecoder,
  [CODEC.TX_ROLLUP_ORIGINATION_PARAM]: txRollupOriginationParamDecoder,
  [CODEC.TX_ROLLUP_ID]: txRollupIdDecoder,
  [CODEC.TX_ROLLUP_BATCH_CONTENT]: txRollupBatchContentDecoder,
  [CODEC.BURN_LIMIT]: burnLimitDecoder,
};

decodersProto14[CODEC.OPERATION] = operationDecoder(decodersProto14);
decodersProto14[CODEC.OP_ACTIVATE_ACCOUNT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto14)(ActivationSchema)(val);
decodersProto14[CODEC.OP_DELEGATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto14)(DelegationSchema)(val);
decodersProto14[CODEC.OP_TRANSACTION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto14)(TransactionSchema)(val);
decodersProto14[CODEC.OP_ORIGINATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto14)(OriginationSchema)(val);
decodersProto14[CODEC.OP_BALLOT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto14)(BallotSchema)(val);
decodersProto14[CODEC.OP_ENDORSEMENT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto14)(EndorsementSchema)(val);
decodersProto14[CODEC.OP_SEED_NONCE_REVELATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto14)(SeedNonceRevelationSchema)(val);
decodersProto14[CODEC.OP_PROPOSALS] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto14)(ProposalsSchema)(val);
decodersProto14[CODEC.OP_REVEAL] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto14)(RevealSchema)(val);
decodersProto14[CODEC.OP_REGISTER_GLOBAL_CONSTANT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto14)(RegisterGlobalConstantSchema)(val);
decodersProto14[CODEC.OP_TRANSFER_TICKET] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto14)(TransferTicketSchema)(val);
decodersProto14[CODEC.OP_TX_ROLLUP_ORIGINATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto14)(TxRollupOriginationSchema)(val);
decodersProto14[CODEC.OP_TX_ROLLUP_SUBMIT_BATCH] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto14)(TxRollupSubmitBatchSchema)(val);
decodersProto14[CODEC.OP_INCREASE_PAID_STORAGE] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto14)(IncreasePaidStorageSchema)(val);
decodersProto14[CODEC.MANAGER] = schemaDecoder(decodersProto14)(ManagerOperationSchema);
