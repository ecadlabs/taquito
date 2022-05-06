import { int16Encoder } from '../codec';
import { CODEC } from '../constants';
import { Encoder, encoders } from '../encoder';
import {
  schemaEncoder,
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
import { blockPayloadHashEncoder } from './codec';
import { EndorsementSchemaProto12, operationEncoderProto12 } from './schema';

export const encodersProto12: { [key: string]: Encoder<any> } = {
  ...encoders,
  [CODEC.INT16]: int16Encoder,
  [CODEC.BLOCK_PAYLOAD_HASH]: blockPayloadHashEncoder,
};

encodersProto12[CODEC.OPERATION] = operationEncoderProto12(encodersProto12);
encodersProto12[CODEC.OP_ACTIVATE_ACCOUNT] = (val) =>
  schemaEncoder(encodersProto12)(ActivationSchema)(val);
encodersProto12[CODEC.OP_DELEGATION] = (val) =>
  schemaEncoder(encodersProto12)(DelegationSchema)(val);
encodersProto12[CODEC.OP_TRANSACTION] = (val) =>
  schemaEncoder(encodersProto12)(TransactionSchema)(val);
encodersProto12[CODEC.OP_ORIGINATION] = (val) =>
  schemaEncoder(encodersProto12)(OriginationSchema)(val);
encodersProto12[CODEC.OP_BALLOT] = (val) => schemaEncoder(encodersProto12)(BallotSchema)(val);
encodersProto12[CODEC.OP_ENDORSEMENT] = (val) =>
  schemaEncoder(encodersProto12)(EndorsementSchemaProto12)(val);
encodersProto12[CODEC.OP_SEED_NONCE_REVELATION] = (val) =>
  schemaEncoder(encodersProto12)(SeedNonceRevelationSchema)(val);
encodersProto12[CODEC.OP_PROPOSALS] = (val) =>
  schemaEncoder(encodersProto12)(ProposalsSchema)(val);
encodersProto12[CODEC.OP_REVEAL] = (val) => schemaEncoder(encodersProto12)(RevealSchema)(val);
encodersProto12[CODEC.OP_REGISTER_GLOBAL_CONSTANT] = (val) =>
  schemaEncoder(encodersProto12)(RegisterGlobalConstantSchema)(val);
encodersProto12[CODEC.MANAGER] = schemaEncoder(encodersProto12)(ManagerOperationSchema);
