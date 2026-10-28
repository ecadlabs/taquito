import { expectTypeOf } from 'vitest';
import type { BeaconWallet } from '@taquito/beacon-wallet';
import type { WalletConnect } from '@taquito/wallet-connect';
import type { MichelsonV1Expression, OpKind, PvmKind } from '@taquito/rpc';

// Public return shapes from freshly built PR #3483 at b8e25cc0, before helper extraction.
type Messages = {
  fee?: string;
  gas_limit?: string;
  storage_limit?: string;
  kind: OpKind.SMART_ROLLUP_ADD_MESSAGES;
  source: string;
  message: string[];
};
type Originate = {
  fee?: string;
  gas_limit?: string;
  storage_limit?: string;
  kind: OpKind.SMART_ROLLUP_ORIGINATE;
  source: string;
  pvm_kind: PvmKind;
  kernel: string;
  parameters_ty: MichelsonV1Expression;
  whitelist?: string[];
};
type Outbox = {
  fee?: string;
  gas_limit?: string;
  storage_limit?: string;
  kind: OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE;
  source: string;
  rollup: string;
  cemented_commitment: string;
  output_proof: string;
};
type Result<Method extends (...params: never[]) => unknown> = {
  [Field in keyof Awaited<ReturnType<Method>>]: Awaited<ReturnType<Method>>[Field];
};

expectTypeOf<
  Result<BeaconWallet['mapSmartRollupAddMessagesParamsToWalletParams']>
>().toEqualTypeOf<Messages>();
expectTypeOf<
  Result<BeaconWallet['mapSmartRollupOriginateParamsToWalletParams']>
>().toEqualTypeOf<Originate>();
expectTypeOf<
  Result<BeaconWallet['mapSmartRollupExecuteOutboxMessageParamsToWalletParams']>
>().toEqualTypeOf<Outbox>();
expectTypeOf<
  Result<WalletConnect['mapSmartRollupAddMessagesParamsToWalletParams']>
>().toEqualTypeOf<Messages>();
expectTypeOf<
  Result<WalletConnect['mapSmartRollupOriginateParamsToWalletParams']>
>().toEqualTypeOf<Originate>();
expectTypeOf<
  Result<WalletConnect['mapSmartRollupExecuteOutboxMessageParamsToWalletParams']>
>().toEqualTypeOf<Outbox>();
