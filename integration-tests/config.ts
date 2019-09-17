import { TezosToolkit } from '@tezos-ts/tezos-ts'
import { InMemorySigner } from '@tezos-ts/signer';
const providers = (process.env['TEZOS_RPC_NODE'] && process.env['TEZOS_RPC_NODE'].split(',')) || ['http://alphanet-node.tzscan.io'];
const signer: any = new InMemorySigner(process.env['TEZOS_SECRET_KEY'] || 'edsk3xkqabYfWWpcEKTWk75cRQv2bgHA3EHuuHSFH3ejqzKPx69Zh9');


jest.setTimeout(180000);


export const CONFIGS = providers.map((provider) => {
    const Tezos = new TezosToolkit();
    Tezos.setProvider({ rpc: provider, signer: signer })
    return { rpc: provider, lib: Tezos };
});