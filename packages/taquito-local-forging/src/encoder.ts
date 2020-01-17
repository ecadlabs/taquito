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
  secret: (val: string) => val,
  raw: (val: string) => val,
  tz1: tz1Encoder,
  branch: branchEncoder,
  zarith: zarithEncoder,
  public_key: publicKeyEncoder,
  pkh: pkhEncoder,
  delegate: delegateEncoder,
  script: scriptEncoder,
  ballotStmt: ballotEncoder,
  proposal: proposalEncoder,
  proposalArr: proposalsEncoder,
  int32: int32Encoder,
  parameters: parametersEncoder,
  address: addressEncoder,
};

encoders['operation'] = operationEncoder(encoders);
encoders['activate_account'] = (val: any) => schemaEncoder(encoders)(ActivationSchema)(val);
encoders['delegation'] = (val: any) => schemaEncoder(encoders)(DelegationSchema)(val);
encoders['transaction'] = (val: any) => schemaEncoder(encoders)(TransactionSchema)(val);
encoders['origination'] = (val: any) => schemaEncoder(encoders)(OriginationSchema)(val);
encoders['ballot'] = (val: any) => schemaEncoder(encoders)(BallotSchema)(val);
encoders['endorsement'] = (val: any) => schemaEncoder(encoders)(EndorsementSchema)(val);
encoders['seed_nonce_revelation'] = (val: any) =>
  schemaEncoder(encoders)(SeedNonceRevelationSchema)(val);
encoders['proposals'] = (val: any) => schemaEncoder(encoders)(ProposalsSchema)(val);
encoders['reveal'] = (val: any) => schemaEncoder(encoders)(RevealSchema)(val);
encoders['manager'] = schemaEncoder(encoders)(ManagerOperationSchema);
