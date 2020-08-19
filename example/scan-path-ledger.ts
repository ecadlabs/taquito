import "babel-polyfill";
import { LedgerSigner, DerivationType } from '@taquito/ledger-signer';
import { Tezos } from '@taquito/taquito';
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";

async function example() {

    const transport = await TransportNodeHid.create();
    let index = 0;
    while (index < 10) {
        const ledgerSigner = new LedgerSigner(transport, `44'/1729'/0'/0'/${index}'`, false, DerivationType.tz1);
        Tezos.setProvider({ rpc: 'https://api.tez.ie/rpc/carthagenet', signer: ledgerSigner });
        const pkh = await Tezos.signer.publicKeyHash();
        const balance = await Tezos.tz.getBalance(pkh)
        const getPublicKey = await Tezos.rpc.getManagerKey(pkh)
        console.log(`The public key hash related to the derivation path having the index ${index} is ${pkh}.`)
        if (getPublicKey) {
            console.log(`The balance is ${balance.toNumber() / 1000000} ꜩ.\n`)
        } else {
            console.log('This account is not revealed.\n')
        }
        index++
    }
}

// tslint:disable-next-line: no-floating-promises
example();