import { 
  transformPathToBuffer, 
  compressPublicKey, 
  appendWatermark, 
  chunkOperation, 
  validateResponse,
  extractValue 
} from '../src/utils';

/**
 * LedgerSigner utils test
 */

describe('Utils functions', () => {
  it('Should concatenate watermark and bytes and return a hex string', () => {
    const bytes = 'a4586adf1c2eae408d5ccbbaab186768457702c442b0b11edd0a674761699cc16c008097b09b3bfdd573ca638ca83ee62cc80a7f4adba80aaf9c60c35000a0c21e0000eadc0855adb415fa69a76fc10397dc2fb37039a000';
    const watermark = new Uint8Array([3])
    const transaction = appendWatermark(bytes, watermark);
    expect(transaction).toEqual(
      '03a4586adf1c2eae408d5ccbbaab186768457702c442b0b11edd0a674761699cc16c008097b09b3bfdd573ca638ca83ee62cc80a7f4adba80aaf9c60c35000a0c21e0000eadc0855adb415fa69a76fc10397dc2fb37039a000'
    );
  });

    it('Should return a hex string without watermark', () => {
    const bytes = 'a4586adf1c2eae408d5ccbbaab186768457702c442b0b11edd0a674761699cc16c008097b09b3bfdd573ca638ca83ee62cc80a7f4adba80aaf9c60c35000a0c21e0000eadc0855adb415fa69a76fc10397dc2fb37039a000';
    let watermark;
    const transaction = appendWatermark(bytes, watermark);
    expect(transaction).toEqual(
      'a4586adf1c2eae408d5ccbbaab186768457702c442b0b11edd0a674761699cc16c008097b09b3bfdd573ca638ca83ee62cc80a7f4adba80aaf9c60c35000a0c21e0000eadc0855adb415fa69a76fc10397dc2fb37039a000'
    );
  });

  it('Public key returned by ledger device should be compressed adequately for tz1 before b58 encoding', () => {
    const buff = Buffer.from('02063ed375b28dd2c1841138d4959f57b4a2715730e2e28fcda9144a19876dd3c6', 'hex');
    const compressbuff = compressPublicKey(buff, 0x00);
    const compressbuff2hex = Buffer.from(compressbuff).toString('hex');
    expect(compressbuff2hex).toEqual(
      '063ed375b28dd2c1841138d4959f57b4a2715730e2e28fcda9144a19876dd3c6'
    );
  });

  it('Public key returned by ledger device should be compressed adequately for tz2 before b58 encoding', () => {
    const buff = Buffer.from('04589caa8a1bc3b254ce32174daaded368a7e88f883bd4780a5ddb3d4f06d96f1805cec3577cf22d9f9a6f206d7f8fa5f7cb27d92f1cd8272b36cdcd080a670802', 'hex');
    const compressbuff = compressPublicKey(buff, 0x01);
    const compressbuff2hex = Buffer.from(compressbuff).toString('hex');
    expect(compressbuff2hex).toEqual(
      '02589caa8a1bc3b254ce32174daaded368a7e88f883bd4780a5ddb3d4f06d96f18'
    );
  });

  it('Public key returned by ledger device should be compressed adequately for tz3 before b58 encoding', () => {
    const buff = Buffer.from('042c51e6f861c41f98833c7654c682ff10c2bfd5bb2f8c045b97479001520dfe1a178629f337b8d51c016c1ab84144243c1db462227cd3a0c699dd73bc57a7f0d3', 'hex');
    const compressbuff = compressPublicKey(buff, 0x02);
    const compressbuff2hex = Buffer.from(compressbuff).toString('hex');
    expect(compressbuff2hex).toEqual(
      '032c51e6f861c41f98833c7654c682ff10c2bfd5bb2f8c045b97479001520dfe1a'
    );
  });

  it('Should convert default path to buffer', () => {
    const path = "44'/1729'/0'/0'/0'";
    const buff = transformPathToBuffer(path);
    const buff2hex = Buffer.from(buff).toString('hex');
    expect(buff2hex).toEqual(
      '058000002c800006c1800000008000000080000000'
    );
  });

  it('Should convert path to buffer', () => {
    const path = "44'/1729'/0'/1'";
    const buff = transformPathToBuffer(path);
    const buff2hex = Buffer.from(buff).toString('hex');
    expect(buff2hex).toEqual(
      '048000002c800006c18000000080000001'
    );
  });

  it('Should split tansaction into 2 buffers', () => {
    let messageToSend = [] as any;
    const transaction = '03463a2292aed955c12d81802c8db5274031d7f226d153d545e935ccf77afe854e6d02686932f282fea132ce940aa79bf6e88b43395b19d00faf8168bb78c2030000000000b702000000b205000764045b0000000a2564656372656d656e74045b0000000a25696e6372656d656e740501035b0502020000008303210317057000010321057100020316072e020000002b032105700002032105710003034203210317057000010321057100020316034b051f020000000405200002020000002b0321057000020321057100030342032103170570000103210571000203160312051f020000000405200002053d036d0342051f020000000405200002000000020000';
    const transactionBuff = Buffer.from(transaction, 'hex');
    messageToSend = chunkOperation(messageToSend, transactionBuff)
    expect(messageToSend.length).toEqual(2);
  });

  it('Should return only 1 buffer because size of transaction is under the max chunk size', () => {
    let messageToSend = [] as any;
    const transaction = '03463a2292aed955c12d81802c8db5';
    const transactionBuff = Buffer.from(transaction, 'hex');
    messageToSend = chunkOperation(messageToSend, transactionBuff)
    expect(messageToSend.length).toEqual(1);
  });

  it('Should split tansaction into 3 buffers', () => {
    let messageToSend = [] as any;
    const transaction = '03463a2292aed955c12d81802c8db5274031d7f226d153d545e935ccf77afe854e6d02686932f282fea132ce940aa79bf6e88b43395b19d00faf8168bb78c2030000000000b702000000b205000764045b0000000a2564656372656d656e74045b0000000a25696e6372656d656e740501035b0502020000008303210317057000010321057100020316072e020000002b032105700002032105710003034203210317057000010321057100020316034b051f020000000405200002020000002b0321057000020321057100030342032103170570000103210571000203160312051f020000000405200002053d036d0342051f02000000040520000200000002000003463a2292aed955c12d81802c8db5274031d7f226d153d545e935ccf77afe854e6d02686932f282fea132ce940aa79bf6e88b43395b19d00faf8168bb78c2030000000000b702000000b205000764045b0000000a2564656372656d656e74045b0000000a25696e6372656d656e740501035b0502020000008303210317057000010321057100020316072e020000002b032105700002032105710003034203210317057000010321057100020316034b051f020000000405200002020000002b0321057000020321057100030342032103170570000103210571000203160312051f020000000405200002053d036d0342051f020000000405200002000000020000';
    const transactionBuff = Buffer.from(transaction, 'hex');
    messageToSend = chunkOperation(messageToSend, transactionBuff)
    expect(messageToSend.length).toEqual(3);
  });

  it('Should validate signature from Ledger', () => {
    const response = '314402207e1bbf244cc6aedfca39c7acf1a838d13602a70248289bdecfa342c8907df5a1022030dddbd18046b7aba123a52736e232586f8acfccd039eaaef78dc63a3e2192039000';
    const responseBuff = Buffer.from(response, 'hex');
    const validation = validateResponse(responseBuff);
    expect(validation).toBe(true);
  });

  it('Should not validate signature from Ledger when first byte is not 0x31 or 0x30', () => {
    const response = '214402207e1bbf244cc6aedfca39c7acf1a838d13602a70248289bdecfa342c8907df5a1022030dddbd18046b7aba123a52736e232586f8acfccd039eaaef78dc63a3e2192039000';
    const responseBuff = Buffer.from(response, 'hex');
    const validation = validateResponse(responseBuff);
    expect(validation).toBe(false);
  });

  it('Should not validate signature from Ledger when byte after r_value is not 0x02', () => {
    const response = '314402207e1bbf244cc6aedfca39c7acf1a838d13602a70248289bdecfa342c8907df5a1052030dddbd18046b7aba123a52736e232586f8acfccd039eaaef78dc63a3e2192039000';
    const responseBuff = Buffer.from(response, 'hex');
    const validation = validateResponse(responseBuff);
    expect(validation).toBe(false);
  });

  it('Should not validate signature from Ledger when third byte is not 0x02', () => {
    const response = '314408207e1bbf244cc6aedfca39c7acf1a838d13602a70248289bdecfa342c8907df5a1022030dddbd18046b7aba123a52736e232586f8acfccd039eaaef78dc63a3e2192039000';
    const responseBuff = Buffer.from(response, 'hex');
    const validation = validateResponse(responseBuff);
    expect(validation).toBe(false);
  });

  it('Should not validate signature from Ledger when second byte +4 is not equal to response length', () => {
    const response = '310002207e1bbf244cc6aedfca39c7acf1a838d13602a70248289bdecfa342c8907df5a1022030dddbd18046b7aba123a52736e232586f8acfccd039eaaef78dc63a3e2192039000';
    const responseBuff = Buffer.from(response, 'hex');
    const validation = validateResponse(responseBuff);
    expect(validation).toBe(false);
  });

  it('Should extract the rigth part from the signature returned by the Ledger', () => {
    const response = '314402207e1bbf244cc6aedfca39c7acf1a838d13602a70248289bdecfa342c8907df5a1022030dddbd18046b7aba123a52736e232586f8acfccd039eaaef78dc63a3e2192039000';
    const responseBuff = Buffer.from(response, 'hex');
    const value = extractValue(3, responseBuff)
    expect(value.buffer).toEqual(Buffer.from('7e1bbf244cc6aedfca39c7acf1a838d13602a70248289bdecfa342c8907df5a1', 'hex'));
  });

});
