// We need to dynamically import Taquito to ensure polyfills are loaded first
// and to catch any module loading errors.

// Import contracts for live code examples
import {
  genericMultisigJSONfile,
  genericMultisig,
  contractMapTacoShop,
  contractMapPairKey,
  contractMap8pairs,
  contractMapBigMap,
  secretKey,
  contractJson,
  contractStorageAnnot,
  contractStorageWithAndWithoutAnnot,
  contractStorageWithoutAnnot,
  managerCode,
} from './contracts';

declare global {
  interface DemoSignerOptions {
    fresh?: boolean;
    minBalanceMutez?: number;
  }

  interface Window {
    Tezos: any;
    TezosToolkit: any;
    InMemorySigner: any;
    BeaconWallet: any;
    wallet: any;
    compose: any;
    Tzip12Module: any;
    tzip12: any;
    Tzip16Module: any;
    tzip16: any;
    bytesToString: any;
    BigNumber: any;
    MichelsonMap: any;
    MichelsonStorageView: any;
    importKey: any;
    UnitValue: any;
    RpcReadAdapter: any;
    stringToBytes: any;
    num2PaddedHex: any;
    SigningType: any;
    Parser: any;
    packDataBytes: any;
    b58Encode: any;
    PrefixV2: any;
    emitMicheline: any;
    getRevealFee: any;
    TransportWebHID: any;
    LedgerSigner: any;
    DerivationType: any;
    HDPathTemplate: any;
    WalletConnect: any;
    NetworkType: any;
    PermissionScopeMethods: any;

    // Contract globals
    genericMultisigJSONfile: any;
    genericMultisig: any;
    contractMapTacoShop: any;
    contractMapPairKey: any;
    contractMap8pairs: any;
    contractMapBigMap: any;
    secretKey: string;
    contractJson: any;
    contractStorageAnnot: any;
    contractStorageWithAndWithoutAnnot: any;
    contractStorageWithoutAnnot: any;
    managerCode: any;
    configureSigner: (options?: DemoSignerOptions) => Promise<string | undefined>;
    connectWallet: () => Promise<string | undefined>;
    __signerConfigured?: boolean;
    __walletConnected?: boolean;
    __taquitoReady?: Promise<void>;
    __taquitoError?: any;
    __taquitoDemoSignerSecretKey__?: string;
    ensureLedgerSupport?: () => Promise<void>;
  }
}

type BrowserGlobalScope = typeof globalThis & {
  Buffer?: typeof import('buffer').Buffer;
  global?: typeof globalThis;
  process?: {
    env?: Record<string, string | undefined>;
  };
};

// Initialize the ready promise immediately
let resolveInit: () => void;
let rejectInit: (err: any) => void;

if (!window.__taquitoReady) {
  window.__taquitoReady = new Promise((resolve, reject) => {
    resolveInit = resolve;
    rejectInit = reject;
  });
}

const installBrowserShims = async () => {
  const browserGlobal = globalThis as BrowserGlobalScope;

  if (!browserGlobal.global) {
    browserGlobal.global = browserGlobal;
  }

  if (!browserGlobal.process) {
    browserGlobal.process = { env: {} };
  } else if (!browserGlobal.process.env) {
    browserGlobal.process.env = {};
  }

  if (!browserGlobal.Buffer) {
    const { Buffer } = await import('buffer');
    browserGlobal.Buffer = Buffer;
  }
};

const KEYGEN_REQUEST_TIMEOUT_MS = 60_000;
const DEFAULT_MIN_DEMO_BALANCE_MUTEZ = 5_000_000;
const DEMO_SIGNER_LOCAL_STORAGE_KEY = 'taquito.docs.demoSignerSecretKey';

const getInjectedDemoSignerKey = () => {
  if (typeof window.__taquitoDemoSignerSecretKey__ === 'string') {
    const injectedKey = window.__taquitoDemoSignerSecretKey__.trim();
    if (injectedKey.length > 0) {
      return injectedKey;
    }
  }

  try {
    const storedKey = window.localStorage.getItem(DEMO_SIGNER_LOCAL_STORAGE_KEY)?.trim();
    if (storedKey) {
      return storedKey;
    }
  } catch {
    // Access to storage can fail in restricted browsing contexts.
  }

  return undefined;
};

const fetchFreshDemoSignerKey = async (minBalanceMutez = DEFAULT_MIN_DEMO_BALANCE_MUTEZ) => {
  const injectedKey = getInjectedDemoSignerKey();
  if (injectedKey) {
    return injectedKey;
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), KEYGEN_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch("https://keygen.ecadinfra.com/v2/shadownet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer taquito-example",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        key_prefixes: ['tz1'],
        max_selection_attempts: 5,
        min_balance_mutez: minBalanceMutez,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to generate key: ${response.status}`);
    }

    const payload = await response.json() as { secret_key?: string };
    if (!payload.secret_key) {
      throw new Error("No private key in response");
    }

    return payload.secret_key;
  } finally {
    window.clearTimeout(timeout);
  }
};

let ledgerSupportPromise: Promise<void> | undefined;

const ensureLedgerSupport = async () => {
  await installBrowserShims();

  if (!ledgerSupportPromise) {
    ledgerSupportPromise = (async () => {
      const TransportWebHID = (await import('@ledgerhq/hw-transport-webhid')).default;
      const { LedgerSigner, DerivationType, HDPathTemplate } = await import(
        '@taquito/ledger-signer'
      );

      window.TransportWebHID = TransportWebHID;
      window.LedgerSigner = LedgerSigner;
      window.DerivationType = DerivationType;
      window.HDPathTemplate = HDPathTemplate;
    })();
  }

  return ledgerSupportPromise;
};

window.ensureLedgerSupport = ensureLedgerSupport;

async function init() {
  try {
    console.log("Initializing Taquito dynamically...");
    await installBrowserShims();

    // Dynamic imports
    const { TezosToolkit, compose, MichelsonMap, UnitValue, RpcReadAdapter, getRevealFee, importKey } = await import('@taquito/taquito');
    const { InMemorySigner } = await import('@taquito/signer');
    const { BeaconWallet } = await import('@taquito/beacon-wallet');
    const { Tzip12Module, tzip12 } = await import('@taquito/tzip12');
    const { Tzip16Module, tzip16, MichelsonStorageView } = await import('@taquito/tzip16');
    const { stringToBytes, num2PaddedHex, bytesToString } = await import('@taquito/utils');
    const { BigNumber } = await import('bignumber.js');
    const { SigningType } = await import('@taquito/beacon-wallet/types')
    const { Parser, packDataBytes, emitMicheline } = await import('@taquito/michel-codec');
    const { b58Encode, PrefixV2 } = await import('@taquito/utils');
    const { WalletConnect, NetworkType, PermissionScopeMethods } = await import("@taquito/wallet-connect");

    const Tezos = new TezosToolkit('https://shadownet.tezos.ecadinfra.com');
    window.Tezos = Tezos;
    window.TezosToolkit = TezosToolkit;
    window.InMemorySigner = InMemorySigner;
    window.BeaconWallet = BeaconWallet;
    window.compose = compose;
    window.Tzip12Module = Tzip12Module;
    window.tzip12 = tzip12;
    window.Tzip16Module = Tzip16Module;
    window.tzip16 = tzip16;
    window.bytesToString = bytesToString;
    window.BigNumber = BigNumber;
    window.MichelsonMap = MichelsonMap;
    window.MichelsonStorageView = MichelsonStorageView;
    window.importKey = importKey;
    window.UnitValue = UnitValue;
    window.RpcReadAdapter = RpcReadAdapter;
    window.stringToBytes = stringToBytes;
    window.num2PaddedHex = num2PaddedHex;
    window.SigningType = SigningType;
    window.Parser = Parser;
    window.packDataBytes = packDataBytes;
    window.b58Encode = b58Encode;
    window.PrefixV2 = PrefixV2;
    window.emitMicheline = emitMicheline;
    window.getRevealFee = getRevealFee;
    window.WalletConnect = WalletConnect;
    window.NetworkType = NetworkType;
    window.PermissionScopeMethods = PermissionScopeMethods;

    // Expose contracts for live code examples
    window.genericMultisigJSONfile = genericMultisigJSONfile;
    window.genericMultisig = genericMultisig;
    window.contractMapTacoShop = contractMapTacoShop;
    window.contractMapPairKey = contractMapPairKey;
    window.contractMap8pairs = contractMap8pairs;
    window.contractMapBigMap = contractMapBigMap;
    window.secretKey = secretKey;
    window.contractJson = contractJson;
    window.contractStorageAnnot = contractStorageAnnot;
    window.contractStorageWithAndWithoutAnnot = contractStorageWithAndWithoutAnnot;
    window.contractStorageWithoutAnnot = contractStorageWithoutAnnot;
    window.managerCode = managerCode;

    console.log('Taquito initialized with Shadownet RPC');

    // Resolve the global promise if we created the resolvers
    if (resolveInit) resolveInit();

  } catch (e) {
    console.error("Failed to initialize Taquito:", e);
    window.__taquitoError = e;
    if (rejectInit) rejectInit(e);
  }
}

// Make configureSigner available globally
window.configureSigner = async function (options = {}) {
  if (!window.Tezos) {
    throw new Error("Tezos toolkit not initialized");
  }

  const shouldUseFreshSigner = options.fresh === true;
  const minBalanceMutez = options.minBalanceMutez ?? DEFAULT_MIN_DEMO_BALANCE_MUTEZ;

  // Check if already configured
  if (!shouldUseFreshSigner && window.__signerConfigured) {
    console.log("Signer already configured");
    return await window.Tezos.signer.publicKeyHash();
  }

  try {
    const privateKey = await fetchFreshDemoSignerKey(minBalanceMutez);

    // Set up the InMemorySigner
    const signer = await window.InMemorySigner.fromSecretKey(privateKey);
    window.Tezos.setProvider({ signer });

    // Mark as configured
    window.__signerConfigured = true;

    const address = await signer.publicKeyHash();
    console.log("Signer configured successfully");
    console.log("Address:", address);

    return address;
  } catch (error) {
    console.error("Failed to configure signer:", error);
    throw error;
  }
};

// Make connectWallet available globally for wallet examples
window.connectWallet = async function () {
  if (!window.Tezos) {
    throw new Error("Tezos toolkit not initialized");
  }

  // Check if already connected
  if (window.__walletConnected && window.wallet) {
    console.log("Wallet already connected");
    return await window.wallet.getPKH();
  }

  try {
    // Create BeaconWallet instance if not already created
    if (!window.wallet) {
      const options = {
        name: 'Taquito Docs',
        network: { type: 'shadownet' as const },
        enableMetrics: true,
      };
      window.wallet = new window.BeaconWallet(options);
    }

    // Request permissions - this opens the wallet popup
    await window.wallet.requestPermissions();

    // Set the wallet provider on Tezos
    window.Tezos.setWalletProvider(window.wallet);

    // Mark as connected
    window.__walletConnected = true;

    const address = await window.wallet.getPKH();
    console.log("Wallet connected successfully");
    console.log("Address:", address);

    return address;
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    throw error;
  }
};

// Start initialization
init();
