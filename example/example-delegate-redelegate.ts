import { Tezos } from '@taquito/taquito'
import { InMemorySigner } from '@taquito/signer';


async function example() {
    // const provider = 'https://api.tez.ie/rpc/carthagenet';
    // const provider = 'https://api.tez.ie/rpc/mainnet';
    // const provider = 'https://mainnet.tezrpc.me';
    const provider = 'https://mainnet.tezos.org.ua';
    // InMemorySigner.fromSecretKey("edsk3XjcXqmfv2ziUAHcGbgnbgiZv2F5R8Dmmdbk1ahLUYonroAcb4")
    // Tezos.setProvider({ rpc: provider });
    // Tezos.setProvider({ rpc: provider, signer: await InMemorySigner.fromSecretKey("edsk3XjcXqmfv2ziUAHcGbgnbgiZv2F5R8Dmmdbk1ahLUYonroAcb4") });
    const secret = process.env.TEZ_SECRET || "";
    const passphrase = process.env.TEZ_PASS || "";

    Tezos.setProvider({ rpc: provider, signer: await InMemorySigner.fromSecretKey(secret,passphrase) });
    try {
        // const op = await Tezos.tz.activate("tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu")
        // 1. delegate (source account needs to have balance)
        const source = await Tezos.signer.publicKeyHash()
        console.log(`PKH: ${source}`);
        const delegateAddress1 = 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m';
        const delegateAddress2 = 'tz1gfArv665EUkSg2ojMBzcbfwuPxAvqPvjo';

        let op = await Tezos.contract.setDelegate({ source, delegate: delegateAddress1 });

        await op.confirmation();
        console.log(op.hash, op.includedInBlock);

        // 2. delegate to a new delegate
        op = await Tezos.contract.setDelegate({ source, delegate: delegateAddress2 });
        await op.confirmation();  // THIS WILL NEVER END
        // await op.confirmation();
        console.log(op.hash, op.includedInBlock);
    } catch (ex) {
        console.log(ex)
    }
}

// tslint:disable-next-line: no-floating-promises
example();
