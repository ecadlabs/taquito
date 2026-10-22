import { createServer } from 'node:http';
import vectors from './detached-signing-vectors.json';

export async function fixtureServer() {
  const requests: { path: string; body: unknown }[] = [];
  let revealed = true;
  const vector = vectors.vectors[0];
  const server = createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    const path = req.url ?? '';
    requests.push({ path, body: body ? JSON.parse(body) : undefined });
    let value: unknown;
    if (path.endsWith('/constants'))
      value = {
        hard_gas_limit_per_operation: '1040000',
        hard_gas_limit_per_block: '5200000',
        hard_storage_limit_per_operation: '60000',
        cost_per_byte: '250',
        minimal_block_delay: '1',
        origination_size: 257,
      };
    else if (path.endsWith('/protocols'))
      value = { protocol: vector.protocol, next_protocol: vector.protocol };
    else if (path.endsWith('/header')) value = { hash: vector.operation.branch, level: 1 };
    else if (path.endsWith('/manager_key')) value = revealed ? vector.publicKey : null;
    else if (path.endsWith('/balance')) value = '100000000';
    else if (path.endsWith('/chain_id')) value = 'NetXdQprcVkpaWU';
    else if (path.includes('/context/contracts/')) value = { balance: '100000000', counter: '0' };
    else if (path.includes('/mempool/filter')) value = {};
    else {
      res.statusCode = 404;
      value = { path };
    }
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(value));
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Missing fixture server address');
  return {
    url: `http://127.0.0.1:${address.port}`,
    requests,
    setRevealed(value: boolean) {
      revealed = value;
    },
    close: () =>
      new Promise<void>((resolve, reject) => server.close((e) => (e ? reject(e) : resolve()))),
  };
}
