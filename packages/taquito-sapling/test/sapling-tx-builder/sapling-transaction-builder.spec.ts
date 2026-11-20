import { buf2hex, hex2buf } from '@taquito/utils';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi, type Mock } from 'vitest';
import {
  outputsUnshieldedTx,
  outputsShieldedTx,
  inputUnshieldedTx,
  saplingState,
} from './single-sapling-state-diff';
import { SaplingTransactionBuilder } from '../../src/sapling-tx-builder/sapling-transactions-builder';
import { SaplingForger } from '../../src/sapling-forger/sapling-forger';
import type { ParametersOutputProof } from '../../src/types';
import BigNumber from 'bignumber.js';

describe('Sapling transactions builder', () => {
  let saplingTransactionBuilder: SaplingTransactionBuilder;

  let mockInMemorySpendingKey: {
    prepareSpendDescription: Mock;
    getSaplingViewingKeyProvider: Mock;
    getSpendingKey: Mock;
    signSpendDescription: Mock;
  };

  let mockInMemoryViewingKey: {
    getFullViewingKey: Mock;
    getOutgoingViewingKey: Mock;
  };

  let mockInMemoryProvingKey: {
    prepareSpendDescription: Mock;
  };

  let saplingForger: SaplingForger;
  const saplingContract = {
    contractAddress: 'KT1G2kvdfPoavgR6Fjdd68M2vaPk14qJ8bhC',
    saplingId: '0',
    memoSize: 8,
  };

  let mockSaplingWrapper: {
    withProvingContext: Mock;
    getRandomBytes: Mock;
    randR: Mock;
    getOutgoingViewingKey: Mock;
    preparePartialOutputDescription: Mock<(proof: ParametersOutputProof) => Promise<unknown>>;
    getDiversifiedFromRawPaymentAddress: Mock;
    deriveEphemeralPublicKey: Mock;
    getPkdFromRawPaymentAddress: Mock;
    keyAgreement: Mock;
    getPaymentAddressFromViewingKey: Mock;
    createBindingSignature: Mock;
    initSaplingParameters: Mock;
  };

  let mockReadProvider: {
    getSaplingDiffById: Mock;
    getChainId: Mock;
  };

  beforeEach(() => {
    saplingForger = new SaplingForger();
    mockInMemorySpendingKey = {
      prepareSpendDescription: vi.fn(),
      getSaplingViewingKeyProvider: vi.fn(),
      getSpendingKey: vi.fn(),
      signSpendDescription: vi.fn(),
    };

    mockInMemoryViewingKey = {
      getFullViewingKey: vi.fn(),
      getOutgoingViewingKey: vi.fn(),
    };

    mockInMemoryProvingKey = {
      prepareSpendDescription: vi.fn(),
    };

    mockSaplingWrapper = {
      withProvingContext: vi.fn(),
      getRandomBytes: vi.fn(),
      randR: vi.fn(),
      getOutgoingViewingKey: vi.fn(),
      preparePartialOutputDescription: vi.fn(),
      getDiversifiedFromRawPaymentAddress: vi.fn(),
      deriveEphemeralPublicKey: vi.fn(),
      getPkdFromRawPaymentAddress: vi.fn(),
      keyAgreement: vi.fn(),
      getPaymentAddressFromViewingKey: vi.fn(),
      createBindingSignature: vi.fn(),
      initSaplingParameters: vi.fn(),
    };

    mockReadProvider = {
      getSaplingDiffById: vi.fn(),
      getChainId: vi.fn(),
    };

    mockInMemorySpendingKey.getSaplingViewingKeyProvider.mockResolvedValue(mockInMemoryViewingKey);
    mockInMemorySpendingKey.getSpendingKey.mockReturnValue(
      'sask27SLmU9herddHz4qFJBLMjWYMbJF8RtS579w9ej9mfCYK7VUdyCJPHK8AzW9zMsopGZEkYeNjAY7Zz1bkM7CGu8eKLzrjBLTMC5wWJDhxiK91ahA29rhDRsHdJDV2u2jFwb2MNUix8JW7sAkAqYVaJpCehTBPgRQ1KqKwqqUaNmuD8kazd4Q8MCWmgbWs21Yuomdqyi9FLigjRp7oY4m5adaVU19Nj1AHvsMY2tePeU2L'
    );
    mockInMemoryViewingKey.getFullViewingKey.mockResolvedValue('vk');
    mockInMemoryViewingKey.getOutgoingViewingKey.mockResolvedValue('ovk');
    mockReadProvider.getSaplingDiffById.mockResolvedValue(saplingState);
    mockReadProvider.getChainId.mockResolvedValue('NetXLH1uAxK7CCh');

    saplingTransactionBuilder = new SaplingTransactionBuilder(
      { saplingSigner: mockInMemorySpendingKey as any },
      saplingForger,
      saplingContract,
      mockReadProvider as any,
      mockSaplingWrapper as any
    );
  });

  it('should be instantiable', async () => {
    expect(
      new SaplingTransactionBuilder(
        { saplingSigner: mockInMemorySpendingKey as any },
        saplingForger,
        saplingContract,
        mockReadProvider as any,
        mockSaplingWrapper as any
      )
    ).toBeDefined();
  });

  it.each(['deposit', 'transfer with change', 'exact-balance transfer'] as const)(
    'uses fresh, distinct commitment trapdoors and ephemeral keys for each %s output',
    async (kind) => {
      const address = 'zet12mVvzJ4QJhnNQetGHzdwTMcLgNrdC4SFact6BB5jpeqGAefWip3iGgEjvDA9z7b9Y';
      const payees = ['2', '3'].map((amount) => ({ to: address, amount, memo: '' }));
      const total = new BigNumber(5);
      const bytes = new Uint8Array(32);
      let sample = 0;
      mockSaplingWrapper.randR.mockImplementation(async () => new Uint8Array(32).fill(++sample));
      mockSaplingWrapper.getRandomBytes.mockImplementation(
        (length: number) => new Uint8Array(length)
      );
      mockSaplingWrapper.withProvingContext.mockImplementation((build) => build(1));
      mockInMemorySpendingKey.getSaplingViewingKeyProvider.mockResolvedValue({
        getOutgoingViewingKey: async () => bytes,
        getAddress: async () => ({ address }),
      });
      mockSaplingWrapper.preparePartialOutputDescription.mockResolvedValue({
        commitment: bytes,
        commitmentValue: bytes,
        proof: bytes,
      });
      mockSaplingWrapper.deriveEphemeralPublicKey.mockResolvedValue(bytes);
      mockSaplingWrapper.getDiversifiedFromRawPaymentAddress.mockResolvedValue(new Uint8Array(11));
      mockSaplingWrapper.getPkdFromRawPaymentAddress.mockResolvedValue(bytes);
      mockSaplingWrapper.keyAgreement.mockResolvedValue(bytes);
      vi.spyOn(saplingTransactionBuilder, 'prepareSaplingSpendDescription').mockResolvedValue([]);
      vi.spyOn(saplingTransactionBuilder, 'createBindingSignature').mockResolvedValue(bytes);
      const plaintext = vi.spyOn(saplingForger, 'forgeTransactionPlaintext');

      if (kind === 'deposit') {
        await saplingTransactionBuilder.createShieldedTx(payees, total, new Uint8Array(0));
      } else {
        await saplingTransactionBuilder.createSaplingTx(payees, total, new Uint8Array(0), {
          inputsToSpend: [],
          sumSelectedInputs: new BigNumber(kind === 'transfer with change' ? 6 : 5),
        });
      }

      const proofCalls = mockSaplingWrapper.preparePartialOutputDescription.mock.calls;
      const randomizers = proofCalls.map(([proof]) => buf2hex(proof.randomCommitmentTrapdoor));
      const ephemeralKeys = proofCalls.map(([proof]) => buf2hex(proof.ephemeralPrivateKey));
      const expectedOutputs = kind === 'transfer with change' ? 3 : 2;
      expect(randomizers).toHaveLength(expectedOutputs);
      expect(ephemeralKeys).toHaveLength(expectedOutputs);
      expect(plaintext.mock.calls.map(([note]) => buf2hex(note.randomCommitmentTrapdoor))).toEqual(
        randomizers
      );
      expect(
        mockSaplingWrapper.deriveEphemeralPublicKey.mock.calls.map(([, esk]) => buf2hex(esk))
      ).toEqual(ephemeralKeys);
      expect(mockSaplingWrapper.keyAgreement.mock.calls.map(([, esk]) => buf2hex(esk))).toEqual(
        ephemeralKeys
      );
      expect(new Set([...randomizers, ...ephemeralKeys]).size).toBe(expectedOutputs * 2);
      expect(mockSaplingWrapper.randR).toHaveBeenCalledTimes(expectedOutputs * 2);
    }
  );

  it('should prepare a shielded transaction of 8 tez', async () => {
    mockSaplingWrapper.randR.mockResolvedValue(
      hex2buf('66222a13e6050a18325b63e0beaed5a864c33a34cdcf7c53a74fb53e4be3a202')
    );

    const signature = hex2buf(
      '837a99215b4ee2573f31c7e4b27faaab855589fb4671354db98c11969e83d6ddeac11e0e0225634c414a46d93167a5019ebcdc7ea0e657d76067a25651e3470e'
    );
    mockSaplingWrapper.withProvingContext.mockResolvedValue({
      inputs: [],
      outputs: outputsShieldedTx,
      signature,
    });

    const tx = await saplingTransactionBuilder.createShieldedTx(
      [
        {
          to: 'zet12mVvzJ4QJhnNQetGHzdwTMcLgNrdC4SFact6BB5jpeqGAefWip3iGgEjvDA9z7b9Y',
          amount: '8000000',
          memo: 'Taquito',
        },
      ],
      new BigNumber(8000000),
      new Uint8Array(0)
    );

    expect(tx).toEqual({
      inputs: [],
      outputs: outputsShieldedTx,
      signature,
      balance: new BigNumber(-8000000),
    });
  });

  it('should prepare an unshielded transaction of 1 tez', async () => {
    mockSaplingWrapper.randR.mockResolvedValue(
      hex2buf('8b038b981085a1af8cb209216873a4f43dd0059ca9dd29390e8af1e2fdffc604')
    );
    mockSaplingWrapper.getOutgoingViewingKey.mockResolvedValue(
      hex2buf('35c61a0e53de553a751c78fbc42d5e7eca807fd441206651c84bf88de803efba')
    );
    mockSaplingWrapper.withProvingContext.mockResolvedValue({
      inputs: inputUnshieldedTx,
      outputs: outputsUnshieldedTx,
      balance: new BigNumber(1000000),
      signature: hex2buf(
        'd1ee5ab2b24a933d48d203b533ddf95d6d90d0354dd8dd5e1363d3468ed6c68101627876a2b96daa4fff1469a3f6dd7fabf6f83d1e0671b01f748a5ddd13b00b'
      ),
    });

    const tx = await saplingTransactionBuilder.createSaplingTx(
      [],
      new BigNumber('1000000'),
      hex2buf('050a0000001500eca2e9db3e096741601333274d33caefc8a16c5a'),
      {
        inputsToSpend: [
          {
            memo: hex2buf('5461717569746f00'),
            paymentAddress: hex2buf(
              '2c8e683029bd1c1ff25882bb0353379487fcf142bbaef37d2b21dc3836f929c6fa9181e2a0d7b72406c148'
            ),
            position: 8,
            randomCommitmentTrapdoor: hex2buf(
              '3ba542ee94a3a26cf257f60cc0eceb85fe0e2a09bf9f7f375bc43d940b76bb08'
            ),
            value: hex2buf('00000000007a1200'),
          },
        ],
        sumSelectedInputs: new BigNumber(8000000),
      }
    );
    expect(tx).toEqual({
      inputs: inputUnshieldedTx,
      outputs: outputsUnshieldedTx,
      balance: new BigNumber(1000000),
      signature: hex2buf(
        'd1ee5ab2b24a933d48d203b533ddf95d6d90d0354dd8dd5e1363d3468ed6c68101627876a2b96daa4fff1469a3f6dd7fabf6f83d1e0671b01f748a5ddd13b00b'
      ),
    });
  });

  it('calculateTransactionBalance', async () => {
    const balance = saplingTransactionBuilder.calculateTransactionBalance('0', '2');
    expect(balance).toEqual(new BigNumber(-2));
  });

  it('prepareSaplingOutputDescription', async () => {
    mockSaplingWrapper.randR.mockResolvedValue(
      hex2buf('f4a2b699ba09ffc666d2f1cc41e630ed5877ca4788ce081df97729bb10f3ee07')
    );
    mockSaplingWrapper.preparePartialOutputDescription.mockResolvedValue({
      commitmentValue: hex2buf('9757e6cf8673bc5877388da2b4bb703ccef03a41b0a32f4dda583bfa8c74b9b6'),
      commitment: hex2buf('fb86682501d3602d68e69e611a5fd5c0363746c888f0099452baabb2f50cd446'),
      proof: hex2buf(
        '8fd5257f5762c32b7800edafbd0ebdeb360a77f6fda470c2e4c2d29d086dc56f3df629cd912cca7dfc0cac49c1d355eaaf86521510deef63ed3eebc0b758cb155007bd10385db2799ffa0da8114c16cf30694bbd2de40b9ded105f683087119c11310871c43e10cd3a85733929d4925b8ac75f40b352d51868d1da9d0459a6c74ba7cf02806995bfe2b72265edd14b6795a2ad122d153a7f08aa289e6620cc826b44b97aca77c56d8d7e5d6cd6e62e8fca7f55fb3c13ab72486392d35db43f8a'
      ),
    });
    mockSaplingWrapper.getDiversifiedFromRawPaymentAddress.mockResolvedValue(
      hex2buf('2c8e683029bd1c1ff25882')
    );
    mockSaplingWrapper.deriveEphemeralPublicKey.mockResolvedValue(
      hex2buf('e7a9a02a7bc8a1cf2a234dcc7f6a180440b5d99afb9f764393bbabfbd752906f')
    );
    mockSaplingWrapper.getPkdFromRawPaymentAddress.mockResolvedValue(
      hex2buf('bb0353379487fcf142bbaef37d2b21dc3836f929c6fa9181e2a0d7b72406c148')
    );
    mockSaplingWrapper.keyAgreement.mockResolvedValue(
      hex2buf('5eefb195e3f6276051d884a679e7ecb5fdf39e5457a6f435c6230c3ea2b05d95')
    );
    mockSaplingWrapper.getRandomBytes.mockReturnValueOnce(
      hex2buf('039bee94027f3b7e8be88f09385d8385f31385f23199f30f')
    );
    mockSaplingWrapper.getRandomBytes.mockReturnValueOnce(
      hex2buf('4d4e108d30c46f0f5448d0f2db47c3a59a126fdff71a305e')
    );

    const outputDescription = await saplingTransactionBuilder.prepareSaplingOutputDescription({
      address: hex2buf(
        '2c8e683029bd1c1ff25882bb0353379487fcf142bbaef37d2b21dc3836f929c6fa9181e2a0d7b72406c148'
      ),
      amount: '6000000',
      memo: '',
      outgoingViewingKey: hex2buf(
        '35c61a0e53de553a751c78fbc42d5e7eca807fd441206651c84bf88de803efba'
      ),
      saplingContext: 1441800,
      randomCommitmentTrapdoor: hex2buf(
        '35bee05c797ec066e40535c5b80c04526a3f91282a3a24e1a3459f18b176b906'
      ),
    });

    expect(outputDescription).toEqual({
      commitment: hex2buf('fb86682501d3602d68e69e611a5fd5c0363746c888f0099452baabb2f50cd446'),
      proof: hex2buf(
        '8fd5257f5762c32b7800edafbd0ebdeb360a77f6fda470c2e4c2d29d086dc56f3df629cd912cca7dfc0cac49c1d355eaaf86521510deef63ed3eebc0b758cb155007bd10385db2799ffa0da8114c16cf30694bbd2de40b9ded105f683087119c11310871c43e10cd3a85733929d4925b8ac75f40b352d51868d1da9d0459a6c74ba7cf02806995bfe2b72265edd14b6795a2ad122d153a7f08aa289e6620cc826b44b97aca77c56d8d7e5d6cd6e62e8fca7f55fb3c13ab72486392d35db43f8a'
      ),
      ciphertext: {
        nonceEnc: hex2buf('039bee94027f3b7e8be88f09385d8385f31385f23199f30f'),
        nonceOut: hex2buf('4d4e108d30c46f0f5448d0f2db47c3a59a126fdff71a305e'),
        payloadEnc: hex2buf(
          'a2a5abb3d08b93a0751acbe12e7cb9b0c212c3d3c91e0808e3e8905d2922762db161df54d53a86f1c302348a61f5ece7c4643f482b9a90f95930811b64d38c6a02bc219451566762b7c74684866af9'
        ),
        payloadOut: hex2buf(
          '30e6653e54348a0722c7b0e8b95e3a1c0c6df693225b8c7b4c5a0d8ff289ced153a76b594d5af7a5cfc37ae068b67bf3b1e317fb61310850f848d33b5fb53808564f9860f15224848dc15a72aac8c853'
        ),
        commitmentValue: hex2buf(
          '9757e6cf8673bc5877388da2b4bb703ccef03a41b0a32f4dda583bfa8c74b9b6'
        ),
        ephemeralPublicKey: hex2buf(
          'e7a9a02a7bc8a1cf2a234dcc7f6a180440b5d99afb9f764393bbabfbd752906f'
        ),
      },
    });
  });

  it('uses a fresh spend randomizer per input with the spending key', async () => {
    const randomizers = [new Uint8Array(32).fill(1), new Uint8Array(32).fill(2)];
    mockSaplingWrapper.randR
      .mockResolvedValueOnce(randomizers[0])
      .mockResolvedValueOnce(randomizers[1]);
    mockInMemorySpendingKey.prepareSpendDescription.mockResolvedValue({
      commitmentValue: hex2buf('4df98a4e1fb32530c54e6ca66051dd29f82a8322aa93ac5ca90e4d0f976ded89'),
      nullifier: hex2buf('e09749d5039c1667352e4c2d7a518ce333a65d6fa9a3191b7c746e0a4c394fab'),
      proof: hex2buf(
        '910057ace443fd765ae01e9ab9a069cf997e6cdb3642c61c0be22cb755c69eeea94dc26910328d7db5acbb74f69eba04a58353bcc11450cf5791bf76147a5f5ac3c97f4a0586093715e046632d5fd8759cca7a3e595e269feaee42230e4a088406c78779807b04e5dc09b13c31203f2602fe44101c13b9d7610242ee67e0f1b617c0a85f4dd2b288a38378b44080b9a5b43ef8f4fa9ee3c39b6d0d8fcabcf997adea371d17a27140d0f9896938ad32041b2a92087144110139ff176becd60ba7'
      ),
      publicKeyReRandomization: hex2buf(
        '0c3e04784691a1d843d2cf1840727e82ff7a83a5723fec28a85450596cfd40c3'
      ),
      rtAnchor: hex2buf('5de3573fbee0b1c59f7f02da3a5b30d0dd51f64b65ddd6fe21bb0c5b1e185e27'),
    });
    mockInMemorySpendingKey.signSpendDescription.mockResolvedValue({
      commitmentValue: hex2buf('4df98a4e1fb32530c54e6ca66051dd29f82a8322aa93ac5ca90e4d0f976ded89'),
      nullifier: hex2buf('e09749d5039c1667352e4c2d7a518ce333a65d6fa9a3191b7c746e0a4c394fab'),
      proof: hex2buf(
        '910057ace443fd765ae01e9ab9a069cf997e6cdb3642c61c0be22cb755c69eeea94dc26910328d7db5acbb74f69eba04a58353bcc11450cf5791bf76147a5f5ac3c97f4a0586093715e046632d5fd8759cca7a3e595e269feaee42230e4a088406c78779807b04e5dc09b13c31203f2602fe44101c13b9d7610242ee67e0f1b617c0a85f4dd2b288a38378b44080b9a5b43ef8f4fa9ee3c39b6d0d8fcabcf997adea371d17a27140d0f9896938ad32041b2a92087144110139ff176becd60ba7'
      ),
      publicKeyReRandomization: hex2buf(
        '0c3e04784691a1d843d2cf1840727e82ff7a83a5723fec28a85450596cfd40c3'
      ),
      rtAnchor: hex2buf('5de3573fbee0b1c59f7f02da3a5b30d0dd51f64b65ddd6fe21bb0c5b1e185e27'),
      signature: hex2buf(
        'ae9a1078bfcbda6e789ad8268562ed3f600e1f3265759771f7e4c0eb586b1f400c561727e5a6daa6f85feea46725d3737a0f77ad5d703f057980048c45004c00'
      ),
    });

    const firstInput = {
      memo: hex2buf('5461717569746f00'),
      paymentAddress: hex2buf(
        '2c8e683029bd1c1ff25882bb0353379487fcf142bbaef37d2b21dc3836f929c6fa9181e2a0d7b72406c148'
      ),
      position: 0,
      randomCommitmentTrapdoor: hex2buf(
        '35289e034251f3a673535eca3a795d8fe420801bbe4b97df5d96f0f654ffb608'
      ),
      value: hex2buf('00000000007a1200'),
    };
    const inputs = [
      firstInput,
      { ...firstInput, position: 1, randomCommitmentTrapdoor: new Uint8Array(32).fill(3) },
    ];
    const spendDescription = await saplingTransactionBuilder.prepareSaplingSpendDescription(
      72805504,
      inputs
    );

    for (const [index, input] of inputs.entries()) {
      expect(mockInMemorySpendingKey.prepareSpendDescription).toHaveBeenNthCalledWith(
        index + 1,
        expect.objectContaining({
          publicKeyReRandomization: randomizers[index],
          randomCommitmentTrapdoor: input.randomCommitmentTrapdoor,
        })
      );
      expect(mockInMemorySpendingKey.signSpendDescription).toHaveBeenNthCalledWith(
        index + 1,
        expect.objectContaining({
          publicKeyReRandomization: randomizers[index],
        })
      );
    }

    const expectedSpend = {
      commitmentValue: hex2buf('4df98a4e1fb32530c54e6ca66051dd29f82a8322aa93ac5ca90e4d0f976ded89'),
      nullifier: hex2buf('e09749d5039c1667352e4c2d7a518ce333a65d6fa9a3191b7c746e0a4c394fab'),
      proof: hex2buf(
        '910057ace443fd765ae01e9ab9a069cf997e6cdb3642c61c0be22cb755c69eeea94dc26910328d7db5acbb74f69eba04a58353bcc11450cf5791bf76147a5f5ac3c97f4a0586093715e046632d5fd8759cca7a3e595e269feaee42230e4a088406c78779807b04e5dc09b13c31203f2602fe44101c13b9d7610242ee67e0f1b617c0a85f4dd2b288a38378b44080b9a5b43ef8f4fa9ee3c39b6d0d8fcabcf997adea371d17a27140d0f9896938ad32041b2a92087144110139ff176becd60ba7'
      ),
      publicKeyReRandomization: hex2buf(
        '0c3e04784691a1d843d2cf1840727e82ff7a83a5723fec28a85450596cfd40c3'
      ),
      rtAnchor: hex2buf('5de3573fbee0b1c59f7f02da3a5b30d0dd51f64b65ddd6fe21bb0c5b1e185e27'),
      signature: hex2buf(
        'ae9a1078bfcbda6e789ad8268562ed3f600e1f3265759771f7e4c0eb586b1f400c561727e5a6daa6f85feea46725d3737a0f77ad5d703f057980048c45004c00'
      ),
    };
    expect(spendDescription).toEqual([expectedSpend, expectedSpend]);
  });

  it('uses a fresh spend randomizer per input with the separate proving key', async () => {
    const saplingTransactionBuilder2 = new SaplingTransactionBuilder(
      {
        saplingSigner: mockInMemorySpendingKey as any,
        saplingProver: mockInMemoryProvingKey as any,
      },
      saplingForger,
      saplingContract,
      mockReadProvider as any,
      mockSaplingWrapper as any
    );

    const randomizers = [new Uint8Array(32).fill(1), new Uint8Array(32).fill(2)];
    mockSaplingWrapper.randR
      .mockResolvedValueOnce(randomizers[0])
      .mockResolvedValueOnce(randomizers[1]);
    mockInMemoryProvingKey.prepareSpendDescription.mockResolvedValue({
      commitmentValue: hex2buf('4df98a4e1fb32530c54e6ca66051dd29f82a8322aa93ac5ca90e4d0f976ded89'),
      nullifier: hex2buf('e09749d5039c1667352e4c2d7a518ce333a65d6fa9a3191b7c746e0a4c394fab'),
      proof: hex2buf(
        '910057ace443fd765ae01e9ab9a069cf997e6cdb3642c61c0be22cb755c69eeea94dc26910328d7db5acbb74f69eba04a58353bcc11450cf5791bf76147a5f5ac3c97f4a0586093715e046632d5fd8759cca7a3e595e269feaee42230e4a088406c78779807b04e5dc09b13c31203f2602fe44101c13b9d7610242ee67e0f1b617c0a85f4dd2b288a38378b44080b9a5b43ef8f4fa9ee3c39b6d0d8fcabcf997adea371d17a27140d0f9896938ad32041b2a92087144110139ff176becd60ba7'
      ),
      publicKeyReRandomization: hex2buf(
        '0c3e04784691a1d843d2cf1840727e82ff7a83a5723fec28a85450596cfd40c3'
      ),
      rtAnchor: hex2buf('5de3573fbee0b1c59f7f02da3a5b30d0dd51f64b65ddd6fe21bb0c5b1e185e27'),
    });
    mockInMemorySpendingKey.signSpendDescription.mockResolvedValue({
      commitmentValue: hex2buf('4df98a4e1fb32530c54e6ca66051dd29f82a8322aa93ac5ca90e4d0f976ded89'),
      nullifier: hex2buf('e09749d5039c1667352e4c2d7a518ce333a65d6fa9a3191b7c746e0a4c394fab'),
      proof: hex2buf(
        '910057ace443fd765ae01e9ab9a069cf997e6cdb3642c61c0be22cb755c69eeea94dc26910328d7db5acbb74f69eba04a58353bcc11450cf5791bf76147a5f5ac3c97f4a0586093715e046632d5fd8759cca7a3e595e269feaee42230e4a088406c78779807b04e5dc09b13c31203f2602fe44101c13b9d7610242ee67e0f1b617c0a85f4dd2b288a38378b44080b9a5b43ef8f4fa9ee3c39b6d0d8fcabcf997adea371d17a27140d0f9896938ad32041b2a92087144110139ff176becd60ba7'
      ),
      publicKeyReRandomization: hex2buf(
        '0c3e04784691a1d843d2cf1840727e82ff7a83a5723fec28a85450596cfd40c3'
      ),
      rtAnchor: hex2buf('5de3573fbee0b1c59f7f02da3a5b30d0dd51f64b65ddd6fe21bb0c5b1e185e27'),
      signature: hex2buf(
        'ae9a1078bfcbda6e789ad8268562ed3f600e1f3265759771f7e4c0eb586b1f400c561727e5a6daa6f85feea46725d3737a0f77ad5d703f057980048c45004c00'
      ),
    });

    const firstInput = {
      memo: hex2buf('5461717569746f00'),
      paymentAddress: hex2buf(
        '2c8e683029bd1c1ff25882bb0353379487fcf142bbaef37d2b21dc3836f929c6fa9181e2a0d7b72406c148'
      ),
      position: 0,
      randomCommitmentTrapdoor: hex2buf(
        '35289e034251f3a673535eca3a795d8fe420801bbe4b97df5d96f0f654ffb608'
      ),
      value: hex2buf('00000000007a1200'),
    };
    const inputs = [
      firstInput,
      { ...firstInput, position: 1, randomCommitmentTrapdoor: new Uint8Array(32).fill(3) },
    ];
    const spendDescription = await saplingTransactionBuilder2.prepareSaplingSpendDescription(
      72805504,
      inputs
    );

    for (const [index, input] of inputs.entries()) {
      expect(mockInMemoryProvingKey.prepareSpendDescription).toHaveBeenNthCalledWith(
        index + 1,
        expect.objectContaining({
          publicKeyReRandomization: randomizers[index],
          randomCommitmentTrapdoor: input.randomCommitmentTrapdoor,
        })
      );
      expect(mockInMemorySpendingKey.signSpendDescription).toHaveBeenNthCalledWith(
        index + 1,
        expect.objectContaining({
          publicKeyReRandomization: randomizers[index],
        })
      );
    }

    const expectedSpend = {
      commitmentValue: hex2buf('4df98a4e1fb32530c54e6ca66051dd29f82a8322aa93ac5ca90e4d0f976ded89'),
      nullifier: hex2buf('e09749d5039c1667352e4c2d7a518ce333a65d6fa9a3191b7c746e0a4c394fab'),
      proof: hex2buf(
        '910057ace443fd765ae01e9ab9a069cf997e6cdb3642c61c0be22cb755c69eeea94dc26910328d7db5acbb74f69eba04a58353bcc11450cf5791bf76147a5f5ac3c97f4a0586093715e046632d5fd8759cca7a3e595e269feaee42230e4a088406c78779807b04e5dc09b13c31203f2602fe44101c13b9d7610242ee67e0f1b617c0a85f4dd2b288a38378b44080b9a5b43ef8f4fa9ee3c39b6d0d8fcabcf997adea371d17a27140d0f9896938ad32041b2a92087144110139ff176becd60ba7'
      ),
      publicKeyReRandomization: hex2buf(
        '0c3e04784691a1d843d2cf1840727e82ff7a83a5723fec28a85450596cfd40c3'
      ),
      rtAnchor: hex2buf('5de3573fbee0b1c59f7f02da3a5b30d0dd51f64b65ddd6fe21bb0c5b1e185e27'),
      signature: hex2buf(
        'ae9a1078bfcbda6e789ad8268562ed3f600e1f3265759771f7e4c0eb586b1f400c561727e5a6daa6f85feea46725d3737a0f77ad5d703f057980048c45004c00'
      ),
    };
    expect(spendDescription).toEqual([expectedSpend, expectedSpend]);
  });

  it('createPaybackOutput', async () => {
    mockSaplingWrapper.randR.mockResolvedValue(
      hex2buf('ae2a0d1d3aa056c3171643544016d33de2e080c0681a7a30687bea6dfc53d00a')
    );
    mockSaplingWrapper.preparePartialOutputDescription.mockResolvedValue({
      commitmentValue: hex2buf('d010b289a8c660ece898a18c2fe2e9b67d814a54616a2b51d5ccdd604d51ca4b'),
      commitment: hex2buf('9445481aaac3ff00ad9bab3a342d332f912e2689df338554a29154b49693a85a'),
      proof: hex2buf(
        '96eee6918b09a8373bd471cb6a1543e2a2e9e6b8815cc94898883a28e56a29c7669de1a5d365648468ee1ebd6024484e975a2b2d31409b1973b036b5521e2f272060785491c0e4c1e10a2eaa9c4b17457cfb40b4953db20479972ca3261ed615192676c00f85d32c30f284bb1d9597520b60d6266ba8265e239c903eb281ec3340b0d8f9ca3616b43c0be73a77a2a1a0af82d5fd4d31859fa504ca121346da15a48209fe33b8e307220b431b690ec88c6b8f30f9a05e796ba61a9794a9884ee1'
      ),
    });

    mockSaplingWrapper.getDiversifiedFromRawPaymentAddress.mockResolvedValue(
      hex2buf('2c8e683029bd1c1ff25882')
    );
    mockSaplingWrapper.deriveEphemeralPublicKey.mockResolvedValue(
      hex2buf('7569a45a8f526d3231807356b643b82256b3e1a632d80762b096e136e00b2d67')
    );
    mockSaplingWrapper.getPkdFromRawPaymentAddress.mockResolvedValue(
      hex2buf('bb0353379487fcf142bbaef37d2b21dc3836f929c6fa9181e2a0d7b72406c148')
    );
    mockSaplingWrapper.keyAgreement.mockResolvedValue(
      hex2buf('19938151214e42709cd926936d2ef8329d137213fc330bd830a784f89046e2e6')
    );
    mockSaplingWrapper.getRandomBytes.mockReturnValueOnce(
      hex2buf('f57dd24dbfcc3c088e741db582edfa4d55508001f2b4f211')
    );
    mockSaplingWrapper.getRandomBytes.mockReturnValueOnce(
      hex2buf('515dbfa329cfd091359d448c96d745b1eb6d34d03d6f9b33')
    );

    const paybackOutput = await saplingTransactionBuilder.createPaybackOutput(
      {
        address: hex2buf(
          '2c8e683029bd1c1ff25882bb0353379487fcf142bbaef37d2b21dc3836f929c6fa9181e2a0d7b72406c148'
        ),
        amount: '1000000',
        memo: '',
        outgoingViewingKey: hex2buf(
          '35c61a0e53de553a751c78fbc42d5e7eca807fd441206651c84bf88de803efba'
        ),
        saplingContext: 1441800,
        randomCommitmentTrapdoor: hex2buf(
          '54bf28854ca47de2907d5e3b55e2cfc0f1fe6c95db1648dc4dfd5d3eec40a40d'
        ),
      },
      new BigNumber(6000000)
    );

    expect(paybackOutput).toEqual({
      payBackOutput: {
        commitment: hex2buf('9445481aaac3ff00ad9bab3a342d332f912e2689df338554a29154b49693a85a'),
        proof: hex2buf(
          '96eee6918b09a8373bd471cb6a1543e2a2e9e6b8815cc94898883a28e56a29c7669de1a5d365648468ee1ebd6024484e975a2b2d31409b1973b036b5521e2f272060785491c0e4c1e10a2eaa9c4b17457cfb40b4953db20479972ca3261ed615192676c00f85d32c30f284bb1d9597520b60d6266ba8265e239c903eb281ec3340b0d8f9ca3616b43c0be73a77a2a1a0af82d5fd4d31859fa504ca121346da15a48209fe33b8e307220b431b690ec88c6b8f30f9a05e796ba61a9794a9884ee1'
        ),
        ciphertext: {
          nonceEnc: hex2buf('f57dd24dbfcc3c088e741db582edfa4d55508001f2b4f211'),
          nonceOut: hex2buf('515dbfa329cfd091359d448c96d745b1eb6d34d03d6f9b33'),
          payloadEnc: hex2buf(
            '8b110a52cbfbecdea95526602a171891a6643df7c1b5fd15c7d42cc073bc3faa21c6b5777d1d19d6b5c523e0d3afde66e6873491966f20851a6415e06b3139121b063f6973c7ef5523a570aa7c6f55'
          ),
          payloadOut: hex2buf(
            '2daaf5cd1df3c3d27335ff06e6599c9a09614b4d8f2e026f5efa69368ff2725286a0e4fda42fb3ecf7603240e776062a7fc84cfe3a2a71d99904d99d04f79a397a4d2832174e6476a178a66ef7df48fa'
          ),
          commitmentValue: hex2buf(
            'd010b289a8c660ece898a18c2fe2e9b67d814a54616a2b51d5ccdd604d51ca4b'
          ),
          ephemeralPublicKey: hex2buf(
            '7569a45a8f526d3231807356b643b82256b3e1a632d80762b096e136e00b2d67'
          ),
        },
      },
      payBackAmount: '5000000',
    });
  });

  it('createBindingSignature', async () => {
    const signature = hex2buf(
      '4891e3ec8afcc06675c39a67e95080e0b0ef67c51fde929da938020611480528a33595d0f21b3a087fb3d1e71d4de944ff6e5ba35e9a32a8a034be12d53a1507'
    );
    mockSaplingWrapper.createBindingSignature.mockResolvedValue(signature);
    const bindingSignature = await saplingTransactionBuilder.createBindingSignature({
      balance: new BigNumber(1000000),
      boundData: hex2buf('050a0000001500eca2e9db3e096741601333274d33caefc8a16c5a'),
      saplingContext: 72805504,
      inputs: [
        {
          commitmentValue: hex2buf(
            'f39dd9eb0b7b1b4a4e70bd38d290d1c668043b9645353e5c316c090279651dd1'
          ),
          nullifier: hex2buf('c21f43a1fdd1dd68eca3877b9948e91523ae9f9afb0eb65285c628f4b3ccc1c0'),
          proof: hex2buf(
            'b85be7fa63578a76a58e33985605927480f4f48cedaa207914208cc171d888a0af92ded1003baf7e4014785e0c0fdc39b207df180725030eb5b256a7e91fa78930e21b854d6ab51408d9cdf650644b0ccf6f9f5d517a12b101e41a4f0d94ffa406792b1adda3d601a80efd79020acbcce9a9277c4071de3122cd97aee7ca3097220306f9329f721353889cd284b6c717b78a3d5905c711962613914f8fc86eeb57bae32aa639f3c1f18c767a3d8d8da749df7d7f632b98f3a4ded8258724b2d5'
          ),
          publicKeyReRandomization: hex2buf(
            'b226faf64a351bed83c3c2d8fd8e1ec80ceac6a7aa1ba6546f879794e7e07915'
          ),
          signature: hex2buf(
            'a06b2ee8b1ba82bf9b333fed63f408722f6468cd914a9760a0db09177ec0de1730bf5ee291d844b4f74c1205f53117e6dfbc6ea5c0de8fbd0fa5660297b4bf02'
          ),
        },
      ],
      outputs: [
        {
          commitment: hex2buf('9ee2e031c51a7d38d27d71685aab6fe0f59f4960031bdf8605d28f638af9570b'),
          proof: hex2buf(
            'afea23b9490fffecb35da4fc741ee4cc0ddf97b1d8bbbe1660a88dcef53d7b64b4a06c0891e17f919cdc8f5c33c525e5b01f9121785f1bad4ed0ced342fe592ddab12157fc04ff7e07cb1f6e4a7594e57cf02e1f3b017672f6bf7c225e1b4c1a020ffcb20de5eedaa438112276da7f11a1d96c60ddb1423dcd51a084bb62fd41dcd90d0cfb218ae88584895ae1c0ce2199045640766996957d364e384aeee925e78b3259f17acd945228429457d8ffb82da5467fd7a59e924d1c8dd0c2a6c003'
          ),
          ciphertext: {
            commitmentValue: hex2buf(
              'aeb0e0332d845a780be58f50f32cf1ba7a0c9731625754b2f6ef5ede7c41ed50'
            ),
            ephemeralPublicKey: hex2buf(
              '9b18f05c3459028ef46c87e7ca171ae10e4395afb85bc6b268473f725d2776cd'
            ),
            nonceEnc: hex2buf('a5d02a4e1cf7f7db823371516556cd937ed828155de8b99e'),
            nonceOut: hex2buf('7a3393c68e664870bb04dca35e9b4a9b894454b41a22b1c3'),
            payloadEnc: hex2buf(
              'b7107772c0c7a13b2dc92c4704276d7bd46d0edb1568c6249c8d9bc34ffefb4520bc99cd04cadb2ec90ac1ebd93c2fa48db9039e668842ffa5a996537a3c5e01f372e5b579f4e70984437784bdf352'
            ),
            payloadOut: hex2buf(
              '0e6fba14d93b913903663c6c5b1b482a9924a44e9ce9f1ddcd3382fc36741a4c484928f67dbfa583147a58f9f461a45d3d1cb6f5d7b91d9f9bd5bfcbae3ba013fdb360e35a65e37b05c161e6425fc02a'
            ),
          },
        },
      ],
    });

    expect(bindingSignature).toEqual(signature);
  });

  it('getAntiReplay', async () => {
    const antiReplay = await saplingTransactionBuilder.getAntiReplay();
    expect(antiReplay).toEqual(
      hex2buf(
        '4b543147326b766466506f6176675236466a646436384d327661506b3134714a386268434e6574584c48317541784b37434368'
      )
    );
  });
});
