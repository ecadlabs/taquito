import { exporter, ReadableStorage } from 'ipfs-unixfs-exporter';
import { CID } from 'multiformats/cid';
import { base16, base16upper } from 'multiformats/bases/base16';
import { base32, base32upper } from 'multiformats/bases/base32';
import { base36, base36upper } from 'multiformats/bases/base36';
import { base58btc } from 'multiformats/bases/base58';
import CryptoJS from 'crypto-js';
import { InvalidUriError, MetadataHashMismatchError } from '../errors';

export const MAX_IPFS_BLOCK_BYTES = 2 * 1024 * 1024;
export const MAX_IPFS_METADATA_BYTES = 32 * 1024 * 1024;
const MAX_BLOCK_READS = 1024;
const SHA256_CODE = 0x12;
const SHA512_CODE = 0x13;

const cidDecoder = base32.decoder
  .or(base32upper.decoder)
  .or(base58btc.decoder)
  .or(base36.decoder)
  .or(base36upper.decoder)
  .or(base16.decoder)
  .or(base16upper.decoder);

function checkCid(cid: CID) {
  if (cid.code !== 0x55 && cid.code !== 0x70) {
    throw new Error(`Unsupported IPFS CID codec ${cid.code}`);
  }
  if (cid.multihash.code !== SHA256_CODE && cid.multihash.code !== SHA512_CODE) {
    throw new Error(`Unsupported IPFS CID hash algorithm ${cid.multihash.code}`);
  }
  const digestLength = cid.multihash.code === SHA256_CODE ? 32 : 64;
  if (cid.multihash.size !== digestLength) {
    throw new Error(`Unsupported IPFS CID digest length ${cid.multihash.size}`);
  }
}

export function parseIpfsLocation(location: string): { root: string; path: string[] } {
  try {
    if (!location.startsWith('//')) throw new Error('Missing IPFS authority');
    const [authority, ...segments] = location.slice(2).split('/');
    const root = CID.parse(authority, cidDecoder);
    const path = segments.filter(Boolean).map((segment) => decodeURIComponent(segment));
    // The exporter interprets slashes and backslashes as path syntax, not filenames.
    if (path.some((segment) => /[/\\]/.test(segment) || segment === '.' || segment === '..')) {
      throw new Error('Invalid IPFS path');
    }
    checkCid(root);
    return { root: root.toString(), path };
  } catch {
    throw new InvalidUriError(`ipfs:${location}`);
  }
}

/** Only verified blocks enter the UnixFS decoder, including directory and HAMT links. */
export async function readVerifiedIpfsFile(
  root: string,
  path: string[],
  fetchBlock: (cid: string) => Promise<Uint8Array>,
  signal: AbortSignal
): Promise<string> {
  const verified = new Map<string, Uint8Array>();
  let reads = 0;
  let downloadedBytes = 0;
  const storage: ReadableStorage = {
    async *get(cid) {
      signal.throwIfAborted();
      if (++reads > MAX_BLOCK_READS)
        throw new Error('IPFS metadata exceeds the block traversal limit');
      checkCid(cid);
      const key = cid.toV1().toString();
      const cached = verified.get(key);
      if (cached) {
        yield cached;
        return;
      }
      const block = await fetchBlock(cid.toString());
      signal.throwIfAborted();
      downloadedBytes += block.byteLength;
      if (downloadedBytes > MAX_IPFS_METADATA_BYTES)
        throw new Error('IPFS metadata exceeds the download limit');
      const words = CryptoJS.lib.WordArray.create(block);
      const hash = (cid.multihash.code === SHA256_CODE ? CryptoJS.SHA256 : CryptoJS.SHA512)(
        words
      ).toString(CryptoJS.enc.Hex);
      const expectedHash = base16.encode(cid.multihash.digest).slice(1);
      if (hash !== expectedHash) {
        throw new MetadataHashMismatchError(cid.toString(), expectedHash, hash);
      }
      verified.set(key, block);
      yield block;
    },
  };

  const requestedPath = [root, ...path].join('/');
  let entry = await exporter(requestedPath, storage, { signal });
  // The upstream resolver can consume a trailing segment without traversing it.
  if (entry.path !== requestedPath) throw new Error('IPFS metadata path was not fully resolved');
  if (entry.type !== 'raw' && entry.type !== 'file')
    throw new Error('IPFS metadata must resolve to a file');
  if (entry.size < 0n || entry.size > BigInt(MAX_IPFS_METADATA_BYTES))
    throw new Error('IPFS metadata exceeds the file size limit');
  const bytes = new Uint8Array(Number(entry.size));
  let offset = 0;
  const pending: { cid: CID; size: bigint }[] = [];
  // Read decoded nodes sequentially. The exporter's content iterator leaves rejected
  // child-queue promises unhandled when a deeper block fails to load.
  for (;;) {
    signal.throwIfAborted();
    if (entry.type !== 'raw' && entry.type !== 'file')
      throw new Error('IPFS file contains a non-file block');
    const data = entry.type === 'raw' ? entry.node : entry.unixfs.data;
    if (data) {
      if (data.byteLength > bytes.byteLength - offset)
        throw new Error('IPFS file exceeds its declared size');
      bytes.set(data, offset);
      offset += data.byteLength;
    }
    if (entry.type === 'file') {
      if (entry.unixfs.type !== 'file' && entry.unixfs.type !== 'raw')
        throw new Error('Unsupported UnixFS file type');
      const links = entry.node.Links;
      const sizes = entry.unixfs.blockSizes;
      if (links.length !== sizes.length || pending.length + links.length > MAX_BLOCK_READS)
        throw new Error('Invalid or excessive IPFS file links');
      if (
        sizes.some((size) => size < 0n) ||
        sizes.reduce((sum, size) => sum + size, BigInt(data?.byteLength ?? 0)) !== entry.size
      )
        throw new Error('Inconsistent IPFS file size');
      for (let i = links.length - 1; i >= 0; i--)
        pending.push({ cid: links[i].Hash, size: sizes[i] });
    }
    const next = pending.pop();
    if (!next) break;
    entry = await exporter(next.cid.toString(), storage, { signal });
    if (entry.size !== next.size) throw new Error('Inconsistent IPFS child file size');
  }
  signal.throwIfAborted();
  if (offset !== bytes.byteLength) throw new Error('IPFS file is incomplete');
  // Decode after reassembly: a UTF-8 character can span several UnixFS blocks.
  return new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
}
