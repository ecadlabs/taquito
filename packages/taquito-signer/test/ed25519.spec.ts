import { Ed25519, Hard } from '../src/derivation-tools';
import * as Bip39 from 'bip39';
import { InvalidSeedLengthError } from '../src/errors';

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

const testData: TestChain[] = [
  {
    seed: '000102030405060708090a0b0c0d0e0f',
    keys: [
      {
        path: [],
        chain: '90046a93de5380a72b5e45010748567d5ea02bbf6522f979e05c0d8d8ca9fffb',
        priv: '2b4be7f19ee27bbf30c667b642d5f4aa69fd169872f8fc3059c08ebae2eb19e7',
      },
      {
        path: [0 | Hard],
        chain: '8b59aa11380b624e81507a27fedda59fea6d0b779a778918a2fd3590e16e9c69',
        priv: '68e0fe46dfb67e368c75379acec591dad19df3cde26e63b93a8e704f1dade7a3',
      },
      {
        path: [0 | Hard, 1 | Hard],
        chain: 'a320425f77d1b5c2505a6b1b27382b37368ee640e3557c315416801243552f14',
        priv: 'b1d0bad404bf35da785a64ca1ac54b2617211d2777696fbffaf208f746ae84f2',
      },
      {
        path: [0 | Hard, 1 | Hard, 2 | Hard],
        chain: '2e69929e00b5ab250f49c3fb1c12f252de4fed2c1db88387094a0f8c4c9ccd6c',
        priv: '92a5b23c0b8a99e37d07df3fb9966917f5d06e02ddbd909c7e184371463e9fc9',
      },
      {
        path: [0 | Hard, 1 | Hard, 2 | Hard, 2 | Hard],
        chain: '8f6d87f93d750e0efccda017d662a1b31a266e4a6f5993b15f5c1f07f74dd5cc',
        priv: '30d1dc7e5fc04c31219ab25a27ae00b50f6fd66622f6e9c913253d6511d1e662',
      },
      {
        path: [0 | Hard, 1 | Hard, 2 | Hard, 2 | Hard, 1000000000 | Hard],
        chain: '68789923a0cac2cd5a29172a475fe9e0fb14cd6adb5ad98a3fa70333e7afa230',
        priv: '8f94d394a8e8fd6b1bc2f3f49f5c47e385281d5c17e65324b0f62483e37e8793',
      },
    ],
  },
  {
    seed: 'fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542',
    keys: [
      {
        path: [],
        chain: 'ef70a74db9c3a5af931b5fe73ed8e1a53464133654fd55e7a66f8570b8e33c3b',
        priv: '171cb88b1b3c1db25add599712e36245d75bc65a1a5c9e18d76f9f2b1eab4012',
      },
      {
        path: [0 | Hard],
        chain: '0b78a3226f915c082bf118f83618a618ab6dec793752624cbeb622acb562862d',
        priv: '1559eb2bbec5790b0c65d8693e4d0875b1747f4970ae8b650486ed7470845635',
      },
      {
        path: [0 | Hard, 2147483647 | Hard],
        chain: '138f0b2551bcafeca6ff2aa88ba8ed0ed8de070841f0c4ef0165df8181eaad7f',
        priv: 'ea4f5bfe8694d8bb74b7b59404632fd5968b774ed545e810de9c32a4fb4192f4',
      },
      {
        path: [0 | Hard, 2147483647 | Hard, 1 | Hard],
        chain: '73bd9fff1cfbde33a1b846c27085f711c0fe2d66fd32e139d3ebc28e5a4a6b90',
        priv: '3757c7577170179c7868353ada796c839135b3d30554bbb74a4b1e4a5a58505c',
      },
      {
        path: [0 | Hard, 2147483647 | Hard, 1 | Hard, 2147483646 | Hard],
        chain: '0902fe8a29f9140480a00ef244bd183e8a13288e4412d8389d140aac1794825a',
        priv: '5837736c89570de861ebc173b1086da4f505d4adb387c6a1b1342d5e4ac9ec72',
      },
      {
        path: [0 | Hard, 2147483647 | Hard, 1 | Hard, 2147483646 | Hard, 2 | Hard],
        chain: '5d70af781f3a37b829f0d060924d5e960bdc02e85423494afc0b1a41bbe196d4',
        priv: '551d333177df541ad876a60ea71f00447931c0a9da16f227c11ea080d7391b8d',
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
  // BOLOS
  {
    seed: '5eb00bbddcf069084889a8ab9155568165f5c453ccb85e70811aaed6f6da5fc19a5ac40b389cd370d086206dec8aa6c43daea6690f20ad3d8d48b2d2ce9e38e4',
    keys: [
      {
        path: [738197632 | Hard, 335544448 | Hard, 0 | Hard, 0 | Hard],
        chain: 'b609a7af6a8ae5568bff26a3747aa0c4d8b383144db5c3da28650a37015f2503',
        priv: '9761691a62523b637c55aa267b3c4835b7cdd4bb704b399a0f7290ca570262cb',
      },
      {
        path: [738197504 | Hard, 335544320 | Hard, 16777216 | Hard, 33554432 | Hard],
        chain: '1a8e8df02b17fd4632529dab6443887359ecf94d547291535952b412cba88420',
        priv: 'e36a66d67ea0d2dcf9af54bc4617c0fa0724b42acff17501ac9dd27588bbd7dd',
      },
      {
        path: [44 | Hard, 148 | Hard, 0 | Hard, 0 | Hard],
        chain: 'ad38cb3640dd5a1e7540030761ec7ade17a8b38a203c37072647ec22eea7a3ba',
        priv: 'a044cf4dcc4c6206d64ea3a7dae79337afcd61808dc6239a22c1ba1f4618c055',
      },
      {
        path: [44 | Hard, 148 | Hard, 1 | Hard, 2 | Hard],
        chain: 'fbc472b0a324f71f264c6b002524a93a690a3d9fd130c9ca949d0ccc1e37b07e',
        priv: '889fc3bc31029c0f09eb6a24f1617af15b919dc9a6b3caac3c57383da094a157',
      },
    ],
  },
];
const badSeed =
  'fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542ababababababababababababababababababababab';

describe('Ed25519', () => {
  for (const d of testData) {
    describe(d.seed || 'mnemonic', () => {
      const seed = d.seed || Bip39.mnemonicToSeedSync(d.mnemonic || '');
      const root = Ed25519.PrivateKey.fromSeed(seed);
      for (const keyData of d.keys) {
        it(JSON.stringify(keyData.path.map((x) => x >>> 0)), () => {
          const key = root.derivePath(keyData.path);
          if (keyData.chain) {
            expect(Buffer.from(key.chainCode).toString('hex')).toBe(keyData.chain);
          }
          if (keyData.priv) {
            expect(Buffer.from(key.seed()).toString('hex')).toBe(keyData.priv);
          }
        });
      }
    });
  }
  it('Should reject with bad seed', () => {
    expect(() => Ed25519.PrivateKey.fromSeed(badSeed)).toThrowError(InvalidSeedLengthError);
  });
});
