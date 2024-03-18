import { PreapplyResponse, ConstantsResponse, RPCSimulateOperationParam } from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import { flattenErrors, flattenOperationResult, TezosOperationError } from '../operations/errors';
import {
  DelegateParams,
  isOpWithFee,
  isOpWithGasBuffer,
  OriginateParams,
  ParamsWithKind,
  RegisterDelegateParams,
  TransferParams,
  RevealParams,
  RegisterGlobalConstantParams,
  TransferTicketParams,
  IncreasePaidStorageParams,
  UpdateConsensusKeyParams,
  SmartRollupAddMessagesParams,
  SmartRollupOriginateParams,
  SmartRollupExecuteOutboxMessageParams,
} from '../operations/types';
import { Estimate, EstimateProperties } from './estimate';
import { EstimationProvider } from '../estimate/estimate-provider-interface';
import { validateAddress, ValidationResult, invalidDetail } from '@taquito/utils';
import { RevealEstimateError } from './errors';
import { ContractMethod, ContractMethodObject, ContractProvider } from '../contract';
import { Provider } from '../provider';
import { PrepareProvider } from '../prepare/prepare-provider';
import { PreparedOperation } from '../prepare';
import { InvalidAddressError, InvalidAmountError } from '@taquito/core';

// stub signature that won't be verified by tezos rpc simulate_operation
const STUB_SIGNATURE =
  'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg';

export class RPCEstimateProvider extends Provider implements EstimationProvider {
  private readonly OP_SIZE_REVEAL = 324; // injecting size tz1=320, tz2=322, tz3=322, tz4=420(not supported)
  private readonly MILLIGAS_BUFFER = 100 * 1000; // 100 buffer depends on operation kind
  private readonly STORAGE_BUFFER = 20; // according to octez-client

  private prepare = new PrepareProvider(this.context);

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

  private getEstimationPropertiesFromOperationContent(
    content: PreapplyResponse['contents'][0],
    size: number,
    costPerByte: BigNumber,
    originationSize: number
  ): EstimateProperties {
    const operationResults = flattenOperationResult({ contents: [content] });
    let consumedMilligas = 0;
    let accumulatedStorage = 0;
    operationResults.forEach((result) => {
      consumedMilligas += Number(result.consumed_milligas) || 0;
      // transfer to unrevealed implicit
      accumulatedStorage += 'allocated_destination_contract' in result ? originationSize : 0;
      // originate
      accumulatedStorage +=
        'originated_contracts' in result && Array.isArray(result.originated_contracts)
          ? result.originated_contracts.length * originationSize
          : 0;
      // register_global_constants
      accumulatedStorage +=
        'storage_size' in result && 'global_address' in result
          ? Number(result.storage_size) || 0
          : 0;
      // transfer_ticket, originate, contract_call
      accumulatedStorage +=
        'paid_storage_size_diff' in result ? Number(result.paid_storage_size_diff) || 0 : 0;
      //smart_rollup_originate
      accumulatedStorage += 'genesis_commitment_hash' in result ? Number(result.size) || 0 : 0;
    });
    if (isOpWithFee(content)) {
      return {
        milligasLimit: isOpWithGasBuffer(content)
          ? consumedMilligas + Number(this.MILLIGAS_BUFFER)
          : consumedMilligas,
        storageLimit: accumulatedStorage > 0 ? accumulatedStorage + this.STORAGE_BUFFER : 0,
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

  private async calculateEstimates(
    op: PreparedOperation,
    constants: Pick<ConstantsResponse, 'cost_per_byte' | 'origination_size'>
  ) {
    const {
      opbytes,
      opOb: { branch, contents },
    } = await this.forge(op);
    const operation: RPCSimulateOperationParam = {
      operation: { branch, contents, signature: STUB_SIGNATURE },
      chain_id: await this.context.readProvider.getChainId(),
    };

    const { opResponse } = await this.simulate(operation);
    const { cost_per_byte, origination_size } = constants;
    const errors = [...flattenErrors(opResponse, 'backtracked'), ...flattenErrors(opResponse)];

    // Fail early in case of errors
    if (errors.length) {
      throw new TezosOperationError(
        errors,
        'Error occurred during estimation',
        opResponse.contents
      );
    }

    let numberOfOps = 1;
    if (Array.isArray(op.opOb.contents) && op.opOb.contents.length > 1) {
      numberOfOps =
        opResponse.contents[0].kind === 'reveal'
          ? op.opOb.contents.length - 1
          : op.opOb.contents.length;
    }

    return opResponse.contents.map((x) => {
      return this.getEstimationPropertiesFromOperationContent(
        x,
        // diff between estimated and injecting OP_SIZE is 124-126, we added buffer to use 130
        x.kind === 'reveal' ? this.OP_SIZE_REVEAL / 2 : (opbytes.length + 130) / 2 / numberOfOps,
        cost_per_byte,
        origination_size ?? 257 // protocol constants
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
  async originate(params: OriginateParams) {
    const preparedOperation = await this.prepare.originate(params);
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');

    const estimateProperties = await this.calculateEstimates(preparedOperation, protocolConstants);

    if (preparedOperation.opOb.contents[0].kind === 'reveal') {
      estimateProperties.shift();
      estimateProperties[0].opSize -= this.OP_SIZE_REVEAL / 2;
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
    const toValidation = validateAddress(rest.to);
    if (toValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(rest.to, invalidDetail(toValidation));
    }
    const sourceValidation = validateAddress(rest.source ?? '');
    if (rest.source && sourceValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(rest.source, invalidDetail(sourceValidation));
    }
    if (rest.amount < 0) {
      throw new InvalidAmountError(rest.amount.toString());
    }
    const preparedOperation = await this.prepare.transaction({
      fee,
      storageLimit,
      gasLimit,
      ...rest,
    });
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const estimateProperties = await this.calculateEstimates(preparedOperation, protocolConstants);

    if (preparedOperation.opOb.contents[0].kind === 'reveal') {
      estimateProperties.shift();
      estimateProperties[0].opSize -= this.OP_SIZE_REVEAL / 2;
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
    const destinationValidation = validateAddress(rest.destination);
    if (destinationValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(rest.destination, invalidDetail(destinationValidation));
    }
    const sourceValidation = validateAddress(rest.source ?? '');
    if (rest.source && sourceValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(rest.source, invalidDetail(sourceValidation));
    }
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const preparedOperation = await this.prepare.transferTicket({
      fee,
      storageLimit,
      gasLimit,
      ...rest,
    });

    const estimateProperties = await this.calculateEstimates(preparedOperation, protocolConstants);

    if (preparedOperation.opOb.contents[0].kind === 'reveal') {
      estimateProperties.shift();
      estimateProperties[0].opSize -= this.OP_SIZE_REVEAL / 2;
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
    const sourceValidation = validateAddress(rest.source);
    if (rest.source && sourceValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(rest.source, invalidDetail(sourceValidation));
    }
    const delegateValidation = validateAddress(rest.delegate ?? '');
    if (rest.delegate && delegateValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(rest.delegate, invalidDetail(delegateValidation));
    }

    const preparedOperation = await this.prepare.delegation({
      fee,
      storageLimit,
      gasLimit,
      ...rest,
    });
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');

    const estimateProperties = await this.calculateEstimates(preparedOperation, protocolConstants);

    if (preparedOperation.opOb.contents[0].kind === 'reveal') {
      estimateProperties.shift();
      estimateProperties[0].opSize -= this.OP_SIZE_REVEAL / 2;
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
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const preparedOperations = await this.prepare.batch(params);

    const estimateProperties = await this.calculateEstimates(preparedOperations, protocolConstants);

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
  async registerDelegate(
    { fee, storageLimit, gasLimit, ...rest }: RegisterDelegateParams,
    source?: string
  ) {
    const pkh = (await this.getKeys()).publicKeyHash;
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');

    const checkSource = source || pkh;
    const preparedOperation = await this.prepare.registerDelegate(
      { fee, storageLimit, gasLimit, ...rest },
      checkSource
    );

    const estimateProperties = await this.calculateEstimates(preparedOperation, protocolConstants);

    if (preparedOperation.opOb.contents[0].kind === 'reveal') {
      estimateProperties.shift();
      estimateProperties[0].opSize -= this.OP_SIZE_REVEAL / 2;
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
      const preparedOperation = params
        ? await this.prepare.reveal(params)
        : await this.prepare.reveal({});

      const estimateProperties = await this.calculateEstimates(
        preparedOperation,
        protocolConstants
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
    const preparedOperation = await this.prepare.registerGlobalConstant({
      fee,
      storageLimit,
      gasLimit,
      ...rest,
    });
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');

    const estimateProperties = await this.calculateEstimates(preparedOperation, protocolConstants);

    if (preparedOperation.opOb.contents[0].kind === 'reveal') {
      estimateProperties.shift();
      estimateProperties[0].opSize -= this.OP_SIZE_REVEAL / 2;
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
  async increasePaidStorage({ fee, storageLimit, gasLimit, ...rest }: IncreasePaidStorageParams) {
    if (rest.amount < 0) {
      throw new InvalidAmountError(rest.amount.toString());
    }
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const preparedOperation = await this.prepare.increasePaidStorage({
      fee,
      storageLimit,
      gasLimit,
      ...rest,
    });

    const estimateProperties = await this.calculateEstimates(preparedOperation, protocolConstants);

    if (preparedOperation.opOb.contents[0].kind === 'reveal') {
      estimateProperties.shift();
      estimateProperties[0].opSize -= this.OP_SIZE_REVEAL / 2;
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
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const preparedOperation = await this.prepare.updateConsensusKey(params);

    const estimateProperties = await this.calculateEstimates(preparedOperation, protocolConstants);
    if (preparedOperation.opOb.contents[0].kind === 'reveal') {
      estimateProperties.shift();
      estimateProperties[0].opSize -= this.OP_SIZE_REVEAL / 2;
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
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const preparedOperation = await this.prepare.smartRollupAddMessages(params);

    const estimateProperties = await this.calculateEstimates(preparedOperation, protocolConstants);

    if (preparedOperation.opOb.contents[0].kind === 'reveal') {
      estimateProperties.shift();
      estimateProperties[0].opSize -= this.OP_SIZE_REVEAL / 2;
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
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const preparedOperation = await this.prepare.smartRollupOriginate(params);

    const estimateProperties = await this.calculateEstimates(preparedOperation, protocolConstants);
    if (preparedOperation.opOb.contents[0].kind === 'reveal') {
      estimateProperties.shift();
      estimateProperties[0].opSize -= this.OP_SIZE_REVEAL / 2;
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }

  /**
   *
   * @description Estimate gasLimit, storageLimit and fees for a smart_rollup_execute_outbox_message operation
   *
   * @returns An estimation of gasLimit, storageLimit and fees for the operation
   *
   * @param Estimate
   */
  async smartRollupExecuteOutboxMessage(params: SmartRollupExecuteOutboxMessageParams) {
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const preparedOperation = await this.prepare.smartRollupExecuteOutboxMessage(params);

    const estimateProperties = await this.calculateEstimates(preparedOperation, protocolConstants);
    if (preparedOperation.opOb.contents[0].kind === 'reveal') {
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
    const protocolConstants = await this.context.readProvider.getProtocolConstants('head');
    const preparedOperation = await this.prepare.contractCall(contractMethod);

    const estimateProperties = await this.calculateEstimates(preparedOperation, protocolConstants);

    if (preparedOperation.opOb.contents[0].kind === 'reveal') {
      estimateProperties.shift();
      estimateProperties[0].opSize -= this.OP_SIZE_REVEAL / 2;
    }
    return Estimate.createEstimateInstanceFromProperties(estimateProperties);
  }
}
