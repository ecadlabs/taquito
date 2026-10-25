// Adapted from trilitech/octez.js #123-126. Copyright 2026 Nomadic Labs. Apache-2.0.
/** Michelson data accepted by the public codec and SDK transfer parameters. */
export type MichelineExpression = import('@taquito/michel-codec').MichelsonData;

/**
 * Amount given as a bigint, a safe integer number or a decimal / 0x-prefixed hex string.
 */
export type AmountLike = bigint | number | string;

declare const amountBrand: unique symbol;

/**
 * Non-negative integer amount. Functions validate amounts at runtime too. It is a plain bigint at runtime.
 */
export type Amount = bigint & { readonly [amountBrand]: true };

/**
 * A Michelson → EVM call: a contract call to the NAC gateway on the Michelson runtime.
 */
export interface GatewayCall {
  direction: 'michelson-to-evm';
  /** Address of the NAC gateway contract */
  contractAddress: string;
  /** `call` for a bare native transfer, `call_evm` for an EVM contract call */
  entrypoint: 'call' | 'call_evm';
  /** Parameter of the gateway entrypoint */
  parameter: MichelineExpression;
  /** Amount sent along with the call, in mutez */
  mutezAmount: bigint;
  /**
   * Canonical ABI signature of the called EVM method (e.g. `transfer(address,uint256)`).
   * Only set for `call_evm`.
   */
  methodSignature?: string;
}

/**
 * An EVM transaction to wrap into a Michelson → EVM call.
 */
export interface EvmTransactionRequest {
  /** Destination EVM address (0x-prefixed, 20 bytes, EIP-55 checksummed if mixed-case) */
  to: string;
  /** Value in wei. Defaults to 0 */
  value?: AmountLike;
  /**
   * Calldata (hex). Empty or missing for a bare native transfer, otherwise at least
   * the 4-byte function selector
   */
  data?: string;
  /**
   * ABI signature of the called method (e.g. `transfer(address,uint256)` or
   * `function transfer(address to, uint256 amount)`). It is sent to the gateway in its
   * canonical form, which must match the selector of `data`, so it requires `data`.
   * When missing, the selector is looked up in the known signatures.
   */
  methodSignature?: string;
}

export interface BuildMichelsonToEvmCallOptions {
  /** Address of the NAC gateway contract. Defaults to {@link NAC_GATEWAY} */
  gatewayAddress?: string;
  /**
   * Callback of the `call_evm` entrypoint, of type `option (contract bytes)`: `None` (the
   * default), or `Some` with the address of a contract taking `bytes`. The builder checks the option shape and address. The callback contract type still needs simulation.
   */
  callback?: MichelineExpression;
  /**
   * Selector (8 hex chars, with or without 0x, any case) → ABI signature map used
   * when `methodSignature` is not given. Defaults to {@link DEFAULT_KNOWN_SIGNATURES}
   */
  knownSignatures?: Record<string, string>;
}

/**
 * Transfer parameters for a gateway call, compatible with the `TransferParams` of
 * `@taquito/taquito` (`Tezos.contract.transfer` / `Tezos.wallet.transfer`).
 */
export interface GatewayTransferParams {
  to: string;
  amount: number;
  mutez: true;
  parameter: {
    entrypoint: string;
    value: MichelineExpression;
  };
}

/**
 * An EVM → Michelson call: an unsigned EVM transaction to the NAC precompile, to be
 * completed (nonce, chain id, fees), signed and sent with an EVM library.
 */
export interface PrecompileCall {
  direction: 'evm-to-michelson';
  to: `0x${string}`;
  data: `0x${string}`;
  /** Value sent along with the call, in wei */
  value: bigint;
  /** Default gas limit from {@link NAC_RECOMMENDED_GAS}, to replace if the call needs more */
  gasLimit: bigint;
}

export type CrossRuntimeCall = GatewayCall | PrecompileCall;

export type CrossRuntimeDirection = CrossRuntimeCall['direction'];

/**
 * A Michelson runtime operation to wrap into an EVM → Michelson call.
 */
export type EvmToMichelsonIntent =
  | {
      kind: 'transfer';
      /** Destination account on the Michelson runtime (implicit tz… account or KT1) */
      destination: string;
      /** Amount in mutez */
      amount: AmountLike;
    }
  | {
      kind: 'call-michelson';
      /** Destination contract on the Michelson runtime (KT1) */
      destination: string;
      /** Entrypoint name, without the `%` prefix */
      entrypoint: string;
      /**
       * Entrypoint parameter, either as binary Micheline (hex, without the `05` pack
       * prefix) or as a Michelson expression with an optional type.
       */
      parameter:
        | string
        | { value: MichelineExpression; type?: import('@taquito/michel-codec').MichelsonType };
      /** Amount in mutez. Defaults to 0 */
      amount?: AmountLike;
    };
