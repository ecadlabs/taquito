import { SaplingWrapper } from '../../src/sapling-module-wrapper';

describe('SaplingWrapper', () => {
  const saplingWrapper = new SaplingWrapper();

  it('getRandomBytes', () => {
    const bytes = saplingWrapper.getRandomBytes(24);
    expect(bytes.length).toEqual(24);
  });

  /* it('randR', async (done) => {
    const randR = await saplingWrapper.randR();
    expect(randR.length).toEqual(32);
    done();
  }); */

  it('getOutgoingViewingKey', async (done) => {
    const vk = Buffer.from(
      '000000000000000000977d725fc96387e8ec1e603e7ae60c6e63529fb84e36e126770e9db9899d7f2344259fd700dc80120d3c9ca65d698f6064043b048b079caa4f198aed96271740b1d6fd523d71b15cd0b3d75644afbe9abfedb6883e299165665ab692c14ca5c835c61a0e53de553a751c78fbc42d5e7eca807fd441206651c84bf88de803efba837583145a5f338b1a7af8a5f9bec4783054f9d063d365f2352f72cbced95e0a',
      'hex'
    );
    const ovk = await saplingWrapper.getOutgoingViewingKey(vk);
    expect(ovk.toString('hex')).toEqual(
      '35c61a0e53de553a751c78fbc42d5e7eca807fd441206651c84bf88de803efba'
    );
    done();
  });

  it('getOutgoingViewingKey', async (done) => {
    const vk = Buffer.from(
      '000000000000000000977d725fc96387e8ec1e603e7ae60c6e63529fb84e36e126770e9db9899d7f2344259fd700dc80120d3c9ca65d698f6064043b048b079caa4f198aed96271740b1d6fd523d71b15cd0b3d75644afbe9abfedb6883e299165665ab692c14ca5c835c61a0e53de553a751c78fbc42d5e7eca807fd441206651c84bf88de803efba837583145a5f338b1a7af8a5f9bec4783054f9d063d365f2352f72cbced95e0a',
      'hex'
    );
    const ovk = await saplingWrapper.getOutgoingViewingKey(vk);
    expect(ovk.toString('hex')).toEqual(
      '35c61a0e53de553a751c78fbc42d5e7eca807fd441206651c84bf88de803efba'
    );
    done();
  });

  it('getDiversifiedFromRawPaymentAddress', async (done) => {
    const address = new Uint8Array([
      0x2c, 0x8e, 0x68, 0x30, 0x29, 0xbd, 0x1c, 0x1f, 0xf2, 0x58, 0x82, 0xbb, 0x03, 0x53, 0x37,
      0x94, 0x87, 0xfc, 0xf1, 0x42, 0xbb, 0xae, 0xf3, 0x7d, 0x2b, 0x21, 0xdc, 0x38, 0x36, 0xf9,
      0x29, 0xc6, 0xfa, 0x91, 0x81, 0xe2, 0xa0, 0xd7, 0xb7, 0x24, 0x06, 0xc1, 0x48,
    ]);
    const diversifier = await saplingWrapper.getDiversifiedFromRawPaymentAddress(address);
    expect(diversifier.toString('hex')).toEqual('2c8e683029bd1c1ff25882');
    done();
  });

  it('getPkdFromRawPaymentAddress', async (done) => {
    const address = new Uint8Array([
      0x2c, 0x8e, 0x68, 0x30, 0x29, 0xbd, 0x1c, 0x1f, 0xf2, 0x58, 0x82, 0xbb, 0x03, 0x53, 0x37,
      0x94, 0x87, 0xfc, 0xf1, 0x42, 0xbb, 0xae, 0xf3, 0x7d, 0x2b, 0x21, 0xdc, 0x38, 0x36, 0xf9,
      0x29, 0xc6, 0xfa, 0x91, 0x81, 0xe2, 0xa0, 0xd7, 0xb7, 0x24, 0x06, 0xc1, 0x48,
    ]);
    const pkd = await saplingWrapper.getPkdFromRawPaymentAddress(address);
    expect(pkd.toString('hex')).toEqual(
      'bb0353379487fcf142bbaef37d2b21dc3836f929c6fa9181e2a0d7b72406c148'
    );
    done();
  });

  it('deriveEphemeralPublicKey', async (done) => {
    const esk = Buffer.from(
      '50335f36d7f64b16c24433e38a98fbde45258112348334638bb5e6bd705b3102',
      'hex'
    );
    const diversifier = Buffer.from('2c8e683029bd1c1ff25882', 'hex');
    const epk = await saplingWrapper.deriveEphemeralPublicKey(diversifier, esk);
    expect(epk.toString('hex')).toEqual(
      '623f1e9caa60c50d4342edaaf55a71782256f125f7d3e178c8540843be892d56'
    );
    done();
  });

  /* it('signSpendDescription', async (done) => {
    const spendDescription = {
      commitmentValue: Buffer.from('a61b321b9b3c12d31a8f1cadad2fec37e219bea726998d9c3f311fd91092f859', 'hex'),
      proof: Buffer.from(
        'b5a14dae39e36166c41ce84282cad0452dcc822caa12752f039a8b3d5c27a3624307081fec681dc0a8c8a14f5bbe897085ffc156196f1ee17655a9f3a48c412f36bb694227c81dcb5e514842f4a1259f7a8daf52c5512ea5e5fd810d9618b90e00fd8883a36575781aa468bfe5dada63c9139926a78d083edef99d1a1f13280e0ba9c90d6cbd4d9ffe46767a0573a8dfa989c95bb1c213808a617f4c2a0f026c802523db6d90fb3e5f0ac48d6dbe55437339ec4547f0fb93ee6be672c1b8b541',
        'hex'
      ),
      nullifier: Buffer.from('a0678d948b2f39c8fe723dc0ab2302107de48ec746adb2fac636c3a5dec50de3', 'hex'),
      randomizedPublicKey: Buffer.from('75a3311108abd110c767d19cca8e657cd6b58412868f48e05da04d0903ab95d3', 'hex'),
      rtAnchor: Buffer.from('25fa83c26fdb118353e9442c7cedd6919147d0029bc4bef236638396c2824557', 'hex'),
    };
    const spendingKey = Buffer.from(
      '000000000000000000977d725fc96387e8ec1e603e7ae60c6e63529fb84e36e126770e9db9899d7f233fe1deabce96fe39efe6cbe315755ad2938b3a7e112c61305a0ba1ed7ed561053f80bf8cb9a8da8deb290913e9302be00c56f4565d917a6170be1880f42bb70935c61a0e53de553a751c78fbc42d5e7eca807fd441206651c84bf88de803efba837583145a5f338b1a7af8a5f9bec4783054f9d063d365f2352f72cbced95e0a',
      'hex'
    );
    const publicKeyReRandomization = Buffer.from(
      'f2e0532579a9f484b94cfe536a649b82d48d38f398d013eebd9fd6aa12d79204',
      'hex'
    );
    const sighash = Buffer.from(
      '14bf34283c865524157102962a1d58051b0ce026b5e29824114b023fc82dd9fa',
      'hex'
    );
    const signedSpendDesc = await saplingWrapper.signSpendDescription({
      spendingKey,
      publicKeyReRandomization,
      hash: sighash,
      unsignedSpendDescription: spendDescription,
    });

    expect(signedSpendDesc.signature.length).toEqual(64); // the returned value is changing
    expect(signedSpendDesc.commitmentValue).toEqual(spendDescription.commitmentValue);
    expect(signedSpendDesc.proof).toEqual(spendDescription.proof);
    expect(signedSpendDesc.randomizedPublicKey).toEqual(spendDescription.randomizedPublicKey);
    expect(signedSpendDesc.nullifier).toEqual(spendDescription.nullifier);

    done();
  }); */

  it('getPaymentAddressFromViewingKey', async (done) => {
    const vk = Buffer.from(
      '000000000000000000977d725fc96387e8ec1e603e7ae60c6e63529fb84e36e126770e9db9899d7f2344259fd700dc80120d3c9ca65d698f6064043b048b079caa4f198aed96271740b1d6fd523d71b15cd0b3d75644afbe9abfedb6883e299165665ab692c14ca5c835c61a0e53de553a751c78fbc42d5e7eca807fd441206651c84bf88de803efba837583145a5f338b1a7af8a5f9bec4783054f9d063d365f2352f72cbced95e0a',
      'hex'
    );
    const paymentAddress = await saplingWrapper.getPaymentAddressFromViewingKey(vk);
    expect(paymentAddress.toString('hex')).toEqual(
      '2c8e683029bd1c1ff25882bb0353379487fcf142bbaef37d2b21dc3836f929c6fa9181e2a0d7b72406c148'
    );
    done();
  });
});
