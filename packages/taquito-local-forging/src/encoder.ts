import {
  addressEncoder,
  ballotEncoder,
  blockPayloadHashEncoder,
  branchEncoder,
  burnLimitEncoder,
  delegateEncoder,
  entrypointNameEncoder,
  int16Encoder,
  int32Encoder,
  parametersEncoder,
  pkhEncoder,
  proposalEncoder,
  proposalsEncoder,
  publicKeyEncoder,
  smartContractAddressEncoder,
  txRollupBatchContentEncoder,
  txRollupIdEncoder,
  txRollupOriginationParamEncoder,
  tz1Encoder,
  valueParameterEncoder,
  zarithEncoder,
} from './codec';
import { CODEC } from './constants';
import { scriptEncoder } from './michelson/codec';
import {
  ActivationSchema,
  BallotSchema,
  DelegationSchema,
  EndorsementSchema,
  IncreasePaidStorageSchema,
  UpdateConsensusKeySchema,
  DrainDelegateSchema,
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
} from './schema/operation';

export type Encoder<T> = (val: T) => string;

export const encoders: { [key: string]: Encoder<any> } = {
  [CODEC.SECRET]: (val: string) => val,
  [CODEC.RAW]: (val: string) => val,
  [CODEC.TZ1]: tz1Encoder,
  [CODEC.BRANCH]: branchEncoder,
  [CODEC.ZARITH]: zarithEncoder,
  [CODEC.PUBLIC_KEY]: publicKeyEncoder,
  [CODEC.PKH]: pkhEncoder,
  [CODEC.DELEGATE]: delegateEncoder,
  [CODEC.SCRIPT]: scriptEncoder,
  [CODEC.BALLOT_STATEMENT]: ballotEncoder,
  [CODEC.PROPOSAL]: proposalEncoder,
  [CODEC.PROPOSAL_ARR]: proposalsEncoder,
  [CODEC.INT32]: int32Encoder,
  [CODEC.PARAMETERS]: parametersEncoder,
  [CODEC.ADDRESS]: addressEncoder,
  [CODEC.SMART_CONTRACT_ADDRESS]: smartContractAddressEncoder,
  [CODEC.VALUE]: valueParameterEncoder,
  [CODEC.INT16]: int16Encoder,
  [CODEC.BLOCK_PAYLOAD_HASH]: blockPayloadHashEncoder,
  [CODEC.ENTRYPOINT]: entrypointNameEncoder,
  [CODEC.TX_ROLLUP_ORIGINATION_PARAM]: txRollupOriginationParamEncoder,
  [CODEC.TX_ROLLUP_ID]: txRollupIdEncoder,
  [CODEC.TX_ROLLUP_BATCH_CONTENT]: txRollupBatchContentEncoder,
  [CODEC.BURN_LIMIT]: burnLimitEncoder,
};

encoders[CODEC.OPERATION] = operationEncoder(encoders);
encoders[CODEC.OP_ACTIVATE_ACCOUNT] = (val: any) => schemaEncoder(encoders)(ActivationSchema)(val);
encoders[CODEC.OP_DELEGATION] = (val: any) => schemaEncoder(encoders)(DelegationSchema)(val);
encoders[CODEC.OP_TRANSACTION] = (val: any) => schemaEncoder(encoders)(TransactionSchema)(val);
encoders[CODEC.OP_ORIGINATION] = (val: any) => schemaEncoder(encoders)(OriginationSchema)(val);
encoders[CODEC.OP_BALLOT] = (val: any) => schemaEncoder(encoders)(BallotSchema)(val);
encoders[CODEC.OP_ENDORSEMENT] = (val: any) => schemaEncoder(encoders)(EndorsementSchema)(val);
encoders[CODEC.OP_SEED_NONCE_REVELATION] = (val: any) =>
  schemaEncoder(encoders)(SeedNonceRevelationSchema)(val);
encoders[CODEC.OP_PROPOSALS] = (val: any) => schemaEncoder(encoders)(ProposalsSchema)(val);
encoders[CODEC.OP_REVEAL] = (val: any) => schemaEncoder(encoders)(RevealSchema)(val);
encoders[CODEC.OP_REGISTER_GLOBAL_CONSTANT] = (val: any) =>
  schemaEncoder(encoders)(RegisterGlobalConstantSchema)(val);
encoders[CODEC.OP_TRANSFER_TICKET] = (val: any) =>
  schemaEncoder(encoders)(TransferTicketSchema)(val);
encoders[CODEC.OP_TX_ROLLUP_ORIGINATION] = (val: any) =>
  schemaEncoder(encoders)(TxRollupOriginationSchema)(val);
encoders[CODEC.OP_TX_ROLLUP_SUBMIT_BATCH] = (val: any) =>
  schemaEncoder(encoders)(TxRollupSubmitBatchSchema)(val);
encoders[CODEC.OP_INCREASE_PAID_STORAGE] = (val: any) =>
  schemaEncoder(encoders)(IncreasePaidStorageSchema)(val);
encoders[CODEC.OP_UPDATE_CONSENSUS_KEY] = (val: any) =>
  schemaEncoder(encoders)(UpdateConsensusKeySchema)(val);
encoders[CODEC.OP_DRAIN_DELEGATE] = (val: any) => schemaEncoder(encoders)(DrainDelegateSchema)(val);
encoders[CODEC.MANAGER] = schemaEncoder(encoders)(ManagerOperationSchema);
