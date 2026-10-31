import { InMemorySigner } from '@taquito/signer';
import type { RawSignResult, Signer } from '@taquito/core';
import { RpcClient, type RpcClientInterface } from '@taquito/rpc';

declare const legacyRpc: Omit<RpcClientInterface, 'aggregateProofs'>;
const preservedRpc: RpcClientInterface = legacyRpc;
declare const legacySigner: Signer;
const oldProof: (() => Promise<RawSignResult>) | undefined = legacySigner.provePossession;
const signer = new InMemorySigner('fixture');
const proof: Promise<RawSignResult> = signer.provePossession('aggregate');
const rpc = new RpcClient('http://127.0.0.1');
const result: Promise<string | null> = rpc.aggregateProofs({
  public_key: 'aggregate',
  proofs: [],
});
void [preservedRpc, oldProof, proof, result];
