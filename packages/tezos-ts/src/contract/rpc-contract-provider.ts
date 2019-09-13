import {
  ContractProvider,
  ContractSchema,
  OriginateParams,
  OriginationOperation,
  PrepareOperationParams,
  TransferParams,
  TransferOperation,
  DelegateOperation,
  DelegateParams,
  ForgedBytes,
  RevealOperation,
} from './interface';
import { Schema, ParameterSchema } from '@tezos-ts/michelson-encoder';
import { ml2mic, sexp2mic } from '@tezos-ts/utils';
import { format } from '../format';
import { Context } from '../context';
import { Operation } from './operations';
import { BlockResponse } from '@tezos-ts/rpc';
import { Contract } from './contract';
import { DEFAULT_FEE, DEFAULT_GAS_LIMIT, DEFAULT_STORAGE_LIMIT } from './constants';

export class RpcContractProvider implements ContractProvider {
  constructor(private context: Context) {}

  get rpc() {
    return this.context.rpc;
  }

  get signer() {
    return this.context.signer;
  }

  /**
   *
   * @description Return a well formatted json object of the contract storage
   *
   * @param contract contract address you want to get the storage from
   * @param schema optional schema can either be the contract script rpc response or a michelson-encoder schema
   *
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id-script
   */
  async getStorage<T>(contract: string, schema?: ContractSchema): Promise<T> {
    if (!schema) {
      schema = await this.rpc.getScript(contract);
    }

    let contractSchema: Schema;
    if (schema instanceof Schema) {
      contractSchema = schema;
    } else {
      contractSchema = Schema.fromRPCResponse({ script: schema });
    }

    const storage = await this.rpc.getStorage(contract);

    return contractSchema.Execute(storage) as T; // Cast into T because only the caller can know the true type of the storage
  }

  /**
   *
   * @description Return a well formatted json object of the contract big map storage
   *
   * @param contract contract address you want to get the storage from
   * @param key contract big map key to fetch value from
   * @param schema optional schema can either be the contract script rpc response or a michelson-encoder schema
   *
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id-script
   */
  async getBigMapKey<T>(contract: string, key: string, schema?: ContractSchema): Promise<T> {
    if (!schema) {
      schema = await this.rpc.getScript(contract);
    }

    let contractSchema: Schema;
    if (schema instanceof Schema) {
      contractSchema = schema;
    } else {
      contractSchema = Schema.fromRPCResponse({ script: schema });
    }

    const encodedKey = contractSchema.EncodeBigMapKey(key);

    const val = await this.rpc.getBigMapKey(contract, encodedKey);

    return contractSchema.ExecuteOnBigMapValue(val) as T; // Cast into T because only the caller can know the true type of the storage
  }

  private async prepareOperation({
    operation,
    source,
  }: PrepareOperationParams): Promise<ForgedBytes> {
    let counter;
    const counters: { [key: string]: number } = {};
    const promises: any[] = [];
    let requiresReveal = false;
    let ops: PrepareOperationParams['operation'][] = [];
    let head: BlockResponse;

    promises.push(this.rpc.getBlockHeader());

    if (Array.isArray(operation)) {
      ops = [...operation];
    } else {
      ops = [operation];
    }

    const publicKeyHash = source || (await this.signer.publicKeyHash());

    for (let i = 0; i < ops.length; i++) {
      if (['transaction', 'origination', 'delegation'].includes(ops[i].kind)) {
        requiresReveal = true;
        const { counter } = await this.rpc.getContract(publicKeyHash);
        promises.push(Promise.resolve(counter));
        promises.push(this.rpc.getManagerKey(publicKeyHash));
        break;
      }
    }

    promises.push(this.rpc.getBlockMetadata());

    return Promise.all(promises).then(
      async ([header, headCounter, manager, metadata]: any[]): Promise<any> => {
        head = header;

        const managerKey = manager.key;
        if (requiresReveal && !managerKey) {
          const reveal: RevealOperation = {
            kind: 'reveal',
            fee: DEFAULT_FEE.REVEAL,
            public_key: await this.signer.publicKey(),
            source: publicKeyHash,
            gas_limit: DEFAULT_GAS_LIMIT.REVEAL,
            storage_limit: DEFAULT_STORAGE_LIMIT.REVEAL,
          };

          ops.unshift(reveal);
        }

        counter = parseInt(headCounter, 10);
        if (!counters[publicKeyHash] || counters[publicKeyHash] < counter) {
          counters[publicKeyHash] = counter;
        }

        const constructOps = (cOps: PrepareOperationParams['operation'][]) =>
          cOps.map((op: any) => {
            // @ts-ignore
            const constructedOp = { ...op };
            if (['transaction', 'origination', 'delegation'].includes(op.kind)) {
              if (typeof op.source === 'undefined') {
                constructedOp.source = publicKeyHash;
              }
            }
            if (['reveal', 'transaction', 'origination', 'delegation'].includes(op.kind)) {
              if (typeof op.fee === 'undefined') {
                constructedOp.fee = '0';
              } else {
                constructedOp.fee = `${op.fee}`;
              }
              if (typeof op.gas_limit === 'undefined') {
                constructedOp.gas_limit = '0';
              } else {
                constructedOp.gas_limit = `${op.gas_limit}`;
              }
              if (typeof op.storage_limit === 'undefined') {
                constructedOp.storage_limit = '0';
              } else {
                constructedOp.storage_limit = `${op.storage_limit}`;
              }
              if (typeof op.balance !== 'undefined') {
                constructedOp.balance = `${constructedOp.balance}`;
              }
              if (typeof op.amount !== 'undefined') {
                constructedOp.amount = `${constructedOp.amount}`;
              }
              const opCounter = ++counters[publicKeyHash];
              constructedOp.counter = `${opCounter}`;
            }
            return constructedOp;
          });

        const branch = head.hash;
        const contents = constructOps(ops);
        const protocol = metadata.nextProtocol;

        let remoteForgedBytes = await this.rpc.forgeOperations({ branch, contents });

        return {
          opbytes: remoteForgedBytes,
          opOb: {
            branch,
            contents,
            protocol,
          },
          counter,
        };
      }
    );
  }

  private async signAndInject(forgedBytes: ForgedBytes) {
    const signed = await this.signer.sign(forgedBytes.opbytes, new Uint8Array([3]));
    forgedBytes.opbytes = signed.sbytes;
    forgedBytes.opOb.signature = signed.prefixSig;

    const opResponse: any[] = [];
    let errors: any[] = [];

    const results = await this.rpc.preapplyOperations([forgedBytes.opOb]);

    if (!Array.isArray(results)) {
      throw new Error(`RPC Fail: ${JSON.stringify(results)}`);
    }
    for (let i = 0; i < results.length; i++) {
      for (let j = 0; j < results[i].contents.length; j++) {
        opResponse.push(results[i].contents[j]);
        const content = results[i].contents[j];
        if (
          'metadata' in content &&
          typeof content.metadata.operation_result !== 'undefined' &&
          content.metadata.operation_result.status === 'failed'
        ) {
          errors = errors.concat(content.metadata.operation_result.errors);
        }
      }
    }

    if (errors.length) {
      // @ts-ignore
      throw new Error(JSON.stringify({ error: 'Operation Failed', errors }));
    }

    return new Operation(
      await this.rpc.injectOperation(forgedBytes.opbytes),
      forgedBytes,
      opResponse,
      this.context.clone()
    );
  }

  async at(address: string): Promise<any> {
    let script = await this.rpc.getScript(address);

    let contractSchema: Schema = Schema.fromRPCResponse({ script });
    let parameterSchema: ParameterSchema = ParameterSchema.fromRPCResponse({ script });

    return new Contract(address, contractSchema, parameterSchema, this);
  }

  /**
   *
   * @description Originate a new contract according to the script in parameters. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param OriginationOperation Originate operation parameter
   */
  async originate({
    code,
    init,
    balance = '0',
    spendable = false,
    delegatable = false,
    delegate,
    fee = DEFAULT_FEE.ORIGINATION,
    gasLimit = DEFAULT_GAS_LIMIT.ORIGINATION,
    storageLimit = DEFAULT_STORAGE_LIMIT.ORIGINATION,
  }: OriginateParams) {
    const script = {
      code: Array.isArray(code) ? code : ml2mic(code),
      storage: typeof init === 'object' ? init : sexp2mic(init),
    };

    const publicKeyHash = await this.signer.publicKeyHash();
    const operation: OriginationOperation = {
      kind: 'origination',
      fee,
      gas_limit: gasLimit,
      storage_limit: storageLimit,
      balance: format('tz', 'mutez', balance).toString(),
      manager_pubkey: publicKeyHash,
      spendable,
      delegatable,
      script,
    };

    if (delegate) {
      operation.delegate = delegate;
    }

    const opBytes = await this.prepareOperation({ operation, source: publicKeyHash });
    return this.signAndInject(opBytes);
  }

  /**
   *
   * @description Set the delegate for a contract. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param SetDelegate operation parameter
   */
  async setDelegate({
    delegate,
    source,
    fee = DEFAULT_FEE.DELEGATION,
    gasLimit = DEFAULT_GAS_LIMIT.DELEGATION,
    storageLimit = DEFAULT_STORAGE_LIMIT.DELEGATION,
  }: DelegateParams) {
    const operation: DelegateOperation = {
      kind: 'delegation',
      source,
      fee,
      gas_limit: gasLimit,
      storage_limit: storageLimit,
      delegate,
    };
    const opBytes = await this.prepareOperation({
      operation,
      source: source || (await this.signer.publicKeyHash()),
    });
    return this.signAndInject(opBytes);
  }

  /**
   *
   * @description Register the current address as delegate. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param RegisterDelegate operation parameter
   */
  async registerDelegate({
    fee = DEFAULT_FEE.DELEGATION,
    gasLimit = DEFAULT_GAS_LIMIT.DELEGATION,
    storageLimit = DEFAULT_STORAGE_LIMIT.DELEGATION,
  }: any) {
    const operation: DelegateOperation = {
      kind: 'delegation',
      fee,
      gas_limit: gasLimit,
      storage_limit: storageLimit,
      delegate: await this.signer.publicKeyHash(),
    };
    const opBytes = await this.prepareOperation({ operation });
    return this.signAndInject(opBytes);
  }

  /**
   *
   * @description Transfer tz from current address to a specific address. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param Transfer operation parameter
   */
  async transfer({
    to,
    source,
    amount,
    parameter,
    fee = DEFAULT_FEE.TRANSFER,
    gasLimit = DEFAULT_GAS_LIMIT.TRANSFER,
    storageLimit = DEFAULT_STORAGE_LIMIT.TRANSFER,
    mutez = false,
    rawParam = false,
  }: TransferParams) {
    const operation: TransferOperation = {
      kind: 'transaction',
      fee,
      gas_limit: gasLimit,
      storage_limit: storageLimit,
      amount: mutez ? amount.toString() : format('tz', 'mutez', amount).toString(),
      destination: to,
    };
    if (parameter) {
      operation.parameters = rawParam ? parameter : sexp2mic(parameter);
    }

    const opBytes = await this.prepareOperation({ operation, source });
    return this.signAndInject(opBytes);
  }
}
