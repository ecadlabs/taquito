import crypto from "crypto";
import { Prefix, b58cencode, prefix } from "@taquito/utils";
import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import Fastify from "fastify";
import * as fs from "fs";

export class KeygenServer {
    private keygenMap: Map<string, LocalKeygen> = new Map();

    constructor() {
        this.saveInterval = setInterval(() => this.saveLogTick(), 10000);
        this.allCalls = [];
    }

    private fastify = Fastify();
    private totalCalls = new Map<string, number>();
    private allCalls: { time: Date, path: string }[];
    private startTime = new Date().toISOString();
    private saveInterval: NodeJS.Timeout;

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
            reply.send({ total: this.keygenMap.size, 
                totalCalls: Array.from(this.totalCalls.entries()).sort((a, b) => b[1] - a[1]).map(x => [x[1], x[0].substring(0, 100)]), stats: items.map(k => ({ name: k[0], stats: k[1].getStats() })) });
        });

        this.fastify.post('/logHttpCall', (request, reply) => {
            const { type } = request.query as any;
            this.allCalls.push({ time: new Date(), path: type });
            if (this.totalCalls.has(type)) {
                this.totalCalls.set(type, this.totalCalls.get(type)! + 1);
            } else {
                this.totalCalls.set(type, 1);
            }
            reply.send({ success: true });
        });

        this.fastify.listen({ port: 20001, host: 'localhost' }, (err, _address) => {
            if (err) {
                throw err;
            }
        });
        await new Promise(r => setTimeout(r, 1000)); // TODO: have a loop that checks if the server is up
    }

    saveLogTick() {
        const toBeSaved = this.allCalls.splice(0, this.allCalls.length);
        if (toBeSaved.length == 0) {
            return;
        }
        this.saveLog(toBeSaved);
        this.saveStats(false);
    }

    private saveLog(toBeSaved: { time: Date; path: string; }[]) {
        fs.appendFileSync(`../alireza/logs/keygen-log-${this.startTime}.json`, toBeSaved.map(item => `${item.time.toISOString()}: ${item.path}`).join(`\n`));
    }

    private saveStats(complete: boolean) {
        const stats = Array.from(this.totalCalls.entries());
        stats.sort((a, b) => b[1] - a[1]);
        fs.writeFileSync(`../alireza/logs/keygen-stats-${this.startTime}.json`, `${complete ? 'complete' : 'incomplete'} \n ${stats.map(item => `${item[1]}: ${item[0]}`).join(`\n`)}`);
    }

    async stopServer() {
        this.saveStats(true);
        this.saveLog(this.allCalls);
        clearInterval(this.saveInterval);
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
