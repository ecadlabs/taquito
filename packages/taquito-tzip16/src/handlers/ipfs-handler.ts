import { HttpBackend, HttpTimeoutError } from '@taquito/http-utils';
import { ContractAbstraction, ContractProvider, Wallet, Context } from '@taquito/taquito';
import { Handler, Tzip16Uri } from '../metadata-provider';
import {
  InvalidContractMetadataError,
  IpfsGatewayError,
  MetadataHashMismatchError,
} from '../errors';
import { calculateSHA256Hash } from '../tzip16-utils';
import { MAX_IPFS_BLOCK_BYTES, parseIpfsLocation, readVerifiedIpfsFile } from './ipfs-metadata';

const DEFAULT_GATEWAYS = ['ipfs.filebase.io', 'gateway.pinata.cloud'];

/**
 * Handler for retrieving and verifying TZIP-16 contract metadata over HTTPS IPFS gateways.
 *
 * By default, tries the public gateways `ipfs.filebase.io` and `gateway.pinata.cloud` in order
 * with a 10-second per-gateway deadline. Public gateways are best-effort and may rate-limit or
 * time out; for production applications, configure a paid IPFS gateway service with an SLA or
 * a self-hosted HTTPS IPFS gateway supporting raw block retrieval (`?format=raw`).
 */
export class IpfsHttpHandler implements Handler {
  private readonly gateways: readonly string[];
  public readonly integrityVerified = true;
  public httpBackend = new HttpBackend();

  /**
   * @param ipfsGateway - Optional HTTPS gateway hostname (without `https://` or `/ipfs/`). For production, use a paid gateway service with an SLA or a self-hosted HTTPS IPFS gateway. When omitted, falls back across the default public gateways.
   * @param timeout - Total deadline in milliseconds for each gateway, including all block and body reads (default `10000`).
   */
  constructor(
    ipfsGateway?: string,
    private readonly timeout = 10000
  ) {
    if (!Number.isFinite(timeout) || timeout <= 0)
      throw new RangeError('IPFS gateway timeout must be positive');
    this.gateways = ipfsGateway ? [ipfsGateway] : DEFAULT_GATEWAYS;
  }

  async getMetadata(
    _contractAbstraction: ContractAbstraction<ContractProvider | Wallet>,
    { location, sha256hash }: Tzip16Uri,
    _context: Context
  ): Promise<string> {
    const { root, path } = parseIpfsLocation(location);
    const errors: Error[] = [];
    const uri = `ipfs:${location}`;
    for (const gateway of this.gateways) {
      const controller = new AbortController();
      let url = `https://${gateway}/ipfs/${root}?format=raw`;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const deadline = Date.now() + this.timeout;
      const timedOut = new Promise<never>((_resolve, reject) => {
        timer = setTimeout(() => {
          reject(new HttpTimeoutError(this.timeout, url));
          controller.abort();
        }, this.timeout);
      });
      try {
        const metadata = await Promise.race([
          readVerifiedIpfsFile(
            root,
            path,
            async (cid) => {
              url = `https://${gateway}/ipfs/${cid}?format=raw`;
              // Decoding can exhaust the budget before the timer callback runs.
              const remaining = deadline - Date.now();
              if (remaining <= 0) throw new HttpTimeoutError(this.timeout, url);
              return this.httpBackend.createRequestBytes(
                {
                  url,
                  method: 'GET',
                  headers: {
                    Accept: 'application/vnd.ipld.raw',
                    'Content-Type': 'text/plain; charset=utf-8',
                  },
                  timeout: remaining,
                  signal: controller.signal,
                },
                MAX_IPFS_BLOCK_BYTES
              );
            },
            controller.signal
          ),
          timedOut,
        ]);
        // Both commitments and JSON parsing are inside the attempt so failures try the next gateway.
        if (sha256hash !== undefined) {
          const actualHash = calculateSHA256Hash(metadata);
          if (sha256hash.toLowerCase() !== actualHash)
            throw new MetadataHashMismatchError(uri, sha256hash, actualHash);
        }
        try {
          JSON.parse(metadata.replace(/^\uFEFF/, ''));
        } catch {
          const error = new InvalidContractMetadataError(metadata);
          error.message = `Unable to parse verified metadata from ${uri} as JSON.`;
          throw error;
        }
        return metadata;
      } catch (error) {
        const failure = error instanceof Error ? error : new Error(String(error));
        const guidance =
          `IPFS metadata retrieval failed at ${url}. ` +
          `Public IPFS gateways are best-effort and may rate-limit or time out; for production, configure a paid gateway service with an SLA or a self-hosted HTTPS IPFS gateway with IpfsHttpHandler('your-gateway-hostname').`;
        failure.message = `${guidance} ${failure.message}`;
        errors.push(failure);
      } finally {
        clearTimeout(timer);
        // Stop exporter prefetch work before starting a different gateway.
        controller.abort();
      }
    }
    if (this.gateways.length === 1) throw errors[0];
    throw new IpfsGatewayError(errors);
  }
}
