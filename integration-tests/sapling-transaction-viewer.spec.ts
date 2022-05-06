import { SaplingTransactionViewer, SaplingViewingKeyInMemory } from '@taquito/sapling';
import { Protocols, SaplingStateAbstraction } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import { CONFIGS } from './config';

CONFIGS().forEach(({ lib, protocol, rpc }) => {
    const ithacanet = protocol === Protocols.Psithaca2 ? test : test.skip;
    const Tezos = lib;
    const unencryptedSk = 'sask27SLmU9herddJFjvuQq9aVuzTx8nmu3zttpMCDWBH2V2MbvUcnxrH5AWGXXybqiqn9THT8GMQhJumHgM2rPQi3sx6FmD2WY4tXrEk7YupAQ9VG9MoM5YkpQFMqS6JkcWiZZCYz4ZWXDdi8Jycgv6qKXauWPA6EY7vVJUZX8Dh2rJGrCRm7huLQK3UpHkHar4sv332z6Cqwqcc7Drz7VzkGeUidG2MWQJvUvzPVzpnHPJx'
    const saplingContractAddress = 'KT1KAzz8qFGThsWfWTB8TVMMyQur8htMWkdL'

    describe(`Test retrieve balance and transactions from sapling contract: ${rpc}`, () => {

        beforeEach(async (done) => {
            done()
        })
        ithacanet('Retrieve the unspent balance associated with unencryptedSk in the sapling contract', async (done) => {
            const viewingKeyHolder = await SaplingViewingKeyInMemory.fromSpendingKey(unencryptedSk);
            const transactionViewer = new SaplingTransactionViewer(viewingKeyHolder, rpc);
            
            const saplingContract = await Tezos.contract.at(saplingContractAddress);
            // Retrieve the sapling state id in the contract storage
            const storage: SaplingStateAbstraction = await saplingContract.storage();

            const saplingBalance = await transactionViewer.getBalance(storage.getId());
            expect(saplingBalance).toEqual(new BigNumber(5000000));
            done();
        });

        ithacanet('Retrieve the transactions associated with unencryptedSk in the sapling contract', async (done) => {
            const viewingKeyHolder = await SaplingViewingKeyInMemory.fromSpendingKey(unencryptedSk);
            const transactionViewer = new SaplingTransactionViewer(viewingKeyHolder, rpc);

            const saplingContract = await Tezos.contract.at(saplingContractAddress);
            // Retrieve the sapling state id in the contract storage
            const storage: SaplingStateAbstraction = await saplingContract.storage();

            const transactions = await transactionViewer.getIncomingAndOutgoingTransactionsRaw(storage.getId());

            console.log(transactions)
            expect(transactions.incoming[0]).toMatchObject({
                value: new BigNumber(10000000), // received 10tz
            });
            expect(transactions.incoming[1]).toMatchObject({
                value: new BigNumber(10000000), // received 10tz
            });
            expect(transactions.outgoing[0]).toMatchObject({
                value: new BigNumber(10000000), // sent 10tz to bob
            });
            expect(transactions.outgoing[1]).toMatchObject({
                value: new BigNumber(4000000), // sent 4tz to bob
            });
            done();
        });



    });
})
