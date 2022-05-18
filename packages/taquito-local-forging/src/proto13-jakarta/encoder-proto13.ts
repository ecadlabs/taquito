import { CODEC } from '../constants';
import { Encoder, encoders } from '../encoder';
import {
  ActivationSchema,
  BallotSchema,
  DelegationSchema,
  EndorsementSchema,
  ManagerOperationSchema,
  operationEncoder,
  OriginationSchema,
  ProposalsSchema,
  RegisterGlobalConstantSchema,
  RevealSchema,
  schemaEncoder,
  SeedNonceRevelationSchema,
  TransactionSchema,
} from '../schema/operation';
import {
  entrypointNameEncoderProto13,
  parametersEncoderProto13,
  valueParameterEncoderProto13,
} from './codec-proto13';
import { scriptEncoderProto13 } from './michelson-proto13/codec-proto13';
import { TransferTicketSchema } from './schema/operation-proto13';

export const encodersProto13: { [key: string]: Encoder<any> } = {
  ...encoders,
  [CODEC.SCRIPT]: scriptEncoderProto13,
  [CODEC.PARAMETERS]: parametersEncoderProto13,
  [CODEC.VALUE]: valueParameterEncoderProto13,
  [CODEC.ENTRYPOINT]: entrypointNameEncoderProto13,
};

encodersProto13[CODEC.OPERATION] = operationEncoder(encodersProto13);
encodersProto13[CODEC.OP_ACTIVATE_ACCOUNT] = (val: any) =>
  schemaEncoder(encodersProto13)(ActivationSchema)(val);
encodersProto13[CODEC.OP_DELEGATION] = (val: any) =>
  schemaEncoder(encodersProto13)(DelegationSchema)(val);
encodersProto13[CODEC.OP_TRANSACTION] = (val: any) =>
  schemaEncoder(encodersProto13)(TransactionSchema)(val);
encodersProto13[CODEC.OP_ORIGINATION] = (val: any) =>
  schemaEncoder(encodersProto13)(OriginationSchema)(val);
encodersProto13[CODEC.OP_BALLOT] = (val: any) => schemaEncoder(encodersProto13)(BallotSchema)(val);
encodersProto13[CODEC.OP_ENDORSEMENT] = (val: any) =>
  schemaEncoder(encodersProto13)(EndorsementSchema)(val);
encodersProto13[CODEC.OP_SEED_NONCE_REVELATION] = (val: any) =>
  schemaEncoder(encodersProto13)(SeedNonceRevelationSchema)(val);
encodersProto13[CODEC.OP_PROPOSALS] = (val: any) =>
  schemaEncoder(encodersProto13)(ProposalsSchema)(val);
encodersProto13[CODEC.OP_REVEAL] = (val: any) => schemaEncoder(encodersProto13)(RevealSchema)(val);
encodersProto13[CODEC.OP_REGISTER_GLOBAL_CONSTANT] = (val: any) =>
  schemaEncoder(encodersProto13)(RegisterGlobalConstantSchema)(val);
encodersProto13[CODEC.OP_TRANSFER_TICKET] = (val: any) =>
  schemaEncoder(encodersProto13)(TransferTicketSchema)(val);
encodersProto13[CODEC.MANAGER] = schemaEncoder(encodersProto13)(ManagerOperationSchema);
