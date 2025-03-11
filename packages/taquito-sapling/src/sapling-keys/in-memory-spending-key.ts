import { InMemoryViewingKey } from './in-memory-viewing-key';
import * as sapling from '@airgap/sapling-wasm';
import { Prefix, prefix, b58cencode } from '@taquito/utils';
import * as bip39 from '@scure/bip39';
import {
  ParametersSpendProof,
  ParametersSpendSig,
  SaplingSpendDescription,
  SaplingTransactionInput,
} from '../types';
import { decryptKey } from './helpers';

/**
 * @description holds the spending key, create proof and signature for spend descriptions
 * can instantiate from mnemonic word list or decrypt a encrypted spending key
 * with access to instantiate a InMemoryViewingKey
 */
export class InMemorySpendingKey {
  #spendingKeyBuf: Buffer;
  #saplingViewingKey: InMemoryViewingKey | undefined;
  /**
   *
   * @param spendingKey unencrypted sask... or encrypted MMXj...
   * @param password required for MMXj encrypted keys
   */
  constructor(spendingKey: string, password?: string) {
    this.#spendingKeyBuf = decryptKey(spendingKey, password);
  }

  /**
   *
   * @param mnemonic string of words
   * @param derivationPath tezos current standard 'm/'
   * @returns InMemorySpendingKey class instantiated
   */
  static async fromMnemonic(mnemonic: string, derivationPath = 'm/') {
    // no password passed here. password provided only changes from sask -> MMXj
    const fullSeed = await bip39.mnemonicToSeed(mnemonic);

    const first32 = fullSeed.slice(0, 32);
    const second32 = fullSeed.slice(32);
    // reduce seed bytes must be 32 bytes reflecting both halves
    const seed = Buffer.from(
      first32.map((byte, index) => byte ^ second32[index])
    );

    const spendingKeyArr = new Uint8Array(
      await sapling.getExtendedSpendingKey(seed, derivationPath)
    );

    const spendingKey = b58cencode(spendingKeyArr, prefix[Prefix.SASK]);

    return new InMemorySpendingKey(spendingKey);
  }

  /**
   *
   * @returns InMemoryViewingKey instantiated class
   */
  async getSaplingViewingKeyProvider() {
    let viewingKey: Buffer;
    if (!this.#saplingViewingKey) {
      viewingKey = await sapling.getExtendedFullViewingKeyFromSpendingKey(
        this.#spendingKeyBuf
      );
      this.#saplingViewingKey = new InMemoryViewingKey(
        viewingKey.toString('hex')
      );
    }

    return this.#saplingViewingKey;
  }

  /**
   * @description Prepare an unsigned sapling spend description using the spending key
   * @param parametersSpendProof.saplingContext The sapling proving context
   * @param parametersSpendProof.address The address of the input
   * @param parametersSpendProof.randomCommitmentTrapdoor The randomness of the commitment
   * @param parametersSpendProof.publicKeyReRandomization The re-randomization of the public key
   * @param parametersSpendProof.amount The value of the input
   * @param parametersSpendProof.root The root of the merkle tree
   * @param parametersSpendProof.witness The path of the commitment in the tree
   * @param derivationPath tezos current standard 'm/'
   * @returns The unsigned spend description
   */
  async prepareSpendDescription(
    parametersSpendProof: ParametersSpendProof
  ): Promise<Omit<SaplingSpendDescription, 'signature'>> {
    const spendDescription =
      await sapling.prepareSpendDescriptionWithSpendingKey(
        parametersSpendProof.saplingContext,
        this.#spendingKeyBuf,
        parametersSpendProof.address,
        parametersSpendProof.randomCommitmentTrapdoor,
        parametersSpendProof.publicKeyReRandomization,
        parametersSpendProof.amount,
        parametersSpendProof.root,
        parametersSpendProof.witness
      );
    return {
      commitmentValue: spendDescription.cv,
      nullifier: spendDescription.nf,
      publicKeyReRandomization: spendDescription.rk,
      rtAnchor: spendDescription.rt,
      proof: spendDescription.proof,
    };
  }

  /**
   * @description Sign a sapling spend description
   * @param parametersSpendSig.publicKeyReRandomization The re-randomization of the public key
   * @param parametersSpendSig.unsignedSpendDescription The unsigned Spend description
   * @param parametersSpendSig.hash The data to be signed
   * @returns The signed spend description
   */
  async signSpendDescription(
    parametersSpendSig: ParametersSpendSig
  ): Promise<SaplingTransactionInput> {
    const signedSpendDescription = await sapling.signSpendDescription(
      {
        cv: parametersSpendSig.unsignedSpendDescription.commitmentValue,
        rt: parametersSpendSig.unsignedSpendDescription.rtAnchor,
        nf: parametersSpendSig.unsignedSpendDescription.nullifier,
        rk: parametersSpendSig.unsignedSpendDescription
          .publicKeyReRandomization,
        proof: parametersSpendSig.unsignedSpendDescription.proof,
      },
      this.#spendingKeyBuf,
      parametersSpendSig.publicKeyReRandomization,
      parametersSpendSig.hash
    );
    return {
      commitmentValue: signedSpendDescription.cv,
      nullifier: signedSpendDescription.nf,
      publicKeyReRandomization: signedSpendDescription.rk,
      proof: signedSpendDescription.proof,
      signature: signedSpendDescription.spendAuthSig,
    };
  }

  /**
   * @description Return a proof authorizing key from the configured spending key
   */
  async getProvingKey() {
    const provingKey = await sapling.getProofAuthorizingKey(
      this.#spendingKeyBuf
    );
    return provingKey.toString('hex');
  }
}
