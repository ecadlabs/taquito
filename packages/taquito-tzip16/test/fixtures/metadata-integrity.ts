import { Context, ContractAbstraction } from '@taquito/taquito';
import fixtures from './ipfs-integrity.json';

export { fixtures };

export function metadataContract() {
  const context = new Context('https://rpc.example.com');
  const contract = new ContractAbstraction(
    'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton',
    {
      code: [
        { prim: 'parameter', args: [{ prim: 'unit' }] },
        { prim: 'storage', args: [{ prim: 'unit' }] },
        { prim: 'code', args: [[]] },
      ],
      storage: { prim: 'Unit' },
    },
    context.contract,
    context.contract,
    { entrypoints: { default: { prim: 'unit' } } },
    context.rpc,
    context.readProvider
  );
  return { context, contract };
}

export interface Block {
  cid: string;
  cidHex: string;
  hex: string;
  links: string[];
}
export const blocks: Block[] = [
  fixtures.raw,
  fixtures.singleV0,
  fixtures.singleV1,
  fixtures.multi,
  fixtures.directory,
  ...fixtures.children,
];

function varint(value: number): Buffer {
  const bytes: number[] = [];
  do {
    const byte = value & 127;
    value = Math.floor(value / 128);
    bytes.push(byte | (value ? 128 : 0));
  } while (value);
  return Buffer.from(bytes);
}

// CARv1 framing only. Block bytes and CIDs are fixed fixtures, never produced
// by the code under test. The header carries the requested root (CBOR tag 42).
function car(root: Block, supplied: Block[]): Buffer {
  const rootBytes = Buffer.concat([Buffer.from([0]), Buffer.from(root.cidHex, 'hex')]);
  const header = Buffer.concat([
    Buffer.from('a265726f6f747381d82a58', 'hex'),
    Buffer.from([rootBytes.length]),
    rootBytes,
    Buffer.from('6776657273696f6e01', 'hex'),
  ]);
  const reachable: Block[] = [];
  const visited = new Set<string>();
  const visit = (cid: string) => {
    if (visited.has(cid)) return;
    visited.add(cid);
    const block = supplied.find((candidate) => candidate.cid === cid);
    // Missing blocks deliberately produce incomplete CARs for rejection tests.
    if (!block) return;
    reachable.push(block);
    block.links.forEach(visit);
  };
  visit(root.cid);
  return Buffer.concat([
    varint(header.length),
    header,
    ...reachable.flatMap((block) => {
      const record = Buffer.concat([
        Buffer.from(block.cidHex, 'hex'),
        Buffer.from(block.hex, 'hex'),
      ]);
      return [varint(record.length), record];
    }),
  ]);
}

/** Serves both trustless transports so tests do not mandate CAR vs block traversal. */
export function gatewayResponse(
  input: string | URL | Request,
  init?: RequestInit,
  supplied: Block[] = blocks,
  legacyBody: string | null = fixtures.metadata
): Response {
  const url = new URL(input instanceof Request ? input.url : input.toString());
  const requestedCid = url.pathname.split('/')[2];
  const requested = blocks.find((block) => block.cid === requestedCid);
  const accept =
    new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined)).get(
      'Accept'
    ) ?? '';
  const format = url.searchParams.get('format');
  if (format === 'car' || accept.includes('application/vnd.ipld.car')) {
    if (!requested) return new Response('Missing root', { status: 404 });
    return new Response(new Uint8Array(car(requested, supplied)), {
      headers: { 'Content-Type': 'application/vnd.ipld.car; version=1' },
    });
  }
  if (format === 'raw' || accept.includes('application/vnd.ipld.raw')) {
    if (url.pathname.split('/').slice(3).some(Boolean)) {
      return new Response('Raw block requests cannot traverse paths', { status: 400 });
    }
    const block = supplied.find((block) => block.cid === requestedCid);
    if (!block) return new Response('Missing block', { status: 404 });
    return new Response(new Uint8Array(Buffer.from(block.hex, 'hex')), {
      headers: { 'Content-Type': 'application/vnd.ipld.raw' },
    });
  }
  return legacyBody === null
    ? new Response('Request raw blocks or CAR', { status: 406 })
    : new Response(legacyBody, { headers: { 'Content-Type': 'application/json' } });
}
