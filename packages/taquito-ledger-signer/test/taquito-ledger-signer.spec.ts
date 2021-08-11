import { LedgerSigner, DerivationType, HDPathTemplate } from '../src/taquito-ledger-signer';
import { transformPathToBuffer } from '../src/utils';

/**
 * LedgerSigner test
 */
describe('LedgerSigner test', () => {
  let mockTransport: {
    send: jest.Mock<any, any>;
    decorateAppAPIMethods: jest.Mock<any, any>;
    setScrambleKey: jest.Mock<any, any>;
  };

  beforeEach(async () => {
    mockTransport =  { 
      send: jest.fn(), 
      decorateAppAPIMethods: jest.fn(),
      setScrambleKey: jest.fn(),
    }
  });

  it('LedgerSigner is instantiable with parameters', () => {
    expect(
      new LedgerSigner(
        mockTransport,
        "44'/1729'/0'/0'", 
        true, 
        DerivationType.SECP256K1
      )
    ).toBeInstanceOf(LedgerSigner);
  });

  it('Should throw exception if path is incorrect', () => {
    expect(() => {
      new LedgerSigner(
        mockTransport,
        "4'/1729'/0'/0'", 
        true, 
        DerivationType.SECP256K1
      )}
    ).toThrow("The derivation path must start with 44'/1729'");
  });

it('Should get public key and public key hash for default path and tz1 curve', async () => {
    const signer = new LedgerSigner(mockTransport);
    const mockpk = Buffer.from('21026760ff228c2c16cbca18bb782a106e51c43a131776f5dfad30ecb5d5e43eccbd9000', 'hex');
    mockTransport.send.mockResolvedValue(mockpk); 
    const pk = await signer.publicKey();
    const pkh = await signer.publicKeyHash();
    const path = "44'/1729'/0'/0'";
    const buff = transformPathToBuffer(path);
    expect(mockTransport.send).toHaveBeenCalledWith(0x80, 0x03, 0x00, 0x00, buff);
    expect(mockTransport.send).toHaveBeenCalledTimes(1);
    expect(pk).toEqual('edpkuRkcStobJ569XFxmE6edyRQQzMmtf4ZnmPkTPfSQnt6P3Nym2V');
    expect(pkh).toEqual('tz1e42w8ZaGAbM3gucbBy8iRypdbnqUj7oWY');
  })

  it('Should get public key and public key hash for default path and tz2 curve', async () => {
    const signer = new LedgerSigner(mockTransport, "44'/1729'/0'/0'", false, DerivationType.SECP256K1);
    const mockpk = Buffer.from('410406285dc14a52f870054debb9add64359c968698b16697651d2457a9b3235ce3686f3821d7373b00e91670b137920cc0f3480dca3373d057c34a163047549cc3e9000', 'hex');
    mockTransport.send.mockResolvedValue(mockpk); 
    const pk = await signer.publicKey();
    const pkh = await signer.publicKeyHash();
    const path = "44'/1729'/0'/0'";
    const buff = transformPathToBuffer(path);
    expect(mockTransport.send).toHaveBeenCalledWith(0x80, 0x02, 0x00, 0x01, buff);
    expect(mockTransport.send).toHaveBeenCalledTimes(1);
    expect(pk).toEqual('sppk7ZMM9NZLPPueTKcoJobdUG7MjLtaGsdrZqddcn9U6C9Yt99m8sU');
    expect(pkh).toEqual('tz2SxDTGnT3mHzaHf6mwy6Wtw1qUX1hzm1Sw');
  })

  it('Should get public key and public key hash for path which accounnt is 1 and tz3 curve', async () => {
    const signer = new LedgerSigner(mockTransport, "44'/1729'/1'/0'", false, DerivationType.P256);
    const mockpk = Buffer.from('4104eac3db090c124a2d57623d8e743f4a2beef9e6f96e80b49a4755c525c6c80ee391d9d93595479ae1d0099ecc8f4d56ca0542516407ff9f386c48678de965b8809000', 'hex');
    mockTransport.send.mockResolvedValue(mockpk); 
    const pk = await signer.publicKey();
    const pkh = await signer.publicKeyHash();
    const path = "44'/1729'/1'/0'";
    const buff = transformPathToBuffer(path);
    expect(mockTransport.send).toHaveBeenCalledWith(0x80, 0x02, 0x00, 0x02, buff);
    expect(mockTransport.send).toHaveBeenCalledTimes(1);
    expect(pk).toEqual('p2pk66MZ9MuDHfn5cQsUvtCvU376cijjvDLtTQzBFNeDHMijG4snUZZ');
    expect(pkh).toEqual('tz3PX4M9x9N7oXp2WWxNcQNK6GtaGdCdesK9');
  })

  it('Should get the right public key and public key hash using HDPathTemplate with index 1', async () => {
    const path = HDPathTemplate(1); //"44'/1729'/1'/0'"
    const signer = new LedgerSigner(mockTransport, path, false, DerivationType.ED25519);
    const mockpk = Buffer.from('2102ba40b58f38f54512f79e0d6c416e501759d08a05948989d84204a81d841e76749000', 'hex');
    mockTransport.send.mockResolvedValue(mockpk); 
    const pk = await signer.publicKey();
    const pkh = await signer.publicKeyHash();
    const buff = transformPathToBuffer(path);
    expect(mockTransport.send).toHaveBeenCalledWith(0x80, 0x02, 0x00, 0x00, buff);
    expect(mockTransport.send).toHaveBeenCalledTimes(1);
    expect(pk).toEqual('edpkv4FWm7YkppQNmKjxrSHCYzoh2pYRdeFeUeXWVjPTLPzyJduaox');
    expect(pkh).toEqual('tz1fpJJ331QrGMkdEPJzSWWEZRfVgrUCwzUf');
  })

  it('Should sign operation for tz1', async () => {
    const signer = new LedgerSigner(mockTransport);
    const mocksig = Buffer.from('35c1f3340121965a1350af2082af3c83d4338c23c254591ec7a12fef5d4e9fc2a63f7051508cc41255894fe511cfd11af827e8f8e6c3730c3dd0775aff33dc029000', 'hex');
    mockTransport.send.mockResolvedValue(mocksig); 
    const signature = await signer.sign('367325bbba406bc3f8c1bf12b27b6e8081064722d3342e34142c172b322ba0426b00c9fc72e8491bd2973e196f04ec6918ad5bcee22d8c0bbcb98d01e85200006760ff228c2c16cbca18bb782a106e51c43a131776f5dfad30ecb5d5e43eccbd6c00c9fc72e8491bd2973e196f04ec6918ad5bcee22dea0abdb98d01c35000a0c21e0000eadc0855adb415fa69a76fc10397dc2fb37039a000');
    const path = "44'/1729'/0'/0'";
    const buff = transformPathToBuffer(path);
    expect(mockTransport.send).toHaveBeenCalledTimes(2);
    expect(mockTransport.send).toHaveBeenCalledWith(0x80, 0x04, 0x00, 0x00, buff);
    expect(signature).toEqual({
      bytes:
        '367325bbba406bc3f8c1bf12b27b6e8081064722d3342e34142c172b322ba0426b00c9fc72e8491bd2973e196f04ec6918ad5bcee22d8c0bbcb98d01e85200006760ff228c2c16cbca18bb782a106e51c43a131776f5dfad30ecb5d5e43eccbd6c00c9fc72e8491bd2973e196f04ec6918ad5bcee22dea0abdb98d01c35000a0c21e0000eadc0855adb415fa69a76fc10397dc2fb37039a000',
      prefixSig:
        'edsigteqgHGYbzsxxFmQjGSf9eeNjTML4g6GBqryKvy7uy6y2XczT6C3ehhfzCBgQBdAMy9NLoD6MZVzCUbtSUoSC1iWAgPXGdW',
      sbytes:
        '367325bbba406bc3f8c1bf12b27b6e8081064722d3342e34142c172b322ba0426b00c9fc72e8491bd2973e196f04ec6918ad5bcee22d8c0bbcb98d01e85200006760ff228c2c16cbca18bb782a106e51c43a131776f5dfad30ecb5d5e43eccbd6c00c9fc72e8491bd2973e196f04ec6918ad5bcee22dea0abdb98d01c35000a0c21e0000eadc0855adb415fa69a76fc10397dc2fb37039a00035c1f3340121965a1350af2082af3c83d4338c23c254591ec7a12fef5d4e9fc2a63f7051508cc41255894fe511cfd11af827e8f8e6c3730c3dd0775aff33dc02',
      sig:
        'sigV2DADKhiwmvCaRS8QoxhM6DgXF8hTPbUBDbCd7vxkx5Do3rbJ8ZceS59b4c69z1XbtishJzit2RjorEpf6DpfS4paStBK',
    });
  })

  it('Should sign operation for tz2', async () => {
    const signer = new LedgerSigner(mockTransport, "44'/1729'/0'/0'", false, DerivationType.SECP256K1);
    const mocksig = Buffer.from('314402201bf0d530c35c70dacddfc14c2073e6666df839dca23ff18f0b2a375493fe06a4022036992c38fd5c3e88d6381208744c859dab96de0d8d221ead65b08b553680eee59000', 'hex');
    mockTransport.send.mockResolvedValue(mocksig); 
    const signature = await signer.sign('0372a589146bff99c31469fde4a7ac539e0ea5d926cbea4b72f2ae048fefacdaa16c01cc70a574e52e16028ce0fead32e8b2d8cc1440aca40e9bba8d01ed760000016ca589ff04efc7f657ded2a796631183b3d3709a00ffff09696e6372656d656e74000000020007');
    const path = "44'/1729'/0'/0'";
    const buff = transformPathToBuffer(path);
    expect(mockTransport.send).toHaveBeenCalledTimes(2);
    expect(mockTransport.send).toHaveBeenCalledWith(0x80, 0x04, 0x00, 0x01, buff);
    expect(signature).toEqual({
      bytes:
        '0372a589146bff99c31469fde4a7ac539e0ea5d926cbea4b72f2ae048fefacdaa16c01cc70a574e52e16028ce0fead32e8b2d8cc1440aca40e9bba8d01ed760000016ca589ff04efc7f657ded2a796631183b3d3709a00ffff09696e6372656d656e74000000020007',
      prefixSig:
        'spsig19TzJiKZN8xDGw2qBGyR5FLMAgPamCEpYBXiq7JNzN9WaSkdZbhjWuFK7f1tg4c1h8AHdyrktPYa2UFn1a6YsaLKSRMwiC',
      sbytes:
        '0372a589146bff99c31469fde4a7ac539e0ea5d926cbea4b72f2ae048fefacdaa16c01cc70a574e52e16028ce0fead32e8b2d8cc1440aca40e9bba8d01ed760000016ca589ff04efc7f657ded2a796631183b3d3709a00ffff09696e6372656d656e740000000200071bf0d530c35c70dacddfc14c2073e6666df839dca23ff18f0b2a375493fe06a436992c38fd5c3e88d6381208744c859dab96de0d8d221ead65b08b553680eee5',
      sig:
        'sigReJyeiJtnz4tm35D8RGRLeyFrc1h8c84cQQ4K95BUDo9P6pP2dMZmmTRHSocfY9cQR8u218TFPqwBYfVhR3xMoCzr7hYu',
    });
  })

  it('Should sign operation for tz3', async () => {
    const signer = new LedgerSigner(mockTransport, "44'/1729'/0'/0'", false, DerivationType.P256);
    const mocksig = Buffer.from('3144022005ccc37c4c434b39054a68d15f9f4d4d279699dd3a406cb235e0b3bf62a6ec1702204f72794ad3f06dd3ebb21b36b63eb44b98f5607e8751513741d73660b7952c399000', 'hex');
    mockTransport.send.mockResolvedValue(mocksig); 
    const signature = await signer.sign('038e1824a75961255a36e47d354733d6923c5849579d6abb4bd8c2a929ab5d393a6b02bd2cbb50fb2bfd7237b474a25b1b4ae447c577208c0babbc8d01e8520002022937a7444d7a00cb29f353058444d26d19382f0079e34b5aaf0eda4cec6665f16d02bd2cbb50fb2bfd7237b474a25b1b4ae447c577209310acbc8d01bb78c2030000000000b702000000b205000764045b0000000a2564656372656d656e74045b0000000a25696e6372656d656e740501035b0502020000008303210317057000010321057100020316072e020000002b032105700002032105710003034203210317057000010321057100020316034b051f020000000405200002020000002b0321057000020321057100030342032103170570000103210571000203160312051f020000000405200002053d036d0342051f020000000405200002000000020000');
    const path = "44'/1729'/0'/0'";
    const buff = transformPathToBuffer(path);
    expect(mockTransport.send).toHaveBeenCalledTimes(3);
    expect(mockTransport.send).toHaveBeenCalledWith(0x80, 0x04, 0x00, 0x02, buff);
    expect(signature).toEqual({
      bytes:
        '038e1824a75961255a36e47d354733d6923c5849579d6abb4bd8c2a929ab5d393a6b02bd2cbb50fb2bfd7237b474a25b1b4ae447c577208c0babbc8d01e8520002022937a7444d7a00cb29f353058444d26d19382f0079e34b5aaf0eda4cec6665f16d02bd2cbb50fb2bfd7237b474a25b1b4ae447c577209310acbc8d01bb78c2030000000000b702000000b205000764045b0000000a2564656372656d656e74045b0000000a25696e6372656d656e740501035b0502020000008303210317057000010321057100020316072e020000002b032105700002032105710003034203210317057000010321057100020316034b051f020000000405200002020000002b0321057000020321057100030342032103170570000103210571000203160312051f020000000405200002053d036d0342051f020000000405200002000000020000',
      prefixSig:
        'p2sigN4XTiSicEot77bsR9BvpnDtSm4KDm2YyRew4isqiqxhN6fJpQeYFu8acN8NSDJCxPrqgpqyML3M7ubfBicRfqNz7oGhnX',
      sbytes:
        '038e1824a75961255a36e47d354733d6923c5849579d6abb4bd8c2a929ab5d393a6b02bd2cbb50fb2bfd7237b474a25b1b4ae447c577208c0babbc8d01e8520002022937a7444d7a00cb29f353058444d26d19382f0079e34b5aaf0eda4cec6665f16d02bd2cbb50fb2bfd7237b474a25b1b4ae447c577209310acbc8d01bb78c2030000000000b702000000b205000764045b0000000a2564656372656d656e74045b0000000a25696e6372656d656e740501035b0502020000008303210317057000010321057100020316072e020000002b032105700002032105710003034203210317057000010321057100020316034b051f020000000405200002020000002b0321057000020321057100030342032103170570000103210571000203160312051f020000000405200002053d036d0342051f02000000040520000200000002000005ccc37c4c434b39054a68d15f9f4d4d279699dd3a406cb235e0b3bf62a6ec174f72794ad3f06dd3ebb21b36b63eb44b98f5607e8751513741d73660b7952c39',
      sig:
        'sigNkJcdMAWmsqeBM7ARbQ3Gm74NQ5xfc8kyt5gKRQRdWQpZPXW2bT2cxAKBBrCn6ddmqKfkc31q62kWujT8AEEZgeAquYy5',
    });
  })

});