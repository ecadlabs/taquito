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
  paddedBytesEncoder,
  parametersEncoder,
  publicKeyHashEncoder,
  publicKeyHashesEncoder,
  smartRollupMessageEncoder,
  proposalEncoder,
  proposalsEncoder,
  publicKeyEncoder,
  depositsLimitEncoder,
  pvmKindEncoder,
  smartContractAddressEncoder,
  smartRollupAddressEncoder,
  smartRollupCommitmentHashEncoder,
  tz1Encoder,
  valueParameterEncoder,
  zarithEncoder,
  slotHeaderEncoder,
} from './codec-proto021';
import { CODEC } from './constants-proto021';
import { scriptEncoder } from './michelson/codec';
import {
  ActivationSchema,
  BallotSchema,
  DelegationSchema,
  AttestationSchema,
  AttestationWithDalSchema,
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
  SetDepositsLimitSchema,
  SmartRollupOriginateSchema,
  SmartRollupExecuteOutboxMessageSchema,
  SmartRollupAddMessagesSchema,
  DalPublishCommitmentSchema,
  FailingNoopSchema,
} from './schema/operation-proto021';

export type Encoder<T> = (val: T) => string;

export const encodersProto021: { [key: string]: Encoder<any> } = {
  [CODEC.SECRET]: (val: string) => val,
  [CODEC.RAW]: (val: string) => val,
  [CODEC.TZ1]: tz1Encoder,
  [CODEC.BRANCH]: branchEncoder,
  [CODEC.ZARITH]: zarithEncoder,
  [CODEC.PUBLIC_KEY]: publicKeyEncoder,
  [CODEC.PKH]: publicKeyHashEncoder,
  [CODEC.PKH_ARR]: publicKeyHashesEncoder,
  [CODEC.DELEGATE]: delegateEncoder,
  [CODEC.SCRIPT]: scriptEncoder,
  [CODEC.BALLOT_STATEMENT]: ballotEncoder,
  [CODEC.PROPOSAL]: proposalEncoder,
  [CODEC.PROPOSAL_ARR]: proposalsEncoder,
  [CODEC.INT32]: int32Encoder,
  [CODEC.PARAMETERS]: parametersEncoder,
  [CODEC.ADDRESS]: addressEncoder,
  [CODEC.SMART_ROLLUP_ADDRESS]: smartRollupAddressEncoder,
  [CODEC.SMART_CONTRACT_ADDRESS]: smartContractAddressEncoder,
  [CODEC.SMART_ROLLUP_COMMITMENT_HASH]: smartRollupCommitmentHashEncoder,
  [CODEC.VALUE]: valueParameterEncoder,
  [CODEC.INT16]: int16Encoder,
  [CODEC.BLOCK_PAYLOAD_HASH]: blockPayloadHashEncoder,
  [CODEC.ENTRYPOINT]: entrypointNameEncoder,
  [CODEC.BURN_LIMIT]: burnLimitEncoder,
  [CODEC.DEPOSITS_LIMIT]: depositsLimitEncoder,
  [CODEC.PVM_KIND]: pvmKindEncoder,
  [CODEC.PADDED_BYTES]: paddedBytesEncoder,
  [CODEC.SMART_ROLLUP_MESSAGE]: smartRollupMessageEncoder,
  [CODEC.SLOT_HEADER]: slotHeaderEncoder,
};

encodersProto021[CODEC.OPERATION] = operationEncoder(encodersProto021);
encodersProto021[CODEC.OP_ACTIVATE_ACCOUNT] = (val: any) =>
  schemaEncoder(encodersProto021)(ActivationSchema)(val);
encodersProto021[CODEC.OP_DELEGATION] = (val: any) =>
  schemaEncoder(encodersProto021)(DelegationSchema)(val);
encodersProto021[CODEC.OP_TRANSACTION] = (val: any) =>
  schemaEncoder(encodersProto021)(TransactionSchema)(val);
encodersProto021[CODEC.OP_ORIGINATION] = (val: any) =>
  schemaEncoder(encodersProto021)(OriginationSchema)(val);
encodersProto021[CODEC.OP_BALLOT] = (val: any) =>
  schemaEncoder(encodersProto021)(BallotSchema)(val);
encodersProto021[CODEC.OP_ATTESTATION] = (val: any) =>
  schemaEncoder(encodersProto021)(AttestationSchema)(val);
encodersProto021[CODEC.OP_ATTESTATION_WITH_DAL] = (val: any) =>
  schemaEncoder(encodersProto021)(AttestationWithDalSchema)(val);
encodersProto021[CODEC.OP_SEED_NONCE_REVELATION] = (val: any) =>
  schemaEncoder(encodersProto021)(SeedNonceRevelationSchema)(val);
encodersProto021[CODEC.OP_PROPOSALS] = (val: any) =>
  schemaEncoder(encodersProto021)(ProposalsSchema)(val);
encodersProto021[CODEC.OP_REVEAL] = (val: any) =>
  schemaEncoder(encodersProto021)(RevealSchema)(val);
encodersProto021[CODEC.OP_REGISTER_GLOBAL_CONSTANT] = (val: any) =>
  schemaEncoder(encodersProto021)(RegisterGlobalConstantSchema)(val);
encodersProto021[CODEC.OP_TRANSFER_TICKET] = (val: any) =>
  schemaEncoder(encodersProto021)(TransferTicketSchema)(val);
encodersProto021[CODEC.OP_INCREASE_PAID_STORAGE] = (val: any) =>
  schemaEncoder(encodersProto021)(IncreasePaidStorageSchema)(val);
encodersProto021[CODEC.OP_UPDATE_CONSENSUS_KEY] = (val: any) =>
  schemaEncoder(encodersProto021)(UpdateConsensusKeySchema)(val);
encodersProto021[CODEC.OP_DRAIN_DELEGATE] = (val: any) =>
  schemaEncoder(encodersProto021)(DrainDelegateSchema)(val);
encodersProto021[CODEC.OP_SMART_ROLLUP_ORIGINATE] = (val: any) =>
  schemaEncoder(encodersProto021)(SmartRollupOriginateSchema)(val);
encodersProto021[CODEC.OP_SMART_ROLLUP_ADD_MESSAGES] = (val: any) =>
  schemaEncoder(encodersProto021)(SmartRollupAddMessagesSchema)(val);
encodersProto021[CODEC.OP_SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE] = (val: any) =>
  schemaEncoder(encodersProto021)(SmartRollupExecuteOutboxMessageSchema)(val);
encodersProto021[CODEC.OP_DAL_PUBLISH_COMMITMENT] = (val: any) =>
  schemaEncoder(encodersProto021)(DalPublishCommitmentSchema)(val);
encodersProto021[CODEC.MANAGER] = schemaEncoder(encodersProto021)(ManagerOperationSchema);
encodersProto021[CODEC.OP_SET_DEPOSITS_LIMIT] = (val) =>
  schemaEncoder(encodersProto021)(SetDepositsLimitSchema)(val);
encodersProto021[CODEC.OP_FAILING_NOOP] = (val: any) =>
  schemaEncoder(encodersProto021)(FailingNoopSchema)(val);
