// Regenerate offline with Octez 25.2: node scripts/generate-tz5-fixtures.mjs
// These are disposable test keys. No RPC endpoint or existing client wallet is used.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const protocol = 'PsUshuai9QapM5TGj1JpuVGkdxz5GykdnEvS6Rh8SUVrARvZLCY';
const clientVersion = execFileSync('octez-client', ['--version'], { encoding: 'utf8' }).trim();
if (!clientVersion.startsWith('f6062853 ') || !clientVersion.includes('Octez 25.2 ')) {
  throw new Error(`Expected Octez 25.2 at f6062853, got ${clientVersion}`);
}
const scratch = mkdtempSync(join(tmpdir(), 'taquito-tz5-fixtures-'));
const prefix = ['--base-dir', join(scratch, 'client'), '--mode', 'mockup', '--protocol', protocol];
const client = (args, input) =>
  execFileSync('octez-client', [...prefix, ...args], {
    encoding: 'utf8',
    input,
    maxBuffer: 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe'],
  }).trim();
const rpc = (method, path, body) =>
  JSON.parse(client(['rpc', method, path, ...(body ? ['with', JSON.stringify(body)] : [])]));
const capture = (text, expression) => {
  const match = text.match(expression);
  if (!match) throw new Error(`Missing Octez output matching ${expression}`);
  return match[1];
};
const pack = (value, type) =>
  capture(
    client(['hash', 'data', JSON.stringify(value), 'of', 'type', type]),
    /Raw packed data: 0x(\w+)/
  );
const sign = (message) =>
  capture(client(['sign', 'bytes', `0x${message}`, 'for', 'fixture']), /Signature: (\w+)/);

try {
  client(['create', 'mockup']);
  if (!rpc('get', '/chains/main/blocks/head/context/constants').tz5_account_enable) {
    throw new Error('The reference mockup must enable tz5');
  }
  client(['gen', 'keys', 'fixture', '--sig', 'mldsa44']);
  client(['gen', 'keys', 'other', '--sig', 'mldsa44']);
  const key = client(['show', 'address', 'fixture', '-S']);
  const publicKey = capture(key, /Public Key: (\w+)/);
  const publicKeyHash = capture(key, /Hash: (\w+)/);
  const secretKey = capture(key, /Secret Key: unencrypted:(\w+)/);
  const otherPublicKey = capture(client(['show', 'address', 'other']), /Public Key: (\w+)/);
  const password = 'taquito-tz5-fixture';
  const encryptedSecretKey = capture(
    client(['encrypt', 'secret', 'key'], `${secretKey}\n${password}\n${password}\n`),
    /encrypted:(mdesk\w+)/
  );
  const message = '0123456789';
  const signatures = { plain: sign(message), operation: sign(`03${message}`) };
  const packed = {
    address: pack(publicKeyHash, 'address'),
    keyHash: pack(publicKeyHash, 'key_hash'),
    publicKey: pack(publicKey, 'key'),
    signature: pack(signatures.plain, 'signature'),
  };
  const branch = rpc('get', '/chains/main/blocks/head/hash');
  const reveal = {
    kind: 'reveal',
    source: publicKeyHash,
    fee: '6000',
    counter: '1',
    gas_limit: '2000',
    storage_limit: '0',
    public_key: publicKey,
  };
  const transaction = {
    kind: 'transaction',
    source: publicKeyHash,
    fee: '6000',
    counter: '2',
    gas_limit: '3000',
    storage_limit: '0',
    amount: '1000',
    destination: 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
  };
  const operations = {};
  for (const [name, contents] of Object.entries({
    reveal: [reveal],
    transfer: [transaction],
    batch: [reveal, transaction, { ...transaction, counter: '3', amount: '2000' }],
  })) {
    const unsigned = rpc('post', '/chains/main/blocks/head/helpers/forge/operations', {
      branch,
      contents,
    });
    const signature = sign(`03${unsigned}`);
    const rawSignature = pack(signature, 'signature').slice(12);
    const signed = unsigned + 'ff04' + rawSignature;
    // Have Octez itself parse the complete signature envelope, not just verify a message.
    const parsed = rpc('post', '/chains/main/blocks/head/helpers/parse/operations', {
      operations: [{ branch, data: signed.slice(64) }],
      check_signature: false,
    });
    if (parsed[0].signature !== signature) throw new Error('Octez signature parse mismatch');
    operations[name] = { branch, contents, unsigned, signed, signature };
  }
  const fixture = {
    provenance: { clientVersion, protocol, generator: 'scripts/generate-tz5-fixtures.mjs' },
    publicKey,
    publicKeyHash,
    secretKey,
    encryptedSecretKey,
    password,
    otherPublicKey,
    message,
    signatures,
    packed,
    operations,
  };
  mkdirSync(new URL('../test-fixtures/', import.meta.url), { recursive: true });
  writeFileSync(
    new URL('../test-fixtures/tz5.ts', import.meta.url),
    '// Offline Octez reference vectors. Public test keys, never use for real funds.\n' +
      '// Regenerate with scripts/generate-tz5-fixtures.mjs.\n' +
      `export const tz5 = ${JSON.stringify(fixture, null, 2)};\n`
  );
  console.log('Wrote test-fixtures/tz5.ts; all signed envelopes parsed by Octez.');
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
