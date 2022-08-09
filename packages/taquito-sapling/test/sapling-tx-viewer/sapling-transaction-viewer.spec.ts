import { SaplingTransactionViewer } from '../../src/sapling-tx-viewer/sapling-transaction-viewer';
import { InMemoryViewingKey } from '../../src/sapling-keys/in-memory-viewing-key';
import { saplingStateDiff, saplingStateDiffMemo4 } from '../data';
import BigNumber from 'bignumber.js';

describe('SaplingTransactionViewer', () => {
  let mockRpcClient: any;
  let viewingKeyInMemory: InMemoryViewingKey;

  beforeEach(async () => {
    mockRpcClient = {
      getSaplingDiffById: jest.fn(),
    };
    mockRpcClient.getSaplingDiffById.mockResolvedValue(saplingStateDiff);

    viewingKeyInMemory = await InMemoryViewingKey.fromSpendingKey(
      'sask27SLmU9herddJFjvuQq9aVuzTx8nmu3zttpMCDWBH2V2MbvUcnxrH5AWGXXybqiqn9THT8GMQhJumHgM2rPQi3sx6FmD2WY4tXrEk7YupAQ9VG9MoM5YkpQFMqS6JkcWiZZCYz4ZWXDdi8Jycgv6qKXauWPA6EY7vVJUZX8Dh2rJGrCRm7huLQK3UpHkHar4sv332z6Cqwqcc7Drz7VzkGeUidG2MWQJvUvzPVzpnHPJx'
    );
  });

  it('Should be instantiable', async (done) => {
    const txViewer = new SaplingTransactionViewer(
      viewingKeyInMemory,
      { saplingId: '123' },
      mockRpcClient
    );
    expect(txViewer).toBeDefined();
    done();
  });

  it('should retrieve the correct balance from sapling state', async (done) => {
    const txViewer = new SaplingTransactionViewer(
      viewingKeyInMemory,
      { saplingId: '3899' },
      mockRpcClient
    );
    expect(await txViewer.getBalance()).toEqual(new BigNumber(5000000));
    done();
  });

  it('Retrieve incoming and outgoing transactions in readable format', async (done) => {
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
        },
        {
          value: new BigNumber('0'),
          memo: '',
          paymentAddress: 'zet12xEiGz8bTjRWxAE5kanYUQjZv27JSrUE9JymsT8FrMrZbETtHqCnkLGN7MumgFWNr',
          isSpent: true,
        },
        {
          value: new BigNumber('10000000'),
          memo: '',
          paymentAddress: 'zet12xEiGz8bTjRWxAE5kanYUQjZv27JSrUE9JymsT8FrMrZbETtHqCnkLGN7MumgFWNr',
          isSpent: true,
        },
        {
          value: new BigNumber('6000000'),
          memo: '',
          paymentAddress: 'zet13NrtDFk1CwK3LwRMS84tHoer9JXoh47HemGYqLFmYGUyvX2qRhiYtgdrv8XMbpJtE',
          isSpent: true,
        },
        {
          value: new BigNumber('5000000'),
          memo: '',
          paymentAddress: 'zet13sURbJMkAE6qkMZLDsHypuihJLcvEpfpfjxT3jNAqTpYjgKey5QGXgePPbeJFgqXG',
          isSpent: false,
        },
      ],
      outgoing: [
        {
          value: new BigNumber('10000000'),
          memo: '',
          paymentAddress: 'zet13JTYHFem23nK34x9AXg7rWRSKXXixCRZwN8Wd9q2HkWZiW5GjqHfvT53WFPHMZszM',
        },
        {
          value: new BigNumber('0'),
          memo: '',
          paymentAddress: 'zet12xEiGz8bTjRWxAE5kanYUQjZv27JSrUE9JymsT8FrMrZbETtHqCnkLGN7MumgFWNr',
        },
        {
          value: new BigNumber('6000000'),
          memo: '',
          paymentAddress: 'zet13NrtDFk1CwK3LwRMS84tHoer9JXoh47HemGYqLFmYGUyvX2qRhiYtgdrv8XMbpJtE',
        },
        {
          value: new BigNumber('4000000'),
          memo: 'taquito',
          paymentAddress: 'zet134HVqfm5DVp8PZccMeQQjeNXFJZg2VyZigpBSR31ppdfvddkRuqGyEWPLiaXULtDR',
        },
        {
          value: new BigNumber('5000000'),
          memo: '',
          paymentAddress: 'zet13sURbJMkAE6qkMZLDsHypuihJLcvEpfpfjxT3jNAqTpYjgKey5QGXgePPbeJFgqXG',
        },
      ],
    });
    done();
  });

  it('Retrieve incoming and outgoing transactions raw format', async (done) => {
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
          rcm: new Uint8Array([
            36, 172, 48, 219, 73, 224, 5, 79, 74, 89, 93, 209, 250, 102, 226, 180, 52, 197, 67, 240,
            191, 75, 110, 117, 240, 29, 231, 138, 161, 173, 197, 0,
          ]),
          isSpent: false,
        },
      ],
      outgoing: [],
    });
    done();
  });

  it('should ignore transactions having invalid commitment', async (done) => {
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
        },
        {
          value: new BigNumber('7000000'),
          memo: 'test',
          paymentAddress: 'zet12mvUcMftBAkvn58h5gNVCwiySx2w2Qb4pjP5F5qqZ7xBnVmy7ckRDPGmj2hzZti2s',
          isSpent: true,
        },
      ],
      outgoing: [
        {
          value: new BigNumber('1000000'),
          memo: 'hi',
          paymentAddress: 'zet144JrAT1waTbYdFWPzJGPSGgDyy3vmDDPSWaxmWGJuhwpn3F6RL48kcWMDxAwGGFWY',
        },
      ],
    });
    done();
  });
});
