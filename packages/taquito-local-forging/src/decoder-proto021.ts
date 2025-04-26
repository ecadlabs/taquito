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
  paddedBytesDecoder,
  parametersDecoder,
  publicKeyHashDecoder,
  publicKeyHashesDecoder,
  smartRollupMessageDecoder,
  proposalDecoder,
  proposalsDecoder,
  publicKeyDecoder,
  depositsLimitDecoder,
  pvmKindDecoder,
  smartContractAddressDecoder,
  smartRollupAddressDecoder,
  smartRollupCommitmentHashDecoder,
  tz1Decoder,
  valueParameterDecoder,
  zarithDecoder,
  slotHeaderDecoder,
} from './codec-proto021';
import { CODEC } from './constants-proto021';
import { scriptDecoder } from './michelson/codec';
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
  operationDecoder,
  OriginationSchema,
  ProposalsSchema,
  RegisterGlobalConstantSchema,
  RevealSchema,
  schemaDecoder,
  SeedNonceRevelationSchema,
  TransactionSchema,
  TransferTicketSchema,
  SetDepositsLimitSchema,
  SmartRollupOriginateSchema,
  SmartRollupAddMessagesSchema,
  SmartRollupExecuteOutboxMessageSchema,
  DalPublishCommitmentSchema,
  FailingNoopSchema,
} from './schema/operation-proto021';
import { Uint8ArrayConsumer } from './uint8array-consumer';
import { toHexString } from './utils';

export type Decoder = (val: Uint8ArrayConsumer) => string | number | object | undefined;

export const decodersProto021: { [key: string]: Decoder } = {
  [CODEC.SECRET]: (val) => toHexString(val.consume(20)),
  [CODEC.RAW]: (val) => toHexString(val.consume(32)),
  [CODEC.TZ1]: tz1Decoder,
  [CODEC.BRANCH]: branchDecoder,
  [CODEC.ZARITH]: zarithDecoder,
  [CODEC.PUBLIC_KEY]: publicKeyDecoder,
  [CODEC.PKH]: publicKeyHashDecoder,
  [CODEC.PKH_ARR]: publicKeyHashesDecoder,
  [CODEC.DELEGATE]: delegateDecoder,
  [CODEC.INT32]: int32Decoder,
  [CODEC.SCRIPT]: scriptDecoder,
  [CODEC.BALLOT_STATEMENT]: ballotDecoder,
  [CODEC.PROPOSAL]: proposalDecoder,
  [CODEC.PROPOSAL_ARR]: proposalsDecoder,
  [CODEC.PARAMETERS]: parametersDecoder,
  [CODEC.ADDRESS]: addressDecoder,
  [CODEC.SMART_ROLLUP_ADDRESS]: smartRollupAddressDecoder,
  [CODEC.SMART_CONTRACT_ADDRESS]: smartContractAddressDecoder,
  [CODEC.SMART_ROLLUP_COMMITMENT_HASH]: smartRollupCommitmentHashDecoder,
  [CODEC.VALUE]: valueParameterDecoder,
  [CODEC.INT16]: int16Decoder,
  [CODEC.BLOCK_PAYLOAD_HASH]: blockPayloadHashDecoder,
  [CODEC.ENTRYPOINT]: entrypointNameDecoder,
  [CODEC.BURN_LIMIT]: burnLimitDecoder,
  [CODEC.DEPOSITS_LIMIT]: depositsLimitDecoder,
  [CODEC.PVM_KIND]: pvmKindDecoder,
  [CODEC.PADDED_BYTES]: paddedBytesDecoder,
  [CODEC.SMART_ROLLUP_MESSAGE]: smartRollupMessageDecoder,
  [CODEC.SLOT_HEADER]: slotHeaderDecoder,
};

decodersProto021[CODEC.OPERATION] = operationDecoder(decodersProto021);
decodersProto021[CODEC.OP_ACTIVATE_ACCOUNT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(ActivationSchema)(val);
decodersProto021[CODEC.OP_FAILING_NOOP] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(FailingNoopSchema)(val);
decodersProto021[CODEC.OP_DELEGATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(DelegationSchema)(val);
decodersProto021[CODEC.OP_TRANSACTION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(TransactionSchema)(val);
decodersProto021[CODEC.OP_ORIGINATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(OriginationSchema)(val);
decodersProto021[CODEC.OP_BALLOT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(BallotSchema)(val);
decodersProto021[CODEC.OP_ATTESTATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(AttestationSchema)(val);
decodersProto021[CODEC.OP_ATTESTATION_WITH_DAL] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(AttestationWithDalSchema)(val);
decodersProto021[CODEC.OP_SEED_NONCE_REVELATION] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(SeedNonceRevelationSchema)(val);
decodersProto021[CODEC.OP_PROPOSALS] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(ProposalsSchema)(val);
decodersProto021[CODEC.OP_REVEAL] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(RevealSchema)(val);
decodersProto021[CODEC.OP_REGISTER_GLOBAL_CONSTANT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(RegisterGlobalConstantSchema)(val);
decodersProto021[CODEC.OP_TRANSFER_TICKET] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(TransferTicketSchema)(val);
decodersProto021[CODEC.OP_INCREASE_PAID_STORAGE] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(IncreasePaidStorageSchema)(val);
decodersProto021[CODEC.OP_UPDATE_CONSENSUS_KEY] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(UpdateConsensusKeySchema)(val);
decodersProto021[CODEC.OP_DRAIN_DELEGATE] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(DrainDelegateSchema)(val);
decodersProto021[CODEC.OP_SMART_ROLLUP_ORIGINATE] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(SmartRollupOriginateSchema)(val);
decodersProto021[CODEC.OP_SMART_ROLLUP_ADD_MESSAGES] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(SmartRollupAddMessagesSchema)(val);
decodersProto021[CODEC.OP_SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(SmartRollupExecuteOutboxMessageSchema)(val);
decodersProto021[CODEC.OP_DAL_PUBLISH_COMMITMENT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(DalPublishCommitmentSchema)(val);
decodersProto021[CODEC.MANAGER] = schemaDecoder(decodersProto021)(ManagerOperationSchema);
decodersProto021[CODEC.OP_SET_DEPOSITS_LIMIT] = (val: Uint8ArrayConsumer) =>
  schemaDecoder(decodersProto021)(SetDepositsLimitSchema)(val);
