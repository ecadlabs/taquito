import { Decoder, decoders } from '../decoder';
import { CODEC } from '../constants';
import { Uint8ArrayConsumer } from '../uint8array-consumer';
import {
  entrypointNameDecoderProto13,
  parametersDecoderProto13,
  valueParameterDecoderProto13,
  txRollupBatchContentDecoderProto13,
  txRollupIdDecoderProto13,
  txRollupOriginationParamDecoderProto13,
  burnLimitDecoder,
} from './codec-proto13';
import {
  ActivationSchema,
  BallotSchema,
  DelegationSchema,
  EndorsementSchema,
  ManagerOperationSchema,
  operationDecoder,
  OriginationSchema,
  ProposalsSchema,
  RegisterGlobalConstantSchema,
  RevealSchema,
  schemaDecoder,
  SeedNonceRevelationSchema,
  TransactionSchema,
} from '../schema/operation';
import { scriptDecoderProto13 } from './michelson-proto13/codec-proto13';
import {
  TransferTicketSchema,
  TxRollupOriginationSchema,
  TxRollupSubmitBatchSchema,
} from './schema/operation-proto13';

export const decodersProto13: { [key: string]: Decoder } = {
  ...decoders,
  [CODEC.SCRIPT]: scriptDecoderProto13,
  [CODEC.PARAMETERS]: parametersDecoderProto13,
  [CODEC.VALUE]: valueParameterDecoderProto13,
  [CODEC.ENTRYPOINT]: entrypointNameDecoderProto13,
  [CODEC.TX_ROLLUP_ORIGINATION_PARAM]: txRollupOriginationParamDecoderProto13,
  [CODEC.TX_ROLLUP_ID]: txRollupIdDecoderProto13,
  [CODEC.TX_ROLLUP_BATCH_CONTENT]: txRollupBatchContentDecoderProto13,
  [CODEC.BURN_LIMIT]: burnLimitDecoder,
};

decodersProto13[CODEC.OPERATION] = operationDecoder(decodersProto13);
decodersProto13[CODEC.OP_ACTIVATE_ACCOUNT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto13)(ActivationSchema)(val);
decodersProto13[CODEC.OP_DELEGATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto13)(DelegationSchema)(val);
decodersProto13[CODEC.OP_TRANSACTION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto13)(TransactionSchema)(val);
decodersProto13[CODEC.OP_ORIGINATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto13)(OriginationSchema)(val);
decodersProto13[CODEC.OP_BALLOT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto13)(BallotSchema)(val);
decodersProto13[CODEC.OP_ENDORSEMENT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto13)(EndorsementSchema)(val);
decodersProto13[CODEC.OP_SEED_NONCE_REVELATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto13)(SeedNonceRevelationSchema)(val);
decodersProto13[CODEC.OP_PROPOSALS] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto13)(ProposalsSchema)(val);
decodersProto13[CODEC.OP_REVEAL] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto13)(RevealSchema)(val);
decodersProto13[CODEC.OP_REGISTER_GLOBAL_CONSTANT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto13)(RegisterGlobalConstantSchema)(val);
decodersProto13[CODEC.OP_TRANSFER_TICKET] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto13)(TransferTicketSchema)(val);
decodersProto13[CODEC.OP_TX_ROLLUP_ORIGINATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto13)(TxRollupOriginationSchema)(val);
decodersProto13[CODEC.OP_TX_ROLLUP_SUBMIT_BATCH] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto13)(TxRollupSubmitBatchSchema)(val);
decodersProto13[CODEC.MANAGER] = schemaDecoder(decodersProto13)(ManagerOperationSchema);
