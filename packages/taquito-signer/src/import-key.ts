import { InMemorySigner } from './taquito-signer';
import { TezosToolkit } from '@taquito/taquito';
/**
 *
 * @description Import a key to sign operation
 *
 * @param privateKey Key to load in memory
 * @param passphrase If the key is encrypted passphrase to decrypt it
 */
export function importKey(
  toolkit: TezosToolkit,
  privateKey: string,
  passphrase?: string
): Promise<void>;
/**
 *
 * @description Import a key using faucet/fundraiser parameter
 *
 * @param email Faucet email
 * @param password Faucet password
 * @param mnemonic Faucet mnemonic
 * @param secret Faucet secret
 */
// tslint:disable-next-line: unified-signatures
export function importKey(
  toolkit: TezosToolkit,
  email: string,
  password: string,
  mnemonic: string,
  secret: string
): Promise<void>;

export async function importKey(
  toolkit: TezosToolkit,
  privateKeyOrEmail: string,
  passphrase?: string,
  mnemonic?: string,
  secret?: string
) {
  if (privateKeyOrEmail && passphrase && mnemonic && secret) {
    const signer = InMemorySigner.fromFundraiser(privateKeyOrEmail, passphrase, mnemonic);
    const pkh = await signer.publicKeyHash();
    let op;
    try {
      op = await toolkit.tz.activate(pkh, secret);
    } catch (ex) {
      const isInvalidActivationError = ex && ex.body && /Invalid activation/.test(ex.body);
      if (!isInvalidActivationError) {
        throw ex;
      }
    }
    if (op) {
      await op.confirmation();
    }
    toolkit.setProvider({ signer });
  } else {
    // Fallback to regular import
    toolkit.setProvider({ signer: new InMemorySigner(privateKeyOrEmail, passphrase) });
  }
}
