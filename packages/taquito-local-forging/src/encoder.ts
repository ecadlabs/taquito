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
  ManagerOperationSchema,
  operationEncoder,
  OriginationSchema,
  ProposalsSchema,
  RegisterGlobalConstantSchema,
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
  [CODEC.VALUE]: valueParameterEncoder
};

encoders[CODEC.OPERATION] = operationEncoder(encoders);
encoders[CODEC.OP_ACTIVATE_ACCOUNT] = (val) => schemaEncoder(encoders)(ActivationSchema)(val);
encoders[CODEC.OP_DELEGATION] = (val) => schemaEncoder(encoders)(DelegationSchema)(val);
encoders[CODEC.OP_TRANSACTION] = (val) => schemaEncoder(encoders)(TransactionSchema)(val);
encoders[CODEC.OP_ORIGINATION] = (val) => schemaEncoder(encoders)(OriginationSchema)(val);
encoders[CODEC.OP_BALLOT] = (val) => schemaEncoder(encoders)(BallotSchema)(val);
encoders[CODEC.OP_ENDORSEMENT] = (val) => schemaEncoder(encoders)(EndorsementSchema)(val);
encoders[CODEC.OP_SEED_NONCE_REVELATION] = (val) =>
  schemaEncoder(encoders)(SeedNonceRevelationSchema)(val);
encoders[CODEC.OP_PROPOSALS] = (val) => schemaEncoder(encoders)(ProposalsSchema)(val);
encoders[CODEC.OP_REVEAL] = (val) => schemaEncoder(encoders)(RevealSchema)(val);
encoders[CODEC.OP_REGISTER_GLOBAL_CONSTANT] = (val) => schemaEncoder(encoders)(RegisterGlobalConstantSchema)(val);
encoders[CODEC.MANAGER] = schemaEncoder(encoders)(ManagerOperationSchema);
