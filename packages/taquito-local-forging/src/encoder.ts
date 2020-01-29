import {
  addressEncoder,
  ballotEncoder,
  branchEncoder,
  delegateEncoder,
  int32Encoder,
  parametersEncoder,
  pkhEncoder,
  proposalEncoder,
  proposalsEncoder,
  publicKeyEncoder,
  tz1Encoder,
  zarithEncoder,
} from './codec';
import { CODEC } from './constants';
import { scriptEncoder } from './michelson/codec';
import {
  ActivationSchema,
  BallotSchema,
  DelegationSchema,
  EndorsementSchema,
  ManagerOperationSchema,
  operationEncoder,
  OriginationSchema,
  ProposalsSchema,
  RevealSchema,
  schemaEncoder,
  SeedNonceRevelationSchema,
  TransactionSchema,
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
encoders[CODEC.MANAGER] = schemaEncoder(encoders)(ManagerOperationSchema);
