import { SaplingWrapper } from '../../src/sapling-module-wrapper';
import { setSaplingParamsProvider } from '../../src/sapling-params-provider';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const saplingSpendParams = require('../../saplingSpendParams');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const saplingOutputParams = require('../../saplingOutputParams');

describe('SaplingWrapper', () => {
  beforeAll(() => {
    setSaplingParamsProvider(async () => ({
      spend: saplingSpendParams,
      output: saplingOutputParams,
    }));
  });

  const saplingWrapper = new SaplingWrapper();

  it('getRandomBytes', () => {
    const bytes = saplingWrapper.getRandomBytes(24);
    expect(bytes.length).toEqual(24);
  });

  it('randR', async () => {
    const randR = await saplingWrapper.randR();
    expect(randR.length).toEqual(32);
  });

  it('getOutgoingViewingKey', async () => {
    const vk = Buffer.from(
      '000000000000000000977d725fc96387e8ec1e603e7ae60c6e63529fb84e36e126770e9db9899d7f2344259fd700dc80120d3c9ca65d698f6064043b048b079caa4f198aed96271740b1d6fd523d71b15cd0b3d75644afbe9abfedb6883e299165665ab692c14ca5c835c61a0e53de553a751c78fbc42d5e7eca807fd441206651c84bf88de803efba837583145a5f338b1a7af8a5f9bec4783054f9d063d365f2352f72cbced95e0a',
      'hex'
    );
    const ovk = await saplingWrapper.getOutgoingViewingKey(vk);
    expect(ovk.toString('hex')).toEqual(
      '35c61a0e53de553a751c78fbc42d5e7eca807fd441206651c84bf88de803efba'
    );
  });

  it('getOutgoingViewingKey', async () => {
    const vk = Buffer.from(
      '000000000000000000977d725fc96387e8ec1e603e7ae60c6e63529fb84e36e126770e9db9899d7f2344259fd700dc80120d3c9ca65d698f6064043b048b079caa4f198aed96271740b1d6fd523d71b15cd0b3d75644afbe9abfedb6883e299165665ab692c14ca5c835c61a0e53de553a751c78fbc42d5e7eca807fd441206651c84bf88de803efba837583145a5f338b1a7af8a5f9bec4783054f9d063d365f2352f72cbced95e0a',
      'hex'
    );
    const ovk = await saplingWrapper.getOutgoingViewingKey(vk);
    expect(ovk.toString('hex')).toEqual(
      '35c61a0e53de553a751c78fbc42d5e7eca807fd441206651c84bf88de803efba'
    );
  });

  it('getDiversifiedFromRawPaymentAddress', async () => {
    const address = new Uint8Array([
      0x2c, 0x8e, 0x68, 0x30, 0x29, 0xbd, 0x1c, 0x1f, 0xf2, 0x58, 0x82, 0xbb, 0x03, 0x53, 0x37,
      0x94, 0x87, 0xfc, 0xf1, 0x42, 0xbb, 0xae, 0xf3, 0x7d, 0x2b, 0x21, 0xdc, 0x38, 0x36, 0xf9,
      0x29, 0xc6, 0xfa, 0x91, 0x81, 0xe2, 0xa0, 0xd7, 0xb7, 0x24, 0x06, 0xc1, 0x48,
    ]);
    const diversifier = await saplingWrapper.getDiversifiedFromRawPaymentAddress(address);
    expect(diversifier.toString('hex')).toEqual('2c8e683029bd1c1ff25882');
  });

  it('getPkdFromRawPaymentAddress', async () => {
    const address = new Uint8Array([
      0x2c, 0x8e, 0x68, 0x30, 0x29, 0xbd, 0x1c, 0x1f, 0xf2, 0x58, 0x82, 0xbb, 0x03, 0x53, 0x37,
      0x94, 0x87, 0xfc, 0xf1, 0x42, 0xbb, 0xae, 0xf3, 0x7d, 0x2b, 0x21, 0xdc, 0x38, 0x36, 0xf9,
      0x29, 0xc6, 0xfa, 0x91, 0x81, 0xe2, 0xa0, 0xd7, 0xb7, 0x24, 0x06, 0xc1, 0x48,
    ]);
    const pkd = await saplingWrapper.getPkdFromRawPaymentAddress(address);
    expect(pkd.toString('hex')).toEqual(
      'bb0353379487fcf142bbaef37d2b21dc3836f929c6fa9181e2a0d7b72406c148'
    );
  });

  it('deriveEphemeralPublicKey', async () => {
    const esk = Buffer.from(
      '50335f36d7f64b16c24433e38a98fbde45258112348334638bb5e6bd705b3102',
      'hex'
    );
    const diversifier = Buffer.from('2c8e683029bd1c1ff25882', 'hex');
    const epk = await saplingWrapper.deriveEphemeralPublicKey(diversifier, esk);
    expect(epk.toString('hex')).toEqual(
      '623f1e9caa60c50d4342edaaf55a71782256f125f7d3e178c8540843be892d56'
    );
  });
});
