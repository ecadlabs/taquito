
import { LedgerSigner, DerivationType } from '@taquito/ledger-signer';
import { TezosToolkit } from '@taquito/taquito';
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";

async function example() {

    const transport = await TransportNodeHid.create();
    let index = 0;
    const tezos = new TezosToolkit('https://api.tez.ie/rpc/edonet')
    while (index < 10) {
        const ledgerSigner = new LedgerSigner(transport, `44'/1729'/${index}'/0'`, false, DerivationType.ED25519);
        tezos.setProvider({ signer: ledgerSigner });
        const pkh = await tezos.signer.publicKeyHash();
        const balance = await tezos.tz.getBalance(pkh)
        const getPublicKey = await tezos.rpc.getManagerKey(pkh)
        console.log(`The public key hash related to the derivation path having the account ${index} is ${pkh}.`)
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