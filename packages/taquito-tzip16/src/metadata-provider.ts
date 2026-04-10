import { ContractAbstraction, ContractProvider, Wallet, Context } from '@taquito/taquito';
import { MetadataInterface } from './metadata-interface';
import { MetadataContext } from './tzip16-contract-abstraction';
import { InvalidContractMetadataError, InvalidUriError, ProtocolNotSupportedError } from './errors';
import { calculateSHA256Hash } from './tzip16-utils';

export interface MetadataProviderInterface {
  provideMetadata(
    contractAbstraction: ContractAbstraction<ContractProvider | Wallet>,
    uri: string,
    context: MetadataContext
  ): Promise<MetadataEnvelope>;
}

export interface MetadataEnvelope {
  uri: string;
  integrityCheckResult?: boolean;
  sha256Hash?: string;
  metadata: MetadataInterface;
}
export interface Handler {
  getMetadata(
    contractAbstraction: ContractAbstraction<ContractProvider | Wallet>,
    uri: Tzip16Uri,
    context: Context
  ): Promise<string>;
}

export interface Tzip16Uri {
  sha256hash: string | undefined;
  protocol: string;
  location: string;
}

const SHA256_PREFIX = 'sha256://0x';
const SUPPORTED_PROTOCOLS = new Set(['http', 'https', 'ipfs', 'tezos-storage']);

/**
 \* Metadata Provider
 */
export class MetadataProvider implements MetadataProviderInterface {
  constructor(private handlers: Map<string, Handler>) {}

  /**
   * Fetch the metadata by using the appropriate handler based on the protcol found in the URI
   * @returns an object which contains the uri, the metadata, an optional integrity check result and an optional SHA256 hash
   * @param contractAbstraction the contract abstraction which contains the URI in its storage
   * @param uri the decoded uri found in the storage
   * @param context the TezosToolkit Context
   */
  async provideMetadata(
    contractAbstraction: ContractAbstraction<ContractProvider | Wallet>,
    uri: string,
    context: Context
  ): Promise<MetadataEnvelope> {
    const uriInfo = this.extractProtocolInfo(uri);
    if (!uriInfo || !uriInfo.location) {
      throw new InvalidUriError(uri);
    }

    const handler = this.handlers.get(uriInfo.protocol);
    if (!handler) {
      throw new ProtocolNotSupportedError(uriInfo.protocol);
    }

    const metadata = await handler.getMetadata(contractAbstraction, uriInfo, context);
    const sha256Hash = calculateSHA256Hash(metadata);
    let metadataJSON;
    try {
      metadataJSON = JSON.parse(metadata);
    } catch (ex) {
      throw new InvalidContractMetadataError(metadata);
    }

    return {
      uri,
      metadata: metadataJSON,
      integrityCheckResult: uriInfo.sha256hash ? uriInfo.sha256hash === sha256Hash : undefined,
      sha256Hash: uriInfo.sha256hash ? sha256Hash : undefined,
    };
  }

  private extractProtocolInfo(_uri: string) {
    let uri = _uri;
    let sha256hash: string | undefined;

    if (uri.startsWith(SHA256_PREFIX)) {
      const sha256EndIndex = uri.indexOf('/', SHA256_PREFIX.length);
      if (sha256EndIndex === -1) {
        return;
      }

      sha256hash = uri.slice(SHA256_PREFIX.length, sha256EndIndex);
      uri = uri.slice(sha256EndIndex + 1);
    }

    const protocolSeparatorIndex = uri.indexOf(':');
    if (protocolSeparatorIndex === -1) {
      return;
    }

    const protocol = uri.slice(0, protocolSeparatorIndex);
    if (!SUPPORTED_PROTOCOLS.has(protocol)) {
      return;
    }

    return {
      sha256hash,
      protocol,
      location: uri.slice(protocolSeparatorIndex + 1),
    };
  }
}
