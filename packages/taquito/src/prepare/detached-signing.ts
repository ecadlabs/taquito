import { Context } from '../context';
import {
  DetachedIdentity,
  validateDetachedIdentity,
  detachedRevealParams,
} from './detached-identity';
import { PrepareProvider } from './prepare-provider';
import { RPCEstimateProvider } from '../estimate/rpc-estimate-provider';
import { ParamsWithKind, OpKind, RevealParams } from '../operations/types';

/** Public-key preparation and estimation, isolated from toolkit provider changes. */
export class DetachedSigningWorkflow {
  private readonly identity: Readonly<DetachedIdentity>;
  readonly prepare;
  readonly estimate;

  constructor(
    private readonly context: Context,
    identity: DetachedIdentity
  ) {
    this.identity = validateDetachedIdentity(identity);
    const prepare = new PrepareProvider(context, this.identity);
    const estimate = new RPCEstimateProvider(context, this.identity);
    this.prepare = Object.freeze({
      transaction: (params: Parameters<PrepareProvider['transaction']>[0]) =>
        prepare.transaction(this.source(params)),
      delegation: (params: Parameters<PrepareProvider['delegation']>[0]) =>
        prepare.delegation(this.source(params)),
      originate: (params: Parameters<PrepareProvider['originate']>[0]) =>
        prepare.originate(this.source(params)),
      reveal: (params: RevealParams = {}) =>
        prepare.reveal(detachedRevealParams(this.identity, params)),
      batch: (params: ParamsWithKind[]) => prepare.batch(this.batch(params)),
      contractCall: (method: Parameters<PrepareProvider['contractCall']>[0]) =>
        prepare.transaction(this.source(method.toTransferParams())),
    });
    this.estimate = Object.freeze({
      transfer: (params: Parameters<RPCEstimateProvider['transfer']>[0]) =>
        estimate.transfer(this.source(params)),
      setDelegate: (params: Parameters<RPCEstimateProvider['setDelegate']>[0]) =>
        estimate.setDelegate(this.source(params)),
      originate: (params: Parameters<RPCEstimateProvider['originate']>[0]) =>
        estimate.originate(this.source(params)),
      reveal: (params: RevealParams = {}) =>
        estimate.reveal(detachedRevealParams(this.identity, params)),
      batch: (params: ParamsWithKind[]) => estimate.batch(this.batch(params)),
      contractCall: (method: Parameters<RPCEstimateProvider['contractCall']>[0]) =>
        estimate.transfer(this.source(method.toTransferParams())),
    });
  }

  private source<T extends object>(params: T): T {
    if ('source' in params && params.source !== undefined && params.source !== this.identity.pkh) {
      throw new Error('Operation source differs from detached identity');
    }
    return params;
  }

  private batch(params: ParamsWithKind[]): ParamsWithKind[] {
    if (params.length === 0) throw new Error('Detached operation batch cannot be empty');
    return params.map((param) => {
      switch (param.kind) {
        case OpKind.TRANSACTION:
        case OpKind.DELEGATION:
          return this.source(param);
        case OpKind.ORIGINATION:
          return this.source(param);
        default:
          throw new Error('Unsupported detached operation kind');
      }
    });
  }
}
