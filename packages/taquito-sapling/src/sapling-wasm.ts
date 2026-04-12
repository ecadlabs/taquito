import { Buffer } from 'buffer';

type GlobalWithBuffer = typeof globalThis & {
  Buffer?: typeof Buffer;
};

const globalWithBuffer = globalThis as GlobalWithBuffer;

if (typeof globalWithBuffer.Buffer === 'undefined') {
  globalWithBuffer.Buffer = Buffer;
}

export * from '@taquito/sapling-wasm';
