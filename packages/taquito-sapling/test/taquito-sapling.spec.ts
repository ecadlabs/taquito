/* eslint-disable @typescript-eslint/no-explicit-any */
import { MichelCodecPacker } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import { SaplingForger } from '../src/sapling-forger/sapling-forger';
import {
  InMemorySpendingKey,
  SaplingToolkit,
  SaplingTransactionViewer,
} from '../src/taquito-sapling';
import { saplingState } from './sapling-tx-builder/single-sapling-state-diff';

describe('SaplingToolkit', () => {
  let saplingToolkit: SaplingToolkit;

  const inMemorySpendingKey = new InMemorySpendingKey(
    'sask27SLmU9herddHz4qFJBLMjWYMbJF8RtS579w9ej9mfCYK7VUdyCJPHK8AzW9zMsopGZEkYeNjAY7Zz1bkM7CGu8eKLzrjBLTMC5wWJDhxiK91ahA29rhDRsHdJDV2u2jFwb2MNUix8JW7sAkAqYVaJpCehTBPgRQ1KqKwqqUaNmuD8kazd4Q8MCWmgbWs21Yuomdqyi9FLigjRp7oY4m5adaVU19Nj1AHvsMY2tePeU2L'
  );

  let mockSaplingTxBuilder: {
    createShieldedTx: jest.Mock<any, any>;
    createSaplingTx: jest.Mock<any, any>;
  };

  let mockReadProvider: {
    getSaplingDiffById: jest.Mock<any, any>;
    getSaplingDiffByContract: jest.Mock<any, any>;
    getChainId: jest.Mock<any, any>;
  };

  beforeEach(() => {
    mockSaplingTxBuilder = {
      createShieldedTx: jest.fn(),
      createSaplingTx: jest.fn(),
    };

    mockReadProvider = {
      getSaplingDiffById: jest.fn(),
      getSaplingDiffByContract: jest.fn(),
      getChainId: jest.fn(),
    };

    mockReadProvider.getSaplingDiffById.mockResolvedValue(saplingState);
    mockReadProvider.getChainId.mockResolvedValue('NetXLH1uAxK7CCh');

    mockReadProvider.getSaplingDiffById.mockResolvedValue({
      root: '5de3573fbee0b1c59f7f02da3a5b30d0dd51f64b65ddd6fe21bb0c5b1e185e27',
      commitments_and_ciphertexts: [
        [
          '8ace2d8a13f1ffb0ea7c7a771046cb1995b0aa011edd17c5cb52318d0a5c8441',
          {
            cv: 'ffe358e458c6e96a40664859a9250ac22fa52049e4ab53da367b18db35e13ed1',
            epk: '37303fc0babf06f52a23ebc3732b38c77cda346d74c67e3900680dbd0e6237da',
            payload_enc:
              'b730999c1d007a1c5093fd39e47bdee2cf5141761394cdc43d4038d608869cbe7ce4a10a9c47a9182d417ab7bc5c6c0ffc04b3667d2b36db9f0208737305b73641289bce40ca492507c78938be9830',
            nonce_enc: '47a3127129ece95891e332403e687dae9dd86f2e080e0f37',
            payload_out:
              'c998f68807722590aadc5afe492de63adf3a738b3f02dae017968be5b92785fb83aabe380c5aa90efaa4c1456fb65abf85482a6496b28e0b9154e31af7a13515b4036eaa01b6455796de1e65f5e81dbf',
            nonce_out: '126c93195958505e6443bec07acab0afff489921aed8d9ff',
          },
        ],
      ],
      nullifiers: [],
    });

    saplingToolkit = new SaplingToolkit(
      { saplingSigner: inMemorySpendingKey },
      {
        contractAddress: 'KT1G2kvdfPoavgR6Fjdd68M2vaPk14qJ8bhC',
        saplingId: '0',
        memoSize: 8,
      },
      mockReadProvider as any,
      new MichelCodecPacker(),
      new SaplingForger(),
      mockSaplingTxBuilder as any
    );
  });

  it('should be instantiable', async () => {
    expect(
      new SaplingToolkit(
        { saplingSigner: inMemorySpendingKey },
        {
          contractAddress: 'KT1G2kvdfPoavgR6Fjdd68M2vaPk14qJ8bhC',
          saplingId: '0',
          memoSize: 8,
        },
        mockReadProvider as any,
        new MichelCodecPacker(),
        new SaplingForger(),
        mockSaplingTxBuilder as any
      )
    ).toBeDefined();
  });

  it('should return an instance of SaplingTransactionViewer based on sapling state id', async () => {
    const saplingTxViewer = await saplingToolkit.getSaplingTransactionViewer();
    expect(saplingTxViewer).toBeDefined();
    expect(saplingTxViewer).toBeInstanceOf(SaplingTransactionViewer);
  });

  it('should return an instance of SaplingTransactionViewer based on contract address', async () => {
    const saplingToolkit2 = new SaplingToolkit(
      { saplingSigner: inMemorySpendingKey },
      {
        contractAddress: 'KT1G2kvdfPoavgR6Fjdd68M2vaPk14qJ8bhC',
        memoSize: 8,
      },
      mockReadProvider as any,
      new MichelCodecPacker(),
      new SaplingForger(),
      mockSaplingTxBuilder as any
    );
    const saplingTxViewer = await saplingToolkit2.getSaplingTransactionViewer();
    expect(saplingTxViewer).toBeDefined();
    expect(saplingTxViewer).toBeInstanceOf(SaplingTransactionViewer);
  });

  it('Should prepare a valid shielded transaction based on sapling state id', async () => {
    mockReadProvider.getSaplingDiffById.mockResolvedValue({
      root: 'fbc2f4300c01f0b7820d00e3347c8da4ee614674376cbc45359daa54f9b5493e',
      commitments_and_ciphertexts: [],
      nullifiers: [],
    });
    mockSaplingTxBuilder.createShieldedTx.mockResolvedValue({
      inputs: [],
      outputs: [
        {
          commitment: Buffer.from(
            '8ace2d8a13f1ffb0ea7c7a771046cb1995b0aa011edd17c5cb52318d0a5c8441',
            'hex'
          ),
          proof: Buffer.from(
            '8d67d3a0a016a8ba231002ad80ad895307c6548ba247290c8a4a05bb7871e5f80c02bf7dae35038c62718a1117c2f388b204a69810690036ca23a29f604467ab49111c1c4cdda6e5eccc2236fff10050e95065accdff2cda603f65e8fea6cdd80e1c3b4e4f4e249b2b948366f1e4249accfc68cc07f3f3bef9b2a9356c406a7791bc144b056d2a80cb146bf1ac002460a9ef4d304bd635255af2ecce9dbb15ab72d15f8ae1f931deb5997984b6443337b892b4e4177d0e3a21204717a3619e3c',
            'hex'
          ),
          ciphertext: {
            commitmentValue: Buffer.from(
              'ffe358e458c6e96a40664859a9250ac22fa52049e4ab53da367b18db35e13ed1',
              'hex'
            ),
            ephemeralPublicKey: Buffer.from(
              '37303fc0babf06f52a23ebc3732b38c77cda346d74c67e3900680dbd0e6237da',
              'hex'
            ),
            nonceEnc: Buffer.from('47a3127129ece95891e332403e687dae9dd86f2e080e0f37', 'hex'),
            nonceOut: Buffer.from('126c93195958505e6443bec07acab0afff489921aed8d9ff', 'hex'),
            payloadEnc: Buffer.from(
              'b730999c1d007a1c5093fd39e47bdee2cf5141761394cdc43d4038d608869cbe7ce4a10a9c47a9182d417ab7bc5c6c0ffc04b3667d2b36db9f0208737305b73641289bce40ca492507c78938be9830',
              'hex'
            ),
            payloadOut: Buffer.from(
              'c998f68807722590aadc5afe492de63adf3a738b3f02dae017968be5b92785fb83aabe380c5aa90efaa4c1456fb65abf85482a6496b28e0b9154e31af7a13515b4036eaa01b6455796de1e65f5e81dbf',
              'hex'
            ),
          },
        },
      ],
      signature: Buffer.from(
        '34bdf80ea8c565179a63c888998930b8c1a8b8fe8651ba6d832c2ab684a3e139a6849e6d636eb81a9228eca69fbda25223c89e7d71197fad5d11503b4e2b1900',
        'hex'
      ),
      balance: new BigNumber(-8000000),
    });
    const shieldedTx = await saplingToolkit.prepareShieldedTransaction([
      {
        to: 'zet12mVvzJ4QJhnNQetGHzdwTMcLgNrdC4SFact6BB5jpeqGAefWip3iGgEjvDA9z7b9Y',
        amount: 8,
        memo: 'Taquito',
      },
    ]);
    expect(mockReadProvider.getSaplingDiffById).toHaveBeenCalledWith({ id: '0' }, 'head');
    expect(shieldedTx).toEqual(
      '00000000000001f38ace2d8a13f1ffb0ea7c7a771046cb1995b0aa011edd17c5cb52318d0a5c84418d67d3a0a016a8ba231002ad80ad895307c6548ba247290c8a4a05bb7871e5f80c02bf7dae35038c62718a1117c2f388b204a69810690036ca23a29f604467ab49111c1c4cdda6e5eccc2236fff10050e95065accdff2cda603f65e8fea6cdd80e1c3b4e4f4e249b2b948366f1e4249accfc68cc07f3f3bef9b2a9356c406a7791bc144b056d2a80cb146bf1ac002460a9ef4d304bd635255af2ecce9dbb15ab72d15f8ae1f931deb5997984b6443337b892b4e4177d0e3a21204717a3619e3cffe358e458c6e96a40664859a9250ac22fa52049e4ab53da367b18db35e13ed137303fc0babf06f52a23ebc3732b38c77cda346d74c67e3900680dbd0e6237da0000004fb730999c1d007a1c5093fd39e47bdee2cf5141761394cdc43d4038d608869cbe7ce4a10a9c47a9182d417ab7bc5c6c0ffc04b3667d2b36db9f0208737305b73641289bce40ca492507c78938be983047a3127129ece95891e332403e687dae9dd86f2e080e0f37c998f68807722590aadc5afe492de63adf3a738b3f02dae017968be5b92785fb83aabe380c5aa90efaa4c1456fb65abf85482a6496b28e0b9154e31af7a13515b4036eaa01b6455796de1e65f5e81dbf126c93195958505e6443bec07acab0afff489921aed8d9ff34bdf80ea8c565179a63c888998930b8c1a8b8fe8651ba6d832c2ab684a3e139a6849e6d636eb81a9228eca69fbda25223c89e7d71197fad5d11503b4e2b1900ffffffffff85ee00fbc2f4300c01f0b7820d00e3347c8da4ee614674376cbc45359daa54f9b5493e00000000'
    );
  });

  it('Should prepare a valid shielded transaction based on contractAddress', async () => {
    const saplingToolkit2 = new SaplingToolkit(
      { saplingSigner: inMemorySpendingKey },
      {
        contractAddress: 'KT1G2kvdfPoavgR6Fjdd68M2vaPk14qJ8bhC',
        memoSize: 8,
      },
      mockReadProvider as any,
      new MichelCodecPacker(),
      new SaplingForger(),
      mockSaplingTxBuilder as any
    );
    mockReadProvider.getSaplingDiffByContract.mockResolvedValue({
      root: 'fbc2f4300c01f0b7820d00e3347c8da4ee614674376cbc45359daa54f9b5493e',
      commitments_and_ciphertexts: [],
      nullifiers: [],
    });
    mockSaplingTxBuilder.createShieldedTx.mockResolvedValue({
      inputs: [],
      outputs: [
        {
          commitment: Buffer.from(
            '8ace2d8a13f1ffb0ea7c7a771046cb1995b0aa011edd17c5cb52318d0a5c8441',
            'hex'
          ),
          proof: Buffer.from(
            '8d67d3a0a016a8ba231002ad80ad895307c6548ba247290c8a4a05bb7871e5f80c02bf7dae35038c62718a1117c2f388b204a69810690036ca23a29f604467ab49111c1c4cdda6e5eccc2236fff10050e95065accdff2cda603f65e8fea6cdd80e1c3b4e4f4e249b2b948366f1e4249accfc68cc07f3f3bef9b2a9356c406a7791bc144b056d2a80cb146bf1ac002460a9ef4d304bd635255af2ecce9dbb15ab72d15f8ae1f931deb5997984b6443337b892b4e4177d0e3a21204717a3619e3c',
            'hex'
          ),
          ciphertext: {
            commitmentValue: Buffer.from(
              'ffe358e458c6e96a40664859a9250ac22fa52049e4ab53da367b18db35e13ed1',
              'hex'
            ),
            ephemeralPublicKey: Buffer.from(
              '37303fc0babf06f52a23ebc3732b38c77cda346d74c67e3900680dbd0e6237da',
              'hex'
            ),
            nonceEnc: Buffer.from('47a3127129ece95891e332403e687dae9dd86f2e080e0f37', 'hex'),
            nonceOut: Buffer.from('126c93195958505e6443bec07acab0afff489921aed8d9ff', 'hex'),
            payloadEnc: Buffer.from(
              'b730999c1d007a1c5093fd39e47bdee2cf5141761394cdc43d4038d608869cbe7ce4a10a9c47a9182d417ab7bc5c6c0ffc04b3667d2b36db9f0208737305b73641289bce40ca492507c78938be9830',
              'hex'
            ),
            payloadOut: Buffer.from(
              'c998f68807722590aadc5afe492de63adf3a738b3f02dae017968be5b92785fb83aabe380c5aa90efaa4c1456fb65abf85482a6496b28e0b9154e31af7a13515b4036eaa01b6455796de1e65f5e81dbf',
              'hex'
            ),
          },
        },
      ],
      signature: Buffer.from(
        '34bdf80ea8c565179a63c888998930b8c1a8b8fe8651ba6d832c2ab684a3e139a6849e6d636eb81a9228eca69fbda25223c89e7d71197fad5d11503b4e2b1900',
        'hex'
      ),
      balance: new BigNumber(-8000000),
    });
    const shieldedTx = await saplingToolkit2.prepareShieldedTransaction([
      {
        to: 'zet12mVvzJ4QJhnNQetGHzdwTMcLgNrdC4SFact6BB5jpeqGAefWip3iGgEjvDA9z7b9Y',
        amount: 8,
        memo: 'Taquito',
      },
    ]);
    expect(mockReadProvider.getSaplingDiffByContract).toHaveBeenCalledWith(
      'KT1G2kvdfPoavgR6Fjdd68M2vaPk14qJ8bhC',
      'head'
    );
    expect(shieldedTx).toEqual(
      '00000000000001f38ace2d8a13f1ffb0ea7c7a771046cb1995b0aa011edd17c5cb52318d0a5c84418d67d3a0a016a8ba231002ad80ad895307c6548ba247290c8a4a05bb7871e5f80c02bf7dae35038c62718a1117c2f388b204a69810690036ca23a29f604467ab49111c1c4cdda6e5eccc2236fff10050e95065accdff2cda603f65e8fea6cdd80e1c3b4e4f4e249b2b948366f1e4249accfc68cc07f3f3bef9b2a9356c406a7791bc144b056d2a80cb146bf1ac002460a9ef4d304bd635255af2ecce9dbb15ab72d15f8ae1f931deb5997984b6443337b892b4e4177d0e3a21204717a3619e3cffe358e458c6e96a40664859a9250ac22fa52049e4ab53da367b18db35e13ed137303fc0babf06f52a23ebc3732b38c77cda346d74c67e3900680dbd0e6237da0000004fb730999c1d007a1c5093fd39e47bdee2cf5141761394cdc43d4038d608869cbe7ce4a10a9c47a9182d417ab7bc5c6c0ffc04b3667d2b36db9f0208737305b73641289bce40ca492507c78938be983047a3127129ece95891e332403e687dae9dd86f2e080e0f37c998f68807722590aadc5afe492de63adf3a738b3f02dae017968be5b92785fb83aabe380c5aa90efaa4c1456fb65abf85482a6496b28e0b9154e31af7a13515b4036eaa01b6455796de1e65f5e81dbf126c93195958505e6443bec07acab0afff489921aed8d9ff34bdf80ea8c565179a63c888998930b8c1a8b8fe8651ba6d832c2ab684a3e139a6849e6d636eb81a9228eca69fbda25223c89e7d71197fad5d11503b4e2b1900ffffffffff85ee00fbc2f4300c01f0b7820d00e3347c8da4ee614674376cbc45359daa54f9b5493e00000000'
    );
  });

  it('should throw when preparing a shielded transaction if the `to` parameter is not a shielded payment address', async () => {
    await expect(
      saplingToolkit.prepareShieldedTransaction([
        {
          to: 'tz1awHvfqEVsmNpXtLsLoHcjLk9HaXkzHf7Z',
          amount: 8,
          memo: 'Taquito',
        },
      ])
    ).rejects.toThrow(
      `Invalid address "tz1awHvfqEVsmNpXtLsLoHcjLk9HaXkzHf7Z"`
    );
  });

  it('should throw when preparing a shielded transaction if the memo is too large', async () => {
    await expect(
      saplingToolkit.prepareShieldedTransaction([
        {
          to: 'zet12mVvzJ4QJhnNQetGHzdwTMcLgNrdC4SFact6BB5jpeqGAefWip3iGgEjvDA9z7b9Y',
          amount: 8,
          memo: 'Taquitoooo',
        },
      ])
    ).rejects.toThrow(
      `Invalid memo "Taquitoooo" with length 10 expecting length to be less than 8`
    );
  });

  it('Should prepare a valid unshielded transaction to a tz1 address', async () => {
    mockSaplingTxBuilder.createSaplingTx.mockResolvedValue({
      inputs: [
        {
          commitmentValue: Buffer.from(
            'e8de599bc21ef0743160bfdb8242a267fd5b01269870d128c5d631510100fa8f',
            'hex'
          ),
          nullifier: Buffer.from(
            'e09749d5039c1667352e4c2d7a518ce333a65d6fa9a3191b7c746e0a4c394fab',
            'hex'
          ),
          proof: Buffer.from(
            '8b4c7f168dc6775f1e74fff11b977261451655eb586d499487d95d56e750f4576f2ca3d28e60250dddbdc8e7442348feab1ad28b05a34861ec537595e047841d1181f90839bc5a13e3fbc7761e7daf4a2837893854f9d90a0368c9e616b20e5f17e78a9a8a8e0edf6325c78610e51315c14a36f2b2ec74ade40ab26819d98fa9fbd01bc7749c83dc76bd6e450693b1ffa91aa2dae3cb98cd6642e90b0b600ff69dbb44b9fbbfde8e31fffce88b05da332718e10f1b08c5fd53e826202b298d22',
            'hex'
          ),
          publicKeyReRandomization: Buffer.from(
            'a2a5df5089012f50daaf9d5a1e37c9d6fa07b136c33c799dbfb685ba9632ba39',
            'hex'
          ),
          signature: Buffer.from(
            '1ddc3e0a6bb4a6f56aefe269fee78a43ae01883fbf7468e23806bcec363513485867bb309bf0581f2803df2fb91670a1874f9d97a6cff327bc1c344df9833c07',
            'hex'
          ),
        },
      ],
      outputs: [
        {
          commitment: Buffer.from(
            '6e736b2db63006ab60c8242fd2adcbec8d6f261fa34eb31f6563c75a279f993b',
            'hex'
          ),
          proof: Buffer.from(
            '819ce6579e3dc72a743e2604f3b5dcb67c38850bac376273baaf13cd7f39dc96c5531955aed7e45dde9c50697f46293da9878ddbefe15e9535388c21d47186c7074998409bf2b40336ec565c1677a30ff8144691855185d39c8bd30c0b5eba5607c5d7bc81b0540d9cc89e6332a2c30e3725fd9cc81b5358fc3c86905e4f3917708988fac19a8f6258765d1504d7587f93b4ccc267f54d0a8fb09ca155df3f41dc817229f0c0c30820af84f538e411c251e2a86ef402bdb8a465fb31d86c03d1',
            'hex'
          ),
          ciphertext: {
            commitmentValue: Buffer.from(
              '18a4b140227e34c6aeeac26663f28cde5d816a24dd0791d807b9e40f9e9c544b',
              'hex'
            ),
            ephemeralPublicKey: Buffer.from(
              '17da9304490b1d4a29cd900c682ae6e47e39f24a4e3468de1998e9a56578016a',
              'hex'
            ),
            nonceEnc: Buffer.from('243a7cc1b3c36947b9ec8fe757b7b139523de634fd558e6d', 'hex'),
            nonceOut: Buffer.from('f17de6db472bb9a92dbba5e6c80b2a86dc286e3c45bef7a7', 'hex'),
            payloadEnc: Buffer.from(
              '91bf06e1bd699ff784f439f6e0143a8a16c838305ca2707414d262e9c6d3f1b639f09cec12b8cea9ad3c53bd9053d1d380deb0ce886012c07f0ddf9bf921cc5cde4aa925bafd8ec47860d62acf11db',
              'hex'
            ),
            payloadOut: Buffer.from(
              'ad805de960b19ac1de0f93228cb2213d5e4f11486a9f8c8f6a163cb2428aabbec35751f8b5f9eef362d9c908bf286aba7cea11f0f9036b197087373a527d8b4eda86bec1b214f1f2c42eb3aa17ac6aa5',
              'hex'
            ),
          },
        },
      ],
      signature: Buffer.from(
        'fcbe3a7c574fdab1227e4d445a4a4aa5ee07a46d1be655ea71e6f5624fe960e352f50cbd457e3a0059a656ecb65132a48005897552da84bdb191b89d8ca6c308',
        'hex'
      ),
      balance: new BigNumber(1000000),
    });
    const shieldedTx = await saplingToolkit.prepareUnshieldedTransaction({
      to: 'tz1hDFKpVkT7jzYncaLma4vxh4Gg6JNqvdtB',
      amount: 1,
    });
    expect(shieldedTx).toEqual(
      '00000160e8de599bc21ef0743160bfdb8242a267fd5b01269870d128c5d631510100fa8fe09749d5039c1667352e4c2d7a518ce333a65d6fa9a3191b7c746e0a4c394faba2a5df5089012f50daaf9d5a1e37c9d6fa07b136c33c799dbfb685ba9632ba398b4c7f168dc6775f1e74fff11b977261451655eb586d499487d95d56e750f4576f2ca3d28e60250dddbdc8e7442348feab1ad28b05a34861ec537595e047841d1181f90839bc5a13e3fbc7761e7daf4a2837893854f9d90a0368c9e616b20e5f17e78a9a8a8e0edf6325c78610e51315c14a36f2b2ec74ade40ab26819d98fa9fbd01bc7749c83dc76bd6e450693b1ffa91aa2dae3cb98cd6642e90b0b600ff69dbb44b9fbbfde8e31fffce88b05da332718e10f1b08c5fd53e826202b298d221ddc3e0a6bb4a6f56aefe269fee78a43ae01883fbf7468e23806bcec363513485867bb309bf0581f2803df2fb91670a1874f9d97a6cff327bc1c344df9833c07000001f36e736b2db63006ab60c8242fd2adcbec8d6f261fa34eb31f6563c75a279f993b819ce6579e3dc72a743e2604f3b5dcb67c38850bac376273baaf13cd7f39dc96c5531955aed7e45dde9c50697f46293da9878ddbefe15e9535388c21d47186c7074998409bf2b40336ec565c1677a30ff8144691855185d39c8bd30c0b5eba5607c5d7bc81b0540d9cc89e6332a2c30e3725fd9cc81b5358fc3c86905e4f3917708988fac19a8f6258765d1504d7587f93b4ccc267f54d0a8fb09ca155df3f41dc817229f0c0c30820af84f538e411c251e2a86ef402bdb8a465fb31d86c03d118a4b140227e34c6aeeac26663f28cde5d816a24dd0791d807b9e40f9e9c544b17da9304490b1d4a29cd900c682ae6e47e39f24a4e3468de1998e9a56578016a0000004f91bf06e1bd699ff784f439f6e0143a8a16c838305ca2707414d262e9c6d3f1b639f09cec12b8cea9ad3c53bd9053d1d380deb0ce886012c07f0ddf9bf921cc5cde4aa925bafd8ec47860d62acf11db243a7cc1b3c36947b9ec8fe757b7b139523de634fd558e6dad805de960b19ac1de0f93228cb2213d5e4f11486a9f8c8f6a163cb2428aabbec35751f8b5f9eef362d9c908bf286aba7cea11f0f9036b197087373a527d8b4eda86bec1b214f1f2c42eb3aa17ac6aa5f17de6db472bb9a92dbba5e6c80b2a86dc286e3c45bef7a7fcbe3a7c574fdab1227e4d445a4a4aa5ee07a46d1be655ea71e6f5624fe960e352f50cbd457e3a0059a656ecb65132a48005897552da84bdb191b89d8ca6c30800000000000f42405de3573fbee0b1c59f7f02da3a5b30d0dd51f64b65ddd6fe21bb0c5b1e185e270000001b050a0000001500eca2e9db3e096741601333274d33caefc8a16c5a'
    );
  });

  it('Should prepare a valid unshielded transaction to a tz2 address', async () => {
    mockSaplingTxBuilder.createSaplingTx.mockResolvedValue({
      inputs: [
        {
          commitmentValue: Buffer.from(
            '47e7e8a1ff5627907aeb2b4948da09ff9a0aa2bad92f67acf18d0b05292fe397',
            'hex'
          ),
          nullifier: Buffer.from(
            'e09749d5039c1667352e4c2d7a518ce333a65d6fa9a3191b7c746e0a4c394fab',
            'hex'
          ),
          proof: Buffer.from(
            '95a16310de04873148debfcf1b0c673f704646d1dc374d60dea4eebfef2bf6f8bec192f5159a79a06e1d482af2466536abb424b8f261325606040a91e828b4f2fe1d1a6f87dceb65e0adfe5f0c1ca9a1f2548a9c53fe95b04f1523233e8a215f0178ba36283f0729421c8d422a047961b343ec57ecc54f212bc74e33582258da748f48910919a1fe33fcedfd6a3f1ffcab0ca7f8f5133c02ee62264e359f30f649c9ef74512aa768f822ecbfa083e841003e8d705cccf0e776f4a9c7ca27ebb7',
            'hex'
          ),
          publicKeyReRandomization: Buffer.from(
            'e262c46c3371de572b54fbd37d578df69cf9f299bea2d7ee94fc0435603559bb',
            'hex'
          ),
          signature: Buffer.from(
            'fdd5ae8a0f714cb2d5f025ff914e5551b8a6ea92a7f42007e8d05cadde18e21e238506ced96ff2c4ed343f3201d9adb265499536e2dd2b400ed57fcee0a8f103',
            'hex'
          ),
        },
      ],
      outputs: [
        {
          commitment: Buffer.from(
            'cd349c80fe147ee38287b9f604d8f9e4da837ab099110a4d1c31d4192e584c44',
            'hex'
          ),
          proof: Buffer.from(
            '9123efda3af2d486d179b9115e0a07dc151ec553c4260978eb538652f80c4443a1f6cf0bcfe0be4719313c7b9b444e428982bb02173a52a8a557c8c2293f5b06b6eb0408c5241024f53ef374a51f15336aaaed6e56159594421e4a2f25e42980106a2b922fd2dab8fe38fc2fb9c14dc4425e8bf011a1699737b6e33d69d32e88273327b2ced48f05efae40c3e96d0688b81af5fbcc404146f23228eab634fc22379e2df07f31eb2eb459b7ef9d081310032d857d9cced454a2b1bbb35e06ee66',
            'hex'
          ),
          ciphertext: {
            commitmentValue: Buffer.from(
              'b266f32ac9a6a653236cd40137f4cb931871d7afa2a87b602f2cbd91c8d986f3',
              'hex'
            ),
            ephemeralPublicKey: Buffer.from(
              '92aa60779083e9ba7d006f39357a0f92e46c3beecdb948c7486daaf7142a1eca',
              'hex'
            ),
            nonceEnc: Buffer.from('c7ecf11e2c4efafc2d1432fd5c414350567553e0e4863259', 'hex'),
            nonceOut: Buffer.from('73de1c9e747f955dbdb7f0e78deff53384cd8873bf03a8fb', 'hex'),
            payloadEnc: Buffer.from(
              'c1c736d0db95eed8bca10c4f103ecf2fbc98957e86a71ff1732ccefbd7923eb769d930ece00be939916bed9872812ab3b5afb71505a5f6f469b500eb8a3222372131e9ab07e21c846ba46f83f7cdda',
              'hex'
            ),
            payloadOut: Buffer.from(
              'ee8665a20706a432e37f35cce4b20bd3a239070ffc806837e827b6452d2edf75a516eab9ed412a85dd90813073186c745f5a26c17612f89013b9906d9d5e3bdc34f58b72d90c4d81713699837611e80c',
              'hex'
            ),
          },
        },
      ],
      signature: Buffer.from(
        'cf547544809632ea58b411807b1fc4c691c95b5398b7cc80042c9c3112b812bcee7ad825095272a04405961e17c31360c8aa02aa4c087dccff63a5d7a7d7190d',
        'hex'
      ),
      balance: new BigNumber(1000000),
    });
    const shieldedTx = await saplingToolkit.prepareUnshieldedTransaction({
      to: 'tz2V17qQHTuQ3GJLu5bmPQDJTLDVwiWCrYFh',
      amount: 1,
    });
    expect(shieldedTx).toEqual(
      '0000016047e7e8a1ff5627907aeb2b4948da09ff9a0aa2bad92f67acf18d0b05292fe397e09749d5039c1667352e4c2d7a518ce333a65d6fa9a3191b7c746e0a4c394fabe262c46c3371de572b54fbd37d578df69cf9f299bea2d7ee94fc0435603559bb95a16310de04873148debfcf1b0c673f704646d1dc374d60dea4eebfef2bf6f8bec192f5159a79a06e1d482af2466536abb424b8f261325606040a91e828b4f2fe1d1a6f87dceb65e0adfe5f0c1ca9a1f2548a9c53fe95b04f1523233e8a215f0178ba36283f0729421c8d422a047961b343ec57ecc54f212bc74e33582258da748f48910919a1fe33fcedfd6a3f1ffcab0ca7f8f5133c02ee62264e359f30f649c9ef74512aa768f822ecbfa083e841003e8d705cccf0e776f4a9c7ca27ebb7fdd5ae8a0f714cb2d5f025ff914e5551b8a6ea92a7f42007e8d05cadde18e21e238506ced96ff2c4ed343f3201d9adb265499536e2dd2b400ed57fcee0a8f103000001f3cd349c80fe147ee38287b9f604d8f9e4da837ab099110a4d1c31d4192e584c449123efda3af2d486d179b9115e0a07dc151ec553c4260978eb538652f80c4443a1f6cf0bcfe0be4719313c7b9b444e428982bb02173a52a8a557c8c2293f5b06b6eb0408c5241024f53ef374a51f15336aaaed6e56159594421e4a2f25e42980106a2b922fd2dab8fe38fc2fb9c14dc4425e8bf011a1699737b6e33d69d32e88273327b2ced48f05efae40c3e96d0688b81af5fbcc404146f23228eab634fc22379e2df07f31eb2eb459b7ef9d081310032d857d9cced454a2b1bbb35e06ee66b266f32ac9a6a653236cd40137f4cb931871d7afa2a87b602f2cbd91c8d986f392aa60779083e9ba7d006f39357a0f92e46c3beecdb948c7486daaf7142a1eca0000004fc1c736d0db95eed8bca10c4f103ecf2fbc98957e86a71ff1732ccefbd7923eb769d930ece00be939916bed9872812ab3b5afb71505a5f6f469b500eb8a3222372131e9ab07e21c846ba46f83f7cddac7ecf11e2c4efafc2d1432fd5c414350567553e0e4863259ee8665a20706a432e37f35cce4b20bd3a239070ffc806837e827b6452d2edf75a516eab9ed412a85dd90813073186c745f5a26c17612f89013b9906d9d5e3bdc34f58b72d90c4d81713699837611e80c73de1c9e747f955dbdb7f0e78deff53384cd8873bf03a8fbcf547544809632ea58b411807b1fc4c691c95b5398b7cc80042c9c3112b812bcee7ad825095272a04405961e17c31360c8aa02aa4c087dccff63a5d7a7d7190d00000000000f42405de3573fbee0b1c59f7f02da3a5b30d0dd51f64b65ddd6fe21bb0c5b1e185e270000001b050a0000001501e2ed74a9a4cdb46c398879193e4ae2c8352ae0e4'
    );
  });

  it('Should prepare a valid unshielded transaction to a tz3 address', async () => {
    mockSaplingTxBuilder.createSaplingTx.mockResolvedValue({
      inputs: [
        {
          commitmentValue: Buffer.from(
            '615accadfd4e6422179bcc9c9cfad48d085306ae195bf8cf896734bdce7402a4',
            'hex'
          ),
          nullifier: Buffer.from(
            'e09749d5039c1667352e4c2d7a518ce333a65d6fa9a3191b7c746e0a4c394fab',
            'hex'
          ),
          proof: Buffer.from(
            '832f43780d521fec8c39d7dc19ddc33ec1be89e357aece1a9c6414f352eeb79b920b66e373fb869b16acad8ff52ea4858d701f2bf0a2b0e6ee2ef29b54191a32c951c7b66e24f9ebb680c6d69a7098ecc892623f8c2d99bb5ee91b7225268c6e0e02bd671a0669770aca4b905aa33a3139cbb62e92a5a57ef4d11251b7ba09980e3e7ce384366d366296fc9e67581edaa638fe89c61ad92350a7141266533e73966c6c0760870c357f1a5227bf10e04d12e362d23d1d90ce3d6320ffabf991d2',
            'hex'
          ),
          publicKeyReRandomization: Buffer.from(
            '9122255f466c87a4f33806b34ee182fc984f1016b577fe0264d2121daf8514af',
            'hex'
          ),
          signature: Buffer.from(
            '1dfc7a3a233147eb2bffd6aa01af627ed10cf3ee08d1d6f44ad841baaafcd429738f9481a25e3721f3895f38a36aa1678f83bc42b1016457bc7ba084fe75ba0a',
            'hex'
          ),
        },
      ],
      outputs: [
        {
          commitment: Buffer.from(
            '216e7378ab96d2e9b810b0ac131a0b04cf438bd918e3112c0119baaf1078e572',
            'hex'
          ),
          proof: Buffer.from(
            'a14500005ea757f49ef8a8dcbc0efdc31aef47cddb7fdd303e305b663be30234874a3422408d476688cdc54b9c07652da91e34183cd9c16b439660742d65c32f925aa585d5617cf58bb13225d06e85078abc6c23d88834f6807f520126acb75810bcdf219f547553bff5aa19d2395869dfa89245ec320ee73e951cde761460b04f3599188767680e5b4f12f886945d6989ee53502c0fc61eb7b6ceb4c1851f14c4f11435891e1824a5d3766f57fbb27bdcb25be81c5da7450762bb3e966cf286',
            'hex'
          ),
          ciphertext: {
            commitmentValue: Buffer.from(
              'd57c3cbf378e0344d7a601128651d0c7af1bec8919380fccb8274742d371a647',
              'hex'
            ),
            ephemeralPublicKey: Buffer.from(
              'fa1983343fcb3ee9bdbea29d4dee8fa6811926f250008e8e7fa4841fe58fd9d9',
              'hex'
            ),
            nonceEnc: Buffer.from('d93450ed130d077041e4a20e238957e78f9692ef73a0fcba', 'hex'),
            nonceOut: Buffer.from('2941ef0802bfe50b3a9bb4e3d332eb28326037a58771eff5', 'hex'),
            payloadEnc: Buffer.from(
              'fbd997f484b7c1be7a05cd8b5b770307d5410ade285f4285fe50ef88741b0c732b4d640f5d46d0e3f3a1ee93e4c3d715037b6b563747d8d46567a26e839b1c12f13a5cd7764fd998d2ed5970d03ba9',
              'hex'
            ),
            payloadOut: Buffer.from(
              '81ec571c62701ad4e0fcb1f1cd536de953a51971f757ce5f70b3c8b5d62f49120386f71ab0c1c8551d49ee2ccadeb341cc54bcc51dd78ad98660e22f449cd056ecfe7181cbb19542532cfed55a302cd9',
              'hex'
            ),
          },
        },
      ],
      signature: Buffer.from(
        '3b35a7a96797d676b6cc5317d6723de136fb54b23781f8f647131bf4ac4f0832473050299f3ba832f4baea042c5a10bdb63f7a52f24dc663e0d59f6ef6ce9007',
        'hex'
      ),
      balance: new BigNumber(1000000),
    });
    const shieldedTx = await saplingToolkit.prepareUnshieldedTransaction({
      to: 'tz3huGFMzC124NdxK1TsEfMb3zRCP1wiFF56',
      amount: 1,
    });
    expect(shieldedTx).toEqual(
      '00000160615accadfd4e6422179bcc9c9cfad48d085306ae195bf8cf896734bdce7402a4e09749d5039c1667352e4c2d7a518ce333a65d6fa9a3191b7c746e0a4c394fab9122255f466c87a4f33806b34ee182fc984f1016b577fe0264d2121daf8514af832f43780d521fec8c39d7dc19ddc33ec1be89e357aece1a9c6414f352eeb79b920b66e373fb869b16acad8ff52ea4858d701f2bf0a2b0e6ee2ef29b54191a32c951c7b66e24f9ebb680c6d69a7098ecc892623f8c2d99bb5ee91b7225268c6e0e02bd671a0669770aca4b905aa33a3139cbb62e92a5a57ef4d11251b7ba09980e3e7ce384366d366296fc9e67581edaa638fe89c61ad92350a7141266533e73966c6c0760870c357f1a5227bf10e04d12e362d23d1d90ce3d6320ffabf991d21dfc7a3a233147eb2bffd6aa01af627ed10cf3ee08d1d6f44ad841baaafcd429738f9481a25e3721f3895f38a36aa1678f83bc42b1016457bc7ba084fe75ba0a000001f3216e7378ab96d2e9b810b0ac131a0b04cf438bd918e3112c0119baaf1078e572a14500005ea757f49ef8a8dcbc0efdc31aef47cddb7fdd303e305b663be30234874a3422408d476688cdc54b9c07652da91e34183cd9c16b439660742d65c32f925aa585d5617cf58bb13225d06e85078abc6c23d88834f6807f520126acb75810bcdf219f547553bff5aa19d2395869dfa89245ec320ee73e951cde761460b04f3599188767680e5b4f12f886945d6989ee53502c0fc61eb7b6ceb4c1851f14c4f11435891e1824a5d3766f57fbb27bdcb25be81c5da7450762bb3e966cf286d57c3cbf378e0344d7a601128651d0c7af1bec8919380fccb8274742d371a647fa1983343fcb3ee9bdbea29d4dee8fa6811926f250008e8e7fa4841fe58fd9d90000004ffbd997f484b7c1be7a05cd8b5b770307d5410ade285f4285fe50ef88741b0c732b4d640f5d46d0e3f3a1ee93e4c3d715037b6b563747d8d46567a26e839b1c12f13a5cd7764fd998d2ed5970d03ba9d93450ed130d077041e4a20e238957e78f9692ef73a0fcba81ec571c62701ad4e0fcb1f1cd536de953a51971f757ce5f70b3c8b5d62f49120386f71ab0c1c8551d49ee2ccadeb341cc54bcc51dd78ad98660e22f449cd056ecfe7181cbb19542532cfed55a302cd92941ef0802bfe50b3a9bb4e3d332eb28326037a58771eff53b35a7a96797d676b6cc5317d6723de136fb54b23781f8f647131bf4ac4f0832473050299f3ba832f4baea042c5a10bdb63f7a52f24dc663e0d59f6ef6ce900700000000000f42405de3573fbee0b1c59f7f02da3a5b30d0dd51f64b65ddd6fe21bb0c5b1e185e270000001b050a0000001502eca2e9db3e096741601333274d33caefc8a16c5a'
    );
  });

  it('should throw when preparing an unshielded transaction if the `to` parameter is not a Tezos address', async () => {
    await expect(
      saplingToolkit.prepareUnshieldedTransaction({
        to: 'zet12mVvzJ4QJhnNQetGHzdwTMcLgNrdC4SFact6BB5jpeqGAefWip3iGgEjvDA9z7b9Y',
        amount: 8,
      })
    ).rejects.toThrow(
      `Invalid public key hash "zet12mVvzJ4QJhnNQetGHzdwTMcLgNrdC4SFact6BB5jpeqGAefWip3iGgEjvDA9z7b9Y"`
    );
  });

  it('should throw when preparing an unshielded transaction if the amount is higner than the available balance', async () => {
    await expect(
      saplingToolkit.prepareUnshieldedTransaction({
        to: 'tz2V17qQHTuQ3GJLu5bmPQDJTLDVwiWCrYFh',
        amount: 10,
      })
    ).rejects.toThrow(
      'Unable to spend "10000000" mutez while the balance is only 8000000 mutez.'
    );
  });

  it('Should prepare a valid sapling transaction', async () => {
    mockSaplingTxBuilder.createSaplingTx.mockResolvedValue({
      inputs: [
        {
          commitmentValue: Buffer.from(
            '3d9e3d4ad3492be757f63e8eb9063ce8698d95b9caa419c54e53ff50b6a37683',
            'hex'
          ),
          nullifier: Buffer.from(
            'e09749d5039c1667352e4c2d7a518ce333a65d6fa9a3191b7c746e0a4c394fab',
            'hex'
          ),
          proof: Buffer.from(
            '87201838d863e025e9f51ed5a93c633d87ab07d4b24661a66f8cb56e3ab890244c063f4c371a40297f79f903e014f68991a1341b33129a6a5058ea6babd12df993e6e5e9a43f284b1c6df95b1764648c69604ae09e1b3170e71d395097d6739311b942cecde7c95ff25f3cf5a35b0ba8e794cc4351d7bdb8c3b59412a8daa57ab24966cf572c60e3082bd0edcd54ce79ae7f54bb1502bad403e882f53a060d12baacd1bf08ef4f9a641a6c105cfb8c199c8a56186c6d5e2277b9f0a6dae67cf6',
            'hex'
          ),
          publicKeyReRandomization: Buffer.from(
            '4e5013ab2f07f645fb098f21845da78b389328dd0e6554256c9dec0ac74da913',
            'hex'
          ),
          signature: Buffer.from(
            '4241a10e4d8d19c617e45ce2f80e43beb1e4a089d5bb5c0c965cec5b52ad47cffebb4aa66e8db33c1dc49e005b9e5865f0f1acbbdf9d4b2261a1f38c13ba610a',
            'hex'
          ),
        },
      ],
      outputs: [
        {
          commitment: Buffer.from(
            '1bc42058e61847fce7bc37429fb86806087b2a85a4c84464f6c3c1c5f7821e1f',
            'hex'
          ),
          proof: Buffer.from(
            '81813e8b698d2378cfeacc5c6e0b6498573b13d1e02fb9e95a29a4c81e12f7da37d9145c83d89f00efa4f4b72a6c270685ebf77424e7553382c4085aeef5ab49d865104c6047a0f4d65af444341f60ea4436d5adcbf802502f88c0209b230afd115b23aacf684e9a492919c2b75ce704bbde3664c4eb59a18d8cced860fa7d47e44ed3536d1822ca24be61da74824590962b447647f4f91481af4946b5614f00b4f02300e01023e72aed68b9005572194d1d7dd619fad4f705e531bb91c9ae2b',
            'hex'
          ),
          ciphertext: {
            commitmentValue: Buffer.from(
              '757863edb8f7d7e74416b48434c855dd1f3c4bd4b97df0da6bca54c50578b11c',
              'hex'
            ),
            ephemeralPublicKey: Buffer.from(
              '1319c8fd494c9b7a6b48c6934979677fd3faeb0b21ef3b1089c3703ba3600d5f',
              'hex'
            ),
            nonceEnc: Buffer.from('65b88cd80f4f4961fbf49f169ab6386f8599e9383a21d497', 'hex'),
            nonceOut: Buffer.from('670d20742215c7d47bff7fcf725ad60b56b6b477e1789697', 'hex'),
            payloadEnc: Buffer.from(
              'a4a979754ac1876cb4c888b63617839eecb74044b745a45b8ab3a18d92e094e60de9d0a31a89e68b4de8d7bf3d05cf970f9d538223ec7b8d1a1d7063194ff077ad65d00a21a1c88c8a225cb25100ee',
              'hex'
            ),
            payloadOut: Buffer.from(
              '96419a6335ca5440392e872f1998e482782c29536d6a71daad916ae0e2eec534668a347d9f0257e0ab4bda9881fef7b4861f64713f756567bfaf9e55c8f43eacd2e086b20fe15606afeaef990ff286ee',
              'hex'
            ),
          },
        },
        {
          commitment: Buffer.from(
            'b3434eeca0763e70cdb05a8f09f8577ec63904dc11301ed50507ffb618542e32',
            'hex'
          ),
          proof: Buffer.from(
            '96dd9443694186b696e92aba067df3a01796e171fe10b7230407244f8be471ed385b3fc7f12c7a700335b1501fabc69ea8305a09034abe7a24ad660fe9674034266c88e8e4be72edd5d21e0dc550504b64cd13aac5d0bcf91d9da68bdced260305f3abd54d02e6bec603060f1244ef8e05250abb0f961f3d0062a5dcf9d5ce649afb812d1807bbbaa793636b2b5f7cd1a97046a1114417d9664bbf67ac3b101512f954d5dba67b26439b50d2a818d13b4957f30caa36d2feec927bc3d77913c0',
            'hex'
          ),
          ciphertext: {
            commitmentValue: Buffer.from(
              'f2fa5879b0c9ad38fdf677dfd943dde2f2229657d7adef199799ea33a5067c2d',
              'hex'
            ),
            ephemeralPublicKey: Buffer.from(
              'b605665ad0913acc08fd70198a8cad886b158c0ded8b3637d650d0df9a237440',
              'hex'
            ),
            nonceEnc: Buffer.from('5f0c236f777f984d56aa48723f3a392075eb22fbb174844a', 'hex'),
            nonceOut: Buffer.from('bc34747a50fba0f2bd4f21efe2f56917f9d9761e2361ee9c', 'hex'),
            payloadEnc: Buffer.from(
              'e89475d5cf4ca61d99b01ca28f36289744660eff603471b8152cb7ffc7a975070005dba13a51d303d08f506424258ba3294a05e4382fbe732a3cf78458c0031a867504f7fd25d60e241a48697c8909',
              'hex'
            ),
            payloadOut: Buffer.from(
              'd780f47961d32af1bbf618f7638655a52e9ffee8a9e704b83d3eff0b55065b7e5d33c29cddf7ad92915302fcc85689ea50183c0ab7be941895712e1ec7ab71c86a5c01da0a0cf93ee9796abc474a7880',
              'hex'
            ),
          },
        },
      ],
      signature: Buffer.from(
        'fd143a9a443942d9bdb629e4f9c88984c6b91cbca65338c256bd0bc90513cf0f39faa1022303db5f079bcf367c0eb0ff092da1aaec3ef6317305cb178cff3f0e',
        'hex'
      ),
      balance: new BigNumber(0),
    });

    const shieldedTx = await saplingToolkit.prepareSaplingTransaction([
      {
        to: 'zet13KeFdzZ3tf8Aragg5iuMu3Ff8ZXXhzKhZF3mALYoL8spoPNvShf7THzo5tu4ynbJQ',
        amount: 2,
        memo: 'A gift',
      },
    ]);
    expect(shieldedTx).toEqual(
      '000001603d9e3d4ad3492be757f63e8eb9063ce8698d95b9caa419c54e53ff50b6a37683e09749d5039c1667352e4c2d7a518ce333a65d6fa9a3191b7c746e0a4c394fab4e5013ab2f07f645fb098f21845da78b389328dd0e6554256c9dec0ac74da91387201838d863e025e9f51ed5a93c633d87ab07d4b24661a66f8cb56e3ab890244c063f4c371a40297f79f903e014f68991a1341b33129a6a5058ea6babd12df993e6e5e9a43f284b1c6df95b1764648c69604ae09e1b3170e71d395097d6739311b942cecde7c95ff25f3cf5a35b0ba8e794cc4351d7bdb8c3b59412a8daa57ab24966cf572c60e3082bd0edcd54ce79ae7f54bb1502bad403e882f53a060d12baacd1bf08ef4f9a641a6c105cfb8c199c8a56186c6d5e2277b9f0a6dae67cf64241a10e4d8d19c617e45ce2f80e43beb1e4a089d5bb5c0c965cec5b52ad47cffebb4aa66e8db33c1dc49e005b9e5865f0f1acbbdf9d4b2261a1f38c13ba610a000003e61bc42058e61847fce7bc37429fb86806087b2a85a4c84464f6c3c1c5f7821e1f81813e8b698d2378cfeacc5c6e0b6498573b13d1e02fb9e95a29a4c81e12f7da37d9145c83d89f00efa4f4b72a6c270685ebf77424e7553382c4085aeef5ab49d865104c6047a0f4d65af444341f60ea4436d5adcbf802502f88c0209b230afd115b23aacf684e9a492919c2b75ce704bbde3664c4eb59a18d8cced860fa7d47e44ed3536d1822ca24be61da74824590962b447647f4f91481af4946b5614f00b4f02300e01023e72aed68b9005572194d1d7dd619fad4f705e531bb91c9ae2b757863edb8f7d7e74416b48434c855dd1f3c4bd4b97df0da6bca54c50578b11c1319c8fd494c9b7a6b48c6934979677fd3faeb0b21ef3b1089c3703ba3600d5f0000004fa4a979754ac1876cb4c888b63617839eecb74044b745a45b8ab3a18d92e094e60de9d0a31a89e68b4de8d7bf3d05cf970f9d538223ec7b8d1a1d7063194ff077ad65d00a21a1c88c8a225cb25100ee65b88cd80f4f4961fbf49f169ab6386f8599e9383a21d49796419a6335ca5440392e872f1998e482782c29536d6a71daad916ae0e2eec534668a347d9f0257e0ab4bda9881fef7b4861f64713f756567bfaf9e55c8f43eacd2e086b20fe15606afeaef990ff286ee670d20742215c7d47bff7fcf725ad60b56b6b477e1789697b3434eeca0763e70cdb05a8f09f8577ec63904dc11301ed50507ffb618542e3296dd9443694186b696e92aba067df3a01796e171fe10b7230407244f8be471ed385b3fc7f12c7a700335b1501fabc69ea8305a09034abe7a24ad660fe9674034266c88e8e4be72edd5d21e0dc550504b64cd13aac5d0bcf91d9da68bdced260305f3abd54d02e6bec603060f1244ef8e05250abb0f961f3d0062a5dcf9d5ce649afb812d1807bbbaa793636b2b5f7cd1a97046a1114417d9664bbf67ac3b101512f954d5dba67b26439b50d2a818d13b4957f30caa36d2feec927bc3d77913c0f2fa5879b0c9ad38fdf677dfd943dde2f2229657d7adef199799ea33a5067c2db605665ad0913acc08fd70198a8cad886b158c0ded8b3637d650d0df9a2374400000004fe89475d5cf4ca61d99b01ca28f36289744660eff603471b8152cb7ffc7a975070005dba13a51d303d08f506424258ba3294a05e4382fbe732a3cf78458c0031a867504f7fd25d60e241a48697c89095f0c236f777f984d56aa48723f3a392075eb22fbb174844ad780f47961d32af1bbf618f7638655a52e9ffee8a9e704b83d3eff0b55065b7e5d33c29cddf7ad92915302fcc85689ea50183c0ab7be941895712e1ec7ab71c86a5c01da0a0cf93ee9796abc474a7880bc34747a50fba0f2bd4f21efe2f56917f9d9761e2361ee9cfd143a9a443942d9bdb629e4f9c88984c6b91cbca65338c256bd0bc90513cf0f39faa1022303db5f079bcf367c0eb0ff092da1aaec3ef6317305cb178cff3f0e00000000000000005de3573fbee0b1c59f7f02da3a5b30d0dd51f64b65ddd6fe21bb0c5b1e185e2700000000'
    );
  });

  it('should throw when preparing a sapling transaction if the `to` parameter is not a shielded payment address', async () => {
    await expect(
      saplingToolkit.prepareSaplingTransaction([
        {
          to: 'tz2V17qQHTuQ3GJLu5bmPQDJTLDVwiWCrYFh',
          amount: 8,
        },
      ])
    ).rejects.toThrow(
      `Invalid address "tz2V17qQHTuQ3GJLu5bmPQDJTLDVwiWCrYFh"`
    );
  });

  it('should throw when preparing a sapling transaction if the memo is to large', async () => {
    await expect(
      saplingToolkit.prepareSaplingTransaction([
        {
          to: 'zet13KeFdzZ3tf8Aragg5iuMu3Ff8ZXXhzKhZF3mALYoL8spoPNvShf7THzo5tu4ynbJQ',
          amount: 8,
          memo: 'test1234566789',
        },
      ])
    ).rejects.toThrow(
      `Invalid memo "test1234566789" with length 14 expecting length to be less than 8`
    );
  });

  it('should throw when preparing a sapling transaction if the amount is higner than the available balance', async () => {
    await expect(
      saplingToolkit.prepareSaplingTransaction([
        {
          to: 'zet13KeFdzZ3tf8Aragg5iuMu3Ff8ZXXhzKhZF3mALYoL8spoPNvShf7THzo5tu4ynbJQ',
          amount: 10,
          memo: 'test',
        },
      ])
    ).rejects.toThrow(
      'Unable to spend "10000000" mutez while the balance is only 8000000 mutez.'
    );
  });
});
