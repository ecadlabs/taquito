import { RpcClientInterface, OperationContents } from '@taquito/rpc';
import { Context } from '../context';
import { RPCOpWithFee, RPCOriginationOperation, RPCTransferOperation } from '../operations';
import { Preparation, PreparedOperation } from './interface';

export class PrepareProvider implements Preparation {
  #counters: { [key: string]: number };
  // context: Context
  constructor(protected context: Context) {
    this.#counters = {};
    // this.context = context;
  }

  get rpc(): RpcClientInterface {
    return this.context.rpc;
  }

  get signer() {
    return this.context.signer;
  }

  private async getPkh() {
    return await this.context.signer.publicKeyHash();
  }

  private async getBlockHash() {
    return this.context.readProvider.getBlockHash('head~2');
  }

  private async getProtocolHash() {
    return this.context.readProvider.getNextProtocol('head');
  }

  private async getHeadCounter(pkh: string): Promise<string | undefined> {
    // const pkh = await this.signer.publicKeyHash();
    return this.context.readProvider.getCounter(pkh, 'head');
  }

  private async checkAndUpdateCounter(pkh: string) {
    const headCounter = await this.getHeadCounter(pkh);

    // assign 0 to counter if it has no operations yet
    const counter = parseInt(headCounter ?? '0', 10);
    if (!this.#counters[pkh] || this.#counters[pkh] < counter) {
      this.#counters[pkh] = counter;
    }

    return ++this.#counters[pkh];
  }

  private async getFee(op: RPCOpWithFee, pkh: string) {
    // const pkh = await this.getPkh()

    // const headCounter = await this.getHeadCounter(pkh);

    // // TODO: figure out if should bring counter out to each operation instead

    // // assign 0 to counter if it has no operations yet
    // const counter = parseInt(headCounter ?? '0', 10)
    // if (!this.#counters[pkh] || this.#counters[pkh] < counter) {
    //   this.#counters[pkh] = counter;
    // }
    const opCounter = this.checkAndUpdateCounter(pkh);

    return {
      counter: `${opCounter}`,
      fee: typeof op.fee === 'undefined' ? '0' : `${op.fee}`,
      gas_limit: typeof op.gas_limit === 'undefined' ? '0' : `${op.gas_limit}`,
      storage_limit: typeof op.storage_limit === 'undefined' ? '0' : `${op.storage_limit}`,
    };
  }

  async originate(op: RPCOriginationOperation, source?: string): Promise<PreparedOperation> {
    // TODO: CHECK REVEAL OP
    const pkh = await this.signer.publicKeyHash();
    const balance = typeof op.balance !== 'undefined' ? `${op.balance}` : '0';
    const checkedSource = { source: typeof op.source === 'undefined' ? source || pkh : op.source };

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();
    const fee = await this.getFee(op, pkh);

    // TODO: possibly write updateCounter() instead for consistency instead of using getFee()
    const contents = [
      {
        ...op,
        balance,
        ...checkedSource,
        ...fee,
      },
    ] as OperationContents[];

    const counter = this.#counters[pkh];

    return {
      opOb: {
        branch: hash,
        contents,
        protocol,
      },
      counter,
    };
  }

  async transaction(op: RPCTransferOperation, source?: string): Promise<PreparedOperation> {
    const pkh = await this.signer.publicKeyHash();
    const amount = typeof op.amount !== 'undefined' ? `${op.amount}` : '0';
    const checkedSource = { source: typeof op.source === 'undefined' ? source || pkh : op.source };

    const hash = await this.getBlockHash();
    const protocol = await this.getProtocolHash();
    const fee = await this.getFee(op, pkh);

    const contents = [
      {
        ...op,
        amount,
        ...checkedSource,
        ...fee,
      },
    ] as OperationContents[];

    const counter = this.#counters[pkh];

    return {
      opOb: {
        branch: hash,
        contents,
        protocol,
      },
      counter,
    };
  }

  // async reveal(op: RPCRevealOperation, source?: string): Promise<PreparedOperation> {
  //   const pkh = await this.signer.publicKeyHash();

  //   const hash

  // }
}
