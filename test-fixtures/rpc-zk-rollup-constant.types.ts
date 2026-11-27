import type { RpcClient } from '@taquito/rpc';

type ZkRollupFlag = Awaited<ReturnType<RpcClient['getConstants']>>['zk_rollup_enable'];
const enabled: ZkRollupFlag = true;
const disabled: ZkRollupFlag = false;
// @ts-expect-error The RPC does not return a number for this flag.
const invalid: ZkRollupFlag = 1;
void [enabled, disabled, invalid];
