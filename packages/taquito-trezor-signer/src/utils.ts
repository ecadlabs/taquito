import { OperationContents } from '@taquito/rpc';
import { hex2buf } from '@taquito/utils';
import type {
  TrezorOperation,
  TrezorTransactionOp,
  TrezorRevealOp,
  TrezorDelegationOp,
  TrezorOriginationOp,
} from './types';

/**
 * Convert Taquito operation contents to Trezor operation format
 */
export function mapOperationsToTrezor(contents: OperationContents[]): TrezorOperation {
  const result: TrezorOperation = {};

  for (const op of contents) {
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
      case 'origination':
        result.origination = mapOriginationOperation(op);
        break;
      default:
        throw new Error(`Unsupported operation kind for Trezor signing: ${op.kind}`);
    }
  }

  return result;
}

function mapRevealOperation(op: OperationContents): TrezorRevealOp {
  if (op.kind !== 'reveal') throw new Error('Expected reveal operation');
  return {
    source: op.source,
    fee: parseInt(op.fee, 10),
    counter: parseInt(op.counter, 10),
    gas_limit: parseInt(op.gas_limit, 10),
    storage_limit: parseInt(op.storage_limit, 10),
    public_key: op.public_key,
  };
}

function mapTransactionOperation(op: OperationContents): TrezorTransactionOp {
  if (op.kind !== 'transaction') throw new Error('Expected transaction operation');
  const result: TrezorTransactionOp = {
    source: op.source,
    fee: parseInt(op.fee, 10),
    counter: parseInt(op.counter, 10),
    gas_limit: parseInt(op.gas_limit, 10),
    storage_limit: parseInt(op.storage_limit, 10),
    amount: parseInt(op.amount, 10),
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

  // Trezor requires a delegate to be specified - undelegation is not supported
  if (!op.delegate) {
    throw new Error(
      'Undelegation (removing delegate) is not supported by Trezor. A delegate address must be specified.'
    );
  }

  return {
    source: op.source,
    fee: parseInt(op.fee, 10),
    counter: parseInt(op.counter, 10),
    gas_limit: parseInt(op.gas_limit, 10),
    storage_limit: parseInt(op.storage_limit, 10),
    delegate: op.delegate,
  };
}

function mapOriginationOperation(op: OperationContents): TrezorOriginationOp {
  if (op.kind !== 'origination') throw new Error('Expected origination operation');
  const result: TrezorOriginationOp = {
    source: op.source,
    fee: parseInt(op.fee, 10),
    counter: parseInt(op.counter, 10),
    gas_limit: parseInt(op.gas_limit, 10),
    storage_limit: parseInt(op.storage_limit, 10),
    balance: parseInt(op.balance, 10),
    script: [], // Script encoding would require full Michelson serialization
  };

  if (op.delegate) {
    result.delegate = op.delegate;
  }

  // Note: Full script encoding is complex and would require Michelson serialization
  // For now, origination with complex scripts may not be fully supported
  if (op.script) {
    throw new Error(
      'Origination operations with scripts are not yet fully supported for Trezor signing'
    );
  }

  return result;
}

/**
 * Encode Michelson parameters to hex string
 * This is a simplified implementation - complex parameters may need additional handling
 */
function encodeParameters(params: unknown): string | null {
  if (!params) return null;

  // For simple unit type parameters
  if (typeof params === 'object' && params !== null) {
    const p = params as { entrypoint?: string; value?: unknown };
    if (p.entrypoint === 'default' && p.value && typeof p.value === 'object') {
      const v = p.value as { prim?: string };
      if (v.prim === 'Unit') {
        // Unit parameter - Trezor handles this
        return null;
      }
    }
  }

  // For more complex parameters, we would need full Michelson encoding
  // This is a limitation of the current implementation
  throw new Error('Complex transaction parameters are not yet fully supported for Trezor signing');
}

/**
 * Prepend watermark to operation bytes
 */
export function appendWatermark(bytes: string, watermark?: Uint8Array): string {
  if (!watermark) {
    return bytes;
  }
  const hexWatermark = Array.from(watermark)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hexWatermark + bytes;
}
