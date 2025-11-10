import * as sapling from '@airgap/sapling-wasm';
import BigNumber from 'bignumber.js';
import { hex2buf, mergebuf } from '@taquito/utils';
import { CommitmentsAndCiphertexts, SaplingDiffResponse } from '@taquito/rpc';
import blake from 'blakejs';
import { openSecretBox } from '@stablelib/nacl';
import { InMemoryViewingKey } from '../sapling-keys/in-memory-viewing-key';
import { bufToUint8Array, convertValueToBigNumber, readableFormat } from './helpers';
import { KDF_KEY, OCK_KEY } from '../constants';
import { Input, SaplingContractId, SaplingIncomingAndOutgoingTransaction } from '../types';
import { SaplingTransactionViewerError } from '../errors';
import { TzReadProvider } from '@taquito/taquito';

/**
 * @description Allows to retrieve and decrypt sapling transactions using on a viewing key
 *
 * @param inMemoryViewingKey Holds the sapling viewing key
 * @param saplingContractId Address of the sapling contract or sapling id if the smart contract contains multiple sapling states
 * @param readProvider Allows to read data from the blockchain
 */
export class SaplingTransactionViewer {
  #viewingKeyProvider: InMemoryViewingKey;
  #readProvider: TzReadProvider;
  #saplingContractId: SaplingContractId;

  constructor(
    inMemoryViewingKey: InMemoryViewingKey,
    saplingContractId: SaplingContractId,
    readProvider: TzReadProvider
  ) {
    this.#viewingKeyProvider = inMemoryViewingKey;
    this.#saplingContractId = saplingContractId;
    this.#readProvider = readProvider;
  }

  /**
   * @description Retrieve the unspent balance associated with the configured viewing key and sapling state
   *
   * @returns the balance in mutez represented as a BigNumber
   *
   */
  async getBalance(): Promise<BigNumber> {
    let balance = new BigNumber(0);
    const { commitments_and_ciphertexts, nullifiers } = await this.getSaplingDiff();
    for (let i = 0; i < commitments_and_ciphertexts.length; i++) {
      const decrypted = await this.decryptCiphertextAsReceiver(commitments_and_ciphertexts[i]);
      if (decrypted) {
        const valueBigNumber = convertValueToBigNumber(decrypted.value);
        const isSpent = await this.isSpent(
          decrypted.paymentAddress,
          valueBigNumber.toString(),
          decrypted.randomCommitmentTrapdoor,
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

  private isChangeTransaction(
    decryptedAsReceiver: Omit<Input, 'position'> | undefined,
    decryptedAsSender: Omit<Input, 'position'> | undefined
  ): boolean {
    if (!decryptedAsReceiver || !decryptedAsSender) {
      return false;
    }

    const receiverAddress = decryptedAsReceiver.paymentAddress;
    const senderAddress = decryptedAsSender.paymentAddress;

    if (receiverAddress.length !== senderAddress.length) {
      return false;
    }

    for (let i = 0; i < receiverAddress.length; i++) {
      if (receiverAddress[i] !== senderAddress[i]) {
        return false;
      }
    }

    return true;
  }

async getTransactionsWithoutChangeRaw() {
  const transactions = [];
  const { commitments_and_ciphertexts, nullifiers } = await this.getSaplingDiff();
  for (let i = 0; i < commitments_and_ciphertexts.length; i++) {
    const decryptedAsReceiver = await this.decryptCiphertextAsReceiver(
      commitments_and_ciphertexts[i]
    );
    const decryptedAsSender = await this.decryptCiphertextAsSender(
      commitments_and_ciphertexts[i]
    );

    const isChange = this.isChangeTransaction(decryptedAsReceiver, decryptedAsSender);
    if (!isChange) {
      continue;
    }
    if (decryptedAsReceiver) {    
      transactions.push({ ...readableFormat(decryptedAsReceiver), position: i, type: 'incoming' });
    }
    if (decryptedAsSender) {
      transactions.push({ ...readableFormat(decryptedAsSender), position: i, type: 'outgoing' });
    }
  }
  return transactions;
}

  /**
   * @description Retrieve all the incoming and outgoing transactions associated with the configured viewing key.
   * The response properties are in Uint8Array format; use the getIncomingAndOutgoingTransactions method for readable properties
   *
   */
  async getIncomingAndOutgoingTransactionsRaw() {
    const incoming = [];
    const outgoing = [];

    const { commitments_and_ciphertexts, nullifiers } = await this.getSaplingDiff();

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
          decryptedAsReceiver.randomCommitmentTrapdoor,
          i,
          nullifiers
        );
        incoming.push({ ...decryptedAsReceiver, isSpent, position: i });
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
   */
  async getIncomingAndOutgoingTransactions(): Promise<SaplingIncomingAndOutgoingTransaction> {
    const tx = await this.getIncomingAndOutgoingTransactionsRaw();
    const incoming = tx.incoming.map(({ isSpent, ...rest }) => {
      return { ...readableFormat(rest), isSpent };
    });
    const outgoing = tx.outgoing.map((outgoingTx) => {
      return readableFormat(outgoingTx);
    });
    return { incoming, outgoing };
  }

  private async getSaplingDiff() {
    let saplingDiffResponse: SaplingDiffResponse;
    if (this.#saplingContractId.saplingId) {
      saplingDiffResponse = await this.#readProvider.getSaplingDiffById(
        { id: this.#saplingContractId.saplingId },
        'head'
      );
    } else if (this.#saplingContractId.contractAddress) {
      saplingDiffResponse = await this.#readProvider.getSaplingDiffByContract(
        this.#saplingContractId.contractAddress,
        'head'
      );
    } else {
      throw new SaplingTransactionViewerError(
        'A contract address or a sapling id was expected in the SaplingTransactionViewer constructor.'
      );
    }
    return saplingDiffResponse;
  }

  private async decryptCiphertextAsReceiver(
    commitmentsAndCiphertexts: CommitmentsAndCiphertexts
  ): Promise<Omit<Input, 'position'> | undefined> {
    const commitment = commitmentsAndCiphertexts[0];
    const { epk, payload_enc, nonce_enc } = commitmentsAndCiphertexts[1];

    const incomingViewingKey = await this.#viewingKeyProvider.getIncomingViewingKey();
    const keyAgreement = await sapling.keyAgreement(epk, incomingViewingKey);
    const keyAgreementHash = blake.blake2b(keyAgreement, Buffer.from(KDF_KEY), 32);

    const decrypted = await this.decryptCiphertext(
      keyAgreementHash,
      hex2buf(nonce_enc),
      hex2buf(payload_enc)
    );

    if (decrypted) {
      const {
        diversifier,
        value,
        randomCommitmentTrapdoor: rcm,
        memo,
      } = this.extractTransactionProperties(decrypted);
      const paymentAddress = bufToUint8Array(
        await sapling.getRawPaymentAddressFromIncomingViewingKey(incomingViewingKey, diversifier)
      );

      try {
        const valid = await sapling.verifyCommitment(
          commitment,
          paymentAddress,
          convertValueToBigNumber(value).toString(),
          rcm
        );
        if (valid) {
          return { value, memo, paymentAddress, randomCommitmentTrapdoor: rcm };
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
  ): Promise<Omit<Input, 'position'> | undefined> {
    const commitment = commitmentsAndCiphertexts[0];
    const { epk, payload_enc, nonce_enc, payload_out, nonce_out, cv } =
      commitmentsAndCiphertexts[1];

    const outgoingViewingKey = await this.#viewingKeyProvider.getOutgoingViewingKey();
    const concat = cv.concat(commitment, epk, outgoingViewingKey.toString('hex'));
    const outgoingCipherKey = blake.blake2b(Buffer.from(concat, 'hex'), Buffer.from(OCK_KEY), 32);

    const decryptedOut = await this.decryptCiphertext(
      outgoingCipherKey,
      hex2buf(nonce_out),
      hex2buf(payload_out)
    );

    if (decryptedOut) {
      const { recipientDiversifiedTransmissionKey: pkd, ephemeralPrivateKey: esk } =
        this.extractPkdAndEsk(decryptedOut);
      const keyAgreement = await sapling.keyAgreement(pkd, esk);
      const keyAgreementHash = blake.blake2b(keyAgreement, Buffer.from(KDF_KEY), 32);

      const decryptedEnc = await this.decryptCiphertext(
        keyAgreementHash,
        hex2buf(nonce_enc),
        hex2buf(payload_enc)
      );

      if (decryptedEnc) {
        const {
          diversifier,
          value,
          randomCommitmentTrapdoor: rcm,
          memo,
        } = this.extractTransactionProperties(decryptedEnc);
        const paymentAddress = mergebuf(diversifier, pkd);

        try {
          const isValid = await sapling.verifyCommitment(
            commitment,
            paymentAddress,
            convertValueToBigNumber(value).toString(),
            rcm
          );
          if (isValid) {
            return { value, memo, paymentAddress, randomCommitmentTrapdoor: rcm };
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
      randomCommitmentTrapdoor: decrypted.slice(19, 51),
      memoSize: decrypted.slice(51, 55),
      memo: decrypted.slice(55),
    };
  }

  private extractPkdAndEsk(decrypted: Uint8Array) {
    return {
      recipientDiversifiedTransmissionKey: decrypted.slice(0, 32),
      ephemeralPrivateKey: decrypted.slice(32),
    };
  }

  private async isSpent(
    address: Uint8Array,
    value: string,
    randomCommitmentTrapdoor: Uint8Array,
    position: number,
    nullifiers: string[]
  ) {
    const computedNullifier = await sapling.computeNullifier(
      this.#viewingKeyProvider.getFullViewingKey(),
      address,
      value,
      randomCommitmentTrapdoor,
      position
    );
    return nullifiers.includes(computedNullifier.toString('hex'));
  }
}
