import { Chest } from '../src/taquito-timelock';

describe('Timelock chest unit test', () => {
  const time = 10000;
  const payload = new TextEncoder().encode('zrethgfdsq');
  const { chest, key: chestKey1 } = Chest.newChestAndKey(payload, time);
  let op1: Uint8Array | null;
  let op2: Uint8Array | null;

  it('should be able to create and open chests', () => {
    const chestKey2 = chest.newKey(time);

    op1 = chest.open(chestKey1, time);
    expect(op1).not.toBeNull();

    op2 = chest.open(chestKey2, time);
    expect(op2).not.toBeNull();
  });

  it('opening chest should return same values as encoded payload', () => {
    expect(op1).toEqual(payload);
    expect(op2).toEqual(op1);
  });
});
