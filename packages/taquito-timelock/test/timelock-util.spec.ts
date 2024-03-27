import { Timelock, TimelockProof, unlockAndProve, verify } from '../src/timelock-util';

describe('Timelock unit test', () => {
  const time = 10000;

  const timelockPrecomputedTuple = Timelock.precompute(time);
  const { lockedValue, proof } = timelockPrecomputedTuple.getProof(time);
  let proof2: TimelockProof;

  it('should be able to encode proof', () => {
    const enc = proof.encode();
    const [dec] = TimelockProof.fromArray(enc);
    expect(dec).toEqual(proof);
  });

  it('should be able to verify proof', () => {
    expect(verify(lockedValue, proof, time)).toBeTruthy();
  });

  it('should be able to unlock and prove', () => {
    proof2 = unlockAndProve(time, lockedValue);
    expect(verify(lockedValue, proof2, time)).toBeTruthy();
  });

  it('should be able to verify whether proofs prouce the same symmetric key', () => {
    const symKey1 = proof.symmetricKey();
    const symKey2 = proof2.symmetricKey();

    expect(symKey1).toEqual(symKey2);
  });
});
