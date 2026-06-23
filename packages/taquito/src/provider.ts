import {
  OperationContentsAndResult,
  RPCSimulateOperationParam,
  RpcClientInterface,
} from '@taquito/rpc';
import { HttpResponseError } from '@taquito/http-utils';
import { Context } from './context';
import { ForgedBytes, ParamsWithKind, RPCOperation, isOpRequireReveal } from './operations/types';
import {
  InvalidEstimateValueError,
  TezosOperationError,
  TezosPreapplyFailureError,
  flattenErrors,
} from './operations/errors';
import {
  createOriginationOperation,
  createRegisterGlobalConstantOperation,
  createRevealOperation,
  createSetDelegateOperation,
  createTransferOperation,
  createTransferTicketOperation,
  createIncreasePaidStorageOperation,
  createSmartRollupAddMessagesOperation,
  createSmartRollupOriginateOperation,
  createSmartRollupExecuteOutboxMessageOperation,
  createUpdateConsensusKeyOperation,
  createUpdateCompanionKeyOperation,
} from './contract/prepare';
import { OpKind } from '@taquito/rpc';
import { InvalidOperationKindError } from '@taquito/utils';
import { PreparedOperation } from './prepare';
import { Estimate } from './estimate';

export abstract class Provider {
  private clearRpcCache() {
    const rpc = this.context.rpc as { deleteAllCachedData?: () => void };

    if (typeof rpc.deleteAllCachedData === 'function') {
      rpc.deleteAllCachedData();
    }
  }

  private parseRpcErrors(error: unknown) {
    if (!(error instanceof HttpResponseError)) {
      return [];
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(error.body);
    } catch {
      return [];
    }

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((value): value is Record<string, unknown> => {
      return typeof value === 'object' && value !== null;
    });
  }

  private toBigInt(value: unknown) {
    if (typeof value === 'bigint') {
      return value;
    }

    if (typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value)) {
      return BigInt(value);
    }

    if (typeof value === 'string' && /^-?\d+$/.test(value)) {
      return BigInt(value);
    }

    if (typeof value === 'object' && value !== null && 'toString' in value) {
      const normalized = value.toString();
      if (/^-?\d+$/.test(normalized)) {
        return BigInt(normalized);
      }
    }
  }

  private parseCounterAdjustments(error: unknown) {
    return this.parseRpcErrors(error)
      .filter(
        (value): value is { id: string; contract: string; expected: string; found: string } => {
          const id = value.id;
          const contract = value.contract;
          const expected = value.expected;
          const found = value.found;
          return (
            typeof id === 'string' &&
            (id.endsWith('contract.counter_in_the_past') ||
              id.endsWith('contract.counter_in_the_future')) &&
            typeof contract === 'string' &&
            typeof expected === 'string' &&
            typeof found === 'string'
          );
        }
      )
      .map((value) => ({
        contract: value.contract,
        expected: BigInt(value.expected),
        found: BigInt(value.found),
      }))
      .filter((value) => value.expected !== value.found);
  }

  private hasGasLimitTooHighAndBlockExhausted(error: unknown) {
    const ids = this.parseRpcErrors(error)
      .map((value) => value.id)
      .filter((value): value is string => typeof value === 'string');

    return (
      ids.some((id) => id.endsWith('gas_limit_too_high')) &&
      ids.some((id) => id.endsWith('gas_exhausted.block'))
    );
  }

  private async patchSimulationGasLimits(
    op: RPCSimulateOperationParam,
    error: unknown,
    gasLimitPatchableIndexes?: number[]
  ): Promise<RPCSimulateOperationParam | undefined> {
    if (!this.hasGasLimitTooHighAndBlockExhausted(error)) {
      return;
    }

    if (!Array.isArray(op.operation.contents)) {
      return;
    }

    const constants = await this.context.readProvider.getProtocolConstants('head');
    const hardGasLimitPerOperation = this.toBigInt(constants.hard_gas_limit_per_operation);
    const hardGasLimitPerBlock = this.toBigInt(constants.hard_gas_limit_per_block);
    const zero = BigInt(0);

    if (
      typeof hardGasLimitPerOperation === 'undefined' ||
      typeof hardGasLimitPerBlock === 'undefined' ||
      hardGasLimitPerOperation <= zero ||
      hardGasLimitPerBlock <= zero
    ) {
      return;
    }

    const contents = op.operation.contents.map((content) => ({ ...content }));
    const adjustableIndexes =
      gasLimitPatchableIndexes && gasLimitPatchableIndexes.length > 0
        ? gasLimitPatchableIndexes.filter((index) => index >= 0 && index < contents.length)
        : [];
    let explicitGasLimitTotal = zero;

    for (const [index, content] of contents.entries()) {
      const kind = (content as { kind?: string }).kind;
      const gasLimit = this.toBigInt((content as { gas_limit?: unknown }).gas_limit);

      if (typeof gasLimit === 'undefined') {
        continue;
      }

      if (adjustableIndexes.length === 0) {
        if (kind !== 'reveal' && gasLimit >= hardGasLimitPerOperation) {
          adjustableIndexes.push(index);
          continue;
        }
      } else if (adjustableIndexes.includes(index)) {
        continue;
      }

      explicitGasLimitTotal += gasLimit;
    }

    if (adjustableIndexes.length === 0) {
      return;
    }

    // Mirror octez-client's `may_patch_limits` logic in injection.ml:
    // only rebalance manager operations whose gas limit was auto-assigned for
    // simulation, while treating reveal and user-specified gas limits as already
    // consuming part of the block budget.
    const remainingBlockGas = hardGasLimitPerBlock - explicitGasLimitTotal;
    const evenlyDistributedGas =
      remainingBlockGas > zero ? remainingBlockGas / BigInt(adjustableIndexes.length) : zero;
    const patchedGasLimit =
      evenlyDistributedGas > hardGasLimitPerOperation
        ? hardGasLimitPerOperation
        : evenlyDistributedGas;

    let patched = false;
    for (const index of adjustableIndexes) {
      const content = contents[index] as { gas_limit?: unknown };
      const currentGasLimit = this.toBigInt(content.gas_limit);

      if (currentGasLimit === patchedGasLimit) {
        continue;
      }

      (contents[index] as { gas_limit: string }).gas_limit = patchedGasLimit.toString();
      patched = true;
    }

    if (!patched) {
      return;
    }

    return {
      ...op,
      operation: {
        ...op.operation,
        contents,
      },
    };
  }

  private patchSimulationCounters(
    op: RPCSimulateOperationParam,
    adjustments: { contract: string; expected: bigint; found: bigint }[]
  ): RPCSimulateOperationParam | undefined {
    if (adjustments.length === 0) {
      return;
    }

    if (!Array.isArray(op.operation.contents)) {
      return;
    }

    const contents = op.operation.contents.map((content) => ({ ...content }));
    let patched = false;

    for (const adjustment of adjustments) {
      const delta = adjustment.expected - adjustment.found;
      for (const content of contents) {
        const source = (content as { source?: string }).source;
        const counter = (content as { counter?: string | number }).counter;

        if (source !== adjustment.contract || typeof counter === 'undefined') {
          continue;
        }

        const contentCounter = BigInt(String(counter));
        if (contentCounter < adjustment.found) {
          continue;
        }

        (content as { counter: string }).counter = (contentCounter + delta).toString();
        patched = true;
      }
    }

    if (!patched) {
      return;
    }

    return {
      ...op,
      operation: {
        ...op.operation,
        contents,
      },
    };
  }

  get rpc(): RpcClientInterface {
    return this.context.rpc;
  }

  get signer() {
    return this.context.signer;
  }

  constructor(protected context: Context) {}

  protected async forge({ opOb: { branch, contents, protocol }, counter }: PreparedOperation) {
    const forgedBytes = await this.context.forger.forge({ branch, contents });
    return {
      opbytes: forgedBytes,
      opOb: {
        branch,
        contents,
        protocol,
      },
      counter,
    };
  }

  protected async estimate<T extends { fee?: number; gasLimit?: number; storageLimit?: number }>(
    { fee, gasLimit, storageLimit, ...rest }: T,
    estimator: (param: T) => Promise<Estimate>
  ) {
    let calculatedFee = fee;
    let calculatedGas = gasLimit;
    let calculatedStorage = storageLimit;

    if (calculatedFee && calculatedFee % 1 !== 0) {
      throw new InvalidEstimateValueError(`Fee value must not be a decimal: ${calculatedFee}`);
    }
    if (calculatedGas && calculatedGas % 1 !== 0) {
      throw new InvalidEstimateValueError(
        `Gas Limit value must not be a decimal: ${calculatedGas}`
      );
    }
    if (calculatedStorage && calculatedStorage % 1 !== 0) {
      throw new InvalidEstimateValueError(
        `Storage Limit value must not be a decimal: ${calculatedStorage}`
      );
    }

    if (fee === undefined || gasLimit === undefined || storageLimit === undefined) {
      const estimation = await estimator({ fee, gasLimit, storageLimit, ...(rest as any) });
      calculatedFee ??= estimation.suggestedFeeMutez;
      calculatedGas ??= estimation.gasLimit;
      calculatedStorage ??= estimation.storageLimit;
    }

    return {
      fee: calculatedFee,
      gasLimit: calculatedGas,
      storageLimit: calculatedStorage,
    };
  }

  async getRPCOp(param: ParamsWithKind) {
    switch (param.kind) {
      case OpKind.TRANSACTION:
        return createTransferOperation({
          ...param,
        });
      case OpKind.ORIGINATION:
        return createOriginationOperation(
          await this.context.parser.prepareCodeOrigination({
            ...param,
          })
        );
      case OpKind.DELEGATION:
        return createSetDelegateOperation({
          ...param,
        });
      case OpKind.REGISTER_GLOBAL_CONSTANT:
        return createRegisterGlobalConstantOperation({
          ...param,
        });
      case OpKind.INCREASE_PAID_STORAGE:
        return createIncreasePaidStorageOperation({
          ...param,
        });
      case OpKind.UPDATE_CONSENSUS_KEY:
        return createUpdateConsensusKeyOperation({
          ...param,
        });
      case OpKind.UPDATE_COMPANION_KEY:
        return createUpdateCompanionKeyOperation({
          ...param,
        });
      case OpKind.TRANSFER_TICKET:
        return createTransferTicketOperation({
          ...param,
        });
      case OpKind.SMART_ROLLUP_ADD_MESSAGES:
        return createSmartRollupAddMessagesOperation({
          ...param,
        });
      case OpKind.SMART_ROLLUP_ORIGINATE:
        return createSmartRollupOriginateOperation({
          ...param,
        });
      case OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE:
        return createSmartRollupExecuteOutboxMessageOperation({
          ...param,
        });
      case OpKind.REVEAL:
        return createRevealOperation(
          param,
          await this.signer.publicKeyHash(),
          await this.signer.publicKey()
        );
      default:
        throw new InvalidOperationKindError((param as any).kind);
    }
  }

  protected async simulate(op: RPCSimulateOperationParam, preparedOperation?: PreparedOperation) {
    const gasLimitPatchableIndexes = preparedOperation?.simulation?.gasLimitPatchableIndexes;
    try {
      return {
        opResponse: await this.rpc.simulateOperation(op),
        op,
        context: this.context.clone(),
      };
    } catch (error) {
      const adjustments = this.parseCounterAdjustments(error);
      const patchedOp = this.patchSimulationCounters(op, adjustments);

      if (patchedOp) {
        try {
          return {
            opResponse: await this.rpc.simulateOperation(patchedOp),
            op: patchedOp,
            context: this.context.clone(),
          };
        } catch (counterRetryError) {
          const gasPatchedOp = await this.patchSimulationGasLimits(
            patchedOp,
            counterRetryError,
            gasLimitPatchableIndexes
          );

          if (!gasPatchedOp) {
            throw counterRetryError;
          }

          return {
            opResponse: await this.rpc.simulateOperation(gasPatchedOp),
            op: gasPatchedOp,
            context: this.context.clone(),
          };
        }
      }

      const gasPatchedOp = await this.patchSimulationGasLimits(op, error, gasLimitPatchableIndexes);

      if (!gasPatchedOp) {
        throw error;
      }

      return {
        opResponse: await this.rpc.simulateOperation(gasPatchedOp),
        op: gasPatchedOp,
        context: this.context.clone(),
      };
    }
  }

  protected async isRevealOpNeeded(op: RPCOperation[] | ParamsWithKind[], pkh: string) {
    return !(await this.isAccountRevealRequired(pkh)) || !this.isRevealRequiredForOpType(op)
      ? false
      : true;
  }

  protected async isAccountRevealRequired(publicKeyHash: string) {
    return !(await this.context.readProvider.isAccountRevealed(publicKeyHash, 'head'));
  }

  protected isRevealRequiredForOpType(op: RPCOperation[] | ParamsWithKind[]) {
    let opRequireReveal = false;
    for (const operation of op) {
      if (isOpRequireReveal(operation)) {
        opRequireReveal = true;
      }
    }
    return opRequireReveal;
  }

  protected async signAndInject(forgedBytes: ForgedBytes) {
    let signedForgedBytes = await this.signForgedBytes(forgedBytes);
    const opResponse: OperationContentsAndResult[] = [];
    let results;

    try {
      results = await this.rpc.preapplyOperations([signedForgedBytes.opOb]);
    } catch (error) {
      const adjustments = this.parseCounterAdjustments(error);
      const patchedForgedBytes = await this.patchForgedBytesCounters(
        signedForgedBytes,
        adjustments
      );

      if (!patchedForgedBytes) {
        throw error;
      }

      signedForgedBytes = await this.signForgedBytes(patchedForgedBytes);
      results = await this.rpc.preapplyOperations([signedForgedBytes.opOb]);
    }

    if (!Array.isArray(results)) {
      throw new TezosPreapplyFailureError(results);
    }

    for (let i = 0; i < results.length; i++) {
      for (let j = 0; j < results[i].contents.length; j++) {
        opResponse.push(results[i].contents[j]);
      }
    }

    const errors = flattenErrors(results);

    if (errors.length) {
      throw new TezosOperationError(
        errors,
        'Error occurred during validation simulation of operation',
        opResponse
      );
    }

    const hash = await this.context.injector.inject(signedForgedBytes.opbytes);
    this.clearRpcCache();

    return {
      hash,
      forgedBytes: signedForgedBytes,
      opResponse,
      context: this.context.clone(),
    };
  }

  private async signForgedBytes(forgedBytes: ForgedBytes): Promise<ForgedBytes> {
    const signed = await this.signer.sign(forgedBytes.opbytes, new Uint8Array([3]));

    return {
      ...forgedBytes,
      opbytes: signed.sbytes,
      opOb: {
        ...forgedBytes.opOb,
        signature: signed.prefixSig,
      },
    };
  }

  private async patchForgedBytesCounters(
    forgedBytes: ForgedBytes,
    adjustments: { contract: string; expected: bigint; found: bigint }[]
  ): Promise<ForgedBytes | undefined> {
    if (adjustments.length === 0 || !Array.isArray(forgedBytes.opOb.contents)) {
      return;
    }

    const branch = forgedBytes.opOb.branch;
    if (typeof branch !== 'string') {
      return;
    }

    const contents = forgedBytes.opOb.contents.map((content) => ({ ...content }));
    let patched = false;

    for (const adjustment of adjustments) {
      const delta = adjustment.expected - adjustment.found;
      for (const content of contents) {
        const source = (content as { source?: string }).source;
        const counter = (content as { counter?: string | number }).counter;

        if (source !== adjustment.contract || typeof counter === 'undefined') {
          continue;
        }

        const contentCounter = BigInt(String(counter));
        if (contentCounter < adjustment.found) {
          continue;
        }

        (content as { counter: string }).counter = (contentCounter + delta).toString();
        patched = true;
      }
    }

    if (!patched) {
      return;
    }

    const unsignedOpBytes = await this.context.forger.forge({
      branch,
      contents,
    });

    return {
      ...forgedBytes,
      opbytes: unsignedOpBytes,
      opOb: {
        ...forgedBytes.opOb,
        contents,
      },
    };
  }
}
