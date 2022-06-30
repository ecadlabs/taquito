import { SaplingForger } from '../../src/sapling-forger/sapling-forger';
import { outputDescription, spendDescription } from '../data/sapling_test_data';

describe('Sapling Forger tests', () => {
  const forger = new SaplingForger();

  it('should be able to forge spendDescriptions', () => {
    const forged = forger.forgeSpendDescriptions(spendDescription);

    expect(forged).toBeDefined();
  });

  it('should be able to forge outputDescriptions', () => {
    const forged = forger.forgeOutputDescriptions(outputDescription);

    expect(forged).toBeDefined();
    expect(forged.length).toBeGreaterThan(0);
    expect(forged).toBeInstanceOf(Buffer);
  });

  it('should be able to forge Sapling transactions', () => {
    const forged = forger.forgeSaplingTransaction(
      spendDescription,
      outputDescription,
      Buffer.from(
        'sigoioDSmBSzHiPu2S4PHRfnw9JAovRsJRmwtJeHgfd517qfc4bHTv8KASNBcYvrjAm6Bincu7pDkiAQdwZwujqvsBspnQuR',
        'hex'
      ),
      Buffer.from('123'),
      Buffer.from('root')
    );

    expect(forged).toBeDefined();
    expect(forged.length).toBeGreaterThan(0);
  });
});
