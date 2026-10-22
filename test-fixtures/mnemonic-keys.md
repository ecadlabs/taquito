# Mnemonic key fixtures

mnemonic-keys.json contains 16 fixed, complete key tuples for the public BIP39
zero-entropy phrase. The fixtures are test data, not private accounts.

The independent generator mnemonic-keys.py uses Python hashlib and hmac for BIP39
PBKDF2 and SLIP-10 derivation. Python cryptography uses OpenSSL-backed Ed25519,
secp256k1 and P-256 operations for public keys. The generator implements Base58Check
and Blake2b address hashing separately. It imports no Taquito, noble or scure code.
The recorded run used Python 3.12 and cryptography 41.0.7 on 21 October 2026.

Reproduce from the repository root with Python and cryptography installed:

```sh
python3 test-fixtures/mnemonic-keys.py
git diff --exit-code -- test-fixtures/mnemonic-keys.json
```

All tuples also matched unchanged Taquito main at 7f60ff38 before extraction of
the mnemonic helper. The preservation suite checks the complete public key,
address and canonical secret key. Ed25519 uses the expanded 64-byte secret key.
Cases cover defaults, account one, root and empty paths, hardened notation,
legacy numeric-prefix parsing, nonhardened ECDSA paths and normalized passwords.

The generator is a fixture tool, not a general HD library. It asserts that these
vectors do not reach rare scalar-retry cases. It does not establish correctness
for every possible derivation path. Existing path parsing and ECDSA serialization
remain unchanged by this contribution.

The mnemonic helper tests also use fixed BIP39 zero and all-ones entropy vectors.
Random generation tests check supported strengths and valid conversion. They do
not provide a statistical proof of randomness.

Sources:

- https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
- https://github.com/satoshilabs/slips/blob/master/slip-0010.md
- https://github.com/trezor/python-mnemonic/blob/master/vectors.json
