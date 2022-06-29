# Sapling Spending Key Encryption

  Packages used:

  - Based on the pacakge [@stablelib/nacl](https://github.com/StableLib/stablelib)
      - openSecretBox decrypting from MMXj... -> sask...
      - secretBox -> encrypting from sask... -> MMXj...

  - EncryptionKey created from [pbkdf2](https://github.com/crypto-browserify/pbkdf2) package
      - generated from pbkdf2Sync
        - password: string | Buffer` | TypedArray | DataView
        - salt: string | Buffer | TypedArray | DataView
        - interations: number -> tezos defined interations 32768
        - keylen: number -> tezos defined length 32
        - digest: 'sha512'

  Returning buffer of encryption key

## Encrypting
  `secretBox` from [@stablelib/nacl](https://github.com/StableLib/stablelib)

  Needing encryption key generated from  [pbkdf2](https://github.com/crypto-browserify/pbkdf2)

  `export declare function secretBox(key: Uint8Array, nonce: Uint8Array, data: Uint8Array): Uint8Array;`

  Returns encrypted Uint8Array for sapling spending key

  Currently no support to encrypt a key as there is no use for an encrypted key without decrypting

## Decrypting
  `openSecretBox` from [@stablelib/nacl](https://github.com/StableLib/stablelib)

  Needed encryption generated from [pbkdf2](https://github.com/crypto-browserify/pbkdf2) 

  `export declare function openSecretBox(key: Uint8Array, nonce: Uint8Array, box: Uint8Array): Uint8Array | null;`

  Will return the Uint8Array of the decrypted payload which can be then encoded with `b58cencode(payload, prefix[Prefix.sask])`


### Example from MMXj... to sask...
  Example encrypted key 
  `MMXjN99mhomTm1Y5nQt8NfwEKTHWugsLtucX7oWrpsJd99qxGYJWP5aMb3t8zZaoKHQ898bLu9dwpog71bnjiDZfS9J9hWnTLCGm4fAjKKYeRuwTgCRjSdsP9znCPBUpCvyxeEFvUfamA5URrp8c7AaooAkobLW1PjNh2vjHobtiyNVTEtyTUWTLcjdxaiPbQWs3NaWvcb5Qr6z9MHhKrYNBHmsd9HBeRB2rVnvvL7pMc8f8zqyuXtmAuzMhiqPz3B4BRzuc8a2jkkoL14`

  First converted to Uint8Array with b58cdecode
  `const keyArr = b58cdecode(spendingKey, prefix[Prefix.SASK]) // returns Uint8Array`

  Encryption salt is held from Uint8Arry index 0-8
  - this is the MMXj portion
  - `const salt = toBuffer(keyArr.slice(0, 8))`

  Encrypted secret key is held in the rest
  - `const encryptedSk = toBuffer(keyArr.slice(8))`

  Encryption Key is generated from the pbkdf2 package
  - `const encryptionKey = pbkdf2.pbkdf2Sync(password, salt, 32768, 32, 'sha512');`

  Finally decryption 
  - ` const decrypted = openSecretBox(new Uint8Array(encryptionKey), new Uint8Array(24), new Uint8Array(encryptedSk))`
  - `params: (encryptionKey, nonce, box)`
    - box contains encrypted payload

  step by step example: 
  ```
  const keyArr = b58cdecode(spendingKey, prefix[Prefix.SASK]) // returns Uint8Array
  const salt = toBuffer(keyArr.slice(0, 8))
  const encryptedSk = toBuffer(keyArr.slice(8))

  const encryptionKey = pbkdf2.pbkdf2Sync(password, salt, 32768, 32, 'sha512');
  const decrypted = openSecretBox(
    new Uint8Array(encryptionKey),
    new Uint8Array(24),
    new Uint8Array(encryptedSk),
    )
  ```

# Sapling spending key seed generation

  packages used
  - [bip39](https://github.com/bitcoinjs/bip39)
    - used for seed generator 64 bytes sapling needs 32 which will be explained further down
  - [sapling-wasm](https://github.com/airgap-it/airgap-sapling)
    - used to get the extended spending key from sapling with the seed from the mnemonic

## Sapling Spending key generation
  NOTE: password is only used to convert `sask...` to `MMXj...`

### Mnemonic to usable seed
  `bip39.mnemonicToSeed`
  
  function used to generate a 64 byte secret key (check if this is correct) from the mnemonic

  - split halves first 32 bytes from second 32 bytes
    - `const first32: Buffer = fullSeed.slice(0, 32)`
    - `const second32: Buffer = fullSeed.slice(32)`
  - create new array of XOR bytes from first 32 -> second 32
    -  `const seed =  Buffer.from(first32.map((byte, index) => byte ^ second32[index]))`

### Seed to spending key
  derivation path defined by tezos as seen is currently `'m/'`

  `const spendingKeyArr = new Uint8Array(await sapling.getExtendedSpendingKey(seed, derivationPath))`

  `const spendingKey = b58cencode(spendingKeyArr, prefix[Prefix.SASK])`


## Example full menmonic to seed instantiator from InMemorySpendingKey class
```
static async fromMnemonic(mnemonic: string[], derivationPath: string, password?: string) {
  // no password passed here. password provided only changes from sask -> MMXj
  const fullSeed = (await bip39.mnemonicToSeed(mnemonic.join(' ')))

  const first32: Buffer = fullSeed.slice(0, 32)
  const second32: Buffer = fullSeed.slice(32)
  // reduce seed bytes must be 32 bytes reflecting both halves
  const seed =  Buffer.from(first32.map((byte, index) => byte ^ second32[index]))
  // create an extended spending key
  const spendingKeyArr = new Uint8Array(await sapling.getExtendedSpendingKey(seed, derivationPath))

  const spendingKey = b58cencode(spendingKeyArr, prefix[Prefix.SASK])
  if (validateSpendingKey(spendingKey) !== 3) {
    throw new InvalidSpendingKey(spendingKey)
  }

  return new InMemorySpendingKey(spendingKey, password)
}
  ```

