import { TezosToolkit, RpcReadAdapter } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { InMemorySpendingKey, SaplingToolkit } from '@taquito/sapling';
import { singleSaplingStateContractJProtocol } from '../integration-tests/data/single_sapling_state_contract_jakarta_michelson';
const numberOfSaplingTx = 1;
let totalTime = 0;

async function example() {
    try {
        const provider = 'https://ghostnet.tezos.ecadinfra.com';
        const signer = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
        const tezos = new TezosToolkit(provider);
        tezos.setSignerProvider(signer);

        const saplingContractOrigination = await tezos.contract.originate({
            code: singleSaplingStateContractJProtocol(),
            init: '{}'
        });

        const saplingContract = await saplingContractOrigination.contract();
        console.log(saplingContract.address);

        const aliceInMemorySpendingKey = new InMemorySpendingKey('sask27SLmU9herddHz4qFJBLMjWYMbJF8RtS579w9ej9mfCYK7VUdyCJPHK8AzW9zMsopGZEkYeNjAY7Zz1bkM7CGu8eKLzrjBLTMC5wWJDhxiK91ahA29rhDRsHdJDV2u2jFwb2MNUix8JW7sAkAqYVaJpCehTBPgRQ1KqKwqqUaNmuD8kazd4Q8MCWmgbWs21Yuomdqyi9FLigjRp7oY4m5adaVU19Nj1AHvsMY2tePeU2L');
        const aliceSaplingToolkit = new SaplingToolkit({ saplingSigner: aliceInMemorySpendingKey }, { contractAddress: saplingContract.address, memoSize: 8 }, new RpcReadAdapter(tezos.rpc));
        const aliceInMemoryViewingKey = await aliceInMemorySpendingKey.getSaplingViewingKeyProvider();
        const alicePaymentAddress = (await aliceInMemoryViewingKey.getAddress()).address;

        const shieldedTx = await aliceSaplingToolkit.prepareShieldedTransaction([{
            to: alicePaymentAddress,
            amount: 5,
            memo: 'First Tx'
        }])

        const op = await saplingContract.methodsObject.default([shieldedTx]).send({ amount: 5 });
        await op.confirmation();

        // loop to create multiple sapling transactions (numberOfSaplingTx) and log the time taken to prepare it
        for (let i = 0; i < numberOfSaplingTx; i++) {

            const start = Date.now();

            const tx = await aliceSaplingToolkit.prepareSaplingTransaction([{
                to: 'zet14CMN2T4x1f8sgXeAGWQwczSf6SJ8bm8nyP2Tg7HJn2VmtPtB2nE2q7MMgdmMEwpGQ',
                amount: 2,
                memo: `tx ${i}`,
                mutez: true
            }])

            const millis = Date.now() - start;
            const time = Math.floor(millis / 1000)
            console.log(`seconds elapsed for tx ${i} = ${time}`);
            totalTime += time

            const op = await saplingContract.methodsObject.default([tx]).send();
            await op.confirmation();

        }

        const aliceTxViewer = await aliceSaplingToolkit.getSaplingTransactionViewer()
        const balance = await aliceTxViewer.getBalance();
        console.log('balance', balance.toString());
        console.log('average', totalTime / numberOfSaplingTx)

    } catch (ex) {
        console.error(ex);
    }
}

example();
