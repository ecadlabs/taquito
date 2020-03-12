import { InMemorySigner } from './taquito-signer';
import { TezosToolkit } from '@taquito/taquito';

/**
 *
 * @description Import a key to sign operation
 *
 * @param toolkit The toolkit instance to attach a signer
 * @param privateKeyOrEmail Key to load in memory
 * @param passphrase If the key is encrypted passphrase to decrypt it
 * @param mnemonic Faucet mnemonic
 * @param secret Faucet secret
 */
export async function importKey(
  toolkit: TezosToolkit,
  privateKeyOrEmail: string,
  passphrase?: string,
  mnemonic?: string,
  secret?: string
) {
  if (privateKeyOrEmail && passphrase && mnemonic && secret) {
    const signer = InMemorySigner.fromFundraiser(privateKeyOrEmail, passphrase, mnemonic);
    toolkit.setSignerProvider(signer);
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
  } else {
    // Fallback to regular import
    const signer = await InMemorySigner.fromSecretKey(privateKeyOrEmail, passphrase);
    toolkit.setSignerProvider(signer);
  }
}
