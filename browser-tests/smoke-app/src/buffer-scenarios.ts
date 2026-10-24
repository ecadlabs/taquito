import {
  bufferOperation,
  expectedBufferOperation,
  bufferControl,
  expectedBufferControl,
  signingBytes,
  signingSignature,
} from './buffer-fixtures';
const assertNoGlobalBuffer = () => {
  if ('Buffer' in globalThis) throw new Error('A global Buffer would hide the browser regression');
};

const scenarios: Record<
  string,
  () => Promise<{ exports: string[]; summary: Record<string, unknown> }>
> = {
  'remote-signer-buffer-behavior': async () => {
    assertNoGlobalBuffer();
    const { RemoteSigner } = await import('@taquito/remote-signer');
    assertNoGlobalBuffer();
    const posts: unknown[] = [];
    const nativeFetch = globalThis.fetch;
    globalThis.fetch = async (_input, init) => {
      if (init?.method === 'POST') {
        if (typeof init.body !== 'string')
          throw new Error('Expected the actual JSON HTTP request body');
        posts.push(JSON.parse(init.body));
        return Response.json({ signature: signingSignature });
      }
      return Response.json({
        public_key: 'edpkuAhkJ81xGyf4PcmRMHLSaQGbDEpkGhNbcjNVnKWKR8kqkgQR3f',
      });
    };
    try {
      const signer = new RemoteSigner(
        'tz1iD5nmudc4QtfNW14WWaiP7JEDuUHnbXuv',
        'https://signer.invalid'
      );
      const original = signingBytes.slice(2);
      const signed = await signer.sign(original, new Uint8Array([3]));
      const alreadyWatermarked = await signer.sign(signingBytes);
      let tamperedRejected = false;
      try {
        await signer.sign(original + '00', new Uint8Array([3]));
      } catch (error) {
        if (!(error instanceof Error) || error.name !== 'SignatureVerificationFailedError')
          throw error;
        tamperedRejected = true;
      }
      if (!tamperedRejected) throw new Error('The signer accepted a signature for different bytes');
      assertNoGlobalBuffer();
      return {
        exports: ['RemoteSigner'],
        summary: {
          signed,
          alreadyWatermarked,
          posts,
        },
      };
    } finally {
      globalThis.fetch = nativeFetch;
    }
  },

  'local-forging-buffer-control': async () => {
    assertNoGlobalBuffer();
    const { LocalForger } = await import('@taquito/local-forging');
    const bytes = await new LocalForger().forge(bufferControl);
    if (bytes !== expectedBufferControl) throw new Error('Ordinary transfer bytes changed');
    assertNoGlobalBuffer();
    return { exports: ['LocalForger'], summary: { bytes } };
  },
  'local-forging-buffer-behavior': async () => {
    assertNoGlobalBuffer();
    const { LocalForger } = await import('@taquito/local-forging');
    assertNoGlobalBuffer();
    const forger = new LocalForger();
    const bytes = await forger.forge(bufferOperation);
    if (bytes !== expectedBufferOperation)
      throw new Error('Forged bytes differ from the Octez fixture');
    const decoded = await forger.parse(expectedBufferOperation);
    assertNoGlobalBuffer();
    return { exports: ['LocalForger'], summary: { bytes, decoded } };
  },
};

export async function runBufferScenario(name: string) {
  const scenario = scenarios[name];
  if (!scenario) throw new Error('Unknown buffer scenario');
  return scenario();
}
