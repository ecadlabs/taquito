import { vi } from 'vitest';
import { shuffleOutputs } from '../../src/sapling-tx-builder/shuffle-outputs';

describe('shuffleOutputs', () => {
  it('rejects the biased tail before selecting an index', () => {
    const random = vi
      .fn()
      .mockReturnValueOnce(new Uint8Array([255, 255, 255, 255]))
      .mockReturnValueOnce(new Uint8Array([2, 0, 0, 0]))
      .mockReturnValueOnce(new Uint8Array([1, 0, 0, 0]));
    const outputs = ['a', 'b', 'c'];
    shuffleOutputs(outputs, random);
    expect(outputs).toEqual(['a', 'b', 'c']);
    expect(random).toHaveBeenCalledTimes(3);
    expect(random.mock.calls.every(([length]) => length === 4)).toBe(true);
  });

  it('uses the supplied byte offset', () => {
    const outputs = ['a', 'b'];
    shuffleOutputs(outputs, () => new Uint8Array([99, 0, 0, 0, 0, 99]).subarray(1, 5));
    expect(outputs).toEqual(['b', 'a']);
  });

  it.each([0, 1, 3, 5])('rejects an entropy response with %s bytes', (length) => {
    expect(() => shuffleOutputs(['a', 'b'], () => new Uint8Array(length))).toThrow(
      'Expected four random bytes'
    );
  });

  it('can select every permutation of three outputs exactly once', () => {
    const permutations = new Set<string>();
    for (let first = 0; first < 3; first++) {
      for (let second = 0; second < 2; second++) {
        const samples = [first, second];
        const outputs = ['a', 'b', 'c'];
        shuffleOutputs(outputs, () => new Uint8Array([samples.shift()!, 0, 0, 0]));
        permutations.add(outputs.join(''));
      }
    }
    expect(permutations.size).toBe(6);
  });
});
