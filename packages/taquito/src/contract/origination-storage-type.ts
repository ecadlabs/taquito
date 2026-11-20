import { Expr, isMichelsonType } from '@taquito/michel-codec';
import { InvalidCodeParameter } from './errors';

function isPairType(args: unknown[]): boolean {
  if (args.length < 2) return false;
  for (const arg of args) {
    if (!isStorageType(arg)) return false;
  }
  return true;
}

function isConstantArgs(args: unknown[]): boolean {
  const [hash] = args;
  return (
    args.length === 1 &&
    typeof hash === 'object' &&
    hash !== null &&
    !Array.isArray(hash) &&
    !('prim' in hash) &&
    !('bytes' in hash) &&
    !('int' in hash) &&
    'string' in hash &&
    typeof hash.string === 'string' &&
    hash.string.length > 0
  );
}

function isMemoSize(node: unknown): boolean {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return false;
  if ('prim' in node) return node.prim === 'constant' && isStorageType(node);
  return (
    !('bytes' in node) &&
    !('string' in node) &&
    'int' in node &&
    typeof node.int === 'string' &&
    /^-?[0-9]+$/.test(node.int)
  );
}

// Constants and legacy types can occur before the encoder has a fully expanded type.
function isStorageType(node: unknown): node is Expr {
  if (!node || typeof node !== 'object') return false;
  if (Array.isArray(node)) return isPairType(node);
  if (!('prim' in node) || typeof node.prim !== 'string') return false;
  // Raw scripts can reach the forger directly. A type node must have a single Micheline kind.
  if ('bytes' in node || 'string' in node || 'int' in node) return false;
  if (
    'annots' in node &&
    node.annots !== undefined &&
    (!Array.isArray(node.annots) || !node.annots.every((annot) => typeof annot === 'string'))
  )
    return false;
  const args = 'args' in node && node.args !== undefined ? node.args : [];
  if (!Array.isArray(args)) return false;
  const count = args.length;
  switch (node.prim) {
    case 'constant':
      return isConstantArgs(args);
    case 'sapling_state':
    case 'sapling_transaction':
    case 'sapling_transaction_deprecated':
      return count === 1 && isMemoSize(args[0]);
    case 'pair':
      return isPairType(args);
    case 'map':
    case 'big_map':
    case 'or':
    case 'lambda':
      return count === 2 && isStorageType(args[0]) && isStorageType(args[1]);
    case 'option':
    case 'list':
    case 'set':
    case 'contract':
    case 'ticket':
    case 'ticket_deprecated':
      return count === 1 && isStorageType(args[0]);
    default:
      return count === 0 && isMichelsonType({ prim: node.prim });
  }
}

export function requireStorageType(node: unknown, code: object[]): Expr {
  if (!isStorageType(node)) {
    throw new InvalidCodeParameter('The storage section must contain one Michelson type', code);
  }
  return node;
}

export function getOriginationStorageType(code: object[]): Expr {
  const section = code.find(
    (node) => node && typeof node === 'object' && 'prim' in node && node.prim === 'storage'
  );
  if (!section) {
    throw new InvalidCodeParameter('The storage section is missing from the script', code);
  }
  const args = 'args' in section ? section.args : undefined;
  if (!Array.isArray(args) || args.length !== 1) {
    throw new InvalidCodeParameter('The storage section must contain one Michelson type', code);
  }
  return requireStorageType(args[0], code);
}
