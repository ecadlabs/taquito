import { vi } from 'vitest';
import { SaplingTransactionViewer } from '../../src/sapling-tx-viewer/sapling-transaction-viewer';
import { InMemoryViewingKey } from '../../src/sapling-keys/in-memory-viewing-key';
import { saplingStateDiff, saplingStateDiffMemo4 } from '../data';
import BigNumber from 'bignumber.js';

describe('SaplingTransactionViewer', () => {
  let mockRpcClient: any;
  let viewingKeyInMemory: InMemoryViewingKey;

  beforeEach(async () => {
    mockRpcClient = {
      getSaplingDiffById: vi.fn(),
    };
    mockRpcClient.getSaplingDiffById.mockResolvedValue(saplingStateDiff);

    viewingKeyInMemory = await InMemoryViewingKey.fromSpendingKey(
      'sask27SLmU9herddJFjvuQq9aVuzTx8nmu3zttpMCDWBH2V2MbvUcnxrH5AWGXXybqiqn9THT8GMQhJumHgM2rPQi3sx6FmD2WY4tXrEk7YupAQ9VG9MoM5YkpQFMqS6JkcWiZZCYz4ZWXDdi8Jycgv6qKXauWPA6EY7vVJUZX8Dh2rJGrCRm7huLQK3UpHkHar4sv332z6Cqwqcc7Drz7VzkGeUidG2MWQJvUvzPVzpnHPJx'
    );
  });

  it('Should be instantiable', async () => {
    const txViewer = new SaplingTransactionViewer(
      viewingKeyInMemory,
      { saplingId: '123' },
      mockRpcClient
    );
    expect(txViewer).toBeDefined();
  });

  it('should retrieve the correct balance from sapling state', async () => {
    const txViewer = new SaplingTransactionViewer(
      viewingKeyInMemory,
      { saplingId: '3899' },
      mockRpcClient
    );
    expect(await txViewer.getBalance()).toEqual(new BigNumber(5000000));
  });

  it('Retrieve incoming and outgoing transactions in readable format', async () => {
    const txViewer = new SaplingTransactionViewer(
      viewingKeyInMemory,
      { saplingId: '3899' },
      mockRpcClient
    );
    expect(await txViewer.getIncomingAndOutgoingTransactions()).toEqual({
      incoming: [
        {
          value: new BigNumber('10000000'),
          memo: '',
          paymentAddress: 'zet12YrifNvzLj2D897URmAKpvazMDucwkFEPUGrmmDUE1E7aHXnLU2oTTxUA8igg7sxb',
          isSpent: true,
          position: 0,
        },
        {
          value: new BigNumber('0'),
          memo: '',
          paymentAddress: 'zet12xEiGz8bTjRWxAE5kanYUQjZv27JSrUE9JymsT8FrMrZbETtHqCnkLGN7MumgFWNr',
          isSpent: true,
          position: 2,
        },
        {
          value: new BigNumber('10000000'),
          memo: '',
          paymentAddress: 'zet12xEiGz8bTjRWxAE5kanYUQjZv27JSrUE9JymsT8FrMrZbETtHqCnkLGN7MumgFWNr',
          isSpent: true,
          position: 3,
        },
        {
          value: new BigNumber('6000000'),
          memo: '',
          paymentAddress: 'zet13NrtDFk1CwK3LwRMS84tHoer9JXoh47HemGYqLFmYGUyvX2qRhiYtgdrv8XMbpJtE',
          isSpent: true,
          position: 5,
        },
        {
          value: new BigNumber('5000000'),
          memo: '',
          paymentAddress: 'zet13sURbJMkAE6qkMZLDsHypuihJLcvEpfpfjxT3jNAqTpYjgKey5QGXgePPbeJFgqXG',
          isSpent: false,
          position: 7,
        },
      ],
      outgoing: [
        {
          value: new BigNumber('10000000'),
          memo: '',
          paymentAddress: 'zet13JTYHFem23nK34x9AXg7rWRSKXXixCRZwN8Wd9q2HkWZiW5GjqHfvT53WFPHMZszM',
          position: 1,
        },
        {
          value: new BigNumber('0'),
          memo: '',
          paymentAddress: 'zet12xEiGz8bTjRWxAE5kanYUQjZv27JSrUE9JymsT8FrMrZbETtHqCnkLGN7MumgFWNr',
          position: 2,
        },
        {
          value: new BigNumber('6000000'),
          memo: '',
          paymentAddress: 'zet13NrtDFk1CwK3LwRMS84tHoer9JXoh47HemGYqLFmYGUyvX2qRhiYtgdrv8XMbpJtE',
          position: 5,
        },
        {
          value: new BigNumber('4000000'),
          memo: 'taquito',
          paymentAddress: 'zet134HVqfm5DVp8PZccMeQQjeNXFJZg2VyZigpBSR31ppdfvddkRuqGyEWPLiaXULtDR',
          position: 6,
        },
        {
          value: new BigNumber('5000000'),
          memo: '',
          paymentAddress: 'zet13sURbJMkAE6qkMZLDsHypuihJLcvEpfpfjxT3jNAqTpYjgKey5QGXgePPbeJFgqXG',
          position: 7,
        },
      ],
    });
  });

  it('gives each note its pool position so change can be matched across both lists', async () => {
    const txViewer = new SaplingTransactionViewer(
      viewingKeyInMemory,
      { saplingId: '3899' },
      mockRpcClient
    );
    const { incoming, outgoing } = await txViewer.getIncomingAndOutgoingTransactions();
    const commitmentCount = saplingStateDiff.commitments_and_ciphertexts.length;

    for (const list of [incoming, outgoing]) {
      const positions = list.map((note) => note.position);
      expect(positions.every((p) => Number.isInteger(p) && p >= 0 && p < commitmentCount)).toBe(
        true
      );
      expect([...positions].sort((a, b) => a - b)).toEqual(positions);
      expect(new Set(positions).size).toBe(positions.length);
    }

    // A note this key sent to itself (change, or a payment to its own address) appears in both
    // lists at one position.
    const incomingByPosition = new Map(incoming.map((note) => [note.position, note]));
    const sharedPositions = outgoing
      .map((note) => note.position)
      .filter((position) => incomingByPosition.has(position));
    expect(sharedPositions.length).toBeGreaterThan(0);
    for (const position of sharedPositions) {
      const sent = outgoing.find((note) => note.position === position);
      const received = incomingByPosition.get(position);
      expect(sent?.paymentAddress).toBe(received?.paymentAddress);
      expect(sent?.value).toEqual(received?.value);
      expect(sent?.memo).toBe(received?.memo);
    }
  });

  it('Retrieve incoming and outgoing transactions raw format', async () => {
    mockRpcClient.getSaplingDiffById.mockResolvedValue(saplingStateDiffMemo4);

    viewingKeyInMemory = await InMemoryViewingKey.fromSpendingKey(
      'sask27SLmU9herddJFjvuQq9aVuzTx8nmu3zttpMCDWBH2V2MbvUcnxrH5AWGXXybqiqn9THT8GMQhJumHgM2rPQi3sx6FmD2WY4tXrEk7YupAQ9VG9MoM5YkpQFMqS6JkcWiZZCYz4ZWXDdi8Jycgv6qKXauWPA6EY7vVJUZX8Dh2rJGrCRm7huLQK3UpHkHar4sv332z6Cqwqcc7Drz7VzkGeUidG2MWQJvUvzPVzpnHPJx'
    );

    const txViewer = new SaplingTransactionViewer(
      viewingKeyInMemory,
      { saplingId: '3899' },
      mockRpcClient
    );
    expect(await txViewer.getIncomingAndOutgoingTransactionsRaw()).toEqual({
      incoming: [
        {
          value: new Uint8Array([0, 0, 0, 0, 0, 152, 150, 128]),
          memo: new Uint8Array([116, 97, 99, 111]),
          paymentAddress: new Uint8Array([
            166, 143, 83, 137, 83, 41, 234, 208, 203, 208, 178, 171, 132, 45, 244, 237, 184, 210,
            132, 27, 72, 208, 32, 138, 128, 112, 14, 34, 153, 61, 38, 89, 83, 150, 9, 75, 32, 82,
            221, 192, 178, 66, 70,
          ]),
          position: 0,
          randomCommitmentTrapdoor: new Uint8Array([
            36, 172, 48, 219, 73, 224, 5, 79, 74, 89, 93, 209, 250, 102, 226, 180, 52, 197, 67, 240,
            191, 75, 110, 117, 240, 29, 231, 138, 161, 173, 197, 0,
          ]),
          isSpent: false,
        },
      ],
      outgoing: [],
    });
  });

  it('should ignore transactions having invalid commitment', async () => {
    viewingKeyInMemory = await InMemoryViewingKey.fromSpendingKey(
      'sask27SLmU9herddJ9EmreYA6y3Jmpxvrzk5891R8Z4osTGCoxfevAV9HafAAntWhRDHNxytBCN9qtFE7eBk9DE2ewEzvXUSSKRhrjF7pshtoc4oWGBS7Z1JJ4VHNanXCDc3qdUb45cp6QJS8sbzQqZNFycNyjNr3cXdodUfrGyHDsiX8JHPaL9ASJxauwmVqRmT6rYKEUagJUQEVzdHJ72Wd6ewEC1mHrMpvyNHkkcSkaLRr'
    );
    const txViewer = new SaplingTransactionViewer(
      viewingKeyInMemory,
      { saplingId: '3899' },
      mockRpcClient
    );
    expect(await txViewer.getIncomingAndOutgoingTransactions()).toEqual({
      incoming: [
        {
          value: new BigNumber('7000000'),
          memo: 'test',
          paymentAddress: 'zet14599uF9M7xXsJ9ALhHEdvcRTiE43RLbSTScbEAkozjStD2EA7iBVbYiMkuGDzhi4p',
          isSpent: false,
          position: 9,
        },
        {
          value: new BigNumber('7000000'),
          memo: 'test',
          paymentAddress: 'zet12mvUcMftBAkvn58h5gNVCwiySx2w2Qb4pjP5F5qqZ7xBnVmy7ckRDPGmj2hzZti2s',
          isSpent: true,
          position: 10,
        },
      ],
      outgoing: [
        {
          value: new BigNumber('1000000'),
          memo: 'hi',
          paymentAddress: 'zet144JrAT1waTbYdFWPzJGPSGgDyy3vmDDPSWaxmWGJuhwpn3F6RL48kcWMDxAwGGFWY',
          position: 11,
        },
      ],
    });
  });
});
