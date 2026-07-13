import { Protocols } from '@taquito/taquito';
import { ProtocolsResponse } from '@taquito/rpc';

interface EstimateLike {
  gasLimit: number;
  storageLimit: number;
  suggestedFeeMutez: number;
  burnFeeMutez: number;
  minimalFeeMutez: number;
  totalCost: number;
  usingBaseFeeMutez: number;
  consumedMilligas: number;
}

type EstimateSnapshot = EstimateLike;

/**
 * Resolve the protocol actually running at head into the {@link Protocols} enum.
 *
 * Gas baselines are keyed by the *live* protocol rather than a hardcoded network
 * config, because shadownet shadows whichever proposal is currently under test:
 * its protocol is a moving target, and the declared config value goes stale the
 * moment the net migrates. Reading it at runtime keeps the estimate assertions
 * honest and makes a brand-new protocol fail loudly (see {@link expectEstimate})
 * instead of silently comparing against the wrong baseline.
 */
export const resolveProtocol = (protocols: ProtocolsResponse): Protocols => {
  const match = Object.values(Protocols).find((p) => p === protocols.protocol);
  if (!match) {
    throw new Error(
      `Unknown protocol ${protocols.protocol}. Add it to the Protocols enum and record gas baselines for it.`
    );
  }
  return match;
};

/**
 * Assert an estimate against the baseline recorded for the given protocol.
 *
 * `baselines` maps a protocol to one or more observed snapshots. Every field is
 * matched exactly (any listed value is accepted), except `consumedMilligas`,
 * which is checked against the [min, max] band of the listed snapshots. Milligas
 * jitters run-to-run (and across protocol point-releases that keep the same hash),
 * so list every observed value and the band widens to cover it.
 */
export const expectEstimate = (
  estimate: EstimateLike,
  protocol: Protocols,
  baselines: Partial<Record<Protocols, EstimateSnapshot[]>>
) => {
  const snapshots = baselines[protocol];
  if (!snapshots || snapshots.length === 0) {
    throw new Error(
      `No estimate baseline recorded for protocol ${protocol}. Run against the live network and record the observed values.`
    );
  }

  const estimateKeys: (keyof EstimateSnapshot)[] = [
    'gasLimit',
    'storageLimit',
    'burnFeeMutez',
    'consumedMilligas',
    'suggestedFeeMutez',
    'minimalFeeMutez',
    'totalCost',
    'usingBaseFeeMutez',
  ];

  for (const key of estimateKeys) {
    const values = [...new Set(snapshots.map((snapshot) => snapshot[key]))];

    if (key === 'consumedMilligas') {
      expect(estimate[key]).toBeGreaterThanOrEqual(Math.min(...values));
      expect(estimate[key]).toBeLessThanOrEqual(Math.max(...values));
      continue;
    }

    expect(values).toContain(estimate[key]);
  }
};
