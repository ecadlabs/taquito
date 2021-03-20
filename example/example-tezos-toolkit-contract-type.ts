import { MichelsonMap, TezosToolkit } from '@taquito/taquito';

const example = async () => {

    type TestContract = {
        methods: {
            bid: (params: { amount: string }) => void;
            sell: (params: { id: string }) => void;
        },
        storage: {
            isInitialized: boolean;
            values: MichelsonMap<string, { id: string, isOpen: boolean }>;
        }
    };

    // Set Contract Type
    const tezos = new TezosToolkit<TestContract>('rpc://...');

    const originateContract = async () => {
        // Contract
        const originateResult = await tezos.contract.originate({
            code: '...',

            // This type must match
            storage: {
                isInitialized: false,
                values: new MichelsonMap(),
            },
        });
        const contract = await originateResult.contract(1000);

        // Test Storage
        const storage = await contract.storage();
        const firstValue = storage.values.get('0');
        if (firstValue) {
            const firstId = firstValue.id;
            console.log('firstId', { firstId });
        }

        // Test Methods
        const methods = contract.methods;
        methods.bid({ amount: '10' });
        methods.sell({ id: '42' });
    };
    await originateContract();


    const accessContract = async () => {
        // Contract
        const contract = await tezos.contract.at('tz123');

        // Test Storage
        const storage = await contract.storage();
        const firstValue = storage.values.get('0');
        if (firstValue) {
            const firstId = firstValue.id;
            console.log('firstId', { firstId })
        }

        // Test Methods
        const methods = contract.methods;
        methods.bid({ amount: '10' });
        methods.sell({ id: '42' });
    };
    await accessContract();

    const accessWallet = async () => {
        // Contract
        const wallet = await tezos.wallet.at('tz123');

        // Test Storage
        const storage = await wallet.storage();
        const firstValue = storage.values.get('0');
        if (firstValue) {
            const firstId = firstValue.id;
            console.log('firstId', { firstId })
        }

        // Test Methods
        const methods = wallet.methods;
        methods.bid({ amount: '10' });
        methods.sell({ id: '42' });
    };
    await accessWallet();

};

// tslint:disable-next-line: no-floating-promises
example();