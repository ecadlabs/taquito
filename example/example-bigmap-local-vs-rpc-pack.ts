import { BigMapAbstraction, TezosToolkit, MichelCodecPacker } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

const rpc = 'https://api.tez.ie/rpc/edonet';
const numberOfValueToFetch = 150; //max 150

async function example() {

    try {
        const tezos = new TezosToolkit(rpc);

        const contractAddress = 'KT1Qo6HuBuXEPvAKAyFMLsnUcvtL3fMpwmTS';
        const contract = await tezos.contract.at(contractAddress);

        interface storageType {
            0: BigNumber
            1: BigMapAbstraction
        }
        const storage = await contract.storage<storageType>();
        const bigMapStorage = storage[1];

        // Fetch values of the big map using the RPC to pack
        const startRpcPack = new Date().getTime();
        for (let i = 1; i <= numberOfValueToFetch; i++) {
            await bigMapStorage.get(i.toString());
        }
        const durationRpcPack = new Date().getTime() - startRpcPack;

        // Fetch values of the big map using local implementation to pack data
        tezos.setPackerProvider(new MichelCodecPacker());
        const startLocalPack = new Date().getTime();
        for (let i = 1; i <= numberOfValueToFetch; i++) {
            await bigMapStorage.get(i.toString());
        }
        const durationLocalPack = new Date().getTime() - startLocalPack;

        console.log(`Fetched ${numberOfValueToFetch} value(s) on the big map using ${rpc}.`);
        console.log(`It took`, durationRpcPack, `ms to fetch the big map values when packing data with the RPC.`);
        console.log(`It took`, durationLocalPack, `ms to fetch the big map values when packing data locally.`);
        console.log('Difference is:', durationRpcPack - durationLocalPack, 'ms.')

    } catch (ex) {
        console.error(ex);
    }
}

// tslint:disable-next-line: no-floating-promises
example();






// Code to deploy the contract used in th example:
/*
        console.log('Deploying contract...');
        const code = [{ "prim": "parameter", "args": [{ "prim": "unit" }] }, { "prim": "storage", "args": [{ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "big_map", "args": [{ "prim": "nat" }, { "prim": "string" }] }] }] }, { "prim": "code", "args": [[{ "prim": "CDR" }, { "prim": "NIL", "args": [{ "prim": "operation" }] }, { "prim": "PAIR" }]] }];

        const bigmap = new MichelsonMap();

        for (let i = 1; i <= 150; i++) {
            bigmap.set(i, `test${i}`)
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




