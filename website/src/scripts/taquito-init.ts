// We need to dynamically import Taquito to ensure polyfills are loaded first
// and to catch any module loading errors.

declare global {
  interface Window {
    Tezos: any;
    TezosToolkit: any;
    InMemorySigner: any;
    compose: any;
    Tzip12Module: any;
    tzip12: any;
    Tzip16Module: any;
    tzip16: any;
    bytesToString: any;
    BigNumber: any;
    configureSigner: () => Promise<string | undefined>;
    __signerConfigured?: boolean;
    __taquitoReady?: Promise<void>;
    __taquitoError?: any;
  }
}

// Initialize the ready promise immediately
let resolveInit: () => void;
let rejectInit: (err: any) => void;

if (!window.__taquitoReady) {
  window.__taquitoReady = new Promise((resolve, reject) => {
    resolveInit = resolve;
    rejectInit = reject;
  });
}

async function init() {
  try {
    console.log("Initializing Taquito dynamically...");

    // Dynamic imports
    const { TezosToolkit, compose } = await import('@taquito/taquito');
    const { InMemorySigner } = await import('@taquito/signer');
    const { Tzip12Module, tzip12 } = await import('@taquito/tzip12');
    const { Tzip16Module, tzip16, bytesToString } = await import('@taquito/tzip16');
    const { BigNumber } = await import('bignumber.js');

    const Tezos = new TezosToolkit('https://ghostnet.tezos.ecadinfra.com');
    window.Tezos = Tezos;
    window.TezosToolkit = TezosToolkit;
    window.InMemorySigner = InMemorySigner;
    window.compose = compose;
    window.Tzip12Module = Tzip12Module;
    window.tzip12 = tzip12;
    window.Tzip16Module = Tzip16Module;
    window.tzip16 = tzip16;
    window.bytesToString = bytesToString;
    window.BigNumber = BigNumber;

    console.log('Taquito initialized with Ghostnet RPC');
    
    // Resolve the global promise if we created the resolvers
    if (resolveInit) resolveInit();
    
  } catch (e) {
    console.error("Failed to initialize Taquito:", e);
    window.__taquitoError = e;
    if (rejectInit) rejectInit(e);
  }
}

// Make configureSigner available globally
window.configureSigner = async function() {
  if (!window.Tezos) {
    throw new Error("Tezos toolkit not initialized");
  }

  // Check if already configured
  if (window.__signerConfigured) {
    console.log("Signer already configured");
    return await window.Tezos.signer.publicKeyHash();
  }

  try {
    // Generate a key for demo purposes
    const response = await fetch("https://keygen.ecadinfra.com/ghostnet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer taquito-example",
        "Accept": "application/json"
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to generate key: ${response.status}`);
    }

    const privateKey = await response.text();;

    if (!privateKey) {
      throw new Error("No private key in response");
    }

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

// Start initialization
init();
