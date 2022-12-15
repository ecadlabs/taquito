import {
  addressEncoder,
  ballotEncoder,
  blockPayloadHashEncoder,
  branchEncoder,
  burnLimitEncoder,
  delegateEncoder,
  int16Encoder,
  int32Encoder,
  pkhEncoder,
  proposalEncoder,
  proposalsEncoder,
  publicKeyEncoder,
  smartContractAddressEncoder,
  txRollupBatchContentEncoder,
  txRollupIdEncoder,
  txRollupOriginationParamEncoder,
  tz1Encoder,
  zarithEncoder,
} from '../codec';
import { CODEC } from '../constants';
import {
  entrypointNameEncoderProto14,
  parametersEncoderProto14,
  valueParameterEncoderProto14,
} from './codec-proto14';
import { scriptEncoderProto14 } from './michelson/codec-proto14';
import {
  ActivationSchema,
  BallotSchema,
  DelegationSchema,
  EndorsementSchema,
  IncreasePaidStorageSchema,
  ManagerOperationSchema,
  operationEncoder,
  OriginationSchema,
  ProposalsSchema,
  RegisterGlobalConstantSchema,
  RevealSchema,
  schemaEncoder,
  SeedNonceRevelationSchema,
  TransactionSchema,
  TransferTicketSchema,
  TxRollupOriginationSchema,
  TxRollupSubmitBatchSchema,
} from '../schema/operation';

export type Encoder<T> = (val: T) => string;

export const encodersProto14: { [key: string]: Encoder<any> } = {
  [CODEC.SECRET]: (val: string) => val,
  [CODEC.RAW]: (val: string) => val,
  [CODEC.TZ1]: tz1Encoder,
  [CODEC.BRANCH]: branchEncoder,
  [CODEC.ZARITH]: zarithEncoder,
  [CODEC.PUBLIC_KEY]: publicKeyEncoder,
  [CODEC.PKH]: pkhEncoder,
  [CODEC.DELEGATE]: delegateEncoder,
  [CODEC.SCRIPT]: scriptEncoderProto14,
  [CODEC.BALLOT_STATEMENT]: ballotEncoder,
  [CODEC.PROPOSAL]: proposalEncoder,
  [CODEC.PROPOSAL_ARR]: proposalsEncoder,
  [CODEC.INT32]: int32Encoder,
  [CODEC.PARAMETERS]: parametersEncoderProto14,
  [CODEC.ADDRESS]: addressEncoder,
  [CODEC.SMART_CONTRACT_ADDRESS]: smartContractAddressEncoder,
  [CODEC.VALUE]: valueParameterEncoderProto14,
  [CODEC.INT16]: int16Encoder,
  [CODEC.BLOCK_PAYLOAD_HASH]: blockPayloadHashEncoder,
  [CODEC.ENTRYPOINT]: entrypointNameEncoderProto14,
  [CODEC.TX_ROLLUP_ORIGINATION_PARAM]: txRollupOriginationParamEncoder,
  [CODEC.TX_ROLLUP_ID]: txRollupIdEncoder,
  [CODEC.TX_ROLLUP_BATCH_CONTENT]: txRollupBatchContentEncoder,
  [CODEC.BURN_LIMIT]: burnLimitEncoder,
};

encodersProto14[CODEC.OPERATION] = operationEncoder(encodersProto14);
encodersProto14[CODEC.OP_ACTIVATE_ACCOUNT] = (val: any) =>
  schemaEncoder(encodersProto14)(ActivationSchema)(val);
encodersProto14[CODEC.OP_DELEGATION] = (val: any) =>
  schemaEncoder(encodersProto14)(DelegationSchema)(val);
encodersProto14[CODEC.OP_TRANSACTION] = (val: any) =>
  schemaEncoder(encodersProto14)(TransactionSchema)(val);
encodersProto14[CODEC.OP_ORIGINATION] = (val: any) =>
  schemaEncoder(encodersProto14)(OriginationSchema)(val);
encodersProto14[CODEC.OP_BALLOT] = (val: any) => schemaEncoder(encodersProto14)(BallotSchema)(val);
encodersProto14[CODEC.OP_ENDORSEMENT] = (val: any) =>
  schemaEncoder(encodersProto14)(EndorsementSchema)(val);
encodersProto14[CODEC.OP_SEED_NONCE_REVELATION] = (val: any) =>
  schemaEncoder(encodersProto14)(SeedNonceRevelationSchema)(val);
encodersProto14[CODEC.OP_PROPOSALS] = (val: any) =>
  schemaEncoder(encodersProto14)(ProposalsSchema)(val);
encodersProto14[CODEC.OP_REVEAL] = (val: any) => schemaEncoder(encodersProto14)(RevealSchema)(val);
encodersProto14[CODEC.OP_REGISTER_GLOBAL_CONSTANT] = (val: any) =>
  schemaEncoder(encodersProto14)(RegisterGlobalConstantSchema)(val);
encodersProto14[CODEC.OP_TRANSFER_TICKET] = (val: any) =>
  schemaEncoder(encodersProto14)(TransferTicketSchema)(val);
encodersProto14[CODEC.OP_TX_ROLLUP_ORIGINATION] = (val: any) =>
  schemaEncoder(encodersProto14)(TxRollupOriginationSchema)(val);
encodersProto14[CODEC.OP_TX_ROLLUP_SUBMIT_BATCH] = (val: any) =>
  schemaEncoder(encodersProto14)(TxRollupSubmitBatchSchema)(val);
encodersProto14[CODEC.OP_INCREASE_PAID_STORAGE] = (val: any) =>
  schemaEncoder(encodersProto14)(IncreasePaidStorageSchema)(val);
encodersProto14[CODEC.MANAGER] = schemaEncoder(encodersProto14)(ManagerOperationSchema);
