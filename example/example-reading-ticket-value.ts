import { BigMapAbstraction, TezosToolkit } from '@taquito/taquito';

const provider = 'https://api.tez.ie/rpc/edonet';

async function example() {
    try {
        const Tezos = new TezosToolkit(provider)
        const contract = await Tezos.contract.at('KT1MaAxUZLXwkYCgg7kU3deHuaHANL1n1yYy');
        const storage: any = await contract.storage();
        console.log('Storage of the contract: ', JSON.stringify(storage, null, 2));
        const ticketBigMapInStorage: BigMapAbstraction = storage['tickets'];
        console.log("Fetch the value of the key 0 in the big map %tickets: ", await ticketBigMapInStorage.get('0'));


    } catch (ex) {
        console.error(ex);
    }
}

// tslint:disable-next-line: no-floating-promises
example();