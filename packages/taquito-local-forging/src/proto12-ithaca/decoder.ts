import { int16Decoder } from '../codec';
import { CODEC } from '../constants';
import { Decoder, decoders } from '../decoder';
import {
  schemaDecoder,
  ActivationSchema,
  DelegationSchema,
  TransactionSchema,
  OriginationSchema,
  BallotSchema,
  SeedNonceRevelationSchema,
  ProposalsSchema,
  RevealSchema,
  RegisterGlobalConstantSchema,
  ManagerOperationSchema,
} from '../schema/operation';
import { Uint8ArrayConsumer } from '../uint8array-consumer';
import { blockPayloadHashDecoder } from './codec';
import { CODEC_PROT0_12 } from './constants';
import { EndorsementSchemaProto12, operationDecoderProto12 } from './schema';

export const decodersProto12: { [key: string]: Decoder } = {
  ...decoders,
  [CODEC.INT16]: int16Decoder,
  [CODEC_PROT0_12.BLOCK_PAYLOAD_HASH]: blockPayloadHashDecoder,
};

decodersProto12[CODEC.OPERATION] = operationDecoderProto12(decodersProto12);
decodersProto12[CODEC.OP_ACTIVATE_ACCOUNT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto12)(ActivationSchema)(val);
decodersProto12[CODEC.OP_DELEGATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto12)(DelegationSchema)(val);
decodersProto12[CODEC.OP_TRANSACTION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto12)(TransactionSchema)(val);
decodersProto12[CODEC.OP_ORIGINATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto12)(OriginationSchema)(val);
decodersProto12[CODEC.OP_BALLOT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto12)(BallotSchema)(val);
decodersProto12[CODEC.OP_ENDORSEMENT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto12)(EndorsementSchemaProto12)(val);
decodersProto12[CODEC.OP_SEED_NONCE_REVELATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto12)(SeedNonceRevelationSchema)(val);
decodersProto12[CODEC.OP_PROPOSALS] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto12)(ProposalsSchema)(val);
decodersProto12[CODEC.OP_REVEAL] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto12)(RevealSchema)(val);
decodersProto12[CODEC.OP_REGISTER_GLOBAL_CONSTANT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto12)(RegisterGlobalConstantSchema)(val);
decodersProto12[CODEC.MANAGER] = schemaDecoder(decodersProto12)(ManagerOperationSchema);
