import { Decoder } from '../decoder';
import { Uint8ArrayConsumer } from '../uint8array-consumer';
import { CODEC, kindMapping, kindMappingReverse } from '../constants';
import { InvalidOperationKindError } from '@taquito/utils';
import {
  OperationDecodingError,
  OperationEncodingError,
  UnsupportedOperationError,
} from '../error';

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

export const EndorsementSchema = {
  slot: CODEC.INT16,
  level: CODEC.INT32,
  round: CODEC.INT32,
  block_payload_hash: CODEC.BLOCK_PAYLOAD_HASH,
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

export const TxRollupOriginationSchema = {
  source: CODEC.PKH,
  fee: CODEC.ZARITH,
  counter: CODEC.ZARITH,
  gas_limit: CODEC.ZARITH,
  storage_limit: CODEC.ZARITH,
  tx_rollup_origination: CODEC.TX_ROLLUP_ORIGINATION_PARAM,
};

export const TxRollupSubmitBatchSchema = {
  source: CODEC.PKH,
  fee: CODEC.ZARITH,
  counter: CODEC.ZARITH,
  gas_limit: CODEC.ZARITH,
  storage_limit: CODEC.ZARITH,
  rollup: CODEC.TX_ROLLUP_ID,
  content: CODEC.TX_ROLLUP_BATCH_CONTENT,
  burn_limit: CODEC.BURN_LIMIT,
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
};

export const DrainDelegateSchema = {
  consensus_key: CODEC.PKH,
  delegate: CODEC.PKH,
  destination: CODEC.PKH,
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
      throw new OperationDecodingError('Decoded invalid operation');
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
          throw new OperationEncodingError(`Expected value to be Array ${JSON.stringify(values)}`);
        }

        return prev + values.reduce((prevBytes, current) => prevBytes + encoder(current), '');
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
