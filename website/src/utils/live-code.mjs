export { docsLiveCodeFixtures } from '../generated/live-code-fixtures.mjs';
import { docsLiveCodeFixtures } from '../generated/live-code-fixtures.mjs';

const fixtureEntries = Object.entries(docsLiveCodeFixtures);

export const fixturePlaceholderToken = (fixtureName) => `__FIXTURE_${fixtureName}__`;

export const replaceLiveCodeFixturePlaceholders = (source) =>
  fixtureEntries.reduce(
    (value, [fixtureName, fixtureValue]) =>
      value.replaceAll(fixturePlaceholderToken(fixtureName), fixtureValue),
    source
  );

const matchesAny = (source, patterns) => patterns.some((pattern) => pattern.test(source));

const ledgerPatterns = [
  /\bTransportWebHID\b/,
  /\bLedgerSigner\b/,
  /\bHDPathTemplate\b/,
  /\bDerivationType\b/,
];

const walletConnectPatterns = [/\bWalletConnect\.init\b/, /\bwalletConnect\.requestPermissions\b/];

const selfManagedSignerPatterns = [
  /\bconfigureSigner\s*\(/,
  /\bimportKey\s*\(/,
  /\bInMemorySigner\.fromSecretKey\s*\(/,
  /\bnew\s+InMemorySigner\s*\(/,
  /\bTezos\.setProvider\s*\(\s*\{\s*signer\s*:/,
];

const freshSignerPatterns = [
  /\bTezos\.contract\.transfer\s*\(/,
  /\bTezos\.contract\.originate\s*\(/,
  /\bTezos\.contract\s*\.\s*(transfer|originate)\s*\(/,
  /\bTezos\.estimate\.(transfer|originate|contractCall)\s*\(/,
  /\bTezos\.estimate\s*\.\s*(transfer|originate|contractCall)\s*\(/,
  /\bmethodsObject\.[^(]+\([^)]*\)\.send\s*\(/,
  /\bmethodsObject\s*\.\s*[^(]+\([^)]*\)\s*\.\s*send\s*\(/,
  /\bmethods\.[^(]+\([^)]*\)\.send\s*\(/,
  /\bmethods\s*\.\s*[^(]+\([^)]*\)\s*\.\s*send\s*\(/,
  /\bcontract\.methodsObject\.[^(]+\([^)]*\)\.send\s*\(/,
  /\bcontract\s*\.\s*methodsObject\s*\.\s*[^(]+\([^)]*\)\s*\.\s*send\s*\(/,
  /\bwallet\.methodsObject\.[^(]+\([^)]*\)\.send\s*\(/,
  /\bwallet\s*\.\s*methodsObject\s*\.\s*[^(]+\([^)]*\)\s*\.\s*send\s*\(/,
  /\.send\s*\(\s*\)/,
];

export const inferLiveCodeRuntime = ({ code, isWallet = false, noConfig = false }) => {
  if (isWallet) {
    return {
      interactionMode: 'beacon',
      signerMode: 'none',
    };
  }

  if (matchesAny(code, walletConnectPatterns)) {
    return {
      interactionMode: 'walletconnect',
      signerMode: 'none',
    };
  }

  if (matchesAny(code, ledgerPatterns)) {
    return {
      interactionMode: 'ledger',
      signerMode: 'none',
    };
  }

  if (noConfig || matchesAny(code, selfManagedSignerPatterns)) {
    return {
      interactionMode: 'standard',
      signerMode: 'none',
    };
  }

  if (matchesAny(code, freshSignerPatterns)) {
    return {
      interactionMode: 'standard',
      signerMode: 'fresh',
    };
  }

  return {
    interactionMode: 'standard',
    signerMode: 'none',
  };
};
