import { Decoder } from '../decoder';
import { Uint8ArrayConsumer } from '../uint8array-consumer';
import { kindMapping, kindMappingReverse } from '../constants';
import { InvalidOperationKindError } from '@taquito/utils';
import {
  OperationDecodingError,
  OperationEncodingError,
  UnsupportedOperationError,
} from '../error';

export const ManagerOperationSchema = {
  branch: 'branch',
  contents: ['operation'],
};

export const ActivationSchema = {
  pkh: 'tz1',
  secret: 'secret',
};

export const RevealSchema = {
  source: 'pkh',
  fee: 'zarith',
  counter: 'zarith',
  gas_limit: 'zarith',
  storage_limit: 'zarith',
  public_key: 'public_key',
};

export const DelegationSchema = {
  source: 'pkh',
  fee: 'zarith',
  counter: 'zarith',
  gas_limit: 'zarith',
  storage_limit: 'zarith',
  delegate: 'delegate',
};

export const TransactionSchema = {
  source: 'pkh',
  fee: 'zarith',
  counter: 'zarith',
  gas_limit: 'zarith',
  storage_limit: 'zarith',
  amount: 'zarith',
  destination: 'address',
  parameters: 'parameters',
};

export const OriginationSchema = {
  source: 'pkh',
  fee: 'zarith',
  counter: 'zarith',
  gas_limit: 'zarith',
  storage_limit: 'zarith',
  balance: 'zarith',
  delegate: 'delegate',
  script: 'script',
};

export const BallotSchema = {
  source: 'pkh',
  period: 'int32',
  proposal: 'proposal',
  ballot: 'ballotStmt',
};

export const EndorsementSchema = {
  level: 'int32',
};

export const SeedNonceRevelationSchema = {
  level: 'int32',
  nonce: 'raw',
};

export const ProposalsSchema = {
  source: 'pkh',
  period: 'int32',
  proposals: 'proposalArr',
};

export const RegisterGlobalConstantSchema = {
  source: 'pkh',
  fee: 'zarith',
  counter: 'zarith',
  gas_limit: 'zarith',
  storage_limit: 'zarith',
  value: 'value',
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

export const schemaEncoder =
  (encoders: { [key: string]: (val: object) => string }) =>
  (schema: { [key: string]: string | string[] }) =>
  <T extends { [key: string]: any }>(value: T) => {
    const keys = Object.keys(schema);
    return keys.reduce((prev, key) => {
      const valueToEncode = schema[key];

      if (Array.isArray(valueToEncode)) {
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
