import * as sapling from '@airgap/sapling-wasm';
import BigNumber from 'bignumber.js';
import { hex2buf, mergebuf } from '@taquito/utils';
import { CommitmentsAndCiphertexts, RpcClient, RpcClientInterface } from '@taquito/rpc';
import blake from 'blakejs';
import { openSecretBox } from '@stablelib/nacl';
import { InMemoryViewingKey } from './in-memory-viewing-key';
import { bufToUint8Array, convertValueToBigNumber, readableFormat } from './helpers';

const KDF_KEY = 'KDFSaplingForTezosV1';
const OCK_KEY = 'OCK_keystringderivation_TEZOS';

export interface SaplingIncomingAndOutgoingTransaction {
  incoming: SaplingIncomingTransaction[];
  outgoing: SaplingOutgoingTransaction[];
}
export interface SaplingIncomingTransaction {
  value: BigNumber;
  memo: string;
  paymentAddress: string;
  isSpent: boolean;
}

export interface SaplingOutgoingTransaction {
  value: BigNumber;
  memo: string;
  paymentAddress: string;
}

export interface SaplingTransactionPropertiesRaw {
  value: Uint8Array;
  memo: Uint8Array;
  paymentAddress: Uint8Array;
  rcm: Uint8Array;
}
/**
 * @description Allows to retrieve and decrypt sapling transactions
 */
export class SaplingTransactionViewer {
  #viewingKeyProvider: InMemoryViewingKey;
  #rpcClient: RpcClientInterface;

  constructor(inMemoryViewingKey: InMemoryViewingKey, rpc: string | RpcClientInterface) {
    this.#viewingKeyProvider = inMemoryViewingKey;
    if (typeof rpc === 'string') {
      this.#rpcClient = new RpcClient(rpc);
    } else {
      this.#rpcClient = rpc;
    }
  }

  /**
   * @description Retrieve the unspent balance associated with the configured viewing key
   *
   * @param saplingId sapling id that can be found in the contract storage
   * @returns the balance represented as a BigNumber
   *
   */
  async getBalance(saplingId: string): Promise<BigNumber> {
    let balance = new BigNumber(0);
    const { commitments_and_ciphertexts, nullifiers } = await this.#rpcClient.getSaplingDiffById(
      saplingId
    );
    for (let i = 0; i < commitments_and_ciphertexts.length; i++) {
      const decrypted = await this.decryptCiphertextAsReceiver(commitments_and_ciphertexts[i]);
      if (decrypted) {
        const valueBigNumber = convertValueToBigNumber(decrypted.value);
        const isSpent = await this.isSpent(
          decrypted.paymentAddress,
          valueBigNumber.toString(),
          decrypted.rcm,
          i,
          nullifiers
        );
        if (!isSpent) {
          balance = balance.plus(valueBigNumber);
        }
      }
    }
    return balance;
  }

  /**
   * @description Retrieve all the incoming and outgoing transactions associated with the configured viewing key.
   * The response properties are in Uint8Array format; use the getIncomingAnd Outgoing Transactions method for readable properties
   *
   * @param saplingId sapling id that can be found in the contract storage
   *
   */
  async getIncomingAndOutgoingTransactionsRaw(saplingId: string) {
    const incoming = [];
    const outgoing = [];
    const { commitments_and_ciphertexts, nullifiers } = await this.#rpcClient.getSaplingDiffById(
      saplingId
    );
    for (let i = 0; i < commitments_and_ciphertexts.length; i++) {
      const decryptedAsReceiver = await this.decryptCiphertextAsReceiver(
        commitments_and_ciphertexts[i]
      );
      const decryptedAsSender = await this.decryptCiphertextAsSender(
        commitments_and_ciphertexts[i]
      );
      if (decryptedAsReceiver) {
        const balance = convertValueToBigNumber(decryptedAsReceiver.value);
        const isSpent = await this.isSpent(
          decryptedAsReceiver.paymentAddress,
          balance.toString(),
          decryptedAsReceiver.rcm,
          i,
          nullifiers
        );
        incoming.push({ ...decryptedAsReceiver, isSpent });
      }
      if (decryptedAsSender) {
        outgoing.push(decryptedAsSender);
      }
    }
    return {
      incoming,
      outgoing,
    };
  }

  /**
   * @description Retrieve all the incoming and outgoing decoded transactions associated with the configured viewing key
   *
   * @param saplingId sapling id that can be found in the contract storage
   *
   */
  async getIncomingAndOutgoingTransactions(
    saplingId: string
  ): Promise<SaplingIncomingAndOutgoingTransaction> {
    const tx = await this.getIncomingAndOutgoingTransactionsRaw(saplingId);
    const incoming = tx.incoming.map(({ isSpent, ...rest }) => {
      return { ...readableFormat(rest), isSpent };
    });
    const outgoing = tx.outgoing.map((outgoingTx) => {
      return readableFormat(outgoingTx);
    });
    return { incoming, outgoing };
  }

  private async decryptCiphertextAsReceiver(
    commitmentsAndCiphertexts: CommitmentsAndCiphertexts
  ): Promise<SaplingTransactionPropertiesRaw | undefined> {
    const commitment = commitmentsAndCiphertexts[0];
    const { epk, payload_enc, nonce_enc } = commitmentsAndCiphertexts[1];

    const ivk = await this.#viewingKeyProvider.getIncomingViewingKey();
    const keyAgreement = await sapling.keyAgreement(epk, ivk);
    const keyAgreementHash = blake.blake2b(keyAgreement, Buffer.from(KDF_KEY), 32);

    const decrypted = await this.decryptCiphertext(
      keyAgreementHash,
      hex2buf(nonce_enc),
      hex2buf(payload_enc)
    );

    if (decrypted) {
      const { diversifier, value, rcm, memo } = this.extractTransactionProperties(decrypted);
      const paymentAddress = bufToUint8Array(
        await sapling.getRawPaymentAddressFromIncomingViewingKey(ivk, diversifier)
      );

      try {
        const valid = await sapling.verifyCommitment(
          commitment,
          paymentAddress,
          convertValueToBigNumber(value).toString(),
          rcm
        );
        if (valid) {
          return { value, memo, paymentAddress, rcm };
        }
      } catch (ex: any) {
        if (!/invalid value/.test(ex)) {
          throw ex;
        }
      }
    }
  }

  private async decryptCiphertextAsSender(
    commitmentsAndCiphertexts: CommitmentsAndCiphertexts
  ): Promise<SaplingTransactionPropertiesRaw | undefined> {
    const commitment = commitmentsAndCiphertexts[0];
    const { epk, payload_enc, nonce_enc, payload_out, nonce_out, cv } =
      commitmentsAndCiphertexts[1];

    const ovk = await this.#viewingKeyProvider.getOutgoingViewingKey();
    const concat = cv.concat(commitment, epk, ovk.toString('hex'));
    const ock = blake.blake2b(Buffer.from(concat, 'hex'), Buffer.from(OCK_KEY), 32);

    const decryptedOut = await this.decryptCiphertext(
      ock,
      hex2buf(nonce_out),
      hex2buf(payload_out)
    );

    if (decryptedOut) {
      const { pkd, esk } = this.extractPkdAndEsk(decryptedOut);
      const keyAgreement = await sapling.keyAgreement(pkd, esk);
      const keyAgreementHash = blake.blake2b(keyAgreement, Buffer.from(KDF_KEY), 32);

      const decryptedEnc = await this.decryptCiphertext(
        keyAgreementHash,
        hex2buf(nonce_enc),
        hex2buf(payload_enc)
      );

      if (decryptedEnc) {
        const { diversifier, value, rcm, memo } = this.extractTransactionProperties(decryptedEnc);
        const paymentAddress = mergebuf(diversifier, pkd);

        try {
          const isValid = await sapling.verifyCommitment(
            commitment,
            paymentAddress,
            convertValueToBigNumber(value).toString(),
            rcm
          );
          if (isValid) {
            return { value, memo, paymentAddress, rcm };
          }
        } catch (ex: any) {
          if (!/invalid value/.test(ex)) {
            throw ex;
          }
        }
      }
    }
  }

  private async decryptCiphertext(
    keyAgreementHash: Uint8Array,
    nonce: Uint8Array,
    payload: Uint8Array
  ) {
    return openSecretBox(keyAgreementHash, nonce, payload);
  }

  private extractTransactionProperties(decrypted: Uint8Array) {
    return {
      diversifier: decrypted.slice(0, 11),
      value: decrypted.slice(11, 19),
      rcm: decrypted.slice(19, 51),
      memoSize: decrypted.slice(51, 55),
      memo: decrypted.slice(55),
    };
  }

  private extractPkdAndEsk(decrypted: Uint8Array) {
    return {
      pkd: decrypted.slice(0, 32),
      esk: decrypted.slice(32),
    };
  }

  private async isSpent(
    address: Uint8Array,
    value: string,
    rcm: Uint8Array,
    position: number,
    nullifiers: string[]
  ) {
    const computedNullifier = await sapling.computeNullifier(
      this.#viewingKeyProvider.getFullViewingKey(),
      address,
      value,
      rcm,
      position
    );
    return nullifiers.includes(computedNullifier.toString('hex'));
  }
}
