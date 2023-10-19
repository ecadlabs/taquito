import crypto from "crypto";
import { Prefix, b58cencode, prefix } from "@taquito/utils";
import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import Fastify from "fastify";

export class KeygenServer {
    private keygenMap: Map<string, LocalKeygen> = new Map();

    constructor() {
    }

    private fastify = Fastify();

    async startServer() {
        this.fastify.get('/key', async (request, reply) => {
            const { key, passphrase } = request.query as any;
            let keygen = this.keygenMap.get(key);
            if (!keygen) {
                keygen = new LocalKeygen(key, passphrase);
                console.log(`Created new keygen for ${key}`);
                this.keygenMap.set(key, keygen);
            }
            const newKey = await keygen.getKey();
            reply.send(newKey);
        });

        await this.fastify.listen({ port: 20001, host: 'localhost' }, (err, _address) => {
            if (err) {
                throw err;
            }
            // console.log(`Server is now listening on ${address}`);
        });
    }

    async stopServer() {
        await this.fastify.close();
        for (const keygen of this.keygenMap.values()) {
            keygen.cleanup();
        }
    }
}

class LocalKeygen {

    private _keysQueue: string[] = [];
    private _tezos: TezosToolkit;
    private _creatingSigners = false;
    private _batchSize = 20;
    private _minCount = 10;
    private _maxCount = 100;
    private _interval: NodeJS.Timeout;

    constructor(key: string, passphrase?: string) {
        this._tezos = new TezosToolkit('http://localhost:20000');
        this._tezos.setSignerProvider(new InMemorySigner(key, passphrase));
        // console.log(`LocalKeygen initialized created`);
        this._interval = setInterval(() => this.createSigners(this._batchSize), 300);
    }

    cleanup() {
        clearInterval(this._interval);
    }

    private async createSigners(count: number) {
        if (this._keysQueue.length >= this._maxCount) {
            return;
        }
        if (this._creatingSigners) {
            while (this._creatingSigners) {
                // console.log(`waiting for another signer creation to finish`);
                await new Promise(r => setTimeout(r, 2000));
            }
            if (this._keysQueue.length >= count) {
                return;
            }
        }
        console.log(`creating ${count} signers, current queue size ${this._keysQueue.length}`);
        this._creatingSigners = true;
        try {
            const keys: string[] = [];
            let transfers = this._tezos.wallet.batch();
            for (let i = 0; i < count; i++) {
                const keyBytes = Buffer.alloc(32);
                crypto.randomFillSync(keyBytes);

                const key = b58cencode(new Uint8Array(keyBytes), prefix[Prefix.SPSK]);
                const signer = new InMemorySigner(key);
                keys.push(key);
                const pkh = await signer.publicKeyHash();
                transfers = transfers.withTransfer({ to: pkh, amount: 10 });
            }
            const op = await transfers.send();
            await op.confirmation();
            this._keysQueue.push(...keys);
        } finally {
            this._creatingSigners = false;
        }
    }

    public async getKey(): Promise<string> {
        for (let iteration = 0; iteration < 200; iteration++) {
            const key = this._keysQueue.pop();
            if (key) {
                return key;
            }
            // console.log(`Waiting for keys to be created, iteration ${iteration}`);
            await new Promise(r => setTimeout(r, 1000));
        }
        throw new Error(`Waited 20 times to get a signer, giving up`);
    }
}
