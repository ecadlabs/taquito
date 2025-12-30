import { OperationContents } from '@taquito/rpc';
import { hex2buf } from '@taquito/utils';
import { encoders, CODEC } from '@taquito/local-forging';
import { TrezorUnsupportedOperationError } from './errors';
import type {
  TrezorOperation,
  TrezorTransactionOp,
  TrezorRevealOp,
  TrezorDelegationOp,
  TrezorProposalOp,
  TrezorBallotOp,
  TrezorBallotType,
} from './types';

/**
 * Parse a string to an integer and validate the result
 * @throws Error if the value cannot be parsed as a valid integer
 */
function parseIntChecked(value: string, fieldName: string): number {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid ${fieldName}: expected a numeric string but got "${value}"`);
  }
  return parsed;
}

/**
 * Convert Taquito operation contents to Trezor operation format
 */
export function mapOperationsToTrezor(contents: OperationContents[]): TrezorOperation {
  const result: TrezorOperation = {};
  const seenKinds = new Set<string>();

  for (const op of contents) {
    if (seenKinds.has(op.kind)) {
      throw new TrezorUnsupportedOperationError(
        op.kind,
        'Trezor does not support batch operations with multiple operations of the same type. Please sign each operation separately.'
      );
    }
    seenKinds.add(op.kind);

    switch (op.kind) {
      case 'reveal':
        result.reveal = mapRevealOperation(op);
        break;
      case 'transaction':
        result.transaction = mapTransactionOperation(op);
        break;
      case 'delegation':
        result.delegation = mapDelegationOperation(op);
        break;
      case 'proposals':
        result.proposal = mapProposalOperation(op);
        break;
      case 'ballot':
        result.ballot = mapBallotOperation(op);
        break;
      default:
        throw new TrezorUnsupportedOperationError(op.kind);
    }
  }

  return result;
}

function mapRevealOperation(op: OperationContents): TrezorRevealOp {
  if (op.kind !== 'reveal') throw new Error('Expected reveal operation');
  return {
    source: op.source,
    fee: parseIntChecked(op.fee, 'fee'),
    counter: parseIntChecked(op.counter, 'counter'),
    gas_limit: parseIntChecked(op.gas_limit, 'gas_limit'),
    storage_limit: parseIntChecked(op.storage_limit, 'storage_limit'),
    public_key: op.public_key,
  };
}

function mapTransactionOperation(op: OperationContents): TrezorTransactionOp {
  if (op.kind !== 'transaction') throw new Error('Expected transaction operation');
  const result: TrezorTransactionOp = {
    source: op.source,
    fee: parseIntChecked(op.fee, 'fee'),
    counter: parseIntChecked(op.counter, 'counter'),
    gas_limit: parseIntChecked(op.gas_limit, 'gas_limit'),
    storage_limit: parseIntChecked(op.storage_limit, 'storage_limit'),
    amount: parseIntChecked(op.amount, 'amount'),
    destination: op.destination,
  };

  // Handle parameters if present (convert to byte array for Trezor)
  if (op.parameters) {
    // Trezor expects parameters as a byte array
    // For complex parameters, we encode them as hex and convert to number array
    const paramsHex = encodeParameters(op.parameters);
    if (paramsHex) {
      result.parameters = Array.from(hex2buf(paramsHex));
    }
  }

  return result;
}

function mapDelegationOperation(op: OperationContents): TrezorDelegationOp {
  if (op.kind !== 'delegation') throw new Error('Expected delegation operation');

  // Trezor requires a delegate to be specified, undelegation is not supported yet
  if (!op.delegate) {
    throw new TrezorUnsupportedOperationError(
      'delegation',
      'Undelegation (removing delegate) is not supported. A delegate address must be specified.'
    );
  }

  return {
    source: op.source,
    fee: parseIntChecked(op.fee, 'fee'),
    counter: parseIntChecked(op.counter, 'counter'),
    gas_limit: parseIntChecked(op.gas_limit, 'gas_limit'),
    storage_limit: parseIntChecked(op.storage_limit, 'storage_limit'),
    delegate: op.delegate,
  };
}

function mapProposalOperation(op: OperationContents): TrezorProposalOp {
  if (op.kind !== 'proposals') throw new Error('Expected proposals operation');
  return {
    source: op.source,
    period: typeof op.period === 'string' ? parseIntChecked(op.period, 'period') : op.period,
    proposals: op.proposals,
  };
}

function mapBallotOperation(op: OperationContents): TrezorBallotOp {
  if (op.kind !== 'ballot') throw new Error('Expected ballot operation');
  return {
    source: op.source,
    period: typeof op.period === 'string' ? parseIntChecked(op.period, 'period') : op.period,
    proposal: op.proposal,
    ballot: ballotStringToType(op.ballot),
  };
}

/**
 * Convert ballot string ('yay', 'nay', 'pass') to Trezor ballot type (0, 1, 2)
 */
function ballotStringToType(ballot: string): TrezorBallotType {
  switch (ballot.toLowerCase()) {
    case 'yay':
      return 0;
    case 'nay':
      return 1;
    case 'pass':
      return 2;
    default:
      throw new Error(`Invalid ballot value: ${ballot}. Expected 'yay', 'nay', or 'pass'.`);
  }
}

/**
 * Encode Michelson parameters to hex string for Trezor
 * Uses the encoders from @taquito/local-forging for full Michelson support
 *
 * @param params - The parameters object with entrypoint and value
 * @returns Hex string of encoded parameters, or null if no parameters needed
 */
function encodeParameters(params: unknown): string | null {
  if (!params) return null;

  // Validate params structure
  if (typeof params !== 'object') return null;

  const p = params as { entrypoint?: string; value?: unknown };
  if (!p.entrypoint || p.value === undefined) return null;

  // Use the parameters encoder from local-forging which handles all Michelson types
  // It returns '00' for absent parameters (default Unit), or 'ff...' for present parameters
  const parametersEncoder = encoders[CODEC.PARAMETERS];
  const encoded = parametersEncoder({ entrypoint: p.entrypoint, value: p.value });

  // '00' means no parameters (default Unit) - Trezor doesn't need the parameters field
  if (encoded === '00') {
    return null;
  }

  // The parametersEncoder returns 'ff' + entrypoint + length + params
  // But Trezor firmware adds its own boolean prefix via _encode_data_with_bool_prefix
  // So we need to strip the 'ff' prefix to avoid double-prefixing
  // encoded format: ff + entrypoint_tag + (optional length + entrypoint) + params_length + params
  if (encoded.startsWith('ff')) {
    return encoded.slice(2); // Remove the 'ff' prefix
  }

  return encoded;
}
