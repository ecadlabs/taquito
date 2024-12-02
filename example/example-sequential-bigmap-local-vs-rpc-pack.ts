import { BigMapAbstraction, TezosToolkit, MichelCodecPacker } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

const rpc = 'https://ghostnet.tezos.ecadinfra.com';
const numberOfValueToFetch = 410; // max 410
const repeat = 1; // How many times we want to fetch all the keys

async function example() {

    try {
        const tezos = new TezosToolkit(rpc);

        const contractAddress = 'KT1KbMj3No1gFa2jwXcEUQ5uydc1arahnpiT';
        const contract = await tezos.contract.at(contractAddress);

        interface StorageType {
            0: BigNumber
            1: BigMapAbstraction
        }
        const storage = await contract.storage<StorageType>();
        const bigMapStorage = storage[1];

        // Fetch values of the big map using the RPC to pack
        const startRpcPack = new Date().getTime();
        for (let i = 1; i <= repeat; i++) {
            for (let j = 1; j <= numberOfValueToFetch; j++) {
                await bigMapStorage.get(j.toString());
            }
        }
        const durationRpcPack = new Date().getTime() - startRpcPack;

        // Fetch values of the big map using local implementation to pack data
        tezos.setPackerProvider(new MichelCodecPacker());
        const startLocalPack = new Date().getTime();
        for (let i = 1; i <= repeat; i++) {
            for (let j = 1; j <= numberOfValueToFetch; j++) {
                await bigMapStorage.get(j.toString());
            }
        }
        const durationLocalPack = new Date().getTime() - startLocalPack;

        console.log(`Fetched ${numberOfValueToFetch * repeat} value(s) on the big map in sequence using ${rpc}.`);
        console.log(`It took`, durationRpcPack, `ms to fetch the big map values when packing data with the RPC.`);
        console.log(`It took`, durationLocalPack, `ms to fetch the big map values when packing data locally.`);
        console.log('Difference is:', durationRpcPack - durationLocalPack, 'ms.')

    } catch (ex) {
        console.error(ex);
    }
}


example();

// Code to deploy the contract used in the example:
/*
        const signer: any = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');
        const tezos = new TezosToolkit(rpc);
        tezos.setSignerProvider( signer );

        console.log('Deploying contract...');
        const code = [{ "prim": "parameter", "args": [{ "prim": "unit" }] }, { "prim": "storage", "args": [{ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "big_map", "args": [{ "prim": "nat" }, { "prim": "string" }] }] }] }, { "prim": "code", "args": [[{ "prim": "CDR" }, { "prim": "NIL", "args": [{ "prim": "operation" }] }, { "prim": "PAIR" }]] }];

        const bigmap = new MichelsonMap();

        for (let i = 1; i <= 810; i++) {
            bigmap.set(i, `${i}`)
        }

        const op = await tezos.contract.originate({
            code,
            storage: {
                0: '10',
                1: bigmap
            }
        })

        console.log('Awaiting confirmation...');

        await op.confirmation()
        const contractAddress = op.contractAddress;
        console.log(contractAddress); */




