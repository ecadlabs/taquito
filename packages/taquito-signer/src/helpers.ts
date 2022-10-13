import { hmac } from '@stablelib/hmac';
import { SHA512 } from '@stablelib/sha512';
import { generateKeyPairFromSeed } from '@stablelib/ed25519';
import { b58cencode, prefix } from '@taquito/utils';
import { InvalidDerivationPathError } from './errors';

export interface KeyNode {
  privateKey: Uint8Array;
  chainCode: Uint8Array;
}
export const createNode = (seed: Uint8Array, key: Uint8Array): KeyNode => {
  const derived = hmac(SHA512, key, seed);

  return {
    privateKey: derived.slice(0, 32),
    chainCode: derived.slice(32),
  };
};

export const createMasterNode = (seed: Uint8Array): KeyNode => {
  // 'ed25519 seed' is the initial key used in hmac for ed25519 defined in slip 10
  const ed25519DefaultKey = new Uint8Array(Buffer.from('ed25519 seed'));
  return createNode(seed, ed25519DefaultKey);
};

export const createChildNode = (
  node: KeyNode,
  derivationPathItem: number
): KeyNode => {
  const derivationItemBuff = Buffer.allocUnsafe(4);
  derivationItemBuff.writeUInt32BE(derivationPathItem, 0);
  const childSeed = Buffer.concat([
    Buffer.alloc(1, 0),
    Buffer.from(node.privateKey),
    derivationItemBuff,
  ]);
  const chainCodeUint8 = new Uint8Array(Buffer.from(node.chainCode));

  return createNode(childSeed, chainCodeUint8);
};

export const hardenedDerivationPathToArray = (path: string) => {
  // cleaning path

  return path.split('/').map((level) => {
    // assert paths are hardened
    if (level.indexOf('h') === -1 && level.indexOf("'") === -1) {
      throw new InvalidDerivationPathError(`invalid derivation path: ${path}`);
    }
    const pathWithoutHardened = Number(
      level.replace(/'/g, '').replace(/h/g, '')
    );
    // asser path is both a number and < 2^31
    if (
      isNaN(pathWithoutHardened) ||
      pathWithoutHardened > Number('0x80000000')
    ) {
      throw new InvalidDerivationPathError(
        isNaN(pathWithoutHardened)
          ? `path cannot be NaN`
          : `path out of bounds: cannot be greater than 2^31`
      );
    }

    return Number(pathWithoutHardened) + Number('0x80000000');
  });
};

export const generateSecretKeyEDSK = (
  seed: Uint8Array,
  derivationPath: string
) => {
  const derivationPathArray = hardenedDerivationPathToArray(derivationPath);

  let node = createMasterNode(seed);

  // create new child for each derivation path item
  for (const item of derivationPathArray) {
    node = createChildNode(node, item);
  }

  const keyPair = generateKeyPairFromSeed(node.privateKey.slice(0, 32));
  const sk = b58cencode(keyPair.secretKey.slice(0, 32), prefix.edsk2);
  return sk;
};
