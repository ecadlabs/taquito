import { LedgerSigner, DerivationType } from '../src/taquito-ledger-signer';
import { transformPathToBuffer } from '../src/utils';

/**
 * RemoteSigner test
 */
describe('LedgerSigner test', () => {
  let mockTransport: {
    send: jest.Mock<any, any>;
    decorateAppAPIMethods: jest.Mock<any, any>;
  };

  beforeEach(async () => {
    mockTransport =  { 
      send: jest.fn(), 
      decorateAppAPIMethods: jest.fn() 
    }
  });

it('Should get public key and public key hash for tz1', async () => {
    const signer = new LedgerSigner(mockTransport);
    const mockpk = Buffer.from('2102063ed375b28dd2c1841138d4959f57b4a2715730e2e28fcda9144a19876dd3c69000', 'hex');
    mockTransport.send.mockResolvedValue(mockpk); 
    const pk = await signer.publicKey();
    const pkh = await signer.publicKeyHash();
    const path = "44'/1729'/0'/0'/0'";
    const buff = transformPathToBuffer(path);
    expect(mockTransport.send).toHaveBeenCalledWith(0x80, 0x03, 0x00, 0x00, buff);
    expect(mockTransport.send).toHaveBeenCalledTimes(1);
    expect(pk).toEqual('edpktgyU5HvdQbXSbYMCMUeQvFuFKuAmfqXSMdqSBPJpqGTphs6yNb');
    expect(pkh).toEqual('tz1XMxuGdfC6BjQHkW3PumWtMcy4qeMj8nqW');
  })

  it('Should get public key and public key hash for tz2', async () => {
    const signer = new LedgerSigner(mockTransport, "44'/1729'/0'/0'/1'", false, DerivationType.tz2);
    const mockpk = Buffer.from('41049784b81605e344a2156e3cb77e77559d8dc3ad0f62322aeb9734e3374e95f104995292faba65d941b98ff27531ba47566a83a0c7bdfc78b52223d9f56136acf09000', 'hex');
    mockTransport.send.mockResolvedValue(mockpk); 
    const pk = await signer.publicKey();
    const pkh = await signer.publicKeyHash();
    const path = "44'/1729'/0'/0'/1'";
    const buff = transformPathToBuffer(path);
    expect(mockTransport.send).toHaveBeenCalledWith(0x80, 0x02, 0x00, 0x01, buff);
    expect(mockTransport.send).toHaveBeenCalledTimes(1);
    expect(pk).toEqual('sppk7aTNC17Y3bCioVJSEUH5gAMwcU5qN28b2DAmepCNs7BZ8rUyP4o');
    expect(pkh).toEqual('tz2UChAE93SHiw7FsKY9T6ZK5XHbVJruJr8S');
  })

  it('Should get public key and public key hash for tz3', async () => {
    const signer = new LedgerSigner(mockTransport, "44'/1729'/0'/2'/2'", false, DerivationType.tz3);
    const mockpk = Buffer.from('4104470c0ce49986fae82c9baf3c9782c0ae78806bc16b5418d49a15afc6c5d9d55952a06552cae0ce2e69e8b40ee93819f00797fec45f1bd40cf67e9da2fc67da639000', 'hex');
    mockTransport.send.mockResolvedValue(mockpk); 
    const pk = await signer.publicKey();
    const pkh = await signer.publicKeyHash();
    const path = "44'/1729'/0'/2'/2'";
    const buff = transformPathToBuffer(path);
    expect(mockTransport.send).toHaveBeenCalledWith(0x80, 0x02, 0x00, 0x02, buff);
    expect(mockTransport.send).toHaveBeenCalledTimes(1);
    expect(pk).toEqual('p2pk674CN8MDQBTHMxyNmRoJ3bnotxDdY4rqedevJc89Uc1b5kZ1b5R');
    expect(pkh).toEqual('tz3S43CJiFnra6i9yf7p6zkp9yCnaBxHfAfG');
  })

  it('Should sign operation for tz1', async () => {
    const signer = new LedgerSigner(mockTransport);
    const mockpk = Buffer.from('f657bd75591090f2910872cd195290285d00d7d02c432c384effb9d03734533adeeab9658eaaee12fb9f6b080210a0fc8ab185feea8d6a7ec98e421ccf764a0d9000', 'hex');
    mockTransport.send.mockResolvedValue(mockpk); 
    const signature = await signer.sign('0315a3be060e266dfcdcc63db603d73f2327499e2a3b88c361f34e70547be90d886c008097b09b3bfdd573ca638ca83ee62cc80a7f4adba20eb59c60ed760000016ca589ff04efc7f657ded2a796631183b3d3709a00ffff09696e6372656d656e74000000020007');
    const path = "44'/1729'/0'/0'/0'";
    const buff = transformPathToBuffer(path);
    expect(mockTransport.send).toHaveBeenCalledTimes(2);
    expect(mockTransport.send).toHaveBeenCalledWith(0x80, 0x04, 0x00, 0x00, buff);
    expect(signature).toEqual({
      bytes:
        '0315a3be060e266dfcdcc63db603d73f2327499e2a3b88c361f34e70547be90d886c008097b09b3bfdd573ca638ca83ee62cc80a7f4adba20eb59c60ed760000016ca589ff04efc7f657ded2a796631183b3d3709a00ffff09696e6372656d656e74000000020007',
      prefixSig:
        'sigvDZDMc2jGcw2tTDrU2hRK61yhAFkYW2xXzs4qD46VEZJwLJ9sZ6v3jJEvKHKLXsACt4m6dWCgSncEFJ4wr2GBD5JyPJKx',
      sbytes:
        '0315a3be060e266dfcdcc63db603d73f2327499e2a3b88c361f34e70547be90d886c008097b09b3bfdd573ca638ca83ee62cc80a7f4adba20eb59c60ed760000016ca589ff04efc7f657ded2a796631183b3d3709a00ffff09696e6372656d656e74000000020007f657bd75591090f2910872cd195290285d00d7d02c432c384effb9d03734533adeeab9658eaaee12fb9f6b080210a0fc8ab185feea8d6a7ec98e421ccf764a0d',
      sig:
        'sigvDZDMc2jGcw2tTDrU2hRK61yhAFkYW2xXzs4qD46VEZJwLJ9sZ6v3jJEvKHKLXsACt4m6dWCgSncEFJ4wr2GBD5JyPJKx',
    });
  })

  it('Should sign operation for tz2', async () => {
    const signer = new LedgerSigner(mockTransport, "44'/1729'/0'/0'/0'", false, DerivationType.tz2);
    const mockpk = Buffer.from('3144022032b84b9a869324669bb9d2a1f7515cf5844c5cdeb2ca453af63903ef85c48207022029024defb54f815ac29ed4f58b7bdab736f17549d83c0e68358a22acc9dd36179000', 'hex');
    mockTransport.send.mockResolvedValue(mockpk); 
    const signature = await signer.sign('03e6e9fa3e9bbcc7c949466870837d85378dbaf324612bde8664ef318dc077ff716c016fcc969fc1f67f4eed5cf609c455d4bd01364ba9a20eb68068ed760000016ca589ff04efc7f657ded2a796631183b3d3709a00ffff09696e6372656d656e74000000020007');
    const path = "44'/1729'/0'/0'/0'";
    const buff = transformPathToBuffer(path);
    expect(mockTransport.send).toHaveBeenCalledTimes(2);
    expect(mockTransport.send).toHaveBeenCalledWith(0x80, 0x04, 0x00, 0x01, buff);
    expect(signature).toEqual({
      bytes:
        '03e6e9fa3e9bbcc7c949466870837d85378dbaf324612bde8664ef318dc077ff716c016fcc969fc1f67f4eed5cf609c455d4bd01364ba9a20eb68068ed760000016ca589ff04efc7f657ded2a796631183b3d3709a00ffff09696e6372656d656e74000000020007',
      prefixSig:
        'sigUdAEuwDWvCpHe3Aqx1F7yay4c2C1Kh6P9HttGvo5i5eP4atccZgHW4FW3N6JLKDPfLf1o3PMtk9HuSG3JsB2XMTmkxZCC',
      sbytes:
        '03e6e9fa3e9bbcc7c949466870837d85378dbaf324612bde8664ef318dc077ff716c016fcc969fc1f67f4eed5cf609c455d4bd01364ba9a20eb68068ed760000016ca589ff04efc7f657ded2a796631183b3d3709a00ffff09696e6372656d656e7400000002000732b84b9a869324669bb9d2a1f7515cf5844c5cdeb2ca453af63903ef85c4820729024defb54f815ac29ed4f58b7bdab736f17549d83c0e68358a22acc9dd3617',
      sig:
        'sigUdAEuwDWvCpHe3Aqx1F7yay4c2C1Kh6P9HttGvo5i5eP4atccZgHW4FW3N6JLKDPfLf1o3PMtk9HuSG3JsB2XMTmkxZCC',
    });
  })

  it('Should sign operation for tz3', async () => {
    const signer = new LedgerSigner(mockTransport, "44'/1729'/0'/0'/0'", false, DerivationType.tz3);
    const mockpk = Buffer.from('314402203d3b46bf5fc06108a54f02c783216beca868474d91bf05f738157f2c40728f9902207f63a12ae7c1badd9d6c3a3ca04555b61166ec220343dbb530caa36d169db8b69000', 'hex');
    mockTransport.send.mockResolvedValue(mockpk); 
    const signature = await signer.sign('035a5e306fd31f1ecd1df6a1dc33488e9baaaa6230c64e0c97bf3a69c60cd3a0056c02686932f282fea132ce940aa79bf6e88b43395b19a20eb68168ed760000016ca589ff04efc7f657ded2a796631183b3d3709a00ffff09696e6372656d656e74000000020007');
    const path = "44'/1729'/0'/0'/0'";
    const buff = transformPathToBuffer(path);
    expect(mockTransport.send).toHaveBeenCalledTimes(2);
    expect(mockTransport.send).toHaveBeenCalledWith(0x80, 0x04, 0x00, 0x02, buff);
    expect(signature).toEqual({
      bytes:
        '035a5e306fd31f1ecd1df6a1dc33488e9baaaa6230c64e0c97bf3a69c60cd3a0056c02686932f282fea132ce940aa79bf6e88b43395b19a20eb68168ed760000016ca589ff04efc7f657ded2a796631183b3d3709a00ffff09696e6372656d656e74000000020007',
      prefixSig:
        'sigVzvVJnA6sniKfktjb5Ea4B4ZRdu8gLVmU5PYZd3zuwhq3hUKM7rAmxPzyFKdApFA3d6sTYUfSCQLtqJbhg8HnWQCfzkp5',
      sbytes:
        '035a5e306fd31f1ecd1df6a1dc33488e9baaaa6230c64e0c97bf3a69c60cd3a0056c02686932f282fea132ce940aa79bf6e88b43395b19a20eb68168ed760000016ca589ff04efc7f657ded2a796631183b3d3709a00ffff09696e6372656d656e740000000200073d3b46bf5fc06108a54f02c783216beca868474d91bf05f738157f2c40728f997f63a12ae7c1badd9d6c3a3ca04555b61166ec220343dbb530caa36d169db8b6',
      sig:
        'sigVzvVJnA6sniKfktjb5Ea4B4ZRdu8gLVmU5PYZd3zuwhq3hUKM7rAmxPzyFKdApFA3d6sTYUfSCQLtqJbhg8HnWQCfzkp5',
    });
  })

});