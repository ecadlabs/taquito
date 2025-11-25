import {
  TrezorSigner,
  HDPathTemplate,
  TrezorNotInitializedError,
  TrezorPublicKeyRetrievalError,
  TrezorActionRejectedError,
} from '../src/taquito-trezor-signer';
import { InvalidDerivationPathError, ProhibitedActionError } from '@taquito/core';

// Mock functions
const mockInit = jest.fn().mockResolvedValue(undefined);
const mockDispose = jest.fn();
const mockTezosGetAddress = jest.fn();

// Mock @trezor/connect-web
jest.mock('@trezor/connect-web', () => ({
  __esModule: true,
  default: {
    init: (...args: unknown[]) => mockInit(...args),
    dispose: () => mockDispose(),
    tezosGetAddress: (...args: unknown[]) => mockTezosGetAddress(...args),
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

      expect(mockInit).toHaveBeenCalledWith({
        manifest: {
          appUrl: 'https://test.com',
          email: 'info@ecadlabs.com',
          appName: 'Test App',
        },
        lazyLoad: false,
      });
      expect(TrezorSigner.isInitialized()).toBe(true);
    });

    it('should use default appUrl when not provided', async () => {
      await TrezorSigner.init({});

      expect(mockInit).toHaveBeenCalledWith({
        manifest: {
          appUrl: 'https://taquito.io',
          email: 'info@ecadlabs.com',
          appName: 'Taquito',
        },
        lazyLoad: false,
      });
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
    beforeEach(async () => {
      await TrezorSigner.init();
    });

    it('should throw error indicating signing is not implemented', async () => {
      const signer = new TrezorSigner();

      await expect(signer.sign('050000')).rejects.toThrow(
        'Transaction signing not yet implemented in this prototype'
      );
    });
  });
});
