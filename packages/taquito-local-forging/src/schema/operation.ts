import { Decoder } from '../decoder';
import { Uint8ArrayConsumer } from '../uint8array-consumer';
import { CODEC, kindMapping, kindMappingReverse } from '../constants';
import { InvalidOperationKindError } from '@taquito/core';
import {
  OperationDecodingError,
  OperationEncodingError,
  UnsupportedOperationError,
} from '../errors';

export const ManagerOperationSchema = {
  branch: CODEC.BRANCH,
  contents: [CODEC.OPERATION],
};

export const ActivationSchema = {
  pkh: CODEC.TZ1,
  secret: CODEC.SECRET,
};

export const RevealSchema = {
  source: CODEC.PKH,
  fee: CODEC.ZARITH,
  counter: CODEC.ZARITH,
  gas_limit: CODEC.ZARITH,
  storage_limit: CODEC.ZARITH,
  public_key: CODEC.PUBLIC_KEY,
  proof: CODEC.SIGNATURE_PROOF,
};

export const DelegationSchema = {
  source: CODEC.PKH,
  fee: CODEC.ZARITH,
  counter: CODEC.ZARITH,
  gas_limit: CODEC.ZARITH,
  storage_limit: CODEC.ZARITH,
  delegate: CODEC.DELEGATE,
};

export const TransactionSchema = {
  source: CODEC.PKH,
  fee: CODEC.ZARITH,
  counter: CODEC.ZARITH,
  gas_limit: CODEC.ZARITH,
  storage_limit: CODEC.ZARITH,
  amount: CODEC.ZARITH,
  destination: CODEC.ADDRESS,
  parameters: CODEC.PARAMETERS,
};

export const OriginationSchema = {
  source: CODEC.PKH,
  fee: CODEC.ZARITH,
  counter: CODEC.ZARITH,
  gas_limit: CODEC.ZARITH,
  storage_limit: CODEC.ZARITH,
  balance: CODEC.ZARITH,
  delegate: CODEC.DELEGATE,
  script: CODEC.SCRIPT,
};

export const BallotSchema = {
  source: CODEC.PKH,
  period: CODEC.INT32,
  proposal: CODEC.PROPOSAL,
  ballot: CODEC.BALLOT_STATEMENT,
};

export const AttestationSchema = {
  slot: CODEC.INT16,
  level: CODEC.INT32,
  round: CODEC.INT32,
  block_payload_hash: CODEC.BLOCK_PAYLOAD_HASH,
};

export const AttestationWithDalSchema = {
  slot: CODEC.INT16,
  level: CODEC.INT32,
  round: CODEC.INT32,
  block_payload_hash: CODEC.BLOCK_PAYLOAD_HASH,
  dal_attestation: CODEC.ZARITH,
};

export const SeedNonceRevelationSchema = {
  level: CODEC.INT32,
  nonce: CODEC.RAW,
};

export const ProposalsSchema = {
  source: CODEC.PKH,
  period: CODEC.INT32,
  proposals: CODEC.PROPOSAL_ARR,
};

export const RegisterGlobalConstantSchema = {
  source: CODEC.PKH,
  fee: CODEC.ZARITH,
  counter: CODEC.ZARITH,
  gas_limit: CODEC.ZARITH,
  storage_limit: CODEC.ZARITH,
  value: CODEC.VALUE,
};

export const TransferTicketSchema = {
  source: CODEC.PKH,
  fee: CODEC.ZARITH,
  counter: CODEC.ZARITH,
  gas_limit: CODEC.ZARITH,
  storage_limit: CODEC.ZARITH,
  ticket_contents: CODEC.VALUE,
  ticket_ty: CODEC.VALUE,
  ticket_ticketer: CODEC.ADDRESS,
  ticket_amount: CODEC.ZARITH,
  destination: CODEC.ADDRESS,
  entrypoint: CODEC.ENTRYPOINT,
};

export const IncreasePaidStorageSchema = {
  source: CODEC.PKH,
  fee: CODEC.ZARITH,
  counter: CODEC.ZARITH,
  gas_limit: CODEC.ZARITH,
  storage_limit: CODEC.ZARITH,
  amount: CODEC.ZARITH,
  destination: CODEC.SMART_CONTRACT_ADDRESS,
};

export const UpdateConsensusKeySchema = {
  source: CODEC.PKH,
  fee: CODEC.ZARITH,
  counter: CODEC.ZARITH,
  gas_limit: CODEC.ZARITH,
  storage_limit: CODEC.ZARITH,
  pk: CODEC.PUBLIC_KEY,
  proof: CODEC.SIGNATURE_PROOF,
};

export const UpdateCompanionKeySchema = {
  source: CODEC.PKH,
  fee: CODEC.ZARITH,
  counter: CODEC.ZARITH,
  gas_limit: CODEC.ZARITH,
  storage_limit: CODEC.ZARITH,
  pk: CODEC.PUBLIC_KEY,
  proof: CODEC.SIGNATURE_PROOF,
};

export const DrainDelegateSchema = {
  consensus_key: CODEC.PKH,
  delegate: CODEC.PKH,
  destination: CODEC.PKH,
};

export const SetDepositsLimitSchema = {
  source: CODEC.PKH,
  fee: CODEC.ZARITH,
  counter: CODEC.ZARITH,
  gas_limit: CODEC.ZARITH,
  storage_limit: CODEC.ZARITH,
  limit: CODEC.DEPOSITS_LIMIT,
};

export const SmartRollupOriginateSchema = {
  source: CODEC.PKH,
  fee: CODEC.ZARITH,
  counter: CODEC.ZARITH,
  gas_limit: CODEC.ZARITH,
  storage_limit: CODEC.ZARITH,
  pvm_kind: CODEC.PVM_KIND,
  kernel: CODEC.PADDED_BYTES,
  parameters_ty: CODEC.VALUE,
  whitelist: CODEC.PKH_ARR,
};

export const SmartRollupAddMessagesSchema = {
  source: CODEC.PKH,
  fee: CODEC.ZARITH,
  counter: CODEC.ZARITH,
  gas_limit: CODEC.ZARITH,
  storage_limit: CODEC.ZARITH,
  message: CODEC.SMART_ROLLUP_MESSAGE,
};

export const SmartRollupExecuteOutboxMessageSchema = {
  source: CODEC.PKH,
  fee: CODEC.ZARITH,
  counter: CODEC.ZARITH,
  gas_limit: CODEC.ZARITH,
  storage_limit: CODEC.ZARITH,
  rollup: CODEC.SMART_ROLLUP_ADDRESS,
  cemented_commitment: CODEC.SMART_ROLLUP_COMMITMENT_HASH,
  output_proof: CODEC.PADDED_BYTES,
};

export const DalPublishCommitmentSchema = {
  source: CODEC.PKH,
  fee: CODEC.ZARITH,
  counter: CODEC.ZARITH,
  gas_limit: CODEC.ZARITH,
  storage_limit: CODEC.ZARITH,
  slot_header: CODEC.SLOT_HEADER,
};

export const FailingNoopSchema = {
  arbitrary: CODEC.PADDED_BYTES,
};

export const operationEncoder =
  (encoders: { [key: string]: (val: object) => string }) => (operation: { kind: string }) => {
    if (!(operation.kind in encoders) || !(operation.kind in kindMappingReverse)) {
      throw new InvalidOperationKindError(operation.kind);
    }

    return kindMappingReverse[operation.kind] + encoders[operation.kind](operation);
  };

export const operationDecoder =
  (decoders: { [key: string]: Decoder }) => (value: Uint8ArrayConsumer) => {
    const op = value.consume(1);
    const operationName = kindMapping[op[0]];
    if (operationName === undefined) {
      throw new UnsupportedOperationError(op[0].toString());
    }

    const decodedObj = decoders[operationName](value);

    if (typeof decodedObj !== 'object') {
      throw new OperationDecodingError('Invalid operation, cannot be decoded.');
    }

    return {
      kind: operationName,
      ...decodedObj,
    };
  };

type Schema = Record<string, CODEC | CODEC[]>;
export type Value = Record<keyof Schema, unknown[]>;

export const schemaEncoder =
  (encoders: { [key: string]: (val: object) => string }) => (schema: Schema) => (value: Value) => {
    const keys = Object.keys(schema);
    return keys.reduce((prev, key) => {
      const valueToEncode = schema[key] as CODEC;

      if (value && Array.isArray(valueToEncode)) {
        const encoder = encoders[valueToEncode[0]];
        const values = value[key];

        if (!Array.isArray(values)) {
          throw new OperationEncodingError(
            `Invalid operation value "${JSON.stringify(
              values
            )}" of key "${key}, expected value to be Array.`
          );
        }

        return (
          prev + values.reduce((prevBytes, current) => prevBytes + encoder(current as object), '')
        );
      } else {
        const encoder = encoders[valueToEncode];
        return prev + encoder(value[key]);
      }
    }, '');
  };

export const schemaDecoder =
  (decoders: { [key: string]: Decoder }) =>
  (schema: { [key: string]: string | string[] }) =>
  (value: Uint8ArrayConsumer) => {
    const keys = Object.keys(schema);
    return keys.reduce((prev, key) => {
      const valueToEncode = schema[key];

      if (Array.isArray(valueToEncode)) {
        const decoder = decoders[valueToEncode[0]];

        const decoded = [];
        const lastLength = value.length();
        while (value.length() > 0) {
          decoded.push(decoder(value));

          if (lastLength === value.length()) {
            throw new OperationDecodingError('Unable to decode value');
          }
        }

        return {
          ...prev,
          [key]: decoded,
        };
      } else {
        const decoder = decoders[valueToEncode];

        const result = decoder(value);

        if (typeof result !== 'undefined') {
          return {
            ...prev,
            [key]: result,
          };
        } else {
          return {
            ...prev,
          };
        }
      }
    }, {});
  };
