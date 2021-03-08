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
  } from './codecPsrsRVg1';
  import { CODEC } from './constantsPsrsRVg1';
  import { scriptEncoder } from '../michelson/codec';
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
  } from '../schema/operation';
  
  export type Encoder<T> = (val: T) => string;
  
  export const encodersPsrsRVg1: { [key: string]: Encoder<any> } = {
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
  
  encodersPsrsRVg1[CODEC.OPERATION] = operationEncoder(encodersPsrsRVg1);
  encodersPsrsRVg1[CODEC.OP_ACTIVATE_ACCOUNT] = (val: any) => schemaEncoder(encodersPsrsRVg1)(ActivationSchema)(val);
  encodersPsrsRVg1[CODEC.OP_DELEGATION] = (val: any) => schemaEncoder(encodersPsrsRVg1)(DelegationSchema)(val);
  encodersPsrsRVg1[CODEC.OP_TRANSACTION] = (val: any) => schemaEncoder(encodersPsrsRVg1)(TransactionSchema)(val);
  encodersPsrsRVg1[CODEC.OP_ORIGINATION] = (val: any) => schemaEncoder(encodersPsrsRVg1)(OriginationSchema)(val);
  encodersPsrsRVg1[CODEC.OP_BALLOT] = (val: any) => schemaEncoder(encodersPsrsRVg1)(BallotSchema)(val);
  encodersPsrsRVg1[CODEC.OP_ENDORSEMENT] = (val: any) => schemaEncoder(encodersPsrsRVg1)(EndorsementSchema)(val);
  encodersPsrsRVg1[CODEC.OP_SEED_NONCE_REVELATION] = (val: any) =>
    schemaEncoder(encodersPsrsRVg1)(SeedNonceRevelationSchema)(val);
  encodersPsrsRVg1[CODEC.OP_PROPOSALS] = (val: any) => schemaEncoder(encodersPsrsRVg1)(ProposalsSchema)(val);
  encodersPsrsRVg1[CODEC.OP_REVEAL] = (val: any) => schemaEncoder(encodersPsrsRVg1)(RevealSchema)(val);
  encodersPsrsRVg1[CODEC.MANAGER] = schemaEncoder(encodersPsrsRVg1)(ManagerOperationSchema);
  