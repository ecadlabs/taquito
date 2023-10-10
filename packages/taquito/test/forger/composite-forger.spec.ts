import { CompositeForger, Forger } from '../../src/taquito';

describe('Composite forger', () => {
  const mockForgerThatReturn = (val: string): Forger => ({ forge: () => Promise.resolve(val) });

  it('Should throw if forgers give different result', async () => {
    const composite = new CompositeForger([mockForgerThatReturn('a'), mockForgerThatReturn('b')]);

    await expect(composite.forge({} as any)).rejects.toEqual(
      expect.objectContaining({
        message: 'Forging mismatch error',
        results: expect.arrayContaining([expect.stringMatching('a'), expect.stringMatching('b')]),
      })
    );
  });

  it('Should throw if forgers give different result', async () => {
    const composite = new CompositeForger([
      mockForgerThatReturn('a'),
      mockForgerThatReturn('a'),
      mockForgerThatReturn('c'),
    ]);

    await expect(composite.forge({} as any)).rejects.toEqual(
      expect.objectContaining({
        message: 'Forging mismatch error',
        results: expect.arrayContaining([expect.stringMatching('a'), expect.stringMatching('c')]),
      })
    );
  });

  it('Should return result if all forger return the same', async () => {
    const composite = new CompositeForger([
      mockForgerThatReturn('a'),
      mockForgerThatReturn('a'),
      mockForgerThatReturn('a'),
    ]);

    await expect(composite.forge({} as any)).resolves.toEqual('a');
  });

  it('Should return result if all forger return the same', async () => {
    const composite = new CompositeForger([mockForgerThatReturn('a')]);

    await expect(composite.forge({} as any)).resolves.toEqual('a');
  });

  it('Should throw if forger list is empty', async () => {
    expect(() => new CompositeForger([])).toThrow();
  });
});
