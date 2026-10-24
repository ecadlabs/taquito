import { Operation } from '../operations/operations';
import {
  flattenErrors,
  TezosOperationError,
  TezosPreapplyFailureError,
} from '../operations/errors';
import { hasMetadataWithResult, hasMetadataWithInternalOperationResult } from '../operations/types';
import { blake2b } from '@noble/hashes/blake2.js';
import {
  b58DecodeAndCheckPrefix,
  buf2hex,
  hex2buf,
  PrefixV2,
  verifySignature,
} from '@taquito/utils';
import { PreparedOperation } from './interface';
import { detachedSignatureEncoding, copyOperationData } from './detached-envelope';
import { Context } from '../context';
import {
  DetachedIdentity,
  validateDetachedIdentity,
  detachedRevealParams,
} from './detached-identity';
import { PrepareProvider } from './prepare-provider';
import { RPCEstimateProvider } from '../estimate/rpc-estimate-provider';
import { ParamsWithKind, OpKind, RevealParams } from '../operations/types';

function isApplied(value: unknown): boolean {
  return (
    typeof value === 'object' && value !== null && 'status' in value && value.status === 'applied'
  );
}

/** Process-local snapshot. Use the creating workflow to attach a signature. */
export interface DetachedSignableOperation {
  readonly unsignedBytes: string;
  readonly watermark: '03';
  readonly watermarkedBytes: string;
  readonly blake2bDigest: string;
  readonly scheme: ReturnType<typeof detachedSignatureEncoding>['scheme'];
  /** BLS signs watermarked bytes; the other schemes sign their Blake2b digest. */
  readonly signingInput: 'watermarked-bytes' | 'blake2b-digest';
}

export type DetachedBatchParams = Extract<
  ParamsWithKind,
  {
    kind: OpKind.TRANSACTION | OpKind.DELEGATION | OpKind.ORIGINATION;
  }
>;

export interface DetachedSignedOperation {
  readonly signedBytes: string;
  readonly signature: string;
}

/** Public-key preparation and estimation, isolated from toolkit provider changes. */
export class DetachedSigningWorkflow {
  readonly #signables = new WeakMap<DetachedSignableOperation, PreparedOperation>();
  readonly #submissions = new WeakMap<DetachedSignedOperation, Promise<Operation>>();
  readonly #signed = new WeakMap<DetachedSignedOperation, PreparedOperation>();
  private readonly context: Context;
  private readonly identity: Readonly<DetachedIdentity>;
  readonly prepare;
  readonly estimate;

  constructor(context: Context, identity: DetachedIdentity) {
    this.identity = validateDetachedIdentity(identity);
    this.context = context.createDetachedContext();
    const prepare = new PrepareProvider(this.context, this.identity);
    const estimate = new RPCEstimateProvider(this.context, this.identity);
    this.prepare = Object.freeze({
      transaction: (params: Parameters<PrepareProvider['transaction']>[0]) =>
        prepare.transaction(this.source(params)),
      delegation: (params: Parameters<PrepareProvider['delegation']>[0]) =>
        prepare.delegation(this.source(params)),
      originate: (params: Parameters<PrepareProvider['originate']>[0]) =>
        prepare.originate(this.source(params)),
      reveal: (params: RevealParams = {}) =>
        prepare.reveal(detachedRevealParams(this.identity, params)),
      batch: (params: DetachedBatchParams[]) => prepare.batch(this.batch(params)),
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
      batch: (params: DetachedBatchParams[]) => estimate.batch(this.batch(params)),
      contractCall: (method: Parameters<RPCEstimateProvider['contractCall']>[0]) =>
        estimate.transfer(this.source(method.toTransferParams())),
    });
  }

  /** Forge a private snapshot. Subsequent edits to prepared cannot change it. */
  async toSignable(prepared: PreparedOperation): Promise<DetachedSignableOperation> {
    const snapshot = copyOperationData({ opOb: prepared.opOb, counter: prepared.counter });
    if (!snapshot.opOb.contents.length) throw new Error('Detached operation cannot be empty');
    for (const content of snapshot.opOb.contents) {
      switch (content.kind) {
        case OpKind.TRANSACTION:
        case OpKind.ORIGINATION:
        case OpKind.DELEGATION:
          this.source(content);
          break;
        case OpKind.REVEAL:
          this.source(content);
          if (content.public_key !== this.identity.publicKey)
            throw new Error('Reveal key differs from detached identity');
          detachedRevealParams(this.identity, { proof: content.proof });
          if (content.proof !== this.identity.proof)
            throw new Error('Reveal must contain the identity proof');
          break;
        default:
          throw new Error('Unsupported detached operation kind');
      }
      if (content.source !== this.identity.pkh)
        throw new Error('Operation source differs from detached identity');
    }
    const unsignedBytes = await this.context.forger.forge(
      copyOperationData({
        branch: snapshot.opOb.branch,
        contents: snapshot.opOb.contents,
      })
    );
    if (!/^(?:[0-9a-fA-F]{2})+$/.test(unsignedBytes))
      throw new Error('Forger returned invalid operation bytes');
    const watermarkedBytes = `03${unsignedBytes}`;
    const encoding = detachedSignatureEncoding(this.identity.pkh);
    const signable: DetachedSignableOperation = Object.freeze({
      unsignedBytes,
      watermark: '03',
      watermarkedBytes,
      blake2bDigest: buf2hex(blake2b(hex2buf(watermarkedBytes), { dkLen: 32 })),
      scheme: encoding.scheme,
      signingInput: encoding.scheme === 'bls' ? 'watermarked-bytes' : 'blake2b-digest',
    });
    this.#signables.set(signable, snapshot);
    return signable;
  }

  /** Attach a Base58Check signature without changing the approved bytes. */
  attachSignature(signable: DetachedSignableOperation, signature: string): DetachedSignedOperation {
    const snapshot = this.#signables.get(signable);
    if (!snapshot) throw new Error('Signable operation belongs to another workflow');
    const encoding = detachedSignatureEncoding(this.identity.pkh);
    const [bytes] = b58DecodeAndCheckPrefix(
      signature,
      encoding.size === 64 ? [encoding.prefix, PrefixV2.GenericSignature] : [encoding.prefix]
    );
    if (
      this.identity.publicKey !== undefined &&
      !verifySignature(signable.watermarkedBytes, this.identity.publicKey, signature)
    )
      throw new Error('Signature does not match the detached operation');
    const signed = Object.freeze({
      signedBytes: `${signable.unsignedBytes}${encoding.tag}${buf2hex(bytes)}`,
      signature,
    });
    this.#signed.set(signed, snapshot);
    return signed;
  }

  /** Preapply and inject once. Repeated calls return the same attempt. */
  inject(signed: DetachedSignedOperation): Promise<Operation> {
    const snapshot = this.#signed.get(signed);
    if (!snapshot) return Promise.reject(new Error('Signed operation belongs to another workflow'));
    const previous = this.#submissions.get(signed);
    if (previous) return previous;
    const submission = Promise.resolve().then(() => this.submit(signed, snapshot));
    this.#submissions.set(signed, submission);
    return submission;
  }

  private async submit(
    signed: DetachedSignedOperation,
    snapshot: PreparedOperation
  ): Promise<Operation> {
    const results = await this.context.rpc.preapplyOperations([
      { ...copyOperationData(snapshot.opOb), signature: signed.signature },
    ]);
    if (
      !Array.isArray(results) ||
      results.length !== 1 ||
      !Array.isArray(results[0]?.contents) ||
      results[0].contents.length !== snapshot.opOb.contents.length
    ) {
      throw new TezosPreapplyFailureError(results);
    }
    const errors = flattenErrors(results);
    if (errors.length)
      throw new TezosOperationError(
        errors,
        'Detached operation preapplication failed',
        results[0].contents
      );
    for (const content of results[0].contents) {
      if (!hasMetadataWithResult(content) || !isApplied(content.metadata.operation_result)) {
        throw new TezosPreapplyFailureError(results);
      }
      if (hasMetadataWithInternalOperationResult(content)) {
        const internal = content.metadata.internal_operation_results;
        if (
          !Array.isArray(internal) ||
          internal.some(
            (operation: unknown) =>
              typeof operation !== 'object' ||
              operation === null ||
              !('result' in operation) ||
              !isApplied(operation.result)
          )
        )
          throw new TezosPreapplyFailureError(results);
      }
    }
    const hash = await this.context.injector.inject(signed.signedBytes);
    const rpc = this.context.rpc;
    if ('deleteAllCachedData' in rpc && typeof rpc.deleteAllCachedData === 'function')
      rpc.deleteAllCachedData();
    return new Operation(
      hash,
      {
        opbytes: signed.signedBytes,
        opOb: { ...copyOperationData(snapshot.opOb), signature: signed.signature },
        counter: snapshot.counter,
      },
      copyOperationData(results[0].contents),
      this.context
    );
  }

  private source<T extends object>(params: T): T {
    if ('source' in params && params.source !== undefined && params.source !== this.identity.pkh) {
      throw new Error('Operation source differs from detached identity');
    }
    return params;
  }

  private batch(params: DetachedBatchParams[]): ParamsWithKind[] {
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
