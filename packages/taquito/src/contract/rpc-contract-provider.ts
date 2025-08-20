import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import { BigMapKeyType, MichelsonMap, MichelsonMapKey, Schema } from '@taquito/michelson-encoder';
import {
  OpKind,
  OperationContentsBallot,
  OperationContentsDelegation,
  OperationContentsDrainDelegate,
  OperationContentsFailingNoop,
  OperationContentsIncreasePaidStorage,
  OperationContentsOrigination,
  OperationContentsProposals,
  OperationContentsRegisterGlobalConstant,
  OperationContentsReveal,
  OperationContentsSmartRollupAddMessages,
  OperationContentsSmartRollupOriginate,
  OperationContentsSmartRollupExecuteOutboxMessage,
  OperationContentsTransaction,
  OperationContentsTransferTicket,
  OperationContentsUpdateConsensusKey,
  ScriptResponse,
} from '@taquito/rpc';
import {
  encodeExpr,
  validateAddress,
  validateContractAddress,
  ValidationResult,
} from '@taquito/utils';
import {
  InvalidAddressError,
  InvalidContractAddressError,
  InvalidAmountError,
  InvalidFinalizeUnstakeAmountError,
  InvalidStakingAddressError,
} from '@taquito/core';
import { OperationBatch } from '../batch/rpc-batch-provider';
import { Context } from '../context';
import { DelegateOperation } from '../operations/delegate-operation';
import { OriginationOperation } from '../operations/origination-operation';
import { RegisterGlobalConstantOperation } from '../operations/register-global-constant-operation';
import { RevealOperation } from '../operations/reveal-operation';
import { TransactionOperation } from '../operations/transaction-operation';
import {
  DelegateParams,
  OriginateParams,
  ParamsWithKind,
  RegisterDelegateParams,
  RegisterGlobalConstantParams,
  RevealParams,
  TransferParams,
  TransferTicketParams,
  IncreasePaidStorageParams,
  DrainDelegateParams,
  BallotParams,
  ProposalsParams,
  UpdateConsensusKeyParams,
  SmartRollupAddMessagesParams,
  SmartRollupOriginateParams,
  SmartRollupExecuteOutboxMessageParams,
  FailingNoopParams,
  StakeParams,
  UnstakeParams,
  FinalizeUnstakeParams,
} from '../operations/types';
import { DefaultContractType, ContractStorageType, ContractAbstraction } from './contract';
import { InvalidDelegationSource, RevealOperationError } from './errors';
import { ContractProvider, ContractSchema, StorageProvider } from './interface';
import { smartContractAbstractionSemantic } from './semantic';
import { EstimationProvider } from '../estimate/estimate-provider-interface';
import { TransferTicketOperation } from '../operations/transfer-ticket-operation';
import { IncreasePaidStorageOperation } from '../operations/increase-paid-storage-operation';
import { BallotOperation } from '../operations/ballot-operation';
import { DrainDelegateOperation } from '../operations/drain-delegate-operation';
import { ProposalsOperation } from '../operations/proposals-operation';
import { UpdateConsensusKeyOperation } from '../operations/update-consensus-key-operation';
import { SmartRollupAddMessagesOperation } from '../operations/smart-rollup-add-messages-operation';
import { SmartRollupOriginateOperation } from '../operations/smart-rollup-originate-operation';
import { SmartRollupExecuteOutboxMessageOperation } from '../operations/smart-rollup-execute-outbox-message-operation';
import { Provider } from '../provider';
import { PrepareProvider } from '../prepare';
import { FailingNoopOperation } from '../operations/failing-noop-operation';

export class RpcContractProvider extends Provider implements ContractProvider, StorageProvider {
  constructor(
    context: Context,
    private estimator: EstimationProvider
  ) {
    super(context);
  }
  contractProviderTypeSymbol = Symbol.for('taquito-contract-provider-type-symbol');

  private prepare = new PrepareProvider(this.context);
  /**
   *
   * @description Return a well formatted json object of the contract storage
   *
   * @param contract contract address you want to get the storage from
   * @param schema optional schema can either be the contract script rpc response or a michelson-encoder schema
   * @throws {@link InvalidContractAddressError}
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-script
   */
  async getStorage<T>(contract: string, schema?: ContractSchema): Promise<T> {
    const contractValidation = validateContractAddress(contract);
    if (contractValidation !== ValidationResult.VALID) {
      throw new InvalidContractAddressError(contract, contractValidation);
    }
    const script = await this.context.readProvider.getScript(contract, 'head');
    if (!schema) {
      schema = script;
    }

    let contractSchema: Schema;
    if (Schema.isSchema(schema as Schema)) {
      contractSchema = schema as Schema;
    } else {
      contractSchema = Schema.fromRPCResponse({ script: schema as ScriptResponse });
    }

    return contractSchema.Execute(script.storage, smartContractAbstractionSemantic(this)) as T; // Cast into T because only the caller can know the true type of the storage
  }

  /**
   *
   * @description Return a well formatted json object of the contract big map storage
   *
   * @param contract contract address you want to get the storage from
   * @param key contract big map key to fetch value from
   * @param schema optional schema can either be the contract script rpc response or a michelson-encoder schema
   * @throws {@link InvalidContractAddressError}
   * @deprecated Deprecated in favor of getBigMapKeyByID
   *
   * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-context-contracts-contract-id-big-map-get
   */
  async getBigMapKey<T>(contract: string, key: string, schema?: ContractSchema): Promise<T> {
    const contractValidation = validateContractAddress(contract);
    if (contractValidation !== ValidationResult.VALID) {
      throw new InvalidContractAddressError(contract, contractValidation);
    }
    if (!schema) {
      schema = (await this.rpc.getContract(contract)).script;
    }

    let contractSchema: Schema;
    if (Schema.isSchema(schema as Schema)) {
      contractSchema = schema as Schema;
    } else {
      contractSchema = Schema.fromRPCResponse({ script: schema as ScriptResponse });
    }

    const encodedKey = contractSchema.EncodeBigMapKey(key);

    const val = await this.rpc.getBigMapKey(contract, encodedKey);

    return contractSchema.ExecuteOnBigMapValue(val) as T; // Cast into T because only the caller can know the true type of the storage
  }

  /**
   *
   * @description Return a well formatted json object of a big map value
   *
   * @param id Big Map ID
   * @param keyToEncode key to query (will be encoded properly according to the schema)
   * @param schema Big Map schema (can be determined using your contract type)
   * @param block optional block level to fetch the values from
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-big-maps-big-map-id-script-expr
   */
  async getBigMapKeyByID<T>(
    id: string,
    keyToEncode: BigMapKeyType,
    schema: Schema,
    block?: number
  ): Promise<T> {
    const { key, type } = schema.EncodeBigMapKey(keyToEncode);
    const { packed } = await this.context.packer.packData({ data: key, type });

    const encodedExpr = encodeExpr(packed);

    const bigMapValue = block
      ? await this.context.readProvider.getBigMapValue(
        { id: id.toString(), expr: encodedExpr },
        block
      )
      : await this.context.readProvider.getBigMapValue(
        { id: id.toString(), expr: encodedExpr },
        'head'
      );

    return schema.ExecuteOnBigMapValue(bigMapValue, smartContractAbstractionSemantic(this)) as T;
  }

  /**
   *
   * @description Fetch multiple values in a big map
   * All values will be fetched on the same block level. If a block is specified in the request, the values will be fetched at it.
   * Otherwise, a first request will be done to the node to fetch the level of the head and all values will be fetched at this level.
   * If one of the keys does not exist in the big map, its value will be set to undefined.
   *
   * @param id Big Map ID
   * @param keys Array of keys to query (will be encoded properly according to the schema)
   * @param schema Big Map schema (can be determined using your contract type)
   * @param block optional block level to fetch the values from
   * @param batchSize optional batch size representing the number of requests to execute in parallel
   * @returns A MichelsonMap containing the keys queried in the big map and their value in a well-formatted JSON object format
   *
   */
  async getBigMapKeysByID<T>(
    id: string,
    keys: Array<BigMapKeyType>,
    schema: Schema,
    block?: number,
    batchSize = 5
  ): Promise<MichelsonMap<MichelsonMapKey, T | undefined>> {
    const level = await this.getBlockForRequest(keys, block);
    const bigMapValues = new MichelsonMap<MichelsonMapKey, T | undefined>();

    // Execute batch of promises in series
    let position = 0;
    let results: Array<T | undefined> = [];

    while (position < keys.length) {
      const keysBatch = keys.slice(position, position + batchSize);
      const batch = keysBatch.map((keyToEncode) =>
        this.getBigMapValueOrUndefined<T>(keyToEncode, id, schema, level)
      );
      results = [...results, ...(await Promise.all(batch))];
      position += batchSize;
    }

    for (let i = 0; i < results.length; i++) {
      bigMapValues.set(keys[i], results[i]);
    }

    return bigMapValues;
  }

  private async getBlockForRequest(keys: Array<BigMapKeyType>, block?: number) {
    return keys.length === 1 || typeof block !== 'undefined'
      ? block
      : await this.context.readProvider.getBlockLevel('head');
  }

  private async getBigMapValueOrUndefined<T>(
    keyToEncode: BigMapKeyType,
    id: string,
    schema: Schema,
    level?: number
  ) {
    try {
      return await this.getBigMapKeyByID<T>(id, keyToEncode, schema, level);
    } catch (ex) {
      if (ex instanceof HttpResponseError && ex.status === STATUS_CODE.NOT_FOUND) {
        return;
      } else {
        throw ex;
      }
    }
  }

  /**
   *
   * @description Return a well formatted json object of a sapling state
   *
   * @param id Sapling state ID
   * @param block optional block level to fetch the value from
   *
   */
  async getSaplingDiffByID(id: string, block?: number) {
    const saplingState = block
      ? await this.context.readProvider.getSaplingDiffById({ id: id.toString() }, block)
      : await this.context.readProvider.getSaplingDiffById({ id: id.toString() }, 'head');
    return saplingState;
  }

  /**
   *
   * @description Originate a new contract according to the script in parameters. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @warn You cannot specify storage and init at the same time (use init to pass the raw michelson representation of storage)
   *
   * @param OriginationOperation Originate operation parameter
   */
  async originate<TContract extends DefaultContractType = DefaultContractType>(
    params: OriginateParams<ContractStorageType<TContract>>
  ) {
    const estimate = await this.estimate(params, this.estimator.originate.bind(this.estimator));
    const preparedOrigination = await this.prepare.originate({ ...params, ...estimate });

    const content = preparedOrigination.opOb.contents.find(
      (op) => op.kind === OpKind.ORIGINATION
    ) as OperationContentsOrigination;
    const forgedOrigination = await this.forge(preparedOrigination);

    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(forgedOrigination);
    return new OriginationOperation<TContract>(
      hash,
      content,
      forgedBytes,
      opResponse,
      context,
      this
    );
  }

  /**
   *
   * @description Set the delegate for a contract. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param SetDelegate operation parameter
   */
  async setDelegate(params: DelegateParams) {
    const sourceValidation = validateAddress(params.source);
    if (params.source && sourceValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.source, sourceValidation);
    }
    const delegateValidation = validateAddress(params.delegate ?? '');
    if (params.delegate && delegateValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.delegate, delegateValidation);
    }

    // Since babylon delegation source cannot smart contract
    if (/^kt1/i.test(params.source)) {
      throw new InvalidDelegationSource(params.source);
    }

    const publicKeyHash = await this.signer.publicKeyHash();
    const sourceOrDefault = params.source || publicKeyHash;

    const estimate = await this.estimate(params, this.estimator.setDelegate.bind(this.estimator));
    const preparedDelegation = await this.prepare.delegation({ ...params, ...estimate });

    const content = preparedDelegation.opOb.contents.find(
      (op) => op.kind === OpKind.DELEGATION
    ) as OperationContentsDelegation;

    const opBytes = await this.forge(preparedDelegation);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new DelegateOperation(hash, content, sourceOrDefault, forgedBytes, opResponse, context);
  }

  /**
   *
   * @description Register the current address as delegate. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param RegisterDelegate operation parameter
   */
  async registerDelegate(params: RegisterDelegateParams) {
    const estimate = await this.estimate(
      params,
      this.estimator.registerDelegate.bind(this.estimator)
    );
    const source = await this.signer.publicKeyHash();

    const prepared = await this.prepare.registerDelegate({ ...params, ...estimate });
    const content = prepared.opOb.contents.find(
      (op) => op.kind === OpKind.DELEGATION
    ) as OperationContentsDelegation;

    const opBytes = await this.forge(prepared);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new DelegateOperation(hash, content, source, forgedBytes, opResponse, context);
  }

  /**
   *
   * @description Transfer tz from current address to a specific address. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param Transfer operation parameter
   */
  async transfer(params: TransferParams) {
    const toValidation = validateAddress(params.to);
    if (toValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.to, toValidation);
    }
    const sourceValidation = validateAddress(params.source ?? '');
    if (params.source && sourceValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.source, sourceValidation);
    }
    if (params.amount < 0) {
      throw new InvalidAmountError(params.amount.toString());
    }
    const publicKeyHash = await this.signer.publicKeyHash();
    const estimate = await this.estimate(params, this.estimator.transfer.bind(this.estimator));

    const source = params.source || publicKeyHash;
    const prepared = await this.prepare.transaction({ ...params, ...estimate });
    const content = prepared.opOb.contents.find(
      (op) => op.kind === OpKind.TRANSACTION
    ) as OperationContentsTransaction;
    const opBytes = await this.forge(prepared);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new TransactionOperation(hash, content, source, forgedBytes, opResponse, context);
  }

  /**
   *
   * @description Stake a given amount for the source address
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param Stake pseudo-operation parameter
   */
  async stake(params: StakeParams) {
    const sourceValidation = validateAddress(params.source ?? '');
    if (params.source && sourceValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.source, sourceValidation);
    }

    if (!params.to) {
      params.to = params.source;
    }
    if (params.to && params.to !== params.source) {
      throw new InvalidStakingAddressError(params.to);
    }

    if (params.amount < 0) {
      throw new InvalidAmountError(params.amount.toString());
    }
    const publicKeyHash = await this.signer.publicKeyHash();
    const estimate = await this.estimate(params, this.estimator.stake.bind(this.estimator));

    const source = params.source || publicKeyHash;
    const prepared = await this.prepare.stake({ ...params, ...estimate });
    const content = prepared.opOb.contents.find(
      (op) => op.kind === OpKind.TRANSACTION
    ) as OperationContentsTransaction;

    const opBytes = await this.forge(prepared);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new TransactionOperation(hash, content, source, forgedBytes, opResponse, context);
  }

  /**
   *
   * @description Unstake the given amount. If "everything" is given as amount, unstakes everything from the staking balance.
   * Unstaked tez remains frozen for a set amount of cycles (the slashing period) after the operation. Once this period is over,
   * the operation "finalize unstake" must be called for the funds to appear in the liquid balance.
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param Unstake pseudo-operation parameter
   */
  async unstake(params: UnstakeParams) {
    const sourceValidation = validateAddress(params.source ?? '');
    if (params.source && sourceValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.source, sourceValidation);
    }

    if (!params.to) {
      params.to = params.source;
    }

    if (params.to && params.to !== params.source) {
      throw new InvalidStakingAddressError(params.to);
    }

    if (params.amount < 0) {
      throw new InvalidAmountError(params.amount.toString());
    }
    const publicKeyHash = await this.signer.publicKeyHash();
    const estimate = await this.estimate(params, this.estimator.unstake.bind(this.estimator));

    const source = params.source || publicKeyHash;
    const prepared = await this.prepare.unstake({ ...params, ...estimate });
    const content = prepared.opOb.contents.find(
      (op) => op.kind === OpKind.TRANSACTION
    ) as OperationContentsTransaction;

    const opBytes = await this.forge(prepared);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new TransactionOperation(hash, content, source, forgedBytes, opResponse, context);
  }

  /**
   *
   * @description Transfer all the finalizable unstaked funds of the source to their liquid balance
   * @returns An operation handle with the result from the rpc node
   *
   * @param Finalize_unstake pseudo-operation parameter
   */
  async finalizeUnstake(params: FinalizeUnstakeParams) {
    const sourceValidation = validateAddress(params.source ?? '');
    if (params.source && sourceValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.source, sourceValidation);
    }

    if (!params.to) {
      params.to = params.source;
    }

    if (!params.amount) {
      params.amount = 0;
    }
    if (params.amount !== undefined && params.amount > 0) {
      throw new InvalidFinalizeUnstakeAmountError('Amount must be 0 to finalize unstake.');
    }

    const publicKeyHash = await this.signer.publicKeyHash();
    const estimate = await this.estimate(
      params,
      this.estimator.finalizeUnstake.bind(this.estimator)
    );

    const source = params.source || publicKeyHash;
    const prepared = await this.prepare.finalizeUnstake({ ...params, ...estimate });
    const content = prepared.opOb.contents.find(
      (op) => op.kind === OpKind.TRANSACTION
    ) as OperationContentsTransaction;

    const opBytes = await this.forge(prepared);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new TransactionOperation(hash, content, source, forgedBytes, opResponse, context);
  }

  /**
   *
   * @description Transfer Tickets to a smart contract address
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param TransferTicketParams operation parameter
   */
  async transferTicket(params: TransferTicketParams) {
    const destinationValidation = validateAddress(params.destination);
    if (destinationValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.destination, destinationValidation);
    }
    const sourceValidation = validateAddress(params.source ?? '');
    if (params.source && sourceValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.source, sourceValidation);
    }

    const publicKeyHash = await this.signer.publicKeyHash();
    const source = params.source ?? publicKeyHash;

    const estimate = await this.estimate(
      params,
      this.estimator.transferTicket.bind(this.estimator)
    );

    const prepared = await this.prepare.transferTicket({ ...params, ...estimate });
    const content = prepared.opOb.contents.find(
      (op) => op.kind === OpKind.TRANSFER_TICKET
    ) as OperationContentsTransferTicket;

    const opBytes = await this.forge(prepared);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new TransferTicketOperation(hash, content, source, forgedBytes, opResponse, context);
  }

  /**
   *
   * @description Reveal the public key of the current address. Will throw an error if the address is already revealed.
   * @remarks Reveal tz4 address is not included in the current beta release for protocol Seoul (still a work in progress)
   * @returns An operation handle with the result from the rpc node
   *
   * @param RevealParams operation parameter
   */
  async reveal(params: RevealParams) {
    const publicKeyHash = await this.signer.publicKeyHash();
    const estimateReveal = await this.estimator.reveal(params);
    if (estimateReveal) {
      const estimated = await this.estimate(params, async () => estimateReveal);
      const prepared = await this.prepare.reveal({ ...params, ...estimated });
      const content = prepared.opOb.contents.find(
        (op) => op.kind === OpKind.REVEAL
      ) as OperationContentsReveal;
      const opBytes = await this.forge(prepared);
      const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
      return new RevealOperation(hash, content, publicKeyHash, forgedBytes, opResponse, context);
    } else {
      throw new RevealOperationError(
        `The publicKeyHash '${publicKeyHash}' has already been revealed.`
      );
    }
  }

  /**
   *
   * @description Register a Micheline expression in a global table of constants. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param params registerGlobalConstant operation parameter
   */
  async registerGlobalConstant(params: RegisterGlobalConstantParams) {
    const publicKeyHash = await this.signer.publicKeyHash();
    const estimate = await this.estimate(
      params,
      this.estimator.registerGlobalConstant.bind(this.estimator)
    );

    const prepared = await this.prepare.registerGlobalConstant({ ...params, ...estimate });
    const content = prepared.opOb.contents.find(
      (op) => op.kind === OpKind.REGISTER_GLOBAL_CONSTANT
    ) as OperationContentsRegisterGlobalConstant;
    const opBytes = await this.forge(prepared);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new RegisterGlobalConstantOperation(
      hash,
      content,
      publicKeyHash,
      forgedBytes,
      opResponse,
      context
    );
  }

  /**
   *
   * @description Increase the paid storage of a smart contract
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param params increasePaidStorage operation parameter
   */
  async increasePaidStorage(params: IncreasePaidStorageParams) {
    if (params.amount < 0) {
      throw new InvalidAmountError(params.amount.toString());
    }
    const publicKeyHash = await this.signer.publicKeyHash();
    const estimate = await this.estimate(
      params,
      this.estimator.increasePaidStorage.bind(this.estimator)
    );

    const prepared = await this.prepare.increasePaidStorage({ ...params, ...estimate });
    const content = prepared.opOb.contents.find(
      (op) => op.kind === OpKind.INCREASE_PAID_STORAGE
    ) as OperationContentsIncreasePaidStorage;
    const opBytes = await this.forge(prepared);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new IncreasePaidStorageOperation(
      hash,
      content,
      publicKeyHash,
      forgedBytes,
      opResponse,
      context
    );
  }

  /**
   *
   * @description Transfers the spendable balance of the delegate to destination when consensus_key is the active consensus key of delegate
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param params drainDelegate operation parameter
   */
  async drainDelegate(params: DrainDelegateParams) {
    const prepared = await this.prepare.drainDelegate(params);
    const content = prepared.opOb.contents.find(
      (op) => op.kind === OpKind.DRAIN_DELEGATE
    ) as OperationContentsDrainDelegate;
    const opBytes = await this.forge(prepared);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new DrainDelegateOperation(hash, content, forgedBytes, opResponse, context);
  }

  /**
   *
   * @description Submit a ballot vote to a specified proposal
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param BallotParams Ballot operation parameter
   */
  async ballot(params: BallotParams) {
    const publicKeyHash = await this.signer.publicKeyHash();
    const sourceValidation = validateAddress(params.source ?? '');
    if (params.source && sourceValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.source, sourceValidation);
    }
    const source = params.source ?? publicKeyHash;

    const prepared = await this.prepare.ballot({ ...params, source });
    const content = prepared.opOb.contents.find(
      (op) => op.kind === OpKind.BALLOT
    ) as OperationContentsBallot;

    const opBytes = await this.forge(prepared);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new BallotOperation(hash, content, publicKeyHash, forgedBytes, opResponse, context);
  }

  /**
   *
   * @description Submit or upvote a proposal during the Proposal period
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param ProposalsParams Proposals operation parameter
   */
  async proposals(params: ProposalsParams) {
    const publicKeyHash = await this.signer.publicKeyHash();
    const sourceValidation = validateAddress(params.source ?? '');
    if (params.source && sourceValidation !== ValidationResult.VALID) {
      throw new InvalidAddressError(params.source, sourceValidation);
    }
    const source = params.source ?? publicKeyHash;

    const prepared = await this.prepare.proposals({ ...params, source });
    const content = prepared.opOb.contents.find(
      (op) => op.kind === OpKind.PROPOSALS
    ) as OperationContentsProposals;
    const opBytes = await this.forge(prepared);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new ProposalsOperation(hash, content, publicKeyHash, forgedBytes, opResponse, context);
  }

  /**
   *
   * @description Updates the consensus key of the baker to public_key starting from the current cycle plus PRESERVED_CYCLES + 1
   * @remarks updateConsensusKey to a tz4 address is not included in the current beta release for protocol Seoul (still a work in progress)
   * @returns An operation handle with the result from the rpc node
   *
   * @param UpdateConsensusKeyParams
   */
  async updateConsensusKey(params: UpdateConsensusKeyParams) {
    const publicKeyHash = await this.signer.publicKeyHash();
    const estimate = await this.estimate(
      params,
      this.estimator.updateConsensusKey.bind(this.estimator)
    );

    const prepared = await this.prepare.updateConsensusKey({ ...params, ...estimate });
    const content = prepared.opOb.contents.find(
      (op) => op.kind === OpKind.UPDATE_CONSENSUS_KEY
    ) as OperationContentsUpdateConsensusKey;
    const opBytes = await this.forge(prepared);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new UpdateConsensusKeyOperation(
      hash,
      content,
      publicKeyHash,
      forgedBytes,
      opResponse,
      context
    );
  }

  /**
   * @description Adds messages to the rollup inbox that can be executed/claimed after it gets cemented
   * @param SmartRollupAddMessagesParams
   * @returns An operation handle with results from the RPC node
   */
  async smartRollupAddMessages(params: SmartRollupAddMessagesParams) {
    const publicKeyHash = await this.signer.publicKeyHash();
    const estimate = await this.estimate(
      params,
      this.estimator.smartRollupAddMessages.bind(this.estimator)
    );

    const prepared = await this.prepare.smartRollupAddMessages({ ...params, ...estimate });
    const content = prepared.opOb.contents.find(
      (op) => op.kind === OpKind.SMART_ROLLUP_ADD_MESSAGES
    ) as OperationContentsSmartRollupAddMessages;
    const opBytes = await this.forge(prepared);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);

    return new SmartRollupAddMessagesOperation(
      hash,
      content,
      publicKeyHash,
      forgedBytes,
      opResponse,
      context
    );
  }

  /**
   * @description Creates a smart rollup originate operation
   * @param SmartRollupOriginateParams
   * @returns An operation handle with results from the RPC node
   */
  async smartRollupOriginate(params: SmartRollupOriginateParams) {
    const publicKeyHash = await this.signer.publicKeyHash();
    const estimate = await this.estimate(
      params,
      this.estimator.smartRollupOriginate.bind(this.estimator)
    );

    const prepared = await this.prepare.smartRollupOriginate({ ...params, ...estimate });
    const content = prepared.opOb.contents.find(
      (op) => op.kind === OpKind.SMART_ROLLUP_ORIGINATE
    ) as OperationContentsSmartRollupOriginate;

    const opBytes = await this.forge(prepared);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);

    return new SmartRollupOriginateOperation(
      hash,
      content,
      publicKeyHash,
      forgedBytes,
      opResponse,
      context
    );
  }

  /**
   * @description Execute a message from a smart rollup's outbox of a cemented commitment
   * @param SmartRollupExecuteOutboxMessageParams
   * @returns An operation handle with results from the RPC node
   */
  async smartRollupExecuteOutboxMessage(params: SmartRollupExecuteOutboxMessageParams) {
    const publicKeyHash = await this.signer.publicKeyHash();
    const estimate = await this.estimate(
      params,
      this.estimator.smartRollupExecuteOutboxMessage.bind(this.estimator)
    );

    const prepared = await this.prepare.smartRollupExecuteOutboxMessage({ ...params, ...estimate });
    const content = prepared.opOb.contents.find(
      (op) => op.kind === OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE
    ) as OperationContentsSmartRollupExecuteOutboxMessage;
    const opBytes = await this.forge(prepared);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);

    return new SmartRollupExecuteOutboxMessageOperation(
      hash,
      content,
      publicKeyHash,
      forgedBytes,
      opResponse,
      context
    );
  }

  /**
   *
   * @description A failing_noop operation that is guaranteed to fail.
   *
   * @returns A FailingNoopOperation object representing the signed failing_noop operation
   *
   * @param params failingNoop operation parameter
   */
  async failingNoop(params: FailingNoopParams): Promise<FailingNoopOperation> {
    const op: OperationContentsFailingNoop = {
      kind: OpKind.FAILING_NOOP,
      arbitrary: params.arbitrary,
    };
    const hash = await this.context.readProvider.getBlockHash(params.basedOnBlock);

    const forged = await this.context.forger.forge({
      branch: hash,
      contents: [op],
    });
    const { prefixSig } = await this.signer.sign(forged, new Uint8Array([3]));
    return {
      signature: prefixSig,
      bytes: forged,
      signedContent: {
        branch: hash,
        contents: [
          {
            kind: OpKind.FAILING_NOOP,
            arbitrary: params.arbitrary,
          },
        ],
      },
    };
  }

  /**
   *
   * @description Create an smart contract abstraction for the address specified.
   *
   * @param address Smart contract address
   * @throws {@link InvalidContractAddressError}
   */
  async at<T extends DefaultContractType = DefaultContractType>(
    address: string,
    contractAbstractionComposer: ContractAbstractionComposer<T> = (x) => x as any
  ): Promise<T> {
    const addressValidation = validateContractAddress(address);
    if (addressValidation !== ValidationResult.VALID) {
      throw new InvalidContractAddressError(address, addressValidation);
    }
    const rpc = this.context.withExtensions().rpc;
    const readProvider = this.context.withExtensions().readProvider;
    const script = await readProvider.getScript(address, 'head');
    const entrypoints = await readProvider.getEntrypoints(address);
    const abs = new ContractAbstraction(
      address,
      script,
      this,
      this,
      entrypoints,
      rpc,
      readProvider
    );
    return contractAbstractionComposer(abs, this.context);
  }

  /**
   *
   * @description Batch a group of operation together. Operations will be applied in the order in which they are added to the batch
   *
   * @returns A batch object from which we can add more operation or send a command to execute the batch
   *
   * @param params List of operation to batch together
   */
  batch(params?: ParamsWithKind[]) {
    const batch = new OperationBatch(this.context, this.estimator);

    if (Array.isArray(params)) {
      batch.with(params);
    }

    return batch;
  }
}

type ContractAbstractionComposer<T> = (
  abs: ContractAbstraction<ContractProvider>,
  context: Context
) => T;
