import {
  TrezorSigner,
  HDPathTemplate,
  TrezorNotInitializedError,
  TrezorPublicKeyRetrievalError,
  TrezorActionRejectedError,
  TrezorSigningError,
} from '../src/taquito-trezor-signer';
import { InvalidDerivationPathError, ProhibitedActionError } from '@taquito/core';
import { LocalForger } from '@taquito/local-forging';
import { OpKind } from '@taquito/rpc';

// Mock functions
const mockInit = jest.fn().mockResolvedValue(undefined);
const mockDispose = jest.fn();
const mockTezosGetAddress = jest.fn();
const mockTezosGetPublicKey = jest.fn();
const mockTezosSignTransaction = jest.fn();

// Mock @trezor/connect-web
jest.mock('@trezor/connect-web', () => ({
  __esModule: true,
  default: {
    init: (...args: unknown[]) => mockInit(...args),
    dispose: () => mockDispose(),
    tezosGetAddress: (...args: unknown[]) => mockTezosGetAddress(...args),
    tezosGetPublicKey: (...args: unknown[]) => mockTezosGetPublicKey(...args),
    tezosSignTransaction: (...args: unknown[]) => mockTezosSignTransaction(...args),
  },
}));

describe('TrezorSigner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the initialized state by calling dispose
    TrezorSigner.dispose();
  });

  describe('HDPathTemplate', () => {
    it('should generate correct derivation paths', () => {
      expect(HDPathTemplate(0)).toBe("m/44'/1729'/0'");
      expect(HDPathTemplate(1)).toBe("m/44'/1729'/1'");
      expect(HDPathTemplate(5)).toBe("m/44'/1729'/5'");
      expect(HDPathTemplate(100)).toBe("m/44'/1729'/100'");
    });
  });

  describe('constructor', () => {
    it('should accept valid derivation paths', () => {
      expect(() => new TrezorSigner("m/44'/1729'/0'")).not.toThrow();
      expect(() => new TrezorSigner("m/44'/1729'/1'")).not.toThrow();
      expect(() => new TrezorSigner("m/44'/1729'/999'")).not.toThrow();
    });

    it('should throw InvalidDerivationPathError for invalid paths', () => {
      expect(() => new TrezorSigner("44'/1729'/0'")).toThrow(InvalidDerivationPathError);
      expect(() => new TrezorSigner("m/44'/1729'/0'/0'")).toThrow(InvalidDerivationPathError);
      expect(() => new TrezorSigner("m/44'/60'/0'")).toThrow(InvalidDerivationPathError);
      expect(() => new TrezorSigner('invalid')).toThrow(InvalidDerivationPathError);
    });

    it('should use default path when none provided', () => {
      const signer = new TrezorSigner();
      expect(signer).toBeInstanceOf(TrezorSigner);
    });
  });

  describe('init', () => {
    it('should initialize Trezor Connect', async () => {
      await TrezorSigner.init({ appName: 'Test App', appUrl: 'https://test.com' });

      expect(mockInit).toHaveBeenCalledWith(
        expect.objectContaining({
          manifest: {
            appUrl: 'https://test.com',
            email: 'info@ecadlabs.com',
            appName: 'Test App',
          },
          lazyLoad: false,
        })
      );
      expect(TrezorSigner.isInitialized()).toBe(true);
    });

    it('should use default appUrl when not provided', async () => {
      await TrezorSigner.init({});

      expect(mockInit).toHaveBeenCalledWith(
        expect.objectContaining({
          manifest: {
            appUrl: 'https://taquito.io',
            email: 'info@ecadlabs.com',
            appName: 'Taquito',
          },
        })
      );
    });

    it('should not re-initialize if already initialized', async () => {
      await TrezorSigner.init();
      await TrezorSigner.init();

      expect(mockInit).toHaveBeenCalledTimes(1);
    });
  });

  describe('dispose', () => {
    it('should dispose Trezor Connect and reset initialized state', async () => {
      await TrezorSigner.init();
      expect(TrezorSigner.isInitialized()).toBe(true);

      TrezorSigner.dispose();

      expect(mockDispose).toHaveBeenCalled();
      expect(TrezorSigner.isInitialized()).toBe(false);
    });

    it('should do nothing if not initialized', () => {
      TrezorSigner.dispose();
      expect(mockDispose).not.toHaveBeenCalled();
    });
  });

  describe('publicKeyHash', () => {
    const mockAddress = 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb';
    const mockPublicKey = 'edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn';

    beforeEach(async () => {
      await TrezorSigner.init();
    });

    it('should return the address from Trezor', async () => {
      mockTezosGetAddress.mockResolvedValue({
        success: true,
        payload: {
          address: mockAddress,
          path: [2147483692, 2147485377, 2147483648],
          serializedPath: "m/44'/1729'/0'",
        },
      });
      mockTezosGetPublicKey.mockResolvedValue({
        success: true,
        payload: {
          publicKey: mockPublicKey,
          path: [2147483692, 2147485377, 2147483648],
          serializedPath: "m/44'/1729'/0'",
        },
      });

      const signer = new TrezorSigner();
      const address = await signer.publicKeyHash();

      expect(address).toBe(mockAddress);
      expect(mockTezosGetAddress).toHaveBeenCalledWith({
        path: "m/44'/1729'/0'",
        showOnTrezor: true,
      });
    });

    it('should cache the address after first retrieval', async () => {
      mockTezosGetAddress.mockResolvedValue({
        success: true,
        payload: {
          address: mockAddress,
          path: [2147483692, 2147485377, 2147483648],
          serializedPath: "m/44'/1729'/0'",
        },
      });
      mockTezosGetPublicKey.mockResolvedValue({
        success: true,
        payload: {
          publicKey: mockPublicKey,
          path: [2147483692, 2147485377, 2147483648],
          serializedPath: "m/44'/1729'/0'",
        },
      });

      const signer = new TrezorSigner();
      await signer.publicKeyHash();
      await signer.publicKeyHash();

      expect(mockTezosGetAddress).toHaveBeenCalledTimes(1);
    });

    it('should throw TrezorNotInitializedError if not initialized', async () => {
      TrezorSigner.dispose();
      const signer = new TrezorSigner();

      await expect(signer.publicKeyHash()).rejects.toThrow(TrezorNotInitializedError);
    });

    it('should throw TrezorPublicKeyRetrievalError on failure', async () => {
      mockTezosGetAddress.mockResolvedValue({
        success: false,
        payload: { error: 'Device disconnected' },
      });

      const signer = new TrezorSigner();

      await expect(signer.publicKeyHash()).rejects.toThrow(TrezorPublicKeyRetrievalError);
    });

    it('should throw TrezorActionRejectedError when user cancels', async () => {
      mockTezosGetAddress.mockResolvedValue({
        success: false,
        payload: { error: 'Action cancelled', code: 'Failure_ActionCancelled' },
      });

      const signer = new TrezorSigner();

      await expect(signer.publicKeyHash()).rejects.toThrow(TrezorActionRejectedError);
    });

    it('should respect showOnTrezor parameter', async () => {
      mockTezosGetAddress.mockResolvedValue({
        success: true,
        payload: {
          address: mockAddress,
          path: [2147483692, 2147485377, 2147483648],
          serializedPath: "m/44'/1729'/0'",
        },
      });
      mockTezosGetPublicKey.mockResolvedValue({
        success: true,
        payload: {
          publicKey: mockPublicKey,
          path: [2147483692, 2147485377, 2147483648],
          serializedPath: "m/44'/1729'/0'",
        },
      });

      const signer = new TrezorSigner("m/44'/1729'/0'", false);
      await signer.publicKeyHash();

      expect(mockTezosGetAddress).toHaveBeenCalledWith({
        path: "m/44'/1729'/0'",
        showOnTrezor: false,
      });
    });
  });

  describe('secretKey', () => {
    it('should throw ProhibitedActionError', async () => {
      const signer = new TrezorSigner();

      await expect(signer.secretKey()).rejects.toThrow(ProhibitedActionError);
    });
  });

  describe('sign', () => {
    // We'll generate valid forged bytes using LocalForger
    let forgedTransferOp: string;

    beforeAll(async () => {
      const forger = new LocalForger();
      // Create a simple transaction operation
      const operation = {
        branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
        contents: [
          {
            kind: OpKind.TRANSACTION as const,
            source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
            fee: '10000',
            counter: '1',
            gas_limit: '10',
            storage_limit: '10',
            amount: '1000000',
            destination: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
          },
        ],
      };
      forgedTransferOp = await forger.forge(operation);
    });

    beforeEach(async () => {
      await TrezorSigner.init();
    });

    it('should sign a transaction and return signature data', async () => {
      // Mock signature from Trezor (64 bytes = 128 hex chars)
      const mockSigHex = 'a'.repeat(128);
      const mockSignature =
        'edsigtXomBKi5CTRf5cjATJWSyaRvhfYNHqSUGrn4SdbYRcGwQrUGjzEfQDTuqHhuA8b2d8NarZjz8TRf65WkpQmo423BtomS8Q';

      mockTezosSignTransaction.mockResolvedValue({
        success: true,
        payload: {
          signature: mockSignature,
          sig_op_contents: forgedTransferOp + mockSigHex,
          operation_hash: 'ooSomething',
        },
      });

      const signer = new TrezorSigner();
      const result = await signer.sign(forgedTransferOp);

      expect(result).toHaveProperty('bytes');
      expect(result).toHaveProperty('sig');
      expect(result).toHaveProperty('prefixSig');
      expect(result).toHaveProperty('sbytes');
      expect(result.prefixSig).toBe(mockSignature);
      expect(mockTezosSignTransaction).toHaveBeenCalled();
    });

    it('should throw TrezorNotInitializedError if not initialized', async () => {
      TrezorSigner.dispose();
      const signer = new TrezorSigner();

      await expect(signer.sign(forgedTransferOp)).rejects.toThrow(TrezorNotInitializedError);
    });

    it('should throw TrezorSigningError on Trezor failure', async () => {
      mockTezosSignTransaction.mockResolvedValue({
        success: false,
        payload: { error: 'Signing failed' },
      });

      const signer = new TrezorSigner();

      await expect(signer.sign(forgedTransferOp)).rejects.toThrow(TrezorSigningError);
    });

    it('should throw TrezorActionRejectedError when user cancels', async () => {
      mockTezosSignTransaction.mockResolvedValue({
        success: false,
        payload: { error: 'Action cancelled', code: 'Failure_ActionCancelled' },
      });

      const signer = new TrezorSigner();

      await expect(signer.sign(forgedTransferOp)).rejects.toThrow(TrezorActionRejectedError);
    });

    it('should throw TrezorSigningError for invalid operation bytes', async () => {
      const signer = new TrezorSigner();

      await expect(signer.sign('invalid')).rejects.toThrow(TrezorSigningError);
    });

    it('should throw TrezorSigningError with clear message for unparseable bytes', async () => {
      const signer = new TrezorSigner();
      // 'invalid' is not valid hex, which will cause LocalForger.parse to fail
      // This tests the error message when bytes can't be parsed as a forged operation
      await expect(signer.sign('invalid')).rejects.toThrow(
        /Trezor can only sign Tezos operations, not arbitrary payloads/
      );
    });
  });
});
