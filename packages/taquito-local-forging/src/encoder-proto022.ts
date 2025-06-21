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
  signatureProofEncoder,
  pvmKindEncoder,
  smartContractAddressEncoder,
  smartRollupAddressEncoder,
  smartRollupCommitmentHashEncoder,
  tz1Encoder,
  valueParameterEncoder,
  zarithEncoder,
  slotHeaderEncoder,
} from './codec-proto022';
import { CODEC } from './constants-proto022';
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
} from './schema/operation-proto022';

export type Encoder<T> = (val: T) => string;

export const encoders: { [key: string]: Encoder<any> } = {
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
  [CODEC.SIGNATURE_PROOF]: signatureProofEncoder,
  [CODEC.PVM_KIND]: pvmKindEncoder,
  [CODEC.PADDED_BYTES]: paddedBytesEncoder,
  [CODEC.SMART_ROLLUP_MESSAGE]: smartRollupMessageEncoder,
  [CODEC.SLOT_HEADER]: slotHeaderEncoder,
};

encoders[CODEC.OPERATION] = operationEncoder(encoders);
encoders[CODEC.OP_ACTIVATE_ACCOUNT] = (val: any) => schemaEncoder(encoders)(ActivationSchema)(val);
encoders[CODEC.OP_DELEGATION] = (val: any) => schemaEncoder(encoders)(DelegationSchema)(val);
encoders[CODEC.OP_TRANSACTION] = (val: any) => schemaEncoder(encoders)(TransactionSchema)(val);
encoders[CODEC.OP_ORIGINATION] = (val: any) => schemaEncoder(encoders)(OriginationSchema)(val);
encoders[CODEC.OP_BALLOT] = (val: any) => schemaEncoder(encoders)(BallotSchema)(val);
encoders[CODEC.OP_ATTESTATION] = (val: any) => schemaEncoder(encoders)(AttestationSchema)(val);
encoders[CODEC.OP_ATTESTATION_WITH_DAL] = (val: any) =>
  schemaEncoder(encoders)(AttestationWithDalSchema)(val);
encoders[CODEC.OP_SEED_NONCE_REVELATION] = (val: any) =>
  schemaEncoder(encoders)(SeedNonceRevelationSchema)(val);
encoders[CODEC.OP_PROPOSALS] = (val: any) => schemaEncoder(encoders)(ProposalsSchema)(val);
encoders[CODEC.OP_REVEAL] = (val: any) => schemaEncoder(encoders)(RevealSchema)(val);
encoders[CODEC.OP_REGISTER_GLOBAL_CONSTANT] = (val: any) =>
  schemaEncoder(encoders)(RegisterGlobalConstantSchema)(val);
encoders[CODEC.OP_TRANSFER_TICKET] = (val: any) =>
  schemaEncoder(encoders)(TransferTicketSchema)(val);
encoders[CODEC.OP_INCREASE_PAID_STORAGE] = (val: any) =>
  schemaEncoder(encoders)(IncreasePaidStorageSchema)(val);
encoders[CODEC.OP_UPDATE_CONSENSUS_KEY] = (val: any) =>
  schemaEncoder(encoders)(UpdateConsensusKeySchema)(val);
encoders[CODEC.OP_DRAIN_DELEGATE] = (val: any) => schemaEncoder(encoders)(DrainDelegateSchema)(val);
encoders[CODEC.OP_SMART_ROLLUP_ORIGINATE] = (val: any) =>
  schemaEncoder(encoders)(SmartRollupOriginateSchema)(val);
encoders[CODEC.OP_SMART_ROLLUP_ADD_MESSAGES] = (val: any) =>
  schemaEncoder(encoders)(SmartRollupAddMessagesSchema)(val);
encoders[CODEC.OP_SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE] = (val: any) =>
  schemaEncoder(encoders)(SmartRollupExecuteOutboxMessageSchema)(val);
encoders[CODEC.OP_DAL_PUBLISH_COMMITMENT] = (val: any) =>
  schemaEncoder(encoders)(DalPublishCommitmentSchema)(val);
encoders[CODEC.MANAGER] = schemaEncoder(encoders)(ManagerOperationSchema);
encoders[CODEC.OP_SET_DEPOSITS_LIMIT] = (val) =>
  schemaEncoder(encoders)(SetDepositsLimitSchema)(val);
encoders[CODEC.OP_FAILING_NOOP] = (val: any) => schemaEncoder(encoders)(FailingNoopSchema)(val);
