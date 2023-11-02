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
                // console.log(`Created new keygen for ${key}`);
                this.keygenMap.set(key, keygen);
            }
            const newKey = await keygen.getKey();
            reply.send(newKey);
        });

        this.fastify.get('/stats', (_request, reply) => {
            const items = Array.from(this.keygenMap.entries());
            reply.send({ total: this.keygenMap.size, stats: items.map(k => ({ name: k[0], stats: k[1].getStats() })) });
        });

        this.fastify.listen({ port: 20001, host: 'localhost' }, (err, _address) => {
            if (err) {
                throw err;
            }
        });
        await new Promise(r => setTimeout(r, 1000)); // TODO: have a loop that checks if the server is up
    }

    async stopServer() {
        for (const keygen of this.keygenMap.values()) {
            keygen.cleanup();
        }
        await this.fastify.close();
    }
}

class LocalKeygen {

    private _keysQueue: string[] = [];
    private _tezos: TezosToolkit;
    private _creatingSigners = false;
    private _batchSize = 15;
    private _maxCount = 50;
    private _interval: NodeJS.Timeout;
    private _totalCreated = 0;

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
        // console.log(`creating ${count} signers, current queue size ${this._keysQueue.length}`);
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
            this._totalCreated += keys.length;
        } finally {
            this._creatingSigners = false;
        }
    }

    getStats() {
        return {
            totalCreated: this._totalCreated,
            queueSize: this._keysQueue.length
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
