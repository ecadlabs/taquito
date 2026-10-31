import { ECDSA, Hard } from '../src/derivation-tools';
import { ECKey, ECPublicKey } from '../src/ec-key';
import { b58DecodeAndCheckPrefix, PrefixV2, verifySignature } from '@taquito/utils';
import * as bip39 from '@scure/bip39';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';
import { vi } from 'vitest';

interface TestKeyData {
  path: number[];
  chain?: string;
  priv?: string;
}

interface TestChain {
  mnemonic?: string;
  seed?: string;
  keys: TestKeyData[];
}

interface CurveTestData {
  curve: ECDSA.CurveName;
  chain: TestChain[];
}

const testData: CurveTestData[] = [
  {
    curve: 'secp256k1',
    chain: [
      {
        seed: '000102030405060708090a0b0c0d0e0f',
        keys: [
          {
            path: [],
            chain: '873dff81c02f525623fd1fe5167eac3a55a049de3d314bb42ee227ffed37d508',
            priv: 'e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35',
          },
          {
            path: [0 | Hard],
            chain: '47fdacbd0f1097043b78c63c20c34ef4ed9a111d980047ad16282c7ae6236141',
            priv: 'edb2e14f9ee77d26dd93b4ecede8d16ed408ce149b6cd80b0715a2d911a0afea',
          },
          {
            path: [0 | Hard, 1],
            chain: '2a7857631386ba23dacac34180dd1983734e444fdbf774041578e9b6adb37c19',
            priv: '3c6cb8d0f6a264c91ea8b5030fadaa8e538b020f0a387421a12de9319dc93368',
          },
          {
            path: [0 | Hard, 1, 2 | Hard],
            chain: '04466b9cc8e161e966409ca52986c584f07e9dc81f735db683c3ff6ec7b1503f',
            priv: 'cbce0d719ecf7431d88e6a89fa1483e02e35092af60c042b1df2ff59fa424dca',
          },
          {
            path: [0 | Hard, 1, 2 | Hard, 2],
            chain: 'cfb71883f01676f587d023cc53a35bc7f88f724b1f8c2892ac1275ac822a3edd',
            priv: '0f479245fb19a38a1954c5c7c0ebab2f9bdfd96a17563ef28a6a4b1a2a764ef4',
          },
          {
            path: [0 | Hard, 1, 2 | Hard, 2, 1000000000],
            chain: 'c783e67b921d2beb8f6b389cc646d7263b4145701dadd2161548a8b078e65e9e',
            priv: '471b76e389e528d6de6d816857e012c5455051cad6660850e58372a6c3e6e7c8',
          },
        ],
      },
      {
        seed: 'fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542',
        keys: [
          {
            path: [],
            chain: '60499f801b896d83179a4374aeb7822aaeaceaa0db1f85ee3e904c4defbd9689',
            priv: '4b03d6fc340455b363f51020ad3ecca4f0850280cf436c70c727923f6db46c3e',
          },
          {
            path: [0],
            chain: 'f0909affaa7ee7abe5dd4e100598d4dc53cd709d5a5c2cac40e7412f232f7c9c',
            priv: 'abe74a98f6c7eabee0428f53798f0ab8aa1bd37873999041703c742f15ac7e1e',
          },
          {
            path: [0, 2147483647 | Hard],
            chain: 'be17a268474a6bb9c61e1d720cf6215e2a88c5406c4aee7b38547f585c9a37d9',
            priv: '877c779ad9687164e9c2f4f0f4ff0340814392330693ce95a58fe18fd52e6e93',
          },
          {
            path: [0, 2147483647 | Hard, 1],
            chain: 'f366f48f1ea9f2d1d3fe958c95ca84ea18e4c4ddb9366c336c927eb246fb38cb',
            priv: '704addf544a06e5ee4bea37098463c23613da32020d604506da8c0518e1da4b7',
          },
          {
            path: [0, 2147483647 | Hard, 1, 2147483646 | Hard],
            chain: '637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29',
            priv: 'f1c7c871a54a804afe328b4c83a1c33b8e5ff48f5087273f04efa83b247d6a2d',
          },
          {
            path: [0, 2147483647 | Hard, 1, 2147483646 | Hard, 2],
            chain: '9452b549be8cea3ecb7a84bec10dcfd94afe4d129ebfd3b3cb58eedf394ed271',
            priv: 'bb7d39bdb83ecf58f2fd82b6d918341cbef428661ef01ab97c28a4842125ac23',
          },
        ],
      },
      // from Ledger
      {
        mnemonic:
          'miracle blush border auto country easily icon below finish fruit base shift lift old farm wild room symbol ocean attitude ill tank soon know',
        keys: [
          {
            path: [44 | Hard, 1729 | Hard],
          },
        ],
      },
      // BOLOS test suite
      {
        seed: '5eb00bbddcf069084889a8ab9155568165f5c453ccb85e70811aaed6f6da5fc19a5ac40b389cd370d086206dec8aa6c43daea6690f20ad3d8d48b2d2ce9e38e4',
        keys: [
          {
            path: [738197632, 335544448 | Hard, 0, 0],
            chain: '0524d4d89a04e06f0410003751306bbe7a1c4e80608433d12469fe6a92eecb43',
            priv: 'f7dd8c0fb5023c6fce668c035560a40914abea017d83b792b15563d6feb1251b',
          },
          {
            path: [738197504, 335544320 | Hard, 16777216, 33554432],
            chain: '336717d2389fd2886088c3dff5ceb66ef6064ad90e0a0d07a867064d1c074864',
            priv: '32cc0b6f100f76d724738926fd406f9b476770ba970c369318943562e70011e6',
          },
          {
            path: [44 | Hard, 148 | Hard, 0, 0],
            chain: '8fff97b457b717b0cad899d2818b5d43165f350f31c5d5598cc71bbde707d604',
            priv: '002e694a441a412fc0ca8c3a6dcc27a5da20f69341490bb27cddcd63db5b90ce',
          },
        ],
      },
    ],
  },
  {
    curve: 'p256',
    chain: [
      {
        seed: '000102030405060708090a0b0c0d0e0f',
        keys: [
          {
            path: [],
            chain: 'beeb672fe4621673f722f38529c07392fecaa61015c80c34f29ce8b41b3cb6ea',
            priv: '612091aaa12e22dd2abef664f8a01a82cae99ad7441b7ef8110424915c268bc2',
          },
          {
            path: [0 | Hard],
            chain: '3460cea53e6a6bb5fb391eeef3237ffd8724bf0a40e94943c98b83825342ee11',
            priv: '6939694369114c67917a182c59ddb8cafc3004e63ca5d3b84403ba8613debc0c',
          },
          {
            path: [0 | Hard, 1],
            chain: '4187afff1aafa8445010097fb99d23aee9f599450c7bd140b6826ac22ba21d0c',
            priv: '284e9d38d07d21e4e281b645089a94f4cf5a5a81369acf151a1c3a57f18b2129',
          },
          {
            path: [0 | Hard, 1, 2 | Hard],
            chain: '98c7514f562e64e74170cc3cf304ee1ce54d6b6da4f880f313e8204c2a185318',
            priv: '694596e8a54f252c960eb771a3c41e7e32496d03b954aeb90f61635b8e092aa7',
          },
          {
            path: [0 | Hard, 1, 2 | Hard, 2],
            chain: 'ba96f776a5c3907d7fd48bde5620ee374d4acfd540378476019eab70790c63a0',
            priv: '5996c37fd3dd2679039b23ed6f70b506c6b56b3cb5e424681fb0fa64caf82aaa',
          },
          {
            path: [0 | Hard, 1, 2 | Hard, 2, 1000000000],
            chain: 'b9b7b82d326bb9cb5b5b121066feea4eb93d5241103c9e7a18aad40f1dde8059',
            priv: '21c4f269ef0a5fd1badf47eeacebeeaa3de22eb8e5b0adcd0f27dd99d34d0119',
          },
          // derivation retry
          {
            path: [],
            chain: 'beeb672fe4621673f722f38529c07392fecaa61015c80c34f29ce8b41b3cb6ea',
            priv: '612091aaa12e22dd2abef664f8a01a82cae99ad7441b7ef8110424915c268bc2',
          },
          {
            path: [28578 | Hard],
            chain: 'e94c8ebe30c2250a14713212f6449b20f3329105ea15b652ca5bdfc68f6c65c2',
            priv: '06f0db126f023755d0b8d86d4591718a5210dd8d024e3e14b6159d63f53aa669',
          },
          {
            path: [28578 | Hard, 33941],
            chain: '9e87fe95031f14736774cd82f25fd885065cb7c358c1edf813c72af535e83071',
            priv: '092154eed4af83e078ff9b84322015aefe5769e31270f62c3f66c33888335f3a',
          },
        ],
      },
      {
        seed: 'fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542',
        keys: [
          {
            path: [],
            chain: '96cd4465a9644e31528eda3592aa35eb39a9527769ce1855beafc1b81055e75d',
            priv: 'eaa31c2e46ca2962227cf21d73a7ef0ce8b31c756897521eb6c7b39796633357',
          },
          {
            path: [0],
            chain: '84e9c258bb8557a40e0d041115b376dd55eda99c0042ce29e81ebe4efed9b86a',
            priv: 'd7d065f63a62624888500cdb4f88b6d59c2927fee9e6d0cdff9cad555884df6e',
          },
          {
            path: [0, 2147483647 | Hard],
            chain: 'f235b2bc5c04606ca9c30027a84f353acf4e4683edbd11f635d0dcc1cd106ea6',
            priv: '96d2ec9316746a75e7793684ed01e3d51194d81a42a3276858a5b7376d4b94b9',
          },
          {
            path: [0, 2147483647 | Hard, 1],
            chain: '7c0b833106235e452eba79d2bdd58d4086e663bc8cc55e9773d2b5eeda313f3b',
            priv: '974f9096ea6873a915910e82b29d7c338542ccde39d2064d1cc228f371542bbc',
          },
          {
            path: [0, 2147483647 | Hard, 1, 2147483646 | Hard],
            chain: '5794e616eadaf33413aa309318a26ee0fd5163b70466de7a4512fd4b1a5c9e6a',
            priv: 'da29649bbfaff095cd43819eda9a7be74236539a29094cd8336b07ed8d4eff63',
          },
          {
            path: [0, 2147483647 | Hard, 1, 2147483646 | Hard, 2],
            chain: '3bfb29ee8ac4484f09db09c2079b520ea5616df7820f071a20320366fbe226a7',
            priv: 'bb0a77ba01cc31d77205d51d08bd313b979a71ef4de9b062f8958297e746bd67',
          },
        ],
      },
      // seed retry
      {
        seed: 'a7305bc8df8d0951f0cb224c0e95d7707cbdf2c6ce7e8d481fec69c7ff5e9446',
        keys: [
          {
            path: [],
            chain: '7762f9729fed06121fd13f326884c82f59aa95c57ac492ce8c9654e60efd130c',
            priv: '3b8c18469a4634517d6d0b65448f8e6c62091b45540a1743c5846be55d47d88f',
          },
        ],
      },
      // from Ledger
      {
        mnemonic:
          'miracle blush border auto country easily icon below finish fruit base shift lift old farm wild room symbol ocean attitude ill tank soon know',
        keys: [
          {
            path: [44 | Hard, 1729 | Hard],
          },
        ],
      },
      // BOLOS test suite
      {
        seed: '5eb00bbddcf069084889a8ab9155568165f5c453ccb85e70811aaed6f6da5fc19a5ac40b389cd370d086206dec8aa6c43daea6690f20ad3d8d48b2d2ce9e38e4',
        keys: [
          {
            path: [738197632, 335544448 | Hard, 0, 0],
            chain: 'cdc590746b238933166da99295ef0de9e048c9ef0717c269616613ac14e52934',
            priv: '64461c084badf0064b2cd6c9aacf010ec073e850170bae02643d1b7f9574baf7',
          },
          {
            path: [738197504, 335544320 | Hard, 16777216, 33554432],
            chain: 'eb9bc0b0773fcbb10c4a3078c0a3bc2309ec0b4f28065d6224c5777b6b9e83cd',
            priv: '3cbf2b3d850e1a8f47b35271d0156ca482debef29bdfa5285386d47eefb87204',
          },
          {
            path: [44 | Hard, 148 | Hard, 0, 0],
            chain: 'bba08de0a440987023821d4d82a39c46068e8c8ebe23be0e0329a7dc6467a30d',
            priv: '7b95d7cb3fc819eb4ac356644eb3467d465d5eb5f4703f39670a03139b6cdf56',
          },
        ],
      },
    ],
  },
];

describe('ECDSA', () => {
  for (const curve of testData) {
    describe(curve.curve, () => {
      for (const chain of curve.chain) {
        describe(chain.seed || 'mnemonic', () => {
          const seed = chain.seed || bip39.mnemonicToSeedSync(chain.mnemonic || '', '');
          const root = ECDSA.PrivateKey.fromSeed(seed, curve.curve);
          for (const keyData of chain.keys) {
            it(JSON.stringify(keyData.path.map((x) => x >>> 0)), () => {
              const key = root.derivePath(keyData.path);
              if (keyData.chain) {
                expect(Buffer.from(key.chainCode).toString('hex')).toBe(keyData.chain);
              }
              if (keyData.priv) {
                expect(Buffer.from(key.bytes()).toString('hex')).toBe(keyData.priv);
              }
            });
          }
        });
      }
    });
  }

  describe('ECKey and ECPublicKey compressed/uncompressed bytes and known-answer vectors', () => {
    const secp256k1Order = BigInt(
      '0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141'
    );
    const p256Order = BigInt('0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551');

    it('ECPublicKey.bytes(compressed) returns 33-byte compressed and 65-byte uncompressed SEC1 points for secp256k1 (sppk)', () => {
      const pkString = 'sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH';
      const pubKey = new ECPublicKey(pkString);

      const compressed = pubKey.bytes(true);
      const uncompressed = pubKey.bytes(false);

      expect(compressed).toBeInstanceOf(Uint8Array);
      expect(compressed.length).toBe(33);
      expect(Buffer.from(compressed).toString('hex')).toBe(
        '02c9a6a1cafec7ab8a5624a04f0b07aad7c2a4e4aa2137e977af43b56e0ef59ad0'
      );

      expect(uncompressed).toBeInstanceOf(Uint8Array);
      expect(uncompressed.length).toBe(65);
      expect(uncompressed[0]).toBe(0x04);
      expect(Buffer.from(uncompressed).toString('hex')).toBe(
        '04c9a6a1cafec7ab8a5624a04f0b07aad7c2a4e4aa2137e977af43b56e0ef59ad0f6c52983035d68cb9e2507fd726252430301a28f5baa9e662ac452b25b49e658'
      );
      expect(Buffer.from(uncompressed.subarray(1, 33)).toString('hex')).toBe(
        Buffer.from(compressed.subarray(1, 33)).toString('hex')
      );
      expect(pubKey.toProtocol().length).toBe(34);
      expect(pubKey.toProtocol()[0]).toBe(1);
    });

    it('ECPublicKey.bytes(compressed) returns 33-byte compressed and 65-byte uncompressed SEC1 points for P-256 (p2pk)', () => {
      const pkString = 'p2pk66tTYL5EvahKAXncbtbRPBkAnxo3CszzUho5wPCgWauBMyvybuB';
      const pubKey = new ECPublicKey(pkString);

      const compressed = pubKey.bytes(true);
      const uncompressed = pubKey.bytes(false);

      expect(compressed).toBeInstanceOf(Uint8Array);
      expect(compressed.length).toBe(33);
      expect(Buffer.from(compressed).toString('hex')).toBe(
        '0330ef59d5da4547c684aa0d5b7d8c1527fceab462cfd8d4a3529319c469b0d4d7'
      );

      expect(uncompressed).toBeInstanceOf(Uint8Array);
      expect(uncompressed.length).toBe(65);
      expect(uncompressed[0]).toBe(0x04);
      expect(Buffer.from(uncompressed).toString('hex')).toBe(
        '0430ef59d5da4547c684aa0d5b7d8c1527fceab462cfd8d4a3529319c469b0d4d7896fd6b04882b4736eb99a1e60c1547dee3d180e85c72ec9ec55f50777214341'
      );
      expect(Buffer.from(uncompressed.subarray(1, 33)).toString('hex')).toBe(
        Buffer.from(compressed.subarray(1, 33)).toString('hex')
      );
      expect(pubKey.toProtocol().length).toBe(34);
      expect(pubKey.toProtocol()[0]).toBe(2);
    });

    it('ECKey.sign produces canonical low-S prehash:false signatures over Blake2b-256 digests for tz2 (secp256k1), matching octez-client 25.2', () => {
      // Provenance: `octez-client --protocol PtSeouLouXkx sign bytes 0x031234` with spsk2rBDDeUqakQ42nBHDGQTtP3GErb6AahHPwF9bhca3Q5KA5HESE
      // produces `spsig194cg549ti3fNuGqvQs4dZEn4aJHCbXHde4kc4dDaCs5y4nCwp5uMUp4DbyGuTjisaTU2UV1v7vy7CybSGJJS4ur88uBWT`.
      const wateredBytes = new Uint8Array([3, 0x12, 0x34]);
      const tz2Key = new ECKey('spsk2rBDDeUqakQ42nBHDGQTtP3GErb6AahHPwF9bhca3Q5KA5HESE');
      const tz2Sig = tz2Key.sign(wateredBytes);
      expect(tz2Sig.sig).toBe(
        'sigREwM1SuRN5WzjH5xGJuyeZQ9kWi8XtbA4wRqGTumJwNY18PmF1XQMLCXEQBr4frnriKHWdPUynF1vGUvPcoWrNjb3s5xp'
      );
      expect(tz2Sig.prefixSig).toBe(
        'spsig194cg549ti3fNuGqvQs4dZEn4aJHCbXHde4kc4dDaCs5y4nCwp5uMUp4DbyGuTjisaTU2UV1v7vy7CybSGJJS4ur88uBWT'
      );
      const [tz2RawSig] = b58DecodeAndCheckPrefix(tz2Sig.prefixSig, [PrefixV2.Secp256k1Signature]);
      expect(tz2RawSig.length).toBe(64);
      const tz2S = BigInt('0x' + Buffer.from(tz2RawSig.subarray(32, 64)).toString('hex'));
      expect(tz2S <= secp256k1Order / 2n).toBe(true);
      expect(
        verifySignature('1234', tz2Key.publicKey().toString(), tz2Sig.prefixSig, new Uint8Array([3]))
      ).toBe(true);
    });

    it('ECKey.sign produces canonical low-S prehash:false signatures over Blake2b-256 digests for tz3 (P-256), accepted by octez-client 25.2', () => {
      // Provenance: verified via `octez-client --protocol PtSeouLouXkx check that bytes 0x031234 were signed by ...`
      const wateredBytes = new Uint8Array([3, 0x12, 0x34]);
      const tz3Key = new ECKey('p2sk2obfVMEuPUnadAConLWk7Tf4Dt3n4svSgJwrgpamRqJXvaYcg1');
      const tz3Sig = tz3Key.sign(wateredBytes);
      expect(tz3Sig.sig).toBe(
        'sigRUobRZ4oG7CvdtQfNoDe3Gqn8zrLw6RXjXVa84rX3HMzWuCuncWgDqY8wRkssofLUsfbdR6MNGJzDWaNXEwTxDktfrKmj'
      );
      const [tz3RawSig] = b58DecodeAndCheckPrefix(tz3Sig.prefixSig, [PrefixV2.P256Signature]);
      expect(tz3RawSig.length).toBe(64);
      const tz3S = BigInt('0x' + Buffer.from(tz3RawSig.subarray(32, 64)).toString('hex'));
      expect(tz3S <= p256Order / 2n).toBe(true);
      expect(
        verifySignature('1234', tz3Key.publicKey().toString(), tz3Sig.prefixSig, new Uint8Array([3]))
      ).toBe(true);
    });

    it('bip39.mnemonicToSeedSync normalizes non-ASCII passphrases via NFKD consistently', () => {
      const mnemonic =
        'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
      const decomposedSeed = bip39.mnemonicToSeedSync(mnemonic, 'TREZOR-\u05d0-e\u0301');
      const precomposedSeed = bip39.mnemonicToSeedSync(mnemonic, 'TREZOR-\u05d0-\u00e9');
      expect(Buffer.from(decomposedSeed).toString('hex')).toBe(
        'ed8f4cbca63e92260538b00c96bf2568039026708e4f1cb71d8e005584d75f9b0aa748d47098094e6e5468a956010b46bce01e813b45133af874564538bb3f0f'
      );
      expect(Buffer.from(precomposedSeed).toString('hex')).toBe(
        Buffer.from(decomposedSeed).toString('hex')
      );
    });
  });

  describe('Noble curves v2 compatibility for @taquito/signer', () => {
    const resolveNobleCurvesV2Dir = (): string => {
      const req = createRequire(import.meta.url);
      const directEntryPath = req.resolve('@noble/curves/ed25519.js');
      const directDir = path.dirname(directEntryPath);
      const directPkg = JSON.parse(readFileSync(path.join(directDir, 'package.json'), 'utf8')) as {
        version: string;
      };
      if (Number(directPkg.version.split('.')[0]) >= 2) {
        return directDir;
      }
      const pqEntryPath = req.resolve('@noble/post-quantum/ml-dsa.js');
      const nestedEntryPath = createRequire(pqEntryPath).resolve('@noble/curves/ed25519.js');
      const nestedDir = path.dirname(nestedEntryPath);
      const nestedPkg = JSON.parse(readFileSync(path.join(nestedDir, 'package.json'), 'utf8')) as {
        version: string;
      };
      expect(Number(nestedPkg.version.split('.')[0])).toBeGreaterThanOrEqual(2);
      return nestedDir;
    };

    const hasExtensionlessCurveExports = (): boolean => {
      try {
        createRequire(import.meta.url).resolve('@noble/curves/secp256k1');
        return true;
      } catch {
        return false;
      }
    };

    afterEach(() => {
      const hasExtensionless = hasExtensionlessCurveExports();
      for (const curve of ['secp256k1', 'nist', 'ed25519', 'bls12-381']) {
        vi.doUnmock(`@noble/curves/${curve}.js`);
        if (hasExtensionless) {
          vi.doUnmock(`@noble/curves/${curve}`);
        }
      }
      vi.resetModules();
    });

    it('uses explicit .js subpath specifiers for @noble/curves in source and marks all 4 curve subpaths external in Rollup config', async () => {
      const pkgDir = path.resolve(__dirname, '..');
      const sourceFiles = [
        'src/ec-key.ts',
        'src/ed-key.ts',
        'src/bls-key.ts',
        'src/derivation-tools/ecdsa.ts',
        'src/derivation-tools/ed25519.ts',
      ];
      const bareCurveSpecifier = /['"]@noble\/curves\/(secp256k1|nist|ed25519|bls12-381)['"]/g;

      for (const relPath of sourceFiles) {
        const content = readFileSync(path.join(pkgDir, relPath), 'utf8');
        const matches = content.match(bareCurveSpecifier) ?? [];
        expect(matches, `${relPath} contains extensionless @noble/curves specifiers`).toEqual([]);
      }

      const rollupConfigModule = await import('../rollup.config');
      const rollupConfig = rollupConfigModule.default as {
        external?: string[] | ((id: string) => boolean);
      };
      const isExternal = (id: string): boolean => {
        if (typeof rollupConfig.external === 'function') {
          return Boolean(rollupConfig.external(id));
        }
        return Array.isArray(rollupConfig.external) && rollupConfig.external.includes(id);
      };

      for (const subpath of [
        '@noble/curves/ed25519.js',
        '@noble/curves/secp256k1.js',
        '@noble/curves/nist.js',
        '@noble/curves/bls12-381.js',
      ]) {
        expect(isExternal(subpath), `${subpath} must be external in rollup.config.ts`).toBe(true);
      }
    });

    const mockNobleCurvesV2 = () => {
      const v2Dir = resolveNobleCurvesV2Dir();
      const importV2 = (subpath: string) =>
        import(pathToFileURL(path.join(v2Dir, subpath)).href);

      const hasExtensionless = hasExtensionlessCurveExports();

      for (const curve of ['secp256k1', 'nist', 'ed25519', 'bls12-381']) {
        vi.doMock(`@noble/curves/${curve}.js`, () => importV2(`${curve}.js`));
        if (hasExtensionless) {
          vi.doMock(`@noble/curves/${curve}`, () => importV2(`${curve}.js`));
        }
      }
      vi.resetModules();
    };

    it('serializes uncompressed SEC1 points via ECPublicKey.bytes(false) for secp256k1 (sppk) under @noble/curves v2', async () => {
      mockNobleCurvesV2();
      const { ECPublicKey: V2ECPublicKey } = await import('../src/ec-key');

      const tz2PubKey = new V2ECPublicKey('sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH');
      expect(Buffer.from(tz2PubKey.bytes(false)).toString('hex')).toBe(
        '04c9a6a1cafec7ab8a5624a04f0b07aad7c2a4e4aa2137e977af43b56e0ef59ad0f6c52983035d68cb9e2507fd726252430301a28f5baa9e662ac452b25b49e658'
      );
    });

    it('serializes uncompressed SEC1 points via ECPublicKey.bytes(false) for P-256 (p2pk) under @noble/curves v2', async () => {
      mockNobleCurvesV2();
      const { ECPublicKey: V2ECPublicKey } = await import('../src/ec-key');

      const tz3PubKey = new V2ECPublicKey('p2pk66tTYL5EvahKAXncbtbRPBkAnxo3CszzUho5wPCgWauBMyvybuB');
      expect(Buffer.from(tz3PubKey.bytes(false)).toString('hex')).toBe(
        '0430ef59d5da4547c684aa0d5b7d8c1527fceab462cfd8d4a3529319c469b0d4d7896fd6b04882b4736eb99a1e60c1547dee3d180e85c72ec9ec55f50777214341'
      );
    });

    it('preserves tz2 (secp256k1) ECKey.sign and ECPublicKey.toString under @noble/curves v2', async () => {
      mockNobleCurvesV2();
      const { ECKey: V2ECKey } = await import('../src/ec-key');

      const wateredBytes = new Uint8Array([3, 0x12, 0x34]);
      const tz2Key = new V2ECKey('spsk2rBDDeUqakQ42nBHDGQTtP3GErb6AahHPwF9bhca3Q5KA5HESE');
      const signed = tz2Key.sign(wateredBytes);
      expect(signed.sig).toBe(
        'sigREwM1SuRN5WzjH5xGJuyeZQ9kWi8XtbA4wRqGTumJwNY18PmF1XQMLCXEQBr4frnriKHWdPUynF1vGUvPcoWrNjb3s5xp'
      );
      expect(signed.prefixSig).toBe(
        'spsig194cg549ti3fNuGqvQs4dZEn4aJHCbXHde4kc4dDaCs5y4nCwp5uMUp4DbyGuTjisaTU2UV1v7vy7CybSGJJS4ur88uBWT'
      );
      expect(tz2Key.publicKey().toString()).toBe(
        'sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH'
      );
    });

    it('preserves tz3 (P-256) ECKey.sign and ECPublicKey.toString under @noble/curves v2', async () => {
      mockNobleCurvesV2();
      const { ECKey: V2ECKey } = await import('../src/ec-key');

      const wateredBytes = new Uint8Array([3, 0x12, 0x34]);
      const tz3Key = new V2ECKey('p2sk2obfVMEuPUnadAConLWk7Tf4Dt3n4svSgJwrgpamRqJXvaYcg1');
      expect(tz3Key.sign(wateredBytes).sig).toBe(
        'sigRUobRZ4oG7CvdtQfNoDe3Gqn8zrLw6RXjXVa84rX3HMzWuCuncWgDqY8wRkssofLUsfbdR6MNGJzDWaNXEwTxDktfrKmj'
      );
      expect(tz3Key.publicKey().toString()).toBe(
        'p2pk66tTYL5EvahKAXncbtbRPBkAnxo3CszzUho5wPCgWauBMyvybuB'
      );
    });

    it('preserves tz1 (Ed25519) EdKey.sign and tz4 (BLS12-381) BLSKey.sign/provePossession under @noble/curves v2', async () => {
      mockNobleCurvesV2();
      const { EdKey: V2EdKey } = await import('../src/ed-key');
      const { BLSKey: V2BLSKey } = await import('../src/bls-key');

      const wateredBytes = new Uint8Array([3, 0x12, 0x34]);
      const tz1Key = new V2EdKey('edsk4TjJWEszkHKono7XMnepVqwi37FrpbVt1KCsifJeAGimxheShG');
      expect(tz1Key.publicKey().toString()).toBe(
        'edpkuhmrbunxumoiVdQuxBZUPMmwkPt7yLtY5Qnua3VJVTLWr3vXXa'
      );
      expect(tz1Key.sign(wateredBytes).sig).toBe(
        'sigpKAnfQGzG4Rk5pV7z9mx2TL9veQCHD7qN4PhsUZMj1BqsumBoApBS9Ue616vKVymxrzfZE2L4h27zzxRUVy6BNPRMpufb'
      );

      const tz4Key = new V2BLSKey('BLsk2zk6pBGysG9BJn4u3XNtFnJQ1wpUYz6sQMTZQdfxQaiBWkqLyh');
      expect(tz4Key.publicKey().toString()).toBe(
        'BLpk1oWB1ZbeKePu8FiRMpktQoZw1rPs67qu6zbnYxiCcJDyZih8PXUiGnLyMWR6Fay9cDNyCzj9'
      );
      expect(tz4Key.sign(new Uint8Array([1, 2, 3, 4])).prefixSig).toBe(
        'BLsigAMExDCYjNtvjLUqvLiEQJro6VrJFZ7yr7eNY4YCAVTYVerMnrNtk7cY8ve8D4HfJ55YtK93sQNFTcXTYGt8c6HutFneTz31aR198QkbBfZpHmvJV4zGQTHKroNFDRWLw3c3eJXyAu'
      );
      expect(tz4Key.provePossession().prefixSig).toBe(
        'BLsigAp94rBWCJU7yM7X5F4zSw15AKkW1JZ5dwkqa2Xjdo1y4jhcQKVf6Sh7GFV261MUEx3WbfStUkP83tmKRpAucD4NEo1bLCB3s1TM4ByDUYZ1vUV5qsAWFLagvbnHfn61DnouoxmTij'
      );
      expect(
        tz4Key.provePossession(
          'BLpk1nGsPWudaiPFkzo7iZRGrbbFSH5RD9PXXzNKajKmBGKcGHUaZxKBSibQbYUW1Swo3VbuuNC8'
        ).prefixSig
      ).toBe(
        'BLsigANoYkqpCmSPUi8UCP29nCm6C98HR9oU7vmQzNQAwV2kAFvkBQ6BZkKatf4DD7vD5uxhfwUHz6KZonq4BFH3PwuDYLRNXophffed3XhQGMNYqhKN19wpe6U86gVzLbYTKHyWK4Qzzc'
      );
    });

    it('preserves ECDSA (secp256k1, P-256) and Ed25519 SLIP-0010 HD key derivation under @noble/curves v2', async () => {
      mockNobleCurvesV2();
      const { ECDSA: V2ECDSA, Ed25519: V2Ed25519, Hard: V2Hard } = await import(
        '../src/derivation-tools'
      );

      const seed = Buffer.from('000102030405060708090a0b0c0d0e0f', 'hex');
      const secpChild = V2ECDSA.PrivateKey.fromSeed(seed, 'secp256k1').derivePath([
        0 | V2Hard,
        1,
        2 | V2Hard,
      ]);
      expect(Buffer.from(secpChild.bytes()).toString('hex')).toBe(
        'cbce0d719ecf7431d88e6a89fa1483e02e35092af60c042b1df2ff59fa424dca'
      );
      expect(Buffer.from(secpChild.chainCode).toString('hex')).toBe(
        '04466b9cc8e161e966409ca52986c584f07e9dc81f735db683c3ff6ec7b1503f'
      );

      const p256Child = V2ECDSA.PrivateKey.fromSeed(seed, 'p256').derivePath([
        0 | V2Hard,
        1,
        2 | V2Hard,
      ]);
      expect(Buffer.from(p256Child.bytes()).toString('hex')).toBe(
        '694596e8a54f252c960eb771a3c41e7e32496d03b954aeb90f61635b8e092aa7'
      );
      expect(Buffer.from(p256Child.chainCode).toString('hex')).toBe(
        '98c7514f562e64e74170cc3cf304ee1ce54d6b6da4f880f313e8204c2a185318'
      );

      const edChild = V2Ed25519.PrivateKey.fromSeed(seed).derivePath([
        0 | V2Hard,
        1 | V2Hard,
        2 | V2Hard,
      ]);
      expect(Buffer.from(edChild.seed()).toString('hex')).toBe(
        '92a5b23c0b8a99e37d07df3fb9966917f5d06e02ddbd909c7e184371463e9fc9'
      );
      expect(Buffer.from(edChild.priv.subarray(32)).toString('hex')).toBe(
        'ae98736566d30ed0e9d2f4486a64bc95740d89c7db33f52121f8ea8f76ff0fc1'
      );
      expect(Buffer.from(edChild.chainCode).toString('hex')).toBe(
        '2e69929e00b5ab250f49c3fb1c12f252de4fed2c1db88387094a0f8c4c9ccd6c'
      );
    });
  });
});
