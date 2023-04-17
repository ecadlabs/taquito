import { PreapplyResponse, RPCRunOperationParam, OpKind, ConstantsResponse } from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import { DEFAULT_FEE, DEFAULT_GAS_LIMIT, DEFAULT_STORAGE_LIMIT } from '../constants';
import { OperationEmitter } from '../operations/operation-emitter';
import {
  flattenErrors,
  flattenOperationResult,
  TezosOperationError,
} from '../operations/operation-errors';
import {
  DelegateParams,
  isOpWithFee,
  OriginateParams,
  ParamsWithKind,
  PrepareOperationParams,
  RegisterDelegateParams,
  RPCOperation,
  TransferParams,
  RevealParams,
  RegisterGlobalConstantParams,
  TxRollupOriginateParams,
  TxRollupBatchParams,
  TransferTicketParams,
  IncreasePaidStorageParams,
  UpdateConsensusKeyParams,
  SmartRollupAddMessagesParams,
  SmartRollupOriginateParams,
} from '../operations/types';
import { Estimate, EstimateProperties } from './estimate';
import { EstimationProvider } from '../estimate/estimate-provider-interface';
import {
  createOriginationOperation,
  createRegisterDelegateOperation,
  createRevealOperation,
  createSetDelegateOperation,
  createTransferOperation,
  createRegisterGlobalConstantOperation,
  createTxRollupOriginationOperation,
  createTxRollupBatchOperation,
  createTransferTicketOperation,
  createIncreasePaidStorageOperation,
  createUpdateConsensusKeyOperation,
  createSmartRollupAddMessagesOperation,
  createSmartRollupOriginateOperation,
} from '../contract/prepare';
import {
  validateAddress,
  InvalidAddressError,
  ValidationResult,
  InvalidOperationKindError,
} from '@taquito/utils';
import { RevealEstimateError } from './error';
import { ContractMethod, ContractMethodObject, ContractProvider } from '../contract';

interface Limits {
  fee?: number;
  storageLimit?: number;
  gasLimit?: number;
}

const mergeLimits = (
  userDefinedLimit: Limits,
  defaultLimits: Required<Limits>
): Required<Limits> => {
  return {
    fee: typeof userDefinedLimit.fee === 'undefined' ? defaultLimits.fee : userDefinedLimit.fee,
    gasLimit:
      typeof userDefinedLimit.gasLimit === 'undefined'
        ? defaultLimits.gasLimit
        : userDefinedLimit.gasLimit,
    storageLimit:
      typeof userDefinedLimit.storageLimit === 'undefined'
        ? defaultLimits.storageLimit
        : userDefinedLimit.storageLimit,
  };
};

// RPC requires a signature but does not verify it
const SIGNATURE_STUB =
  'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg';

export class RPCEstimateProvider extends OperationEmitter implements EstimationProvider {
  private readonly ALLOCATION_STORAGE = 257;
  private readonly ORIGINATION_STORAGE = 257;
  private readonly OP_SIZE_REVEAL = 128;

  private async getKeys(): Promise<{
    publicKeyHash: string;
    publicKey?: string;
  }> {
    const isSignerConfigured = this.context.isAnySignerConfigured();
    return {
      publicKeyHash: isSignerConfigured
        ? await this.signer.publicKeyHash()
        : await this.context.walletProvider.getPKH(),
      publicKey: isSignerConfigured ? await this.signer.publicKey() : undefined,
    };
  }

  // Maximum values defined by the protocol
  private async getAccountLimits(
    pkh: string,
    constants: Pick<
      ConstantsResponse,
      | 'hard_gas_limit_per_operation'
      | 'hard_gas_limit_per_block'
      | 'hard_storage_limit_per_operation'
      | 'cost_per_byte'
    >,
    numberOfOps?: number
  ) {
    const balance = await this.context.readProvider.getBalance(pkh, 'head');
    const {
      hard_gas_limit_per_operation,
      hard_gas_limit_per_block,
      hard_storage_limit_per_operation,
      cost_per_byte,
    } = constants;
    return {
      fee: 0,
      gasLimit: numberOfOps
        ? Math.floor(
            this.ajustGasForBatchOperation(
              hard_gas_limit_per_block,
              hard_gas_limit_per_operation,
              numberOfOps
            ).toNumber()
          )
        : hard_gas_limit_per_operation.toNumber(),
      storageLimit: Math.floor(
        BigNumber.min(balance.dividedBy(cost_per_byte), hard_storage_limit_per_operation).toNumber()
      ),
    };
  }

  // Fix for Granada where the total gasLimit of a batch can not exceed the hard_gas_limit_per_block.
  // If the total gasLimit of the batch is higher than the hard_gas_limit_per_block,
  // the gasLimit is calculated by dividing the hard_gas_limit_per_block by the number of operation in the batch (numberOfOps).
  // numberOfOps is incremented by 1 for safety in case a reveal operation is needed
  private ajustGasForBatchOperation(
    gasLimitBlock: BigNumber,
    gaslimitOp: BigNumber,
    numberOfOps: number
  ) {
    return BigNumber.min(gaslimitOp, gasLimitBlock.div(numberOfOps + 1));
  }

  private getEstimationPropertiesFromOperationContent(
    content: PreapplyResponse['contents'][0],
    size: number,
    costPerByte: BigNumber,
    tx_rollup_origination_size: number
  ): EstimateProperties {
    const operationResults = flattenOperationResult({ contents: [content] });
    let totalMilligas = 0;
    let totalStorage = 0;
    operationResults.forEach((result) => {
      totalStorage +=
        'originated_contracts' in result && typeof result.originated_contracts !== 'undefined'
          ? result.originated_contracts.length * this.ORIGINATION_STORAGE
          : 0;
      totalStorage += 'allocated_destination_contract' in result ? this.ALLOCATION_STORAGE : 0;
      totalMilligas += Number(result.consumed_milligas) || 0;
      totalStorage +=
        'paid_storage_size_diff' in result ? Number(result.paid_storage_size_diff) || 0 : 0;
      totalStorage +=
        'storage_size' in result && 'global_address' in result
          ? Number(result.storage_size) || 0
          : 0;
      totalStorage += 'originated_rollup' in result ? tx_rollup_origination_size : 0;
      totalStorage += 'genesis_commitment_hash' in result ? Number(result.size) : 0;
    });

    if (isOpWithFee(content)) {
      return {
        milligasLimit: totalMilligas || 0,
        storageLimit: Number(totalStorage || 0),
        opSize: size,
        minimalFeePerStorageByteMutez: costPerByte.toNumber(),
      };
    } else {
      return {
        milligasLimit: 0,
        storageLimit: 0,
        opSize: size,
        minimalFeePerStorageByteMutez: costPerByte.toNumber(),
        baseFeeMutez: 0,
      };
    }
  }

  private async prepareEstimate(
    params: PrepareOperationParams,
    constants: Pick<
      ConstantsResponse,
      'cost_per_byte' | 'tx_rollup_origination_size' | 'smart_rollup_origination_size'
    >,
    pkh: string
  ) {
    const prepared = await this.prepareOperation(params, pkh);
    const {
      opbytes,
      opOb: { branch, contents },
    } = await this.forge(prepared);
    const operation: RPCRunOperationParam = {
      operation: { branch, contents, signature: SIGNATURE_STUB },
      chain_id: await this.context.readProvider.getChainId(),
    };

    const { opResponse } = await this.simulate(operation);
    const { cost_per_byte, tx_rollup_origination_size } = constants;
    const errors = [...flattenErrors(opResponse, 'backtracked'), ...flattenErrors(opResponse)];

    // Fail early in case of errors
    if (errors.length) {
      throw new TezosOperationError(errors, 'Error occurred during estimation');
    }

    let numberOfOps = 1;
    if (Array.isArray(params.operation) && params.operation.length > 1) {
      numberOfOps =
        opResponse.contents[0].kind === 'reveal'
          ? params.operation.length - 1
          : params.operation.length;
    }

    return opResponse.contents.map((x) => {
      return this.getEstimationPropertiesFromOperationContent(
        x,
        // TODO: Calculate a specific opSize for each operation.
        x.kind === 'reveal' ? this.OP_SIZE_REVEAL / 2 : opbytes.length / 2 / numberOfOps,
        cost_per_byte,
        tx_rollup_origination_size ?? 0
      );
    });
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an origination operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param OriginationOperation Originate operation parameter
   */
  async originate({ fee, storageLimit, gasLimit, ...rest }: OriginateParams) {
    const { publicKeyHash } = await this.getKeys();
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getAccountLimits(publicKeyHash, protocolConstants);
    const op = await createOriginationOperation(
      await this.context.parser.prepareCodeOrigination({
        ...rest,
        ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
      })
    );
    const isRevealNeeded = await this.isRevealOpNeeded([op], publicKeyHash);
    const ops = isRevealNeeded ? await this.addRevealOp([op], publicKeyHash) : op;
    const estimateProperties = await this.prepareEstimate(
      { operation: ops, source: publicKeyHash },
      protocolConstants,
      publicKeyHash
    );
    if (isRevealNeeded) {
      estimateProperties.shift();
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }
  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an transfer operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param TransferOperation Originate operation parameter
   */
  async transfer({ fee, storageLimit, gasLimit, ...rest }: TransferParams) {
    if (validateAddress(rest.to) !== ValidationResult.VALID) {
      throw new InvalidAddressError(rest.to);
    }
    if (rest.source && validateAddress(rest.source) !== ValidationResult.VALID) {
      throw new InvalidAddressError(rest.source);
    }
    const pkh = (await this.getKeys()).publicKeyHash;
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getAccountLimits(pkh, protocolConstants);
    const op = await createTransferOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });
    const isRevealNeeded = await this.isRevealOpNeeded([op], pkh);
    const ops = isRevealNeeded ? await this.addRevealOp([op], pkh) : op;
    const estimateProperties = await this.prepareEstimate(
      { operation: ops, source: pkh },
      protocolConstants,
      pkh
    );
    if (isRevealNeeded) {
      estimateProperties.shift();
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a transferTicket operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param TransferTicketParams operation parameter
   */
  async transferTicket({ fee, storageLimit, gasLimit, ...rest }: TransferTicketParams) {
    if (validateAddress(rest.destination) !== ValidationResult.VALID) {
      throw new InvalidAddressError(rest.destination, 'param destination');
    }
    if (rest.source && validateAddress(rest.source) !== ValidationResult.VALID) {
      throw new InvalidAddressError(rest.source ?? '', 'param source');
    }
    const pkh = (await this.getKeys()).publicKeyHash;
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getAccountLimits(pkh, protocolConstants);
    const op = await createTransferTicketOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });
    const isRevealNeeded = await this.isRevealOpNeeded([op], pkh);
    const ops = isRevealNeeded ? await this.addRevealOp([op], pkh) : op;
    const estimateProperties = await this.prepareEstimate(
      { operation: ops, source: pkh },
      protocolConstants,
      pkh
    );
    if (isRevealNeeded) {
      estimateProperties.shift();
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a delegate operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  async setDelegate({ fee, gasLimit, storageLimit, ...rest }: DelegateParams) {
    if (rest.source && validateAddress(rest.source) !== ValidationResult.VALID) {
      throw new InvalidAddressError(rest.source);
    }
    if (rest.delegate && validateAddress(rest.delegate) !== ValidationResult.VALID) {
      throw new InvalidAddressError(rest.delegate);
    }

    const pkh = (await this.getKeys()).publicKeyHash;
    const sourceOrDefault = rest.source || pkh;
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getAccountLimits(sourceOrDefault, protocolConstants);
    const op = await createSetDelegateOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });
    const isRevealNeeded = await this.isRevealOpNeeded([op], pkh);
    const ops = isRevealNeeded ? await this.addRevealOp([op], pkh) : op;
    const estimateProperties = await this.prepareEstimate(
      { operation: ops, source: pkh },
      protocolConstants,
      pkh
    );
    if (isRevealNeeded) {
      estimateProperties.shift();
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a each operation in the batch
   *
   * @returns An array of Estimate objects. If a reveal operation is needed, the first element of the array is the Estimate for the reveal operation.
   */
  async batch(params: ParamsWithKind[]) {
    const { publicKeyHash } = await this.getKeys();
    let operations: RPCOperation[] = [];
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getAccountLimits(
      publicKeyHash,
      protocolConstants,
      params.length
    );
    for (const param of params) {
      switch (param.kind) {
        case OpKind.TRANSACTION:
          operations.push(
            await createTransferOperation({
              ...param,
              ...mergeLimits(param, DEFAULT_PARAMS),
            })
          );
          break;
        case OpKind.ORIGINATION:
          operations.push(
            await createOriginationOperation(
              await this.context.parser.prepareCodeOrigination({
                ...param,
                ...mergeLimits(param, DEFAULT_PARAMS),
              })
            )
          );
          break;
        case OpKind.DELEGATION:
          operations.push(
            await createSetDelegateOperation({
              ...param,
              ...mergeLimits(param, DEFAULT_PARAMS),
            })
          );
          break;
        case OpKind.ACTIVATION:
          operations.push({
            ...param,
            ...DEFAULT_PARAMS,
          });
          break;
        case OpKind.REGISTER_GLOBAL_CONSTANT:
          operations.push(
            await createRegisterGlobalConstantOperation({
              ...param,
              ...mergeLimits(param, DEFAULT_PARAMS),
            })
          );
          break;
        case OpKind.TX_ROLLUP_ORIGINATION:
          operations.push(
            await createTxRollupOriginationOperation({
              ...param,
              ...mergeLimits(param, DEFAULT_PARAMS),
            })
          );
          break;
        case OpKind.TX_ROLLUP_SUBMIT_BATCH:
          operations.push(
            await createTxRollupBatchOperation({
              ...param,
              ...mergeLimits(param, DEFAULT_PARAMS),
            })
          );
          break;
        case OpKind.TRANSFER_TICKET:
          operations.push(
            await createTransferTicketOperation({
              ...param,
              ...mergeLimits(param, DEFAULT_PARAMS),
            })
          );
          break;
        case OpKind.INCREASE_PAID_STORAGE:
          operations.push(
            await createIncreasePaidStorageOperation({
              ...param,
              ...mergeLimits(param, DEFAULT_PARAMS),
            })
          );
          break;
        case OpKind.SMART_ROLLUP_ADD_MESSAGES:
          operations.push(
            await createSmartRollupAddMessagesOperation({
              ...param,
              ...mergeLimits(param, DEFAULT_PARAMS),
            })
          );
          break;
        case OpKind.SMART_ROLLUP_ORIGINATE: {
          const originationProof = await this.rpc.getOriginationProof({
            kernel: param.kernel,
            kind: param.pvmKind,
          });
          operations.push(
            await createSmartRollupOriginateOperation({
              ...param,
              originationProof,
              ...mergeLimits(param, DEFAULT_PARAMS),
            })
          );
          break;
        }
        default:
          throw new InvalidOperationKindError(param.kind);
      }
    }
    const isRevealNeeded = await this.isRevealOpNeeded(operations, publicKeyHash);
    operations = isRevealNeeded ? await this.addRevealOp(operations, publicKeyHash) : operations;
    const estimateProperties = await this.prepareEstimate(
      { operation: operations, source: publicKeyHash },
      protocolConstants,
      publicKeyHash
    );

    return Estimate.createArrayEstimateInstancesFromProperties(estimateProperties);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a delegate operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  async registerDelegate(params: RegisterDelegateParams) {
    const pkh = (await this.getKeys()).publicKeyHash;
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getAccountLimits(pkh, protocolConstants);
    const op = await createRegisterDelegateOperation({ ...params, ...DEFAULT_PARAMS }, pkh);
    const isRevealNeeded = await this.isRevealOpNeeded([op], pkh);
    const ops = isRevealNeeded ? await this.addRevealOp([op], pkh) : op;
    const estimateProperties = await this.prepareEstimate(
      { operation: ops, source: pkh },
      protocolConstants,
      pkh
    );
    if (isRevealNeeded) {
      estimateProperties.shift();
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees to reveal the current account
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation or undefined if the account is already revealed
   *
   * @param Estimate
   */
  async reveal(params?: RevealParams) {
    const { publicKeyHash, publicKey } = await this.getKeys();
    if (!publicKey) {
      throw new RevealEstimateError();
    }
    if (await this.isAccountRevealRequired(publicKeyHash)) {
      const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
      const DEFAULT_PARAMS = await this.getAccountLimits(publicKeyHash, protocolConstants);
      const op = await createRevealOperation(
        {
          ...params,
          ...DEFAULT_PARAMS,
        },
        publicKeyHash,
        publicKey
      );
      const estimateProperties = await this.prepareEstimate(
        { operation: op, source: publicKeyHash },
        protocolConstants,
        publicKeyHash
      );
      return Estimate.createEstimateInstanceFromProperties(estimateProperties);
    }
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an registerGlobalConstant operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param params registerGlobalConstant operation parameter
   */
  async registerGlobalConstant({
    fee,
    storageLimit,
    gasLimit,
    ...rest
  }: RegisterGlobalConstantParams) {
    const pkh = (await this.getKeys()).publicKeyHash;
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getAccountLimits(pkh, protocolConstants);
    const op = await createRegisterGlobalConstantOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });
    const isRevealNeeded = await this.isRevealOpNeeded([op], pkh);
    const ops = isRevealNeeded ? await this.addRevealOp([op], pkh) : op;
    const estimateProperties = await this.prepareEstimate(
      { operation: ops, source: pkh },
      protocolConstants,
      pkh
    );
    if (isRevealNeeded) {
      estimateProperties.shift();
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit, and fees for an increasePaidStorage operation
   *
   * @returns An estimation of gasLimit, storageLimit, and fees for the operation
   *
   * @param params increasePaidStorage operation parameters
   */
  async increasePaidStorage(params: IncreasePaidStorageParams) {
    const { fee, storageLimit, gasLimit, ...rest } = params;
    const pkh = (await this.getKeys()).publicKeyHash;

    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getAccountLimits(pkh, protocolConstants);
    const op = await createIncreasePaidStorageOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });
    const isRevealNeeded = await this.isRevealOpNeeded([op], pkh);
    const ops = isRevealNeeded ? await this.addRevealOp([op], pkh) : op;
    const estimateProperties = await this.prepareEstimate(
      { operation: ops, source: pkh },
      protocolConstants,
      pkh
    );
    if (isRevealNeeded) {
      estimateProperties.shift();
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a rollup origination operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param TxRollupOriginateParams Originate tx rollup operation parameter
   */
  async txRollupOriginate(params?: TxRollupOriginateParams) {
    params = params ? params : {};
    const { fee, storageLimit, gasLimit, ...rest } = params;
    const pkh = (await this.getKeys()).publicKeyHash;
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getAccountLimits(pkh, protocolConstants);
    const op = await createTxRollupOriginationOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });
    const isRevealNeeded = await this.isRevealOpNeeded([op], pkh);
    const ops = isRevealNeeded ? await this.addRevealOp([op], pkh) : op;
    const estimateProperties = await this.prepareEstimate(
      { operation: ops, source: pkh },
      protocolConstants,
      pkh
    );
    if (isRevealNeeded) {
      estimateProperties.shift();
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a tx rollup batch operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  async txRollupSubmitBatch(params: TxRollupBatchParams) {
    const { fee, storageLimit, gasLimit, ...rest } = params;
    const pkh = (await this.getKeys()).publicKeyHash;
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const DEFAULT_PARAMS = await this.getAccountLimits(pkh, protocolConstants);
    const op = await createTxRollupBatchOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });
    const isRevealNeeded = await this.isRevealOpNeeded([op], pkh);
    const ops = isRevealNeeded ? await this.addRevealOp([op], pkh) : op;
    const estimateProperties = await this.prepareEstimate(
      { operation: ops, source: pkh },
      protocolConstants,
      pkh
    );
    if (isRevealNeeded) {
      estimateProperties.shift();
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an Update Consensus Key operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  async updateConsensusKey(params: UpdateConsensusKeyParams) {
    const { fee, storageLimit, gasLimit, ...rest } = params;
    const pkh = (await this.getKeys()).publicKeyHash;
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');

    const DEFAULT_PARAMS = await this.getAccountLimits(pkh, protocolConstants);
    const op = await createUpdateConsensusKeyOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });
    const isRevealNeeded = await this.isRevealOpNeeded([op], pkh);
    const ops = isRevealNeeded ? await this.addRevealOp([op], pkh) : op;
    const estimateProperties = await this.prepareEstimate(
      { operation: ops, source: pkh },
      protocolConstants,
      pkh
    );
    if (isRevealNeeded) {
      estimateProperties.shift();
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a smart_rollup_add_messages operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  async smartRollupAddMessages(params: SmartRollupAddMessagesParams) {
    const { fee, storageLimit, gasLimit, ...rest } = params;
    const pkh = (await this.getKeys()).publicKeyHash;
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');

    const DEFAULT_PARAMS = await this.getAccountLimits(pkh, protocolConstants);
    const op = await createSmartRollupAddMessagesOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });

    const isRevealNeeded = await this.isRevealOpNeeded([op], pkh);
    const ops = isRevealNeeded ? await this.addRevealOp([op], pkh) : op;
    const estimateProperties = await this.prepareEstimate(
      { operation: ops, source: pkh },
      protocolConstants,
      pkh
    );
    if (isRevealNeeded) {
      estimateProperties.shift();
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }
  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for an Smart Rollup Originate operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param SmartRollupOriginateParams
   */
  async smartRollupOriginate(params: SmartRollupOriginateParams) {
    const { fee, storageLimit, gasLimit, ...rest } = params;
    const pkh = (await this.getKeys()).publicKeyHash;
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');

    const originationProof = await this.rpc.getOriginationProof({
      kind: params.pvmKind,
      kernel: params.kernel,
    });

    const DEFAULT_PARAMS = await this.getAccountLimits(pkh, protocolConstants);
    const op = await createSmartRollupOriginateOperation({
      ...rest,
      originationProof,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });
    const isRevealNeeded = await this.isRevealOpNeeded([op], pkh);
    const ops = isRevealNeeded ? await this.addRevealOp([op], pkh) : op;
    const estimateProperties = await this.prepareEstimate(
      { operation: ops, source: pkh },
      protocolConstants,
      pkh
    );
    if (isRevealNeeded) {
      estimateProperties.shift();
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for contract call
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the contract call
   *
   * @param Estimate
   */
  async contractCall(
    contractMethod: ContractMethod<ContractProvider> | ContractMethodObject<ContractProvider>
  ) {
    const params = contractMethod.toTransferParams();
    const { fee, storageLimit, gasLimit, ...rest } = params;

    const pkh = (await this.getKeys()).publicKeyHash;
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');

    const DEFAULT_PARAMS = await this.getAccountLimits(pkh, protocolConstants);
    const op = await createTransferOperation({
      ...rest,
      ...mergeLimits({ fee, storageLimit, gasLimit }, DEFAULT_PARAMS),
    });

    const isRevealNeeded = await this.isRevealOpNeeded([op], pkh);
    const ops = isRevealNeeded ? await this.addRevealOp([op], pkh) : op;
    const estimateProperties = await this.prepareEstimate(
      { operation: ops, source: pkh },
      protocolConstants,
      pkh
    );

    if (isRevealNeeded) {
      estimateProperties.shift();
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }

  private async addRevealOp(op: RPCOperation[], pkh: string) {
    const { publicKey } = await this.getKeys();
    if (!publicKey) {
      throw new RevealEstimateError();
    }
    op.unshift(
      await createRevealOperation(
        {
          ...{
            fee: DEFAULT_FEE.REVEAL,
            gasLimit: DEFAULT_GAS_LIMIT.REVEAL,
            storageLimit: DEFAULT_STORAGE_LIMIT.REVEAL,
          },
        },
        pkh,
        await this.signer.publicKey()
      )
    );
    return op;
  }
}
