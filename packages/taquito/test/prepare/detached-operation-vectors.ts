import { OpKind } from '@taquito/rpc';
import { ForgeParams } from '@taquito/local-forging';

interface OperationVector {
  scheme: string;
  operationKind?: string;
  protocol: string;
  pkh: string;
  publicKey: string;
  proof?: string;
  operation: ForgeParams;
  unsignedBytes: string;
  watermarkedBytes: string;
  blake2bDigest: string;
  signature: string;
  signedBytes: string;
}

export default {
  octezVersion: 'e5d8a6b8 (2026-10-15 09:10:29 +0200) (Octez 25.3 (build: 0))',
  provenance:
    'Generated and signature-checked with local Octez. Full signed bytes come from forge/signed_operations. BLS proof generated and checked by Octez. Blake2b digest uses Python hashlib. These are generated fixture keys, not funded accounts.',
  vectors: [
    {
      scheme: 'ed25519',
      operationKind: 'transaction',
      protocol: 'PrihK96nBAFSxVL1GLJTVhu9YnzkMFiBeuJRPA8NwuZVZCE1L6i',
      pkh: 'tz1TAhwoVn2gPNquA8GGnV8Zz9M1RmZNBwd5',
      publicKey: 'edpkv1MAWpH1dj6YYY9wMgonu2Ek3hHV6cuUVxVzZtYGFYfjsDmbPo',
      operation: {
        branch: 'BLockGenesisGenesisGenesisGenesisGenesisCCCCCeZiLHU',
        contents: [
          {
            kind: OpKind.TRANSACTION,
            source: 'tz1TAhwoVn2gPNquA8GGnV8Zz9M1RmZNBwd5',
            fee: '1000',
            counter: '1',
            gas_limit: '1040',
            storage_limit: '0',
            amount: '1',
            destination: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
          },
        ],
      },
      unsignedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86c00529620507a1812a63a1c4d2834cda5bc16559406e807019008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      watermarkedBytes:
        '038fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86c00529620507a1812a63a1c4d2834cda5bc16559406e807019008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      blake2bDigest: 'ee0228e605cb70cefa3b6fe44017700818168510aa5a9ef740c45e87113a1772',
      signature:
        'edsigtqQ9EXoaenZp8uRrtxr8YaXbVEp5K6ig1QgXxygrNzd4MWjBH88vYcEYwraXf2sJazF2SGGxvzJj7NpHXo2MPE6XKrN98v',
      signedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86c00529620507a1812a63a1c4d2834cda5bc16559406e807019008000100006b82198cb179e8306c1bedd08f12dc863f328886008678d3741fad7a9fea44ff0d760f04d7ace79e971554af92befc5bcacdb4220bd87f816d8009070984c2430ef5ee05ee86e96341bebfa773e1d10489a60b9f01',
    },
    {
      scheme: 'ed25519',
      operationKind: 'reveal',
      protocol: 'PrihK96nBAFSxVL1GLJTVhu9YnzkMFiBeuJRPA8NwuZVZCE1L6i',
      pkh: 'tz1TAhwoVn2gPNquA8GGnV8Zz9M1RmZNBwd5',
      publicKey: 'edpkv1MAWpH1dj6YYY9wMgonu2Ek3hHV6cuUVxVzZtYGFYfjsDmbPo',
      operation: {
        branch: 'BLockGenesisGenesisGenesisGenesisGenesisCCCCCeZiLHU',
        contents: [
          {
            kind: OpKind.REVEAL,
            source: 'tz1TAhwoVn2gPNquA8GGnV8Zz9M1RmZNBwd5',
            fee: '5000',
            counter: '1',
            gas_limit: '10000',
            storage_limit: '0',
            public_key: 'edpkv1MAWpH1dj6YYY9wMgonu2Ek3hHV6cuUVxVzZtYGFYfjsDmbPo',
          },
        ],
      },
      unsignedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b00529620507a1812a63a1c4d2834cda5bc16559406882701904e0000b3a981503605953fa4df24125fb2501a060f8a2fdcb12e29102c428d2868bc9600',
      watermarkedBytes:
        '038fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b00529620507a1812a63a1c4d2834cda5bc16559406882701904e0000b3a981503605953fa4df24125fb2501a060f8a2fdcb12e29102c428d2868bc9600',
      blake2bDigest: '085e79e407acc7dff31cca95931cf9ba773ee4989d08f398133a36ba93bd0c19',
      signature:
        'edsigu4xWvJbxYaYT33rVx5NZntJ5TitNHPc3aux9raPvJBkFahcXqHJzoXXjqnqoMwxfwV3iUxNVxZMFM3neMt8Hq5atTJ6xoy',
      signedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b00529620507a1812a63a1c4d2834cda5bc16559406882701904e0000b3a981503605953fa4df24125fb2501a060f8a2fdcb12e29102c428d2868bc9600ee1aeb88fc0f790483f3813bd014e464d682ab44b50d9657a7c1f671ebfabda91359457f71bbeb03d30cb3b6b82c306dcd23b2b03309d912b2568e01b3c0800d',
    },
    {
      scheme: 'ed25519',
      operationKind: 'reveal-batch',
      protocol: 'PrihK96nBAFSxVL1GLJTVhu9YnzkMFiBeuJRPA8NwuZVZCE1L6i',
      pkh: 'tz1TAhwoVn2gPNquA8GGnV8Zz9M1RmZNBwd5',
      publicKey: 'edpkv1MAWpH1dj6YYY9wMgonu2Ek3hHV6cuUVxVzZtYGFYfjsDmbPo',
      operation: {
        branch: 'BLockGenesisGenesisGenesisGenesisGenesisCCCCCeZiLHU',
        contents: [
          {
            kind: OpKind.REVEAL,
            source: 'tz1TAhwoVn2gPNquA8GGnV8Zz9M1RmZNBwd5',
            fee: '5000',
            counter: '1',
            gas_limit: '10000',
            storage_limit: '0',
            public_key: 'edpkv1MAWpH1dj6YYY9wMgonu2Ek3hHV6cuUVxVzZtYGFYfjsDmbPo',
          },
          {
            kind: OpKind.TRANSACTION,
            source: 'tz1TAhwoVn2gPNquA8GGnV8Zz9M1RmZNBwd5',
            fee: '1000',
            counter: '2',
            gas_limit: '1040',
            storage_limit: '0',
            amount: '1',
            destination: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
          },
        ],
      },
      unsignedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b00529620507a1812a63a1c4d2834cda5bc16559406882701904e0000b3a981503605953fa4df24125fb2501a060f8a2fdcb12e29102c428d2868bc96006c00529620507a1812a63a1c4d2834cda5bc16559406e807029008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      watermarkedBytes:
        '038fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b00529620507a1812a63a1c4d2834cda5bc16559406882701904e0000b3a981503605953fa4df24125fb2501a060f8a2fdcb12e29102c428d2868bc96006c00529620507a1812a63a1c4d2834cda5bc16559406e807029008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      blake2bDigest: 'd31f05e93b59f40039212e3b3f147f0f8041fe96779b50d96643dff5476bf515',
      signature:
        'edsigtqzDBWCYPuR9gYqaNbe6Nx87qWrKDCZ6qnLcqsEN5DZ2XMU4RbDQw2ck51fFWexa4ym6EESu2rAQgLPB24KwAyp4j8eojk',
      signedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b00529620507a1812a63a1c4d2834cda5bc16559406882701904e0000b3a981503605953fa4df24125fb2501a060f8a2fdcb12e29102c428d2868bc96006c00529620507a1812a63a1c4d2834cda5bc16559406e807029008000100006b82198cb179e8306c1bedd08f12dc863f328886008af6305b99c0ce22ec11eedde2dd9accb9d120bc593dc02d9dc87191346c965837ec0e56be957f2f9bb5e79ecdd04f221fbe4c6b98defb404b418e3598a8aa01',
    },
    {
      scheme: 'secp256k1',
      operationKind: 'transaction',
      protocol: 'PrihK96nBAFSxVL1GLJTVhu9YnzkMFiBeuJRPA8NwuZVZCE1L6i',
      pkh: 'tz2UhW2gVBVauVCgFwGCuKMkmAE7bYsQU3gv',
      publicKey: 'sppk7a6ah9jFX1QhCApZdzAuzTENsnz6RXW114mo6DFrPyfsCkufkyp',
      operation: {
        branch: 'BLockGenesisGenesisGenesisGenesisGenesisCCCCCeZiLHU',
        contents: [
          {
            kind: OpKind.TRANSACTION,
            source: 'tz2UhW2gVBVauVCgFwGCuKMkmAE7bYsQU3gv',
            fee: '1000',
            counter: '1',
            gas_limit: '1040',
            storage_limit: '0',
            amount: '1',
            destination: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
          },
        ],
      },
      unsignedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86c01df987ed364e9387f54c30fbba7fb842dff7c1387e807019008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      watermarkedBytes:
        '038fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86c01df987ed364e9387f54c30fbba7fb842dff7c1387e807019008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      blake2bDigest: '0b9126d79054f4abe8afe1583eef844edf5610d7cf326c64d35bb8d421feec33',
      signature:
        'spsig1LXEdiJ1DNERBh7vzmKwKc6g9mbzG1DEsXsb9vbU4PVchcgPrrJKFqYAymYVASLLbHwB9ZkF7pQD46nneU8jiiQLh3o29x',
      signedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86c01df987ed364e9387f54c30fbba7fb842dff7c1387e807019008000100006b82198cb179e8306c1bedd08f12dc863f328886007072bec8f0bc86842382919a9d6ded7f8381a463fa8d617cd605b9473270bca6332add8c4e4a8f15cfa8973419e0a13a5b73e7074353876c6449e505579466cd',
    },
    {
      scheme: 'secp256k1',
      operationKind: 'reveal',
      protocol: 'PrihK96nBAFSxVL1GLJTVhu9YnzkMFiBeuJRPA8NwuZVZCE1L6i',
      pkh: 'tz2UhW2gVBVauVCgFwGCuKMkmAE7bYsQU3gv',
      publicKey: 'sppk7a6ah9jFX1QhCApZdzAuzTENsnz6RXW114mo6DFrPyfsCkufkyp',
      operation: {
        branch: 'BLockGenesisGenesisGenesisGenesisGenesisCCCCCeZiLHU',
        contents: [
          {
            kind: OpKind.REVEAL,
            source: 'tz2UhW2gVBVauVCgFwGCuKMkmAE7bYsQU3gv',
            fee: '5000',
            counter: '1',
            gas_limit: '10000',
            storage_limit: '0',
            public_key: 'sppk7a6ah9jFX1QhCApZdzAuzTENsnz6RXW114mo6DFrPyfsCkufkyp',
          },
        ],
      },
      unsignedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b01df987ed364e9387f54c30fbba7fb842dff7c1387882701904e000102685327a16a388112695d779108d8cc4b9b146fa3fe272060ae2506b4a9f25bc600',
      watermarkedBytes:
        '038fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b01df987ed364e9387f54c30fbba7fb842dff7c1387882701904e000102685327a16a388112695d779108d8cc4b9b146fa3fe272060ae2506b4a9f25bc600',
      blake2bDigest: '35f74c854a4a678f2c1abfa8f3f43b4cc07a216a958044877d2520bc9ffef091',
      signature:
        'spsig1KTDYCAThVA2KCEK85Cth8R3Mssyx1RqPt8ZM5utBB2pLFGddJEw8D5EKVnwUj6uwLvoME49Twz6JVbg6QQyZYQgEWC9Wk',
      signedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b01df987ed364e9387f54c30fbba7fb842dff7c1387882701904e000102685327a16a388112695d779108d8cc4b9b146fa3fe272060ae2506b4a9f25bc6006846660b029ddaff7ef07163a61226beef1b9fcb45ca4b26ccb0d7411eb0719a3673f3b29295fdbc3da0ba4a9acf5db034abb7b7e22573d51f1258fc77f0cbec',
    },
    {
      scheme: 'secp256k1',
      operationKind: 'reveal-batch',
      protocol: 'PrihK96nBAFSxVL1GLJTVhu9YnzkMFiBeuJRPA8NwuZVZCE1L6i',
      pkh: 'tz2UhW2gVBVauVCgFwGCuKMkmAE7bYsQU3gv',
      publicKey: 'sppk7a6ah9jFX1QhCApZdzAuzTENsnz6RXW114mo6DFrPyfsCkufkyp',
      operation: {
        branch: 'BLockGenesisGenesisGenesisGenesisGenesisCCCCCeZiLHU',
        contents: [
          {
            kind: OpKind.REVEAL,
            source: 'tz2UhW2gVBVauVCgFwGCuKMkmAE7bYsQU3gv',
            fee: '5000',
            counter: '1',
            gas_limit: '10000',
            storage_limit: '0',
            public_key: 'sppk7a6ah9jFX1QhCApZdzAuzTENsnz6RXW114mo6DFrPyfsCkufkyp',
          },
          {
            kind: OpKind.TRANSACTION,
            source: 'tz2UhW2gVBVauVCgFwGCuKMkmAE7bYsQU3gv',
            fee: '1000',
            counter: '2',
            gas_limit: '1040',
            storage_limit: '0',
            amount: '1',
            destination: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
          },
        ],
      },
      unsignedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b01df987ed364e9387f54c30fbba7fb842dff7c1387882701904e000102685327a16a388112695d779108d8cc4b9b146fa3fe272060ae2506b4a9f25bc6006c01df987ed364e9387f54c30fbba7fb842dff7c1387e807029008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      watermarkedBytes:
        '038fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b01df987ed364e9387f54c30fbba7fb842dff7c1387882701904e000102685327a16a388112695d779108d8cc4b9b146fa3fe272060ae2506b4a9f25bc6006c01df987ed364e9387f54c30fbba7fb842dff7c1387e807029008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      blake2bDigest: '43cb3dae47bca9736902e0c460810279d9b89cfeedc2d0210c6d17771b851d3a',
      signature:
        'spsig1Fo32wH77Nzqm17NfTpQ76C7GTccznWtqtJaWVRKhxRAccLqVTCkZfmZYxA2bE2TAbPvKvtzrXtxWf1dnJNHt8zy8NdbsM',
      signedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b01df987ed364e9387f54c30fbba7fb842dff7c1387882701904e000102685327a16a388112695d779108d8cc4b9b146fa3fe272060ae2506b4a9f25bc6006c01df987ed364e9387f54c30fbba7fb842dff7c1387e807029008000100006b82198cb179e8306c1bedd08f12dc863f328886004c4ffdb3de1c5e1e252ff79fb64c66188313a1ad6434ec7be2f5ac00b63f8da071981bc2b9190b7c50b99b2468265d904d9c412a398d66772761245d20075c60',
    },
    {
      scheme: 'p256',
      operationKind: 'transaction',
      protocol: 'PrihK96nBAFSxVL1GLJTVhu9YnzkMFiBeuJRPA8NwuZVZCE1L6i',
      pkh: 'tz3PYbU3DSjdbGsDummVCJ3x6sYJYTGr3rNp',
      publicKey: 'p2pk68NNUPkEdqRGMPVL9EEHEiXeLg7WRxCMSBfR23LYSmeAZF5GKxH',
      operation: {
        branch: 'BLockGenesisGenesisGenesisGenesisGenesisCCCCCeZiLHU',
        contents: [
          {
            kind: OpKind.TRANSACTION,
            source: 'tz3PYbU3DSjdbGsDummVCJ3x6sYJYTGr3rNp',
            fee: '1000',
            counter: '1',
            gas_limit: '1040',
            storage_limit: '0',
            amount: '1',
            destination: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
          },
        ],
      },
      unsignedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86c022347f5009651bcd13a4d7c024f9173242ae0307ce807019008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      watermarkedBytes:
        '038fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86c022347f5009651bcd13a4d7c024f9173242ae0307ce807019008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      blake2bDigest: 'bca3a347486fe4a35a7e1d96f6b719bace4ed4b3438ccb565649cadbd6df0ec5',
      signature:
        'p2sigrN5KEwcZVoiDu73TBXHkpHFZsJLKXFU81BbRx3nxAAFkBir9mvYCbM72KhbvVbmfi9ofguEYbhL14xYuS8FUxVaUEdr2N',
      signedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86c022347f5009651bcd13a4d7c024f9173242ae0307ce807019008000100006b82198cb179e8306c1bedd08f12dc863f32888600de221f64b0c36a3557e199fdfc45ff301e75cd8fe890858e48986510f1650853ce9519a178c0b149578dbf8d5797f817d0271360e2a28bd264a66e15121f7eb5',
    },
    {
      scheme: 'p256',
      operationKind: 'reveal',
      protocol: 'PrihK96nBAFSxVL1GLJTVhu9YnzkMFiBeuJRPA8NwuZVZCE1L6i',
      pkh: 'tz3PYbU3DSjdbGsDummVCJ3x6sYJYTGr3rNp',
      publicKey: 'p2pk68NNUPkEdqRGMPVL9EEHEiXeLg7WRxCMSBfR23LYSmeAZF5GKxH',
      operation: {
        branch: 'BLockGenesisGenesisGenesisGenesisGenesisCCCCCeZiLHU',
        contents: [
          {
            kind: OpKind.REVEAL,
            source: 'tz3PYbU3DSjdbGsDummVCJ3x6sYJYTGr3rNp',
            fee: '5000',
            counter: '1',
            gas_limit: '10000',
            storage_limit: '0',
            public_key: 'p2pk68NNUPkEdqRGMPVL9EEHEiXeLg7WRxCMSBfR23LYSmeAZF5GKxH',
          },
        ],
      },
      unsignedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b022347f5009651bcd13a4d7c024f9173242ae0307c882701904e000203f40294e91a77681e18bb415d0380b5685266fe1c51742fdc1e485d04b091624700',
      watermarkedBytes:
        '038fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b022347f5009651bcd13a4d7c024f9173242ae0307c882701904e000203f40294e91a77681e18bb415d0380b5685266fe1c51742fdc1e485d04b091624700',
      blake2bDigest: 'af892bd2bf285ac3772fbc182a2fa5ef9fc971eddea47a90550bd03eff83c236',
      signature:
        'p2siguooTZoeQfH22VKy5ZCRc5628p75KQ42PRv5AbgPE9P5UNJeGEhurKE6fhjRvQd91sGcoNTcwcFmyMuRcS2tdPpMkBnNef',
      signedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b022347f5009651bcd13a4d7c024f9173242ae0307c882701904e000203f40294e91a77681e18bb415d0380b5685266fe1c51742fdc1e485d04b091624700f87459841d342e4b20ce03127679739bbe8a14aa74cef1c9a77b7983ab82744e0418b45e8da0cfa2f6087cedd114c58cfefed56ca6dac6b521d9fc1c35269713',
    },
    {
      scheme: 'p256',
      operationKind: 'reveal-batch',
      protocol: 'PrihK96nBAFSxVL1GLJTVhu9YnzkMFiBeuJRPA8NwuZVZCE1L6i',
      pkh: 'tz3PYbU3DSjdbGsDummVCJ3x6sYJYTGr3rNp',
      publicKey: 'p2pk68NNUPkEdqRGMPVL9EEHEiXeLg7WRxCMSBfR23LYSmeAZF5GKxH',
      operation: {
        branch: 'BLockGenesisGenesisGenesisGenesisGenesisCCCCCeZiLHU',
        contents: [
          {
            kind: OpKind.REVEAL,
            source: 'tz3PYbU3DSjdbGsDummVCJ3x6sYJYTGr3rNp',
            fee: '5000',
            counter: '1',
            gas_limit: '10000',
            storage_limit: '0',
            public_key: 'p2pk68NNUPkEdqRGMPVL9EEHEiXeLg7WRxCMSBfR23LYSmeAZF5GKxH',
          },
          {
            kind: OpKind.TRANSACTION,
            source: 'tz3PYbU3DSjdbGsDummVCJ3x6sYJYTGr3rNp',
            fee: '1000',
            counter: '2',
            gas_limit: '1040',
            storage_limit: '0',
            amount: '1',
            destination: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
          },
        ],
      },
      unsignedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b022347f5009651bcd13a4d7c024f9173242ae0307c882701904e000203f40294e91a77681e18bb415d0380b5685266fe1c51742fdc1e485d04b0916247006c022347f5009651bcd13a4d7c024f9173242ae0307ce807029008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      watermarkedBytes:
        '038fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b022347f5009651bcd13a4d7c024f9173242ae0307c882701904e000203f40294e91a77681e18bb415d0380b5685266fe1c51742fdc1e485d04b0916247006c022347f5009651bcd13a4d7c024f9173242ae0307ce807029008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      blake2bDigest: '75aa11efc49d701a22271fc5d4a6d6cac2606dc297d698273a2003a1354b6252',
      signature:
        'p2sigqifXrAce5f23Q3MV4jZ1QAB1EY9nyw4ZS2WjwhDJUW9PTW7DpNmvnFKaZkNfsk5VwT1AksWCy9sFibQfudGf8UbS6bkqY',
      signedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b022347f5009651bcd13a4d7c024f9173242ae0307c882701904e000203f40294e91a77681e18bb415d0380b5685266fe1c51742fdc1e485d04b0916247006c022347f5009651bcd13a4d7c024f9173242ae0307ce807029008000100006b82198cb179e8306c1bedd08f12dc863f32888600d93402b082676d78f7c4d963a59a3eeb0e82a45b77943a36ef46ff16733d4b7f0e11aa887ae2071438bedd1866c546fa888a5691483d0954cf1c682cfbf20deb',
    },
    {
      scheme: 'bls',
      operationKind: 'transaction',
      protocol: 'PrihK96nBAFSxVL1GLJTVhu9YnzkMFiBeuJRPA8NwuZVZCE1L6i',
      pkh: 'tz4SVGA6HiNRXKBUMbBB2DPZd7XTsiCqF6tY',
      publicKey: 'BLpk1qebLNivJ7mpBRyaZTyMav2RQaPUsqJC7iA2XEEs9rqGdxRSKAr27vS28jXTfiHTWaP3yaED',
      proof:
        'BLsigAwRi1VJusWU2Db8ZgTsmEpAbJDQ9TWJfgC44Q4mVyctK5mgKKGohHdEMWk1NDqTNJtLz7GzZprMsrhtoFUjWzJonxRu8jLhZhhAtaBTVKyBG6naBkqNWAVkanxGnVWtBtW1mpLH5b',
      operation: {
        branch: 'BLockGenesisGenesisGenesisGenesisGenesisCCCCCeZiLHU',
        contents: [
          {
            kind: OpKind.TRANSACTION,
            source: 'tz4SVGA6HiNRXKBUMbBB2DPZd7XTsiCqF6tY',
            fee: '1000',
            counter: '1',
            gas_limit: '1040',
            storage_limit: '0',
            amount: '1',
            destination: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
          },
        ],
      },
      unsignedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86c03bfc6436543110b9d08898c8f31d496ebcfb915b8e807019008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      watermarkedBytes:
        '038fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86c03bfc6436543110b9d08898c8f31d496ebcfb915b8e807019008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      blake2bDigest: '74dd1a99880adb00489fc6c7033f07c4658d5477777208f9927942566bcec206',
      signature:
        'BLsig9drwWme9D3DNr3ktXYZMy5FkJFZpPxZ9FCpLnAEtMMqErjywWzuFHRy33eqMic1n2JN6po1UPNtm8WGYsdBhXfpWQacDjEYVaZoZVZ78yMJwwCFkrjrd4ZG2mJBAERVahisc9Ggzk',
      signedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86c03bfc6436543110b9d08898c8f31d496ebcfb915b8e807019008000100006b82198cb179e8306c1bedd08f12dc863f32888600ff0383598d1658d895c720a59348d46c7d592a8a0b26d245a912735d0220441e1810157443c34be7154f582a3d61f9d272c4188f7898b621fa28f0e806ffdef1d00370ce93cb3949f78b158271a8d2f5f10aad5e1e87ce075565eeea5c68affddb3a',
    },
    {
      scheme: 'bls',
      operationKind: 'reveal',
      protocol: 'PrihK96nBAFSxVL1GLJTVhu9YnzkMFiBeuJRPA8NwuZVZCE1L6i',
      pkh: 'tz4SVGA6HiNRXKBUMbBB2DPZd7XTsiCqF6tY',
      publicKey: 'BLpk1qebLNivJ7mpBRyaZTyMav2RQaPUsqJC7iA2XEEs9rqGdxRSKAr27vS28jXTfiHTWaP3yaED',
      proof:
        'BLsigAwRi1VJusWU2Db8ZgTsmEpAbJDQ9TWJfgC44Q4mVyctK5mgKKGohHdEMWk1NDqTNJtLz7GzZprMsrhtoFUjWzJonxRu8jLhZhhAtaBTVKyBG6naBkqNWAVkanxGnVWtBtW1mpLH5b',
      operation: {
        branch: 'BLockGenesisGenesisGenesisGenesisGenesisCCCCCeZiLHU',
        contents: [
          {
            kind: OpKind.REVEAL,
            source: 'tz4SVGA6HiNRXKBUMbBB2DPZd7XTsiCqF6tY',
            fee: '5000',
            counter: '1',
            gas_limit: '10000',
            storage_limit: '0',
            public_key:
              'BLpk1qebLNivJ7mpBRyaZTyMav2RQaPUsqJC7iA2XEEs9rqGdxRSKAr27vS28jXTfiHTWaP3yaED',
            proof:
              'BLsigAwRi1VJusWU2Db8ZgTsmEpAbJDQ9TWJfgC44Q4mVyctK5mgKKGohHdEMWk1NDqTNJtLz7GzZprMsrhtoFUjWzJonxRu8jLhZhhAtaBTVKyBG6naBkqNWAVkanxGnVWtBtW1mpLH5b',
          },
        ],
      },
      unsignedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b03bfc6436543110b9d08898c8f31d496ebcfb915b8882701904e000394d9bba85e71070f112498d2c315259f708fac670645c117545e193e102aec16beb06d4396463df37f0edd0e8aae222aff00000060a4df70e2e238fabf27ec427fcca7ba0afdb895653cee68f09d457bb4703287f1fbefa002bd89e71435e9589c5c4a850d1371531a05a605a43c6b1a982df5da809641861e216fc4088debb0c5b4e947192755ba428b1c18c5904c4d5300aa6dc2',
      watermarkedBytes:
        '038fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b03bfc6436543110b9d08898c8f31d496ebcfb915b8882701904e000394d9bba85e71070f112498d2c315259f708fac670645c117545e193e102aec16beb06d4396463df37f0edd0e8aae222aff00000060a4df70e2e238fabf27ec427fcca7ba0afdb895653cee68f09d457bb4703287f1fbefa002bd89e71435e9589c5c4a850d1371531a05a605a43c6b1a982df5da809641861e216fc4088debb0c5b4e947192755ba428b1c18c5904c4d5300aa6dc2',
      blake2bDigest: 'd69394733922d0978a0a3fb35f72667d6684b873c3677dccc0f9802cc8ff9975',
      signature:
        'BLsigBQ3RwURX9xgXLhNHVya4aTomPBnzSDBV2upKw2zw1taD3AmW9ebKKWYL7k691i5bqjz82AQXmbKkYnjRgAPstTY1aipz4eoSHphSjmWrgBca9S7JeRKfS5UVfJqh5NPhTau4hpgrz',
      signedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b03bfc6436543110b9d08898c8f31d496ebcfb915b8882701904e000394d9bba85e71070f112498d2c315259f708fac670645c117545e193e102aec16beb06d4396463df37f0edd0e8aae222aff00000060a4df70e2e238fabf27ec427fcca7ba0afdb895653cee68f09d457bb4703287f1fbefa002bd89e71435e9589c5c4a850d1371531a05a605a43c6b1a982df5da809641861e216fc4088debb0c5b4e947192755ba428b1c18c5904c4d5300aa6dc2ff03b0ae33dae1c987c73eaab934340fbb6f8374519d87648a0d337d84c77287843fdc001deb5b2f6e7a0d7c22902310af5b163ef9c9b53856d0d7709b7743dff97527db0bbff1a31066bfa758a5a309926e796e4c822e07b1f07ee23ec4f39e8bf4',
    },
    {
      scheme: 'bls',
      operationKind: 'reveal-batch',
      protocol: 'PrihK96nBAFSxVL1GLJTVhu9YnzkMFiBeuJRPA8NwuZVZCE1L6i',
      pkh: 'tz4SVGA6HiNRXKBUMbBB2DPZd7XTsiCqF6tY',
      publicKey: 'BLpk1qebLNivJ7mpBRyaZTyMav2RQaPUsqJC7iA2XEEs9rqGdxRSKAr27vS28jXTfiHTWaP3yaED',
      proof:
        'BLsigAwRi1VJusWU2Db8ZgTsmEpAbJDQ9TWJfgC44Q4mVyctK5mgKKGohHdEMWk1NDqTNJtLz7GzZprMsrhtoFUjWzJonxRu8jLhZhhAtaBTVKyBG6naBkqNWAVkanxGnVWtBtW1mpLH5b',
      operation: {
        branch: 'BLockGenesisGenesisGenesisGenesisGenesisCCCCCeZiLHU',
        contents: [
          {
            kind: OpKind.REVEAL,
            source: 'tz4SVGA6HiNRXKBUMbBB2DPZd7XTsiCqF6tY',
            fee: '5000',
            counter: '1',
            gas_limit: '10000',
            storage_limit: '0',
            public_key:
              'BLpk1qebLNivJ7mpBRyaZTyMav2RQaPUsqJC7iA2XEEs9rqGdxRSKAr27vS28jXTfiHTWaP3yaED',
            proof:
              'BLsigAwRi1VJusWU2Db8ZgTsmEpAbJDQ9TWJfgC44Q4mVyctK5mgKKGohHdEMWk1NDqTNJtLz7GzZprMsrhtoFUjWzJonxRu8jLhZhhAtaBTVKyBG6naBkqNWAVkanxGnVWtBtW1mpLH5b',
          },
          {
            kind: OpKind.TRANSACTION,
            source: 'tz4SVGA6HiNRXKBUMbBB2DPZd7XTsiCqF6tY',
            fee: '1000',
            counter: '2',
            gas_limit: '1040',
            storage_limit: '0',
            amount: '1',
            destination: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
          },
        ],
      },
      unsignedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b03bfc6436543110b9d08898c8f31d496ebcfb915b8882701904e000394d9bba85e71070f112498d2c315259f708fac670645c117545e193e102aec16beb06d4396463df37f0edd0e8aae222aff00000060a4df70e2e238fabf27ec427fcca7ba0afdb895653cee68f09d457bb4703287f1fbefa002bd89e71435e9589c5c4a850d1371531a05a605a43c6b1a982df5da809641861e216fc4088debb0c5b4e947192755ba428b1c18c5904c4d5300aa6dc26c03bfc6436543110b9d08898c8f31d496ebcfb915b8e807029008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      watermarkedBytes:
        '038fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b03bfc6436543110b9d08898c8f31d496ebcfb915b8882701904e000394d9bba85e71070f112498d2c315259f708fac670645c117545e193e102aec16beb06d4396463df37f0edd0e8aae222aff00000060a4df70e2e238fabf27ec427fcca7ba0afdb895653cee68f09d457bb4703287f1fbefa002bd89e71435e9589c5c4a850d1371531a05a605a43c6b1a982df5da809641861e216fc4088debb0c5b4e947192755ba428b1c18c5904c4d5300aa6dc26c03bfc6436543110b9d08898c8f31d496ebcfb915b8e807029008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      blake2bDigest: 'f321dec57d613838255ce6ae8700566459179e5a8fe7c89c2a1c304e34981696',
      signature:
        'BLsigBawdoVKrKCKUbd8o6hUBBggHPEy9jUeqhUpJHs2y8VZJ1SyH6qQ9PZuEMjzdFziR6jqcBRUakqTdHwnAj845yyRLNDeB9J26ZxyRSTtT4mdsfDkJ2BSMYVQHtGFmPr6jJ9iwFJL3d',
      signedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b03bfc6436543110b9d08898c8f31d496ebcfb915b8882701904e000394d9bba85e71070f112498d2c315259f708fac670645c117545e193e102aec16beb06d4396463df37f0edd0e8aae222aff00000060a4df70e2e238fabf27ec427fcca7ba0afdb895653cee68f09d457bb4703287f1fbefa002bd89e71435e9589c5c4a850d1371531a05a605a43c6b1a982df5da809641861e216fc4088debb0c5b4e947192755ba428b1c18c5904c4d5300aa6dc26c03bfc6436543110b9d08898c8f31d496ebcfb915b8e807029008000100006b82198cb179e8306c1bedd08f12dc863f32888600ff03b5841f0d0f65c5732a01e8f52a28776bf443f0a862088342ad3188b1d68094f444aaed45de26ca43f379e123023b1b2f0a3f2dace958a171e34be7a8fab0941325f8c60c3d2b901f35c20a114b91ea35d81918cf4c8713e5a9d78bd6fa2ab109',
    },
    {
      scheme: 'mldsa44',
      operationKind: 'transaction',
      protocol: 'PrihK96nBAFSxVL1GLJTVhu9YnzkMFiBeuJRPA8NwuZVZCE1L6i',
      pkh: 'tz5js29DnochJPALgNyB5iaV6MTACvZbhoLx',
      publicKey:
        'mdpk4CW7qtFjvaTntafPe8qoAqrYPzVJzArUW9hSWj3HRGTpfAmMwp61hpc878fYCpCVM7iBVi5tb4L2mQ5huW2XoY2hgLgVjXmm8dDY4SNLL9Z2qw7k2v2AHmyqTpRY9jn6Jv2exTKjRfsW7h2Vo8asaB6V9LqiVrWoWhePVCRZWoHbMikzRicoJUd99tiuobVfrDTfcqpMcp2TQbUvJx3LyS2fJizRf8kNcpXz4pAHDLyeAQKJSrToeJtGq9UaBzXRCsQRPSHPEWXDD1f64eTyd13h3WaraG27bQQSQZKvCHrG4HrY9SUGwnCwQRSRhCkdzwTs2svJwnWNk7ohK8ELBgpDUeoGemEv6gCyohtkWsRxapMXF1jrw8gEtge7j3pKKbAbgLNktYqRcvXPrCgo8dePbzqX3q188o9YqMCG61Xd7YhAd4VUYu8gAbQoKY8cRnxErNtEBr3KqjAnb7F31TADj1UneAA2TT2a8PaTGsJ1h8ox8jDJm1DBo7ekDdowdVcSK3hrhhZdoFaka3q7z4u1eyCRjnH2Ah4wwDXdn5ejmECUZ2LHBFXFMFELP8oJURzvx75VaJwkDRjSyrwZ5VVGFhs4maEh5j74ScxWDy8wc1hoPhkkM5nedo8x8sBSZxG2JuExbE1WECDAiE9hABg8uE1WuokEJEVNUANckHWRiKmGczXG4mPrFSFyYogNc6G6FpsFqecCZDtXitHCiYjZm3CvDtwKuyUfeBw6o35nLsmHZK8yFWQW3SvNyqt1vP1LuDFAqGRroAtyip5swhFwcSs2JhZKDsVULr66CNNkfb3n1nLXcCgvcXYB93Ly5eueD1ENU3JA4keoL1YZdaSzRZ7uFCiJVCuFAsamfmVFQK6fAK6EMJfnoLBXQ3k3DBEhdADK75cHgcr9vSJ2rjUgVjCvZeM2qtA3jnVvtDK5hvm1amC7YYtQC62bpKuAbf1jdAMTmU36UwaP6omw92rqJU9hSAskPmQJBCUv2NvG8SCVLsekJe5GKVpikhthmaYgLy76dzT273ASKrAGdHunMjWWXqBTzUSSNLLVssftBqYvD6B5HaBQPmNS8ZaqWuJaFsFu2gMiXsoPfnBNz24Kdfs637C4U9d1gjsVowa73p5bjrWJAiNQGBypZkNheVHmWv4QoYVVC954ZaDSLV93XE2VzyBaMDPC1DXwvV9wUYrP54qFjqTinnAAA9BBckwkVHn1iovKnqey3QK2sLYpEpWFi8Bpxr5RheCrgeuKMa4trn6xPwRce9TvZ9NCiofEGZ3LXq9WBhq2NMQ6py12aHHL8F1QV8YnSgFqc97f3cmPASnJHHRT8RJ5eMiJ3J2cf8rstNYBzoc5PUryWugUMrz4NhkfhFAwiTWtwePp7oSrmPc376BWi71oATzAXz9oMK72EtTeNRcRDNBJgBpqetM6HKNEjQtzMor6sPPT9zuaooCnsC5QvfXpHVpecBs4ndtWWyXyR13ErkUSTKhXxyZ3A7D9n8jAPPi4w18MCgFpQcQrkhP84ccaux8L11zh4PchuETbapuWALs3NAp9RNz2ZPL6Ts9zzdLGDGYup8GHQkVnH2s4HoquvqdwQjABfL67Bx4Br2K9U4TGUpCpuz3nxED5dZQ4oFk8dEvX6MbppdgMaojfxZNW4EQM2SQZ68FN5w3QMeqwW5ese8NMTZUzhAMRhqbNZNCcRVzgpFS88Ejx1CMBaz4x9M2VkZjyL6SJndnuLeFhYJvVLZZXuSc6LRGDB3CJCSPANvsCChWJAoK2wLRSjhVaFY9wmyeeGJ',
      operation: {
        branch: 'BLockGenesisGenesisGenesisGenesisGenesisCCCCCeZiLHU',
        contents: [
          {
            kind: OpKind.TRANSACTION,
            source: 'tz5js29DnochJPALgNyB5iaV6MTACvZbhoLx',
            fee: '1000',
            counter: '1',
            gas_limit: '1040',
            storage_limit: '0',
            amount: '1',
            destination: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
          },
        ],
      },
      unsignedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86c04fa9526291236732263e4b5556aa14005f193e780e807019008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      watermarkedBytes:
        '038fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86c04fa9526291236732263e4b5556aa14005f193e780e807019008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      blake2bDigest: 'c21ac8e7de874ce8dc4e09549be8d1a96547d9d99e58ead50f36085bcab4332e',
      signature:
        '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',
      signedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86c04fa9526291236732263e4b5556aa14005f193e780e807019008000100006b82198cb179e8306c1bedd08f12dc863f32888600ff04d10651cdf46244cd78b34de0f3f75af742155fcab675279c36a2205c731c22ec980e7ee8e40b6f83133be633158e02208159598f9c0aa4510358c0106b04c492d4f69f378df9f9ed7e95b08d8708cda594439f301c67bdf15acc1927bfa5b75f480252c40e39d82c7d255fcc15cb0bd01a60509ff2ca9b47c046fe6384f057c990fe1e10c279ca25ab57057c1cd26c3f25fc78735884f2e48ad5832435482176aa3dc0ef6b0b3ecd146fc5deb5ead8f90ed887039f49d9b8a2f60bbc61bf1ff37ed9437ae128dda66251a5e4f18fab6d2417af94f26ef07bc9ec631a0bfabbee6d05a9fee165f96cc5fff0fd92265eec5366cddbd414b46e173c375754d88ff34f183e6d71f48e5fae27a86e4af5d1dd3d187ad0b85315862215db1e18ecfe2565000c03df96805bc4a27b7b1d7ca524a77c6b1388ae093bee424eeb19299fa7b5e1ada40f7a9d7937105adea0b0b5941ca8eb5e3088a10550013516b7c9bed8d79888ec457d0fdbb6f78642a6a29623ac80cb2d9b2a419d2f01ce51c02ed8b702114eb1777d131c1545dcae5f6acd95aab515a22e5115af718f9f07e2d691f5f5dad7d113ccf607687337fae5585353b44aeaaa89eb88ac4145bf454fa45b1e54745be970a5ce732041e9bb150d1a0ec9c0ac43f2e4860d92325dde192425f6f5c6572953f0d5aa0d6586b5b2a30c79872276e2a8aa418104c01cc8b1c0f9cc564da45e8c5f339b2d92517bdd5b6023991c43152487f13551049df89c31e3fc9914f550d5a08aeaaa2e8bed16cd096c052aaf7a82c195acec8bce56a001e0d874bc29b42d5c722f125249da920c4a71fb95ffa469f32b38e0db03e2a2706116e7636da129dba98ae759b2de7749ef621399f855c05767b8713406f0e42a1376a54a2a512c6200580a5c1c1d25466eab6662c07414949964a329d03075e27b68ed70efd4619c971ad711dd29ccb190ef12cbfb74d8e4ee8269c385dc535583d8efeee234ed31d10d09caa00407d30bcd70743b8ca284e1dcff25414900923c4b3b7799db4cfa0f7cfdfc3962d53bebe1f5ecc68e9dde84bfa63da8a9ef4d7d783daf99af3063b941dcec1f39390bc015e68167b96cfe217c99fc0563c7d1a4129ef5539ae75c0fe103ff2968258e10aebc7884d06d9a09ad5903df136917c7bdf15c64901d3e0417f90738eddfe0508a4cd0200f6694c7c04b70b9a90f2fd61bbb0bf33d8bac746111a5e8330c8e2826fbe9a3d5a50df2f8b6b0dcaecb753541e5bc5dae7e73000572f5263ce6776088aa57f1c018c9285143064cd4190a9481dae3f11ea99dfd98f21d1b7ced9136bf37734c8f0c1bf661e0ff6d936053af461a5dd7d294e5a71bed98487b1decd3f6a4678ebbf86e96eb2c75fd90c4bb694a96fa06ad59d20201374e0a4096752a57c45a0a0b7744ffea7a21ce757b3a1cdb5cefe8f57b34930e31cd7a49da63f0dd0cb7fd16ac75597017084c81e41d59995b970ce5c08f536804fdd38894a29328a10eaadcece73d59a5ee7560d8f7d32931629500a15b1782699503c5bd6131e71baca967da9dbafd7fa1d4f8c8a28f39dd740f978a523327f359a30b48907e0f2777a7aa49884ec47f38ff57e2e073493500f525f9bbc840e727ae017c61fa59194753363509e5d859753b009a49014b9427b6f0ad816ab7d414575796e92fb9fe41e7065b28cf2e923adaaf3f343842500f5b1449e3d2cfe4c5cda578070678d41e631891e6c5fdf4805c08cecc0107737558de2d318890c98212d99b92c1f5b0d38fbb9236da528498288dc94bd341fed4662a285d0635d7aa1943f826504368fa97dd9535be7006197cb7b31bb671d2beb943ed683f43f23001addd2c86a4fd4c98f144af8aaea17e9a2363899eb878d1f228db6f0141379c709bc76072a4eaae484d5e99351bffc80bf04b4c927c700be57d140c23ccf6f96526be9e9b97bd3ae54a1e374115c392afcc826d69b1849ad6cf463b6fe386afed630d4002909eb374437ed1d2bccf23df4e3494a6ff867ff4176a22cc2891cd840b84216280a08388ed57bf29e09bd94716c93ac4ad569ca567f1a6022eb018b4a27213985aab0a550e02e631c51f24586578416bc49d02539c91bcc4711d77c6b7bf570633459ebadf0ef2732641760ac625b44afad5c7ce9aed3c428ebbd6f1716753d25662101dcd49cead6251514f5993be9a62312e0a91664a2d0d5aae6cb35d9b22d016cc279a7fc5af14cd84e391b00e1652ec2f60a9c3b32b02494f988b2b6d8e942c0ff2036e6f9b1b3a2c559ee071ecf1cc2fab01b3142f90f9edf1cb51d42a62861bd94312f74e2bfd5b97cfcc405caffb2257e48e32a304b2d8ad646ca37f19109bc6b0e88e69db7b49f88cb1d65ea5d5774686d4c1c67a3e8570060e2391fa4e9f7320d9f8bbad04eeb9124b9a36d1cd3bfc432865e76bf10de486582bc4daaba18cb45214979ac9d68bd0f9a68b72b6431467769cd94e36e05aae29d07b011a0b74883a3f9a080197e08a003cebfb96f8663a1458a9acd978ce7e45c98cba89980ac168cbf655494118fd3b036d95424d2f55f316b75c415a91828904361eb25f78f1e586abac5b09c5b29f4235407f7e44dd7e31b04bc402103423b8ab097916de5be733b1fa48f3a8bce9c2deb1e8f1b76bb0a1c11059ec76607659ab784018fab3bcfe4da4c97e905b9015483c366d894f81e8f152004b9b67bcf7b24be19c387bf8178e61d86f937fc7679520f87689cf9d927e6f29e12acda1bf5fde1fd3e560fde8c954942ce17c18a08e22f9e5a3b4891785580c4f7506a944b2ab9b70fa8efd64459a408b76e9c7d65abecfaef82d76ddb1802fcaa5f353850b78118b519e8f713416bb9caab7dc59398bafce503deb1f5acc6b701e446039f11289d75bab9d790e7c9f347bbb329013a52f6a1ff6b64d6e3480127a99d8f56651b9d8bbef0ec55c3f0a4708bfeab8a92de565018453e5b5e782eab5947eff4196490ef88d00028731bf203709433c3ea721f637da1ab7e00947c6ebc6b4cfb03b3ca42e9c94daf727858d08350ab33faf2f4fcab9740db41097ad6e6125e612c1f9ea7c0e08cac8c0a4a1fa1cc8be5b8c1c6a36affda0234891a6ba5fccdd745758c3e8a8e81456f2f63ac4930d13a2a29f8f00efcbcec254d109748ea4108c6fab1d425831e684ef64d3581e1b614799e54d00a790647390e2a0bbdf8ad4f4483f7f4c553e308214238110fead663d2f329ae58970ef08268cfa3115d2a9b56743dc8e2dba3f321ccd2a1950b47b637e1d353c3f5d7c8f96a5adb0c0c2d2dadfe2e6eafb0c2c373f475f7e80888b9aa2abc7d8fd121b1d2f43485b627c87a2a6a9bcc9d70a2e435457656f7486a6a7a8d5d7db0000000000000000000000000014243443',
    },
    {
      scheme: 'mldsa44',
      operationKind: 'reveal',
      protocol: 'PrihK96nBAFSxVL1GLJTVhu9YnzkMFiBeuJRPA8NwuZVZCE1L6i',
      pkh: 'tz5js29DnochJPALgNyB5iaV6MTACvZbhoLx',
      publicKey:
        'mdpk4CW7qtFjvaTntafPe8qoAqrYPzVJzArUW9hSWj3HRGTpfAmMwp61hpc878fYCpCVM7iBVi5tb4L2mQ5huW2XoY2hgLgVjXmm8dDY4SNLL9Z2qw7k2v2AHmyqTpRY9jn6Jv2exTKjRfsW7h2Vo8asaB6V9LqiVrWoWhePVCRZWoHbMikzRicoJUd99tiuobVfrDTfcqpMcp2TQbUvJx3LyS2fJizRf8kNcpXz4pAHDLyeAQKJSrToeJtGq9UaBzXRCsQRPSHPEWXDD1f64eTyd13h3WaraG27bQQSQZKvCHrG4HrY9SUGwnCwQRSRhCkdzwTs2svJwnWNk7ohK8ELBgpDUeoGemEv6gCyohtkWsRxapMXF1jrw8gEtge7j3pKKbAbgLNktYqRcvXPrCgo8dePbzqX3q188o9YqMCG61Xd7YhAd4VUYu8gAbQoKY8cRnxErNtEBr3KqjAnb7F31TADj1UneAA2TT2a8PaTGsJ1h8ox8jDJm1DBo7ekDdowdVcSK3hrhhZdoFaka3q7z4u1eyCRjnH2Ah4wwDXdn5ejmECUZ2LHBFXFMFELP8oJURzvx75VaJwkDRjSyrwZ5VVGFhs4maEh5j74ScxWDy8wc1hoPhkkM5nedo8x8sBSZxG2JuExbE1WECDAiE9hABg8uE1WuokEJEVNUANckHWRiKmGczXG4mPrFSFyYogNc6G6FpsFqecCZDtXitHCiYjZm3CvDtwKuyUfeBw6o35nLsmHZK8yFWQW3SvNyqt1vP1LuDFAqGRroAtyip5swhFwcSs2JhZKDsVULr66CNNkfb3n1nLXcCgvcXYB93Ly5eueD1ENU3JA4keoL1YZdaSzRZ7uFCiJVCuFAsamfmVFQK6fAK6EMJfnoLBXQ3k3DBEhdADK75cHgcr9vSJ2rjUgVjCvZeM2qtA3jnVvtDK5hvm1amC7YYtQC62bpKuAbf1jdAMTmU36UwaP6omw92rqJU9hSAskPmQJBCUv2NvG8SCVLsekJe5GKVpikhthmaYgLy76dzT273ASKrAGdHunMjWWXqBTzUSSNLLVssftBqYvD6B5HaBQPmNS8ZaqWuJaFsFu2gMiXsoPfnBNz24Kdfs637C4U9d1gjsVowa73p5bjrWJAiNQGBypZkNheVHmWv4QoYVVC954ZaDSLV93XE2VzyBaMDPC1DXwvV9wUYrP54qFjqTinnAAA9BBckwkVHn1iovKnqey3QK2sLYpEpWFi8Bpxr5RheCrgeuKMa4trn6xPwRce9TvZ9NCiofEGZ3LXq9WBhq2NMQ6py12aHHL8F1QV8YnSgFqc97f3cmPASnJHHRT8RJ5eMiJ3J2cf8rstNYBzoc5PUryWugUMrz4NhkfhFAwiTWtwePp7oSrmPc376BWi71oATzAXz9oMK72EtTeNRcRDNBJgBpqetM6HKNEjQtzMor6sPPT9zuaooCnsC5QvfXpHVpecBs4ndtWWyXyR13ErkUSTKhXxyZ3A7D9n8jAPPi4w18MCgFpQcQrkhP84ccaux8L11zh4PchuETbapuWALs3NAp9RNz2ZPL6Ts9zzdLGDGYup8GHQkVnH2s4HoquvqdwQjABfL67Bx4Br2K9U4TGUpCpuz3nxED5dZQ4oFk8dEvX6MbppdgMaojfxZNW4EQM2SQZ68FN5w3QMeqwW5ese8NMTZUzhAMRhqbNZNCcRVzgpFS88Ejx1CMBaz4x9M2VkZjyL6SJndnuLeFhYJvVLZZXuSc6LRGDB3CJCSPANvsCChWJAoK2wLRSjhVaFY9wmyeeGJ',
      operation: {
        branch: 'BLockGenesisGenesisGenesisGenesisGenesisCCCCCeZiLHU',
        contents: [
          {
            kind: OpKind.REVEAL,
            source: 'tz5js29DnochJPALgNyB5iaV6MTACvZbhoLx',
            fee: '5000',
            counter: '1',
            gas_limit: '10000',
            storage_limit: '0',
            public_key:
              'mdpk4CW7qtFjvaTntafPe8qoAqrYPzVJzArUW9hSWj3HRGTpfAmMwp61hpc878fYCpCVM7iBVi5tb4L2mQ5huW2XoY2hgLgVjXmm8dDY4SNLL9Z2qw7k2v2AHmyqTpRY9jn6Jv2exTKjRfsW7h2Vo8asaB6V9LqiVrWoWhePVCRZWoHbMikzRicoJUd99tiuobVfrDTfcqpMcp2TQbUvJx3LyS2fJizRf8kNcpXz4pAHDLyeAQKJSrToeJtGq9UaBzXRCsQRPSHPEWXDD1f64eTyd13h3WaraG27bQQSQZKvCHrG4HrY9SUGwnCwQRSRhCkdzwTs2svJwnWNk7ohK8ELBgpDUeoGemEv6gCyohtkWsRxapMXF1jrw8gEtge7j3pKKbAbgLNktYqRcvXPrCgo8dePbzqX3q188o9YqMCG61Xd7YhAd4VUYu8gAbQoKY8cRnxErNtEBr3KqjAnb7F31TADj1UneAA2TT2a8PaTGsJ1h8ox8jDJm1DBo7ekDdowdVcSK3hrhhZdoFaka3q7z4u1eyCRjnH2Ah4wwDXdn5ejmECUZ2LHBFXFMFELP8oJURzvx75VaJwkDRjSyrwZ5VVGFhs4maEh5j74ScxWDy8wc1hoPhkkM5nedo8x8sBSZxG2JuExbE1WECDAiE9hABg8uE1WuokEJEVNUANckHWRiKmGczXG4mPrFSFyYogNc6G6FpsFqecCZDtXitHCiYjZm3CvDtwKuyUfeBw6o35nLsmHZK8yFWQW3SvNyqt1vP1LuDFAqGRroAtyip5swhFwcSs2JhZKDsVULr66CNNkfb3n1nLXcCgvcXYB93Ly5eueD1ENU3JA4keoL1YZdaSzRZ7uFCiJVCuFAsamfmVFQK6fAK6EMJfnoLBXQ3k3DBEhdADK75cHgcr9vSJ2rjUgVjCvZeM2qtA3jnVvtDK5hvm1amC7YYtQC62bpKuAbf1jdAMTmU36UwaP6omw92rqJU9hSAskPmQJBCUv2NvG8SCVLsekJe5GKVpikhthmaYgLy76dzT273ASKrAGdHunMjWWXqBTzUSSNLLVssftBqYvD6B5HaBQPmNS8ZaqWuJaFsFu2gMiXsoPfnBNz24Kdfs637C4U9d1gjsVowa73p5bjrWJAiNQGBypZkNheVHmWv4QoYVVC954ZaDSLV93XE2VzyBaMDPC1DXwvV9wUYrP54qFjqTinnAAA9BBckwkVHn1iovKnqey3QK2sLYpEpWFi8Bpxr5RheCrgeuKMa4trn6xPwRce9TvZ9NCiofEGZ3LXq9WBhq2NMQ6py12aHHL8F1QV8YnSgFqc97f3cmPASnJHHRT8RJ5eMiJ3J2cf8rstNYBzoc5PUryWugUMrz4NhkfhFAwiTWtwePp7oSrmPc376BWi71oATzAXz9oMK72EtTeNRcRDNBJgBpqetM6HKNEjQtzMor6sPPT9zuaooCnsC5QvfXpHVpecBs4ndtWWyXyR13ErkUSTKhXxyZ3A7D9n8jAPPi4w18MCgFpQcQrkhP84ccaux8L11zh4PchuETbapuWALs3NAp9RNz2ZPL6Ts9zzdLGDGYup8GHQkVnH2s4HoquvqdwQjABfL67Bx4Br2K9U4TGUpCpuz3nxED5dZQ4oFk8dEvX6MbppdgMaojfxZNW4EQM2SQZ68FN5w3QMeqwW5ese8NMTZUzhAMRhqbNZNCcRVzgpFS88Ejx1CMBaz4x9M2VkZjyL6SJndnuLeFhYJvVLZZXuSc6LRGDB3CJCSPANvsCChWJAoK2wLRSjhVaFY9wmyeeGJ',
          },
        ],
      },
      unsignedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b04fa9526291236732263e4b5556aa14005f193e780882701904e0004f3881720a6a283f7680e3b99bd9ca090299ea4dccaca3faf3f2d70d8d0fa7b76084d26aa52eaf9186677d4a2c21e77bbda95cea8e33ba33b04a2867fc8d38fa16fa57a9656701e95979ace36d5713708b6ad54c466f553d0abedcab22c28c96f152108a1542f1f07bb478ea20293f4dc172370edc6d46bb2670b1dfcaac2031d9287327d5ae86c5e8dd2b1c8e590681bf4aec794f1196521699f5925b70c6fff35916dd69d99486c758cd92b745dd42924aae278e2aa262b7105c21b0ca69f851690734325b8063cbd3ab3504b9efb35bdd53ae2b6001d555b2df9a9d9f0904d80304554b4862dbf9c580257d5d88163668fcaaca40910e1fc9629d629944efecfefe8e89e39fd1718f341d75f9c83b316a32873e2dfcba07fcfa45cb8ad69f86ea2e16cb1bdce26b93a06f4c7da61d1d33d30e84ce3c1c9b8e600a83af520d0c9eaa6ef536dfa8faca6292a15c4c3fb3b9fbfdfbc6106912004baadcf7ad0a5392539d4fbc9d7a95f0546b96c6e536c3893b462f12e11b83ecfe4a6b76effcc7c9b2de819967efa3605ef23ce1b750871f043cf808d8b2cd37b0621e2adb6318b87026bdd5f2f9b63ac4f56631ce7bfc02879bd6d50e7dc0bc14689218bc842e49d41dd1a9b0b5470bcb276a5c48886fb9751d1b98d63791a60be093b065c67dcd140944c06dffe66735c9d6b3d13d68ad1776e18072c785ba16d1a62ecdbc464b9e420730cfb8bfb70c9fcc2dce5de41abd391a8c334df53e27ac34f6ee505d96628c75e2407684c2615287bebd7bb08d115196f0be626fb6f9ea2b2c0a42f01b2d3a39e1abfc6697e170a911bdcd3e73c77b85f610975aaaaa2a18bb5c7f33ff68316c12cbd17aa983779bbd0ef338aed621d2f8022f887bb4554b7796e7d9d4e04063e1be0d593d4a3ae9ef60bb3cf9791b036be0a5e0faa9670d8fec01132d71f194174142ab4dcfd4b43ee3cad701671fef0d698d96e196ea23fc6ff3907e60b71f3d8cb65a58ee51f75cf748cb4a09d8cbaaf6f5d5f3883cc39824a02d88206fe83b4954ebd080fbee9c1906e42dcc471e52f1c7406e272e0043c75b4fc8c9f92cd5467978041279a9f33d8398f882f261d84504e465dda663d278c66019c862de5a403ea8ff142a2e13405bdb075aec9e0203f0e903cfe17f6a97f1632720636979ffcb42b7ed79f1f14c78e64e86795dfbc4bd4b01018e048dc8eaf20becc45a0cbe0a281dc0788647f078ecbf767d6057d80c568e7d6992eabf70fb8025c705aa7a0363c193146e180bf2060f37527dc64aed528ec908eed544693934d6552be9e7f069402a3eaf70c16fcba0c5286a484217c5adba501f899162344a34f9a659931f65cbfca9740947213dfbeef89608825d00b97745a0f4816cfb196c0f9755ab5e753206ab6b22cb7a96a5299b80f7f2d97e278c13c069162e882e2a24479d576b82cae832fb341427d08452789a2245c7c23987028a123289abef00e68f37ba7ef805560f9fe01d7c95e200b20ce8f2238b61b355aeebfb6d4ca62a4bc2b41f7d35513bac51a8f3e5d03429f56236de09950061c121528e9812dd98a52f8083b3ca2a0e736e108f4489865ad43e2036b9685481f38869253c68b1ace02d97f7d0d9feceed6b12eae84ff608b96ac4a2410fa6e0f02179d1197675d464344b3f659f194e606ecdd5bb2223bd36c9a36662ba19c20bb31f5212f83208f9c36987f6c977ae99603e38ac81f7b96e21d2c9f5f6cc31fcacdd49527e0e469320b182f39d35ac543938b01d11eb9748a110ffad30b7644a94b16401c3eee39fb02e89ad574d72b13eeb5cd1af065cc54369638b7450e968b13715e7f00',
      watermarkedBytes:
        '038fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b04fa9526291236732263e4b5556aa14005f193e780882701904e0004f3881720a6a283f7680e3b99bd9ca090299ea4dccaca3faf3f2d70d8d0fa7b76084d26aa52eaf9186677d4a2c21e77bbda95cea8e33ba33b04a2867fc8d38fa16fa57a9656701e95979ace36d5713708b6ad54c466f553d0abedcab22c28c96f152108a1542f1f07bb478ea20293f4dc172370edc6d46bb2670b1dfcaac2031d9287327d5ae86c5e8dd2b1c8e590681bf4aec794f1196521699f5925b70c6fff35916dd69d99486c758cd92b745dd42924aae278e2aa262b7105c21b0ca69f851690734325b8063cbd3ab3504b9efb35bdd53ae2b6001d555b2df9a9d9f0904d80304554b4862dbf9c580257d5d88163668fcaaca40910e1fc9629d629944efecfefe8e89e39fd1718f341d75f9c83b316a32873e2dfcba07fcfa45cb8ad69f86ea2e16cb1bdce26b93a06f4c7da61d1d33d30e84ce3c1c9b8e600a83af520d0c9eaa6ef536dfa8faca6292a15c4c3fb3b9fbfdfbc6106912004baadcf7ad0a5392539d4fbc9d7a95f0546b96c6e536c3893b462f12e11b83ecfe4a6b76effcc7c9b2de819967efa3605ef23ce1b750871f043cf808d8b2cd37b0621e2adb6318b87026bdd5f2f9b63ac4f56631ce7bfc02879bd6d50e7dc0bc14689218bc842e49d41dd1a9b0b5470bcb276a5c48886fb9751d1b98d63791a60be093b065c67dcd140944c06dffe66735c9d6b3d13d68ad1776e18072c785ba16d1a62ecdbc464b9e420730cfb8bfb70c9fcc2dce5de41abd391a8c334df53e27ac34f6ee505d96628c75e2407684c2615287bebd7bb08d115196f0be626fb6f9ea2b2c0a42f01b2d3a39e1abfc6697e170a911bdcd3e73c77b85f610975aaaaa2a18bb5c7f33ff68316c12cbd17aa983779bbd0ef338aed621d2f8022f887bb4554b7796e7d9d4e04063e1be0d593d4a3ae9ef60bb3cf9791b036be0a5e0faa9670d8fec01132d71f194174142ab4dcfd4b43ee3cad701671fef0d698d96e196ea23fc6ff3907e60b71f3d8cb65a58ee51f75cf748cb4a09d8cbaaf6f5d5f3883cc39824a02d88206fe83b4954ebd080fbee9c1906e42dcc471e52f1c7406e272e0043c75b4fc8c9f92cd5467978041279a9f33d8398f882f261d84504e465dda663d278c66019c862de5a403ea8ff142a2e13405bdb075aec9e0203f0e903cfe17f6a97f1632720636979ffcb42b7ed79f1f14c78e64e86795dfbc4bd4b01018e048dc8eaf20becc45a0cbe0a281dc0788647f078ecbf767d6057d80c568e7d6992eabf70fb8025c705aa7a0363c193146e180bf2060f37527dc64aed528ec908eed544693934d6552be9e7f069402a3eaf70c16fcba0c5286a484217c5adba501f899162344a34f9a659931f65cbfca9740947213dfbeef89608825d00b97745a0f4816cfb196c0f9755ab5e753206ab6b22cb7a96a5299b80f7f2d97e278c13c069162e882e2a24479d576b82cae832fb341427d08452789a2245c7c23987028a123289abef00e68f37ba7ef805560f9fe01d7c95e200b20ce8f2238b61b355aeebfb6d4ca62a4bc2b41f7d35513bac51a8f3e5d03429f56236de09950061c121528e9812dd98a52f8083b3ca2a0e736e108f4489865ad43e2036b9685481f38869253c68b1ace02d97f7d0d9feceed6b12eae84ff608b96ac4a2410fa6e0f02179d1197675d464344b3f659f194e606ecdd5bb2223bd36c9a36662ba19c20bb31f5212f83208f9c36987f6c977ae99603e38ac81f7b96e21d2c9f5f6cc31fcacdd49527e0e469320b182f39d35ac543938b01d11eb9748a110ffad30b7644a94b16401c3eee39fb02e89ad574d72b13eeb5cd1af065cc54369638b7450e968b13715e7f00',
      blake2bDigest: '8963e1c0420b98e039b6a887433a4f010b67bf6480c738c31f1390ba5b86d2c3',
      signature:
        'mdsig2wtNeE5P9CbRuMNSqRyDASkgVgC2GBjhRMPzvWCCzkEs4RWDiH1qtJxDuQtD4vGjKEdKaxAdZF2CpbESjcHSJ1MkkT8LqPqxYgwWmdJJNUd5tDyx2DCPR8DesaLwj9ZARA856RhSYYXzdVnwmJS7hUUabzk6nxcszUQYccpD6VK6Z9QfQUoDmpTJVmk6nnnTjuhEacyUAMDUZNAenWnZX2YNDYPEYMQLFNjwnsLV5CkSE8dXWSE7oTbtcFwigb8u8S7popKvJxTsZFFPzJPnzEdRan9Mgr9AQ7aGNQjx2SBXCeWxWQuTD1vSs1pwWVbeUXr8t71TWGWwgVT6zhAMrkvBkKgkAi4HLk4MSY8mA5pzhJYAqDyRqFnYpQa9ENwV5uyovAnbMvxc4oLQMgRMKqorTh9q2gggSMBCreSg59SsrzVYCFzGXL4JmZSBaWpamL61cbTAKwzu2Ubqrakoh5rqScbKB97fGSVLtV24r9CxrgjZLoymdZP7DjJomg9Bv4FQ3asZLpncrhTp52vrZhhydSeQeGzKQC1jsAaPVkgHgnunwWCUWvHi4tNjtTVb4NQmNfh9hRbqYCfK7TKaDS2WHk2SyrJN5DYAoKLVCYmG9FSMvcTpofnqEyrtKU1L76oe8Ei6qkZqS91VfQCfECBrjtiha1NZAXLV4FqKxttVS753pJwAbJGVS1E2UmQp8kRPFXZFhXkUd3neJq8XS6fqfa9XNSeLvJ4heTY7JRnn6B4b1Me3ivNJD2A4YzbGfGB8Bm6ofow942dfP7NVg5ReUHS18WgWXFzk83tHfpbzBsMM4iffJ5QxGuqnZb5QMvty5tSj7PzUuhWzaUgcR91DWmMJTTBawntKdsX35BcNLuvoEGRQjZESPG4ZbQNDioASquYRSC9KLWRrLrXBpwukTLGTdGiqqZFrupW1RDDRL4BQRpCbdApTnvk8QNKPnAWNjSwtYTzE6igSi9it15g28BELGQDuKPzzvwwtQt34CJXj9w2ao8F15W9XBJwh4RDzxfWeb5r84njtGHfg8BNCsQAYekJVxiS7iLkPB735etG6jYg21Cud8v5VrGNyk3wNrQggeDpXo19vh4pqdVyFFLZ5kZpfUXumSRJfx7snn9J46Fg6t1JNoQt3wL4ygX8FJif73pf7zbGi1cdbyeaBxFW2iUsqFKBQ9zfVGqf3PXcoqToho32YeXN1qA7UMse9Z7Xraf1SXCzDTGNkfYpaYTJnVpQcK7tPZLvg8CVCcuWCB2a1ZcjJVVH46Ank6AdjqaT6pDRUC2F9wR42q9SqxWFCB5sQDcd1KAJpiXBMxXnD2AGuWKYJCEzzL76GAx2q9VNGprZG8zH2gYnnJ8F1JfGjQvZZuiVjhfsLc5PTccXBjCEXkCrZLXcGCMdD5NBvAQxy4uHUZqCeQ1ehttfp9zpR8wnTgf81ZT4BnDMQXtAd8ENrFJY3wauoWUBynruHsn28hUYk4ijuCU1ohBKM12HTtGBT2AoPCc4SXoAGZsgbDGZFbfKQtukgn33aWxP1mD2mMtr4fKVN7R39Z4Pr5dNUmFS3AzJq1135KEJSJQWk3k1RdmvhRzRe4qhQTBTptJkfA78rBRGVbX3fbykkhbw1gXYHvSPuaYej2T1Fn48yryFMR8QgmEBakW2ZcqQe9JghBqiPNDy2b4Pq1v3gazYDV1YLSdawEiHeGFUYZgSYyFGyXyn1ex8m1jY5uyGqajKCNYLZVwcLxue6tMLgFQvbKrkyucd5QoxUAkaX6jBLZ4TvSRfs1hmcxQ7JH7zDuv71hmTdzwStuXLA51q5nvR48rRxMvHFsEiy8AjGin5S7HdACBpYgXLA6Po3uatuqydV7BiP4zAxCtB99ASWhDRrnfDP1uFL2ZsCuE7m2Hz8sun9uaZSegPcwYGJRQJi3KRy9Mfu853qVEtyqZetgtnmUtGPcQeVEPBAZWmdudUhxFaYJcs3f3tgubcw4r5cdrqb6aZnzjncAtSENoUjdfPTHL7tCQnuxQwMBMqZcRyCfKZSUFiEuVYAFZC4Lb5t7Ys1CCoeoe9KAWaedB6eMWuFD2aatbNNbsoB3bsPRhz6eswB6xsruoM1sBNJqRQxtQV7EPMoqtPmAenthRJVJzkcFCkKnFH9HMZnzgfyMzBDJMszaEyA9ioct51DrGbaLUY28C5Y9uUHeHuGBiiJoqW4rRHDJDMyvyNHvGnZ13ppA3KCZ2qWMDtkNRV4G8eAUTq4fxio6t7vn39rM4s8iSFe8VnNpRhCvct1QSFzsEYndzfd4V77wHbsWbt6GoaKQXw7FZ6a3gQxLdPaAp8GQoSac5tzzdv19KNJ33zS9irjZ963WDFTLG8m8KCEhkSGQSxBtxfLy6oyMrU4Mf1ybqQV2fbizKgKmu5AXB76MNKLJXmAEQdDrf53uEJLAiZfCHs93XEKKW8HvSUQ3upwYXCBJCDGtdVUftrVQRPiff4z4bwBJESjq8t3S2ioX8kqtAoCRfCHuenQpQhVe3YmqTxRmAKZyueQZY15B9K7wAMV24MZkFP3Sjb3Cu4gukKhcV3RZUFcAt5C2pTvwYYYc1Rt7oFnbhmUHUYbUnRegfsgoxaRfpXCEMcB9hy8f1FpP95wQheVSox3YQxXRMkGYiLZbpaKYF56JpffnoBpEizrPnsyVgzvozcD2PLaARQM5fiAHdtMYs8wxfBd4puTnWH44RxP9k65dXSmGmW1RkBbnbGF9bdVhU1MWFqLhmwDW5wE2UfFXnEYzV7QiZjNZQwTR47vqJBDGbGdpsXKF6pdUGWg6W2ky1QH6FKBNHT2mwmEG12L2qaZnifjnpeYK9eubsLfnGP9WFv1CnVo7CGifyDrnEeHhLfwRyDFEAq3xbwhF7Lu2C8Qhu11uRCbngWtikUQauXPfEdScUhuyDa4cBJmjVxvYVJaaf8FNpRKHJ1g34ndQEeGjntVaKU7dGwDvqrec5WqVUpS13AMxBvwkw1fg3M5zacGX3wBCeXsWRmNY1xYRi78oQZ2jjEnokKb7QiSuQVABgJP97ydZoYSJ6P1yLLjvfqM1NBBdnCaKW5fbmCEJs35JNxDpEPCgo39smnGYw4hig23WN38ZcPYF325XxapLBJj9ZWGJDFqdztkRosW3jVf5Hynvb2qbuGUhAWDYmmWkk5xW5hRRBkNZhtoKwYMxpvFqmFuuHn9Psm84irH6LEwDg2ypwxpNwaj12VgKAvuE2hpmSCxMfJcU9DRJGxak13JKuKrJcE5ZLu9gBwK1h3Mx7EB2pmtL8BevqX4iu79XZQcEFqAyqn',
      signedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b04fa9526291236732263e4b5556aa14005f193e780882701904e0004f3881720a6a283f7680e3b99bd9ca090299ea4dccaca3faf3f2d70d8d0fa7b76084d26aa52eaf9186677d4a2c21e77bbda95cea8e33ba33b04a2867fc8d38fa16fa57a9656701e95979ace36d5713708b6ad54c466f553d0abedcab22c28c96f152108a1542f1f07bb478ea20293f4dc172370edc6d46bb2670b1dfcaac2031d9287327d5ae86c5e8dd2b1c8e590681bf4aec794f1196521699f5925b70c6fff35916dd69d99486c758cd92b745dd42924aae278e2aa262b7105c21b0ca69f851690734325b8063cbd3ab3504b9efb35bdd53ae2b6001d555b2df9a9d9f0904d80304554b4862dbf9c580257d5d88163668fcaaca40910e1fc9629d629944efecfefe8e89e39fd1718f341d75f9c83b316a32873e2dfcba07fcfa45cb8ad69f86ea2e16cb1bdce26b93a06f4c7da61d1d33d30e84ce3c1c9b8e600a83af520d0c9eaa6ef536dfa8faca6292a15c4c3fb3b9fbfdfbc6106912004baadcf7ad0a5392539d4fbc9d7a95f0546b96c6e536c3893b462f12e11b83ecfe4a6b76effcc7c9b2de819967efa3605ef23ce1b750871f043cf808d8b2cd37b0621e2adb6318b87026bdd5f2f9b63ac4f56631ce7bfc02879bd6d50e7dc0bc14689218bc842e49d41dd1a9b0b5470bcb276a5c48886fb9751d1b98d63791a60be093b065c67dcd140944c06dffe66735c9d6b3d13d68ad1776e18072c785ba16d1a62ecdbc464b9e420730cfb8bfb70c9fcc2dce5de41abd391a8c334df53e27ac34f6ee505d96628c75e2407684c2615287bebd7bb08d115196f0be626fb6f9ea2b2c0a42f01b2d3a39e1abfc6697e170a911bdcd3e73c77b85f610975aaaaa2a18bb5c7f33ff68316c12cbd17aa983779bbd0ef338aed621d2f8022f887bb4554b7796e7d9d4e04063e1be0d593d4a3ae9ef60bb3cf9791b036be0a5e0faa9670d8fec01132d71f194174142ab4dcfd4b43ee3cad701671fef0d698d96e196ea23fc6ff3907e60b71f3d8cb65a58ee51f75cf748cb4a09d8cbaaf6f5d5f3883cc39824a02d88206fe83b4954ebd080fbee9c1906e42dcc471e52f1c7406e272e0043c75b4fc8c9f92cd5467978041279a9f33d8398f882f261d84504e465dda663d278c66019c862de5a403ea8ff142a2e13405bdb075aec9e0203f0e903cfe17f6a97f1632720636979ffcb42b7ed79f1f14c78e64e86795dfbc4bd4b01018e048dc8eaf20becc45a0cbe0a281dc0788647f078ecbf767d6057d80c568e7d6992eabf70fb8025c705aa7a0363c193146e180bf2060f37527dc64aed528ec908eed544693934d6552be9e7f069402a3eaf70c16fcba0c5286a484217c5adba501f899162344a34f9a659931f65cbfca9740947213dfbeef89608825d00b97745a0f4816cfb196c0f9755ab5e753206ab6b22cb7a96a5299b80f7f2d97e278c13c069162e882e2a24479d576b82cae832fb341427d08452789a2245c7c23987028a123289abef00e68f37ba7ef805560f9fe01d7c95e200b20ce8f2238b61b355aeebfb6d4ca62a4bc2b41f7d35513bac51a8f3e5d03429f56236de09950061c121528e9812dd98a52f8083b3ca2a0e736e108f4489865ad43e2036b9685481f38869253c68b1ace02d97f7d0d9feceed6b12eae84ff608b96ac4a2410fa6e0f02179d1197675d464344b3f659f194e606ecdd5bb2223bd36c9a36662ba19c20bb31f5212f83208f9c36987f6c977ae99603e38ac81f7b96e21d2c9f5f6cc31fcacdd49527e0e469320b182f39d35ac543938b01d11eb9748a110ffad30b7644a94b16401c3eee39fb02e89ad574d72b13eeb5cd1af065cc54369638b7450e968b13715e7f00ff044e891d8618a24384a6fae91d235ce6e31eb8f871bc85944ebaad84e443700de57320f75df4fe20605e2bce83278d0de96aa498953c2811f29d8e445cf18e1244a21f920c6cf505208a87a8c0e841f2dc6a55cfc6eb7fd8a21605312121ef637dd38c9d3e1e6702d3dbc4d70359db6860039038f63f408837743f4926a5e502b719bcaeac4a1845ee43166c998d761358c86dded51a9ac8aadf28d95232ff39411b03c047b48fee5b6d6d485aedd79171bfa1563b19f47997751e35c1df1f2a9b2a9307946a9c83b44f4c8c8efd2ca9e68ae166d2d9e521aa07940a41010feea70be3509278a10eef5c32dd31cf60a66cc47fb9fb58acff12696880ce646b48713ca5cdd5c8db299dcad5d5a99e42fb0125e9f7b264f330378d1efba94d802c8736f659ff957874984b6ca6f0f1013fc8ac2bdcdaaebd638585a76d7074372bba2b02899a4ef03fc08ea10c81b61f265abe1d3c413b34ac8e37d802ef0a91ca157e314a7ec5ba94cf6ac058c05661d3304de9e47662f8eaf76bf91de39cf807908ef12cabb3a99c003cef0c86e44c47393ea7063fd4f216c307dcd026079e77c5d5849118b8c84513466aa2432960194d8d4f706144fb6091c604394a19919c040a9a2bf85389d87f8b705e03010bcdeb2b46a5cedcf5cd5b8ab1f6e67fc889811bdad071f202dc34bd8849e44ead312847c15404237ff3c675856339f23cefbc481ca995b30daac9cb81f9ce6b924d4031c1782322fe47b4e0bd5a21a6d541e5d9c15ae99cdff66ea1dbe017ec28f65d510b4d9770dac1b4dc804162fbb37cb20480d5baa54a0c18e57197a3aa08f2682a240b2c4ba071cf0974bb81bc44603bc5bcba5116a855f096b8074f9a3420d20402c7e9d6c49c56b1ea4754c8f43e661a34819c3f45c5d007e6cf2918785dedabe210ec17222cf839390e0a61c2ff2201759a6a7a13881c5004b56832342f222ee6178a3ed4e87891733a1dd74c0db59c78f0f4e26e0eda6bc8669e7f7134dad1e29a800c853e0080a16ae9fde871682671d0deefec02716a77c1e844a7cd021956723c0762665610273ee9393056cfa85e013936f3a49785332c3c016e9af55c5d5752a5c47ca22fae07d9bdfeb077602107d453793c10c05914ba6ef8e53f181d56e5858e7bddb996c9a0436392060761b31d8144e6531ddc1a97157406fbf2083bedcb7c53a325f3bc2b5b100c83d089ae2e23871490216f4dfcb2b7323cd5ed8a283bbce83888ccab99a9e21a45bb7c72d5468eb591f82f056255bffb1aa7be42812d3a53ebad5537a1e2df59918824a672ebaeb0a644b4f5501c238d8e7f82555260a7c44806e8fda9125e51df530253712e299728402c874965dd090677dfa976bc4fdcdd8ef9ad521277968d014be98fbeb45a98e53f56aa9c607ae0de77d54abe4bafb7005eb157d03b09ee56b360e3ba435ca970395c53e7fddd68bae685cf40d65f894b517449abc2d22e1f35f3b7d586c0520acce4f3d1003b751c1e2ae8eb5a779c332511a72ef4da0f2a9eec4585d516f61201cdf394807f3b8fc66d1ae34c5b95c79f297d4ad36bef4dc82f6303d329cd057dc75d2ffd2bfa4b74db4ce0c11127afdaafbd7566454a7ed8a64646b4dfccd477c2e9e4c272de642a3e8cd8e899cfea3f048743e085e5b013c6e46d80c1772a3d30c47d92898d9f740982af691be935aecc1479a5c70661a1739897eb9fe49b1dc87f1d173e936a12d643eeca8bc4f81d555f2d1f8c330cde63ca7a5c56dd989bd3ba46635d0a78375750119fa093f8a38b903436775d450ae609585cd23fd17b2d59c58ceb479904c2d0fd71b96bf86e23740b71a5e4265904d5d84b2d43e0949846dd95d7f2e0c1f070bed7bfd6fb5cfa9b71f4cbf831a497f0e9532236b851a61e3a79ab59f9928286f29c8d1003dde74d3b00fda9e65e294d469b6d73f3cb9c5172017844d24461ecf5a95c8253a417fcaabaa6ad2f31b56a9a8a57336d225fa4b44acd39819be01811121ea054d3890d41e0e1cc520cba42451c5ee0a48ee242fb720cc180b99318de1629baeb0b706aacbb64df7a8b1a2c1a3f3d81941a99a7c7b2b001423705544b1e925079e8041621b4cc093019b4dd7e9a2c9675a355af92b009c5d0cffeb644adfac0d8e2669332afb8020eaa99e0919b61306ce881c6f2cde86ccb722b10dcd9ee26b723fdd56414e2c5a5ca2d39ecd1a919161868402ed0bb8014f88131aabd3915dbf68300993728745a5f9a709968b102e5d085a59fdf990957afb7842d1724203fa5efe477d5260a2bd7fa0a85d946c3d58c1d9d3e3732329277efe4c29609c096deafbbaa61127ff7d3ae55024d566e5e3aa77b735d69fc5385a3fd7e47eec01cfda915d0b93aaaf9aeb62f79ff118d7bb2af3ac354482b374ab73d4462bb5905bffd76cd86cae25d54283268d41cc33dcd2f14472d09adae474b5f3df2d2fe7227c068ee23c9e04502f12d31ce840fe53de51d1b0ab3d667e0e11cf44b07a772b090a0fcf58aceedfcdca2c6ef33fb180f936c7d224cc2116f95ad33dd368091f5241eb3ab66da5ba620e4d00e9a225a76d89f07f075dc966e7f17c74e33d7d2b49f50e6253fd633e6b598b8b76148d043e7d83c218fce3144e84950019e3edaaffb89d2ad305aa5845153fc4333ead741de6eeab752f5de616e58440c325787d22b3d9190c43601f11310d61b5e13152dd881e0aeeaa3b07eef1e1d3d0e57a32d62e913c350b9d70422fc5ad5f4b6cbd932a008626ffd0b1df699865f9313d20492785d663e2795b9a0b1cfd2b37a2a6f2a66e5168bc21d6feccf07f091193d5ee82bc48e79565f6210cd8002ebeb3f0b7532aebc967960805f5bd4b083b6420eb0006615e22ec104829d593d3d3de025ce2287bfd1182b34ee3acda2eea1abb8b45d648ed3a1f61ae18314e0acbf3e1d6b269ad10dffbf67a48ca2f4d79f71e294083a68ec212d37e8b7a7b2badfc44fc6cfd343400b52318398c51877bf54832cb55b0f27d9e51258fedb77bcea64ea71179023dff928da53b0541d2d8a734232a48f1909e8131517c2e9bb5f12b12b70d9f837c4369c8a5714938b30f62adcd0627e8dded620650c40e141ba5b34fc6cb035f51fd51c388b50794202df3a9e72d14a5e17982a8f863fcff3888227ff1812f7cd21af9d1bc82f31243d2e8242d1c6279b901193c5fa4bbc344d660e902e93d1571bfbfbf8f6aaa42d0f9654554aa5e5561f9851a4b67c687eb1fd878d75f79c6842619ac41984e1330feeaf766b35fbad68e8020d162631324f7b8485a9bbcccddd086e76899facaeb3b7bfc3f7fa00050c2024313542474a6b6c90a5aacb1e464e5994abe7e9fe0000000000000000000000000000000000000000000000000000000f1c2c35',
    },
    {
      scheme: 'mldsa44',
      operationKind: 'reveal-batch',
      protocol: 'PrihK96nBAFSxVL1GLJTVhu9YnzkMFiBeuJRPA8NwuZVZCE1L6i',
      pkh: 'tz5js29DnochJPALgNyB5iaV6MTACvZbhoLx',
      publicKey:
        'mdpk4CW7qtFjvaTntafPe8qoAqrYPzVJzArUW9hSWj3HRGTpfAmMwp61hpc878fYCpCVM7iBVi5tb4L2mQ5huW2XoY2hgLgVjXmm8dDY4SNLL9Z2qw7k2v2AHmyqTpRY9jn6Jv2exTKjRfsW7h2Vo8asaB6V9LqiVrWoWhePVCRZWoHbMikzRicoJUd99tiuobVfrDTfcqpMcp2TQbUvJx3LyS2fJizRf8kNcpXz4pAHDLyeAQKJSrToeJtGq9UaBzXRCsQRPSHPEWXDD1f64eTyd13h3WaraG27bQQSQZKvCHrG4HrY9SUGwnCwQRSRhCkdzwTs2svJwnWNk7ohK8ELBgpDUeoGemEv6gCyohtkWsRxapMXF1jrw8gEtge7j3pKKbAbgLNktYqRcvXPrCgo8dePbzqX3q188o9YqMCG61Xd7YhAd4VUYu8gAbQoKY8cRnxErNtEBr3KqjAnb7F31TADj1UneAA2TT2a8PaTGsJ1h8ox8jDJm1DBo7ekDdowdVcSK3hrhhZdoFaka3q7z4u1eyCRjnH2Ah4wwDXdn5ejmECUZ2LHBFXFMFELP8oJURzvx75VaJwkDRjSyrwZ5VVGFhs4maEh5j74ScxWDy8wc1hoPhkkM5nedo8x8sBSZxG2JuExbE1WECDAiE9hABg8uE1WuokEJEVNUANckHWRiKmGczXG4mPrFSFyYogNc6G6FpsFqecCZDtXitHCiYjZm3CvDtwKuyUfeBw6o35nLsmHZK8yFWQW3SvNyqt1vP1LuDFAqGRroAtyip5swhFwcSs2JhZKDsVULr66CNNkfb3n1nLXcCgvcXYB93Ly5eueD1ENU3JA4keoL1YZdaSzRZ7uFCiJVCuFAsamfmVFQK6fAK6EMJfnoLBXQ3k3DBEhdADK75cHgcr9vSJ2rjUgVjCvZeM2qtA3jnVvtDK5hvm1amC7YYtQC62bpKuAbf1jdAMTmU36UwaP6omw92rqJU9hSAskPmQJBCUv2NvG8SCVLsekJe5GKVpikhthmaYgLy76dzT273ASKrAGdHunMjWWXqBTzUSSNLLVssftBqYvD6B5HaBQPmNS8ZaqWuJaFsFu2gMiXsoPfnBNz24Kdfs637C4U9d1gjsVowa73p5bjrWJAiNQGBypZkNheVHmWv4QoYVVC954ZaDSLV93XE2VzyBaMDPC1DXwvV9wUYrP54qFjqTinnAAA9BBckwkVHn1iovKnqey3QK2sLYpEpWFi8Bpxr5RheCrgeuKMa4trn6xPwRce9TvZ9NCiofEGZ3LXq9WBhq2NMQ6py12aHHL8F1QV8YnSgFqc97f3cmPASnJHHRT8RJ5eMiJ3J2cf8rstNYBzoc5PUryWugUMrz4NhkfhFAwiTWtwePp7oSrmPc376BWi71oATzAXz9oMK72EtTeNRcRDNBJgBpqetM6HKNEjQtzMor6sPPT9zuaooCnsC5QvfXpHVpecBs4ndtWWyXyR13ErkUSTKhXxyZ3A7D9n8jAPPi4w18MCgFpQcQrkhP84ccaux8L11zh4PchuETbapuWALs3NAp9RNz2ZPL6Ts9zzdLGDGYup8GHQkVnH2s4HoquvqdwQjABfL67Bx4Br2K9U4TGUpCpuz3nxED5dZQ4oFk8dEvX6MbppdgMaojfxZNW4EQM2SQZ68FN5w3QMeqwW5ese8NMTZUzhAMRhqbNZNCcRVzgpFS88Ejx1CMBaz4x9M2VkZjyL6SJndnuLeFhYJvVLZZXuSc6LRGDB3CJCSPANvsCChWJAoK2wLRSjhVaFY9wmyeeGJ',
      operation: {
        branch: 'BLockGenesisGenesisGenesisGenesisGenesisCCCCCeZiLHU',
        contents: [
          {
            kind: OpKind.REVEAL,
            source: 'tz5js29DnochJPALgNyB5iaV6MTACvZbhoLx',
            fee: '5000',
            counter: '1',
            gas_limit: '10000',
            storage_limit: '0',
            public_key:
              'mdpk4CW7qtFjvaTntafPe8qoAqrYPzVJzArUW9hSWj3HRGTpfAmMwp61hpc878fYCpCVM7iBVi5tb4L2mQ5huW2XoY2hgLgVjXmm8dDY4SNLL9Z2qw7k2v2AHmyqTpRY9jn6Jv2exTKjRfsW7h2Vo8asaB6V9LqiVrWoWhePVCRZWoHbMikzRicoJUd99tiuobVfrDTfcqpMcp2TQbUvJx3LyS2fJizRf8kNcpXz4pAHDLyeAQKJSrToeJtGq9UaBzXRCsQRPSHPEWXDD1f64eTyd13h3WaraG27bQQSQZKvCHrG4HrY9SUGwnCwQRSRhCkdzwTs2svJwnWNk7ohK8ELBgpDUeoGemEv6gCyohtkWsRxapMXF1jrw8gEtge7j3pKKbAbgLNktYqRcvXPrCgo8dePbzqX3q188o9YqMCG61Xd7YhAd4VUYu8gAbQoKY8cRnxErNtEBr3KqjAnb7F31TADj1UneAA2TT2a8PaTGsJ1h8ox8jDJm1DBo7ekDdowdVcSK3hrhhZdoFaka3q7z4u1eyCRjnH2Ah4wwDXdn5ejmECUZ2LHBFXFMFELP8oJURzvx75VaJwkDRjSyrwZ5VVGFhs4maEh5j74ScxWDy8wc1hoPhkkM5nedo8x8sBSZxG2JuExbE1WECDAiE9hABg8uE1WuokEJEVNUANckHWRiKmGczXG4mPrFSFyYogNc6G6FpsFqecCZDtXitHCiYjZm3CvDtwKuyUfeBw6o35nLsmHZK8yFWQW3SvNyqt1vP1LuDFAqGRroAtyip5swhFwcSs2JhZKDsVULr66CNNkfb3n1nLXcCgvcXYB93Ly5eueD1ENU3JA4keoL1YZdaSzRZ7uFCiJVCuFAsamfmVFQK6fAK6EMJfnoLBXQ3k3DBEhdADK75cHgcr9vSJ2rjUgVjCvZeM2qtA3jnVvtDK5hvm1amC7YYtQC62bpKuAbf1jdAMTmU36UwaP6omw92rqJU9hSAskPmQJBCUv2NvG8SCVLsekJe5GKVpikhthmaYgLy76dzT273ASKrAGdHunMjWWXqBTzUSSNLLVssftBqYvD6B5HaBQPmNS8ZaqWuJaFsFu2gMiXsoPfnBNz24Kdfs637C4U9d1gjsVowa73p5bjrWJAiNQGBypZkNheVHmWv4QoYVVC954ZaDSLV93XE2VzyBaMDPC1DXwvV9wUYrP54qFjqTinnAAA9BBckwkVHn1iovKnqey3QK2sLYpEpWFi8Bpxr5RheCrgeuKMa4trn6xPwRce9TvZ9NCiofEGZ3LXq9WBhq2NMQ6py12aHHL8F1QV8YnSgFqc97f3cmPASnJHHRT8RJ5eMiJ3J2cf8rstNYBzoc5PUryWugUMrz4NhkfhFAwiTWtwePp7oSrmPc376BWi71oATzAXz9oMK72EtTeNRcRDNBJgBpqetM6HKNEjQtzMor6sPPT9zuaooCnsC5QvfXpHVpecBs4ndtWWyXyR13ErkUSTKhXxyZ3A7D9n8jAPPi4w18MCgFpQcQrkhP84ccaux8L11zh4PchuETbapuWALs3NAp9RNz2ZPL6Ts9zzdLGDGYup8GHQkVnH2s4HoquvqdwQjABfL67Bx4Br2K9U4TGUpCpuz3nxED5dZQ4oFk8dEvX6MbppdgMaojfxZNW4EQM2SQZ68FN5w3QMeqwW5ese8NMTZUzhAMRhqbNZNCcRVzgpFS88Ejx1CMBaz4x9M2VkZjyL6SJndnuLeFhYJvVLZZXuSc6LRGDB3CJCSPANvsCChWJAoK2wLRSjhVaFY9wmyeeGJ',
          },
          {
            kind: OpKind.TRANSACTION,
            source: 'tz5js29DnochJPALgNyB5iaV6MTACvZbhoLx',
            fee: '1000',
            counter: '2',
            gas_limit: '1040',
            storage_limit: '0',
            amount: '1',
            destination: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
          },
        ],
      },
      unsignedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b04fa9526291236732263e4b5556aa14005f193e780882701904e0004f3881720a6a283f7680e3b99bd9ca090299ea4dccaca3faf3f2d70d8d0fa7b76084d26aa52eaf9186677d4a2c21e77bbda95cea8e33ba33b04a2867fc8d38fa16fa57a9656701e95979ace36d5713708b6ad54c466f553d0abedcab22c28c96f152108a1542f1f07bb478ea20293f4dc172370edc6d46bb2670b1dfcaac2031d9287327d5ae86c5e8dd2b1c8e590681bf4aec794f1196521699f5925b70c6fff35916dd69d99486c758cd92b745dd42924aae278e2aa262b7105c21b0ca69f851690734325b8063cbd3ab3504b9efb35bdd53ae2b6001d555b2df9a9d9f0904d80304554b4862dbf9c580257d5d88163668fcaaca40910e1fc9629d629944efecfefe8e89e39fd1718f341d75f9c83b316a32873e2dfcba07fcfa45cb8ad69f86ea2e16cb1bdce26b93a06f4c7da61d1d33d30e84ce3c1c9b8e600a83af520d0c9eaa6ef536dfa8faca6292a15c4c3fb3b9fbfdfbc6106912004baadcf7ad0a5392539d4fbc9d7a95f0546b96c6e536c3893b462f12e11b83ecfe4a6b76effcc7c9b2de819967efa3605ef23ce1b750871f043cf808d8b2cd37b0621e2adb6318b87026bdd5f2f9b63ac4f56631ce7bfc02879bd6d50e7dc0bc14689218bc842e49d41dd1a9b0b5470bcb276a5c48886fb9751d1b98d63791a60be093b065c67dcd140944c06dffe66735c9d6b3d13d68ad1776e18072c785ba16d1a62ecdbc464b9e420730cfb8bfb70c9fcc2dce5de41abd391a8c334df53e27ac34f6ee505d96628c75e2407684c2615287bebd7bb08d115196f0be626fb6f9ea2b2c0a42f01b2d3a39e1abfc6697e170a911bdcd3e73c77b85f610975aaaaa2a18bb5c7f33ff68316c12cbd17aa983779bbd0ef338aed621d2f8022f887bb4554b7796e7d9d4e04063e1be0d593d4a3ae9ef60bb3cf9791b036be0a5e0faa9670d8fec01132d71f194174142ab4dcfd4b43ee3cad701671fef0d698d96e196ea23fc6ff3907e60b71f3d8cb65a58ee51f75cf748cb4a09d8cbaaf6f5d5f3883cc39824a02d88206fe83b4954ebd080fbee9c1906e42dcc471e52f1c7406e272e0043c75b4fc8c9f92cd5467978041279a9f33d8398f882f261d84504e465dda663d278c66019c862de5a403ea8ff142a2e13405bdb075aec9e0203f0e903cfe17f6a97f1632720636979ffcb42b7ed79f1f14c78e64e86795dfbc4bd4b01018e048dc8eaf20becc45a0cbe0a281dc0788647f078ecbf767d6057d80c568e7d6992eabf70fb8025c705aa7a0363c193146e180bf2060f37527dc64aed528ec908eed544693934d6552be9e7f069402a3eaf70c16fcba0c5286a484217c5adba501f899162344a34f9a659931f65cbfca9740947213dfbeef89608825d00b97745a0f4816cfb196c0f9755ab5e753206ab6b22cb7a96a5299b80f7f2d97e278c13c069162e882e2a24479d576b82cae832fb341427d08452789a2245c7c23987028a123289abef00e68f37ba7ef805560f9fe01d7c95e200b20ce8f2238b61b355aeebfb6d4ca62a4bc2b41f7d35513bac51a8f3e5d03429f56236de09950061c121528e9812dd98a52f8083b3ca2a0e736e108f4489865ad43e2036b9685481f38869253c68b1ace02d97f7d0d9feceed6b12eae84ff608b96ac4a2410fa6e0f02179d1197675d464344b3f659f194e606ecdd5bb2223bd36c9a36662ba19c20bb31f5212f83208f9c36987f6c977ae99603e38ac81f7b96e21d2c9f5f6cc31fcacdd49527e0e469320b182f39d35ac543938b01d11eb9748a110ffad30b7644a94b16401c3eee39fb02e89ad574d72b13eeb5cd1af065cc54369638b7450e968b13715e7f006c04fa9526291236732263e4b5556aa14005f193e780e807029008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      watermarkedBytes:
        '038fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b04fa9526291236732263e4b5556aa14005f193e780882701904e0004f3881720a6a283f7680e3b99bd9ca090299ea4dccaca3faf3f2d70d8d0fa7b76084d26aa52eaf9186677d4a2c21e77bbda95cea8e33ba33b04a2867fc8d38fa16fa57a9656701e95979ace36d5713708b6ad54c466f553d0abedcab22c28c96f152108a1542f1f07bb478ea20293f4dc172370edc6d46bb2670b1dfcaac2031d9287327d5ae86c5e8dd2b1c8e590681bf4aec794f1196521699f5925b70c6fff35916dd69d99486c758cd92b745dd42924aae278e2aa262b7105c21b0ca69f851690734325b8063cbd3ab3504b9efb35bdd53ae2b6001d555b2df9a9d9f0904d80304554b4862dbf9c580257d5d88163668fcaaca40910e1fc9629d629944efecfefe8e89e39fd1718f341d75f9c83b316a32873e2dfcba07fcfa45cb8ad69f86ea2e16cb1bdce26b93a06f4c7da61d1d33d30e84ce3c1c9b8e600a83af520d0c9eaa6ef536dfa8faca6292a15c4c3fb3b9fbfdfbc6106912004baadcf7ad0a5392539d4fbc9d7a95f0546b96c6e536c3893b462f12e11b83ecfe4a6b76effcc7c9b2de819967efa3605ef23ce1b750871f043cf808d8b2cd37b0621e2adb6318b87026bdd5f2f9b63ac4f56631ce7bfc02879bd6d50e7dc0bc14689218bc842e49d41dd1a9b0b5470bcb276a5c48886fb9751d1b98d63791a60be093b065c67dcd140944c06dffe66735c9d6b3d13d68ad1776e18072c785ba16d1a62ecdbc464b9e420730cfb8bfb70c9fcc2dce5de41abd391a8c334df53e27ac34f6ee505d96628c75e2407684c2615287bebd7bb08d115196f0be626fb6f9ea2b2c0a42f01b2d3a39e1abfc6697e170a911bdcd3e73c77b85f610975aaaaa2a18bb5c7f33ff68316c12cbd17aa983779bbd0ef338aed621d2f8022f887bb4554b7796e7d9d4e04063e1be0d593d4a3ae9ef60bb3cf9791b036be0a5e0faa9670d8fec01132d71f194174142ab4dcfd4b43ee3cad701671fef0d698d96e196ea23fc6ff3907e60b71f3d8cb65a58ee51f75cf748cb4a09d8cbaaf6f5d5f3883cc39824a02d88206fe83b4954ebd080fbee9c1906e42dcc471e52f1c7406e272e0043c75b4fc8c9f92cd5467978041279a9f33d8398f882f261d84504e465dda663d278c66019c862de5a403ea8ff142a2e13405bdb075aec9e0203f0e903cfe17f6a97f1632720636979ffcb42b7ed79f1f14c78e64e86795dfbc4bd4b01018e048dc8eaf20becc45a0cbe0a281dc0788647f078ecbf767d6057d80c568e7d6992eabf70fb8025c705aa7a0363c193146e180bf2060f37527dc64aed528ec908eed544693934d6552be9e7f069402a3eaf70c16fcba0c5286a484217c5adba501f899162344a34f9a659931f65cbfca9740947213dfbeef89608825d00b97745a0f4816cfb196c0f9755ab5e753206ab6b22cb7a96a5299b80f7f2d97e278c13c069162e882e2a24479d576b82cae832fb341427d08452789a2245c7c23987028a123289abef00e68f37ba7ef805560f9fe01d7c95e200b20ce8f2238b61b355aeebfb6d4ca62a4bc2b41f7d35513bac51a8f3e5d03429f56236de09950061c121528e9812dd98a52f8083b3ca2a0e736e108f4489865ad43e2036b9685481f38869253c68b1ace02d97f7d0d9feceed6b12eae84ff608b96ac4a2410fa6e0f02179d1197675d464344b3f659f194e606ecdd5bb2223bd36c9a36662ba19c20bb31f5212f83208f9c36987f6c977ae99603e38ac81f7b96e21d2c9f5f6cc31fcacdd49527e0e469320b182f39d35ac543938b01d11eb9748a110ffad30b7644a94b16401c3eee39fb02e89ad574d72b13eeb5cd1af065cc54369638b7450e968b13715e7f006c04fa9526291236732263e4b5556aa14005f193e780e807029008000100006b82198cb179e8306c1bedd08f12dc863f32888600',
      blake2bDigest: 'a71d33ffc116778763ff13cb11e221700b75128a91eaacc95011fa6e703d6e97',
      signature:
        'mdsig3mwVX4nZS2nHWn9rwVDLb85qxV6jqgUrZ5zusCQv9iwgUbnCzFq8fH5bR8WZUiKqa7rjSGggVKG87G1Lv2Ru8C64gD2WB2ukCHQfUFiVL2NUSH5XkC6ETeJndLtKCPjwv89QEUY2NyVva8YwQRf8MJA7pmkRZFyYR36Kqn3fLT6CKPxLWz1YuLxr7MHF23fACgmSjMq1JGtY7oZfH8S5xxPjnVhmHW1KZPMn4wzv73k3EewSJrDdALDGFSqbVps8jotJYweJ6SQcYUkPRpW58Qi76cP8ogANW9ZWpkwndaUG2AcLq6nP7XGsDwAtaJi6aFf99BeY4i3csqvFVtP7CGH4spPCHUdtvDoi7MrE3tbCMJwgSExTF7NcRBJYapeaYL1yXkvioznR6NRyibX1y1bUVTizAu9YK83rEw1xaLFbKXpNKh6qaar9Aha1ZWz5B6hTffKfuLYKZKjXWxXi7wzXAqWuSMRw7hPRDeT6mAYKj2VTZEpQi5RNNkh2dgBfyRuJ6v7uMKaVxqsEqSGswqjJdow4SvTsFCum3WG9dqKzYChJcYHzc5mVHYSNySZfsBftmydKTYf1sLmLv1CMUs2sSMxKxHVRygkCbiFhUHQ7jEJ8ieYVuyHSkwAZu4SCTe22hyUKFgQEoxn9JPR9ZLRWfqPqGTZu9PqTNAhGtuKfPeEu7gSPJy1p6RhqDXWL49ZJXeDwD83vEfZVqKk5UwmP33cwFD2cmptdvaFTxmbQBoYicdP48GM4MDAak1pB3smzRjUMZKM827SUU31zj8dPfRfDbj4JVdJiaoUogpD6qS3RFrnZXe8uABEgSHQ3MXMrp6fSee42gzBr2bNhG965d2nqVAUwfBRwuLF7gaiRpaNnLc6FZfeJvfLHkXw1HvbuVTQYN5562oDKym3WdRE9zEyjR6Xt3cfjaFNsSnvLrTpFHKUWSJRGhGQrfwUZXeFYNnuFtBjLEt3Dny72z1teyEfkBtrYMvmyMcbR1xDRj1hbkiBqEApWsaAZoPsfCAWa2dBtZs76Dw1BNN4CGVM75PGoanPALJfoj9DP6ct2oBkaaGYK8sSH5WL524tLtyRsrj9ZrD2fbkuD7jwBj9oPYLNAiiq3aA1635mqi6c9WJu59oqChaCbrdNbdjw2hXnkHTHPzAkwgrfQYeG3iVYniebWc6D6aqV4SxzzYoB9xmv8zsa28DibyfUCsBsJqubZbHyNMjbGGisBmNfq33NhrQ6oYTKnbm1eKFRKfTgeUN7kFDWTNUPBBfbSrzN127Nt3ddn6HktoNbYtpUVKv3yJjX96rhMJrb3RUwuLfP2PMKTW9QhMBGvAjtcqB2LSRgDgE7j8o3Pt5SKzsCTw9SHVoje9AGrd3XibtZVZcu1yFwcjYdXf8pvCjcp8EH7RHRRxGruqXbhseKsYPQLPCjSEbGEFtaFWv9UiUK64w6Qdiw7NRAA9YVd6TsHCYCCvrLDnp15MpirUPRHYaMzUz12qM9mCPpq8CUKEiXzmm2cqYVZEpRq6RB2xiTQy3qtZskthNWmiGE6UYzLMd4DtHE1STrQu6QUiJFmJtipYt3bj8A4N4yFzdHtFpmDN2XtGF5FR86DKacEcEPTas9iziD7M47Wyh1FZ8ZHJZsdxXXkFE6tVk76mjJiaXrMYZsQf7eJvz5fbUsoCjAmAMn3j9t6oa4pTmoEYn7aTEgx2yATYWny8HTHMbcu6b3PrB4PS7PWPLRhG9q1G4s3HkfLmVAb9bf6yxTZkauX1HC6E74xGVD8tR3gQjSQB1xQ65eSW36Zd43BJY2Mte12Lcimi5fqyt3R2NHpULv2MatfCdtkX7wPjkNtZprxRQpAmXuoZJQiBJycpQpKfQFXVtpkFy2qbcHCe5hLxk7GuLT7j6iPvnGmtUuwnzhHqEUYY1QizWiTtTFkZx1xvnaMDcGs38WADPgDoA8jkAjvuBHS9kecbzbJSPu5ZfB5Zage3Pzc7YeU6gjp7QUT8dqMmRwtsc3hMYxe7EFzjyesR1ZUCNxGSRGzecetnb5kcBEWag3p71dq62kAMFs8atGpeARCwsiqgQ1e8o21NPSdVxMdeH1V3GiQUQbXqksoyWS5hi41QhXdEb9xHeBBwUq4U8BsTMUmF1czp7xBK3jBwrvtAUgsFqCWus39fXYt17TK1FevdnEyemHtFmCwKHy7Wyia7SrBBBWeG39Vdo7rLfXdqneDNSz5MrgBZfPxZhazW4ZXeYi4CCEoS8B1emVmzUnjVrDTHP8uL4MBc9Ht3GiR6er9rsYn2um9T47rx5iQmmuao4BCjQBYETCYATYWgXvL1ML2tYMbtki2QBijw8JA4C6pKHFb1w2C6yi3pKmfNZfNM5gRB8uuB2kGSVQThSSR35s4AZWDYjKfyg1NwNm7mD7nx5QkjJR54YWjgs8r9GMdQxog2TPs2Vo2515cGWDFoVu6nxEYUtki6gWcJE2RXus9Zh7enqZDb1VwFCkVyLc3TnS3Gg9Yfwou9utW3ki9otF5bd9uoiS6J5gCqUAmT7pj2sJ8Wa8MZLGUVYWGAgeJWsTLJBR6qrHPgakexjLJq39mcAXB7L6KQZQ1mKRKq1vKwGkg22d8LA6HHQp4riNRANw4oKLrPAmVEqV4ynmpqoqEgXNVYvh5v6XHYb8cpPCgJKU2orhB2vTjZdj3FfQmx1zJJp476YMkiDcA8B3aZ6kr5M3FiZrXqNP8HfUyk3vPYqhEDa7qrkWCRhSSMVad1zRgGqKwNVv6dE3zMKapxH6HLfh2HC34ZM1P4EVR57GSAZvSEv2WjwKvM2JD9oTMSN8inDcavzFexefFwEcmdu8gmjyTuPUSbBwRgZtELLrwGsaQg8xEPkTmYKC8yPNpTQPvGBDECmFUe1bKj6FPsdgj6r2yANHYdKE48njzNry4TeQxbWMkKw5u352z3czquE5mXxtzT9kikj62nvy6mfsCSqMCUGjJv55GA1CYNC7V4TiDuZxVggFQ9LbB9AHQkp7G5njnfgcG79EnQvPg9ZzvCEVEEkm1CtcKKaAxufR473KUXac9rozfKMjzY8Eg2EaztYgyQQcMwdFy2ZxmVGr8A9iWBVcmzn5tEJbCBceH3NgEyhsf89czaj41Mcbho7XiewbDZhGmqWUfpGNjxfzkLMtgVfVEm49VpigmBBnj3PRWeCvQrvyGcJtjxnVFoLzEhsgRFfsCQy1XQm8oZWJMsY6CDwZahEYnMedfPaejMiDvyxSeJPVEuBLN8tTxJ7NpU3fFKhr2Vsje2bd1rZoZZY98E8ZS4LKFzBh2VfzrUPr',
      signedBytes:
        '8fcf233671b6a04fcf679d2a381c2544ea6c1ea29ba6157776ed842426e5cab86b04fa9526291236732263e4b5556aa14005f193e780882701904e0004f3881720a6a283f7680e3b99bd9ca090299ea4dccaca3faf3f2d70d8d0fa7b76084d26aa52eaf9186677d4a2c21e77bbda95cea8e33ba33b04a2867fc8d38fa16fa57a9656701e95979ace36d5713708b6ad54c466f553d0abedcab22c28c96f152108a1542f1f07bb478ea20293f4dc172370edc6d46bb2670b1dfcaac2031d9287327d5ae86c5e8dd2b1c8e590681bf4aec794f1196521699f5925b70c6fff35916dd69d99486c758cd92b745dd42924aae278e2aa262b7105c21b0ca69f851690734325b8063cbd3ab3504b9efb35bdd53ae2b6001d555b2df9a9d9f0904d80304554b4862dbf9c580257d5d88163668fcaaca40910e1fc9629d629944efecfefe8e89e39fd1718f341d75f9c83b316a32873e2dfcba07fcfa45cb8ad69f86ea2e16cb1bdce26b93a06f4c7da61d1d33d30e84ce3c1c9b8e600a83af520d0c9eaa6ef536dfa8faca6292a15c4c3fb3b9fbfdfbc6106912004baadcf7ad0a5392539d4fbc9d7a95f0546b96c6e536c3893b462f12e11b83ecfe4a6b76effcc7c9b2de819967efa3605ef23ce1b750871f043cf808d8b2cd37b0621e2adb6318b87026bdd5f2f9b63ac4f56631ce7bfc02879bd6d50e7dc0bc14689218bc842e49d41dd1a9b0b5470bcb276a5c48886fb9751d1b98d63791a60be093b065c67dcd140944c06dffe66735c9d6b3d13d68ad1776e18072c785ba16d1a62ecdbc464b9e420730cfb8bfb70c9fcc2dce5de41abd391a8c334df53e27ac34f6ee505d96628c75e2407684c2615287bebd7bb08d115196f0be626fb6f9ea2b2c0a42f01b2d3a39e1abfc6697e170a911bdcd3e73c77b85f610975aaaaa2a18bb5c7f33ff68316c12cbd17aa983779bbd0ef338aed621d2f8022f887bb4554b7796e7d9d4e04063e1be0d593d4a3ae9ef60bb3cf9791b036be0a5e0faa9670d8fec01132d71f194174142ab4dcfd4b43ee3cad701671fef0d698d96e196ea23fc6ff3907e60b71f3d8cb65a58ee51f75cf748cb4a09d8cbaaf6f5d5f3883cc39824a02d88206fe83b4954ebd080fbee9c1906e42dcc471e52f1c7406e272e0043c75b4fc8c9f92cd5467978041279a9f33d8398f882f261d84504e465dda663d278c66019c862de5a403ea8ff142a2e13405bdb075aec9e0203f0e903cfe17f6a97f1632720636979ffcb42b7ed79f1f14c78e64e86795dfbc4bd4b01018e048dc8eaf20becc45a0cbe0a281dc0788647f078ecbf767d6057d80c568e7d6992eabf70fb8025c705aa7a0363c193146e180bf2060f37527dc64aed528ec908eed544693934d6552be9e7f069402a3eaf70c16fcba0c5286a484217c5adba501f899162344a34f9a659931f65cbfca9740947213dfbeef89608825d00b97745a0f4816cfb196c0f9755ab5e753206ab6b22cb7a96a5299b80f7f2d97e278c13c069162e882e2a24479d576b82cae832fb341427d08452789a2245c7c23987028a123289abef00e68f37ba7ef805560f9fe01d7c95e200b20ce8f2238b61b355aeebfb6d4ca62a4bc2b41f7d35513bac51a8f3e5d03429f56236de09950061c121528e9812dd98a52f8083b3ca2a0e736e108f4489865ad43e2036b9685481f38869253c68b1ace02d97f7d0d9feceed6b12eae84ff608b96ac4a2410fa6e0f02179d1197675d464344b3f659f194e606ecdd5bb2223bd36c9a36662ba19c20bb31f5212f83208f9c36987f6c977ae99603e38ac81f7b96e21d2c9f5f6cc31fcacdd49527e0e469320b182f39d35ac543938b01d11eb9748a110ffad30b7644a94b16401c3eee39fb02e89ad574d72b13eeb5cd1af065cc54369638b7450e968b13715e7f006c04fa9526291236732263e4b5556aa14005f193e780e807029008000100006b82198cb179e8306c1bedd08f12dc863f32888600ff048099668b6c87dde2511f8a9ae78675e13524a411f8d67d95808dd93980bcca29f57e52064c560df39d395022d52b348526a745d46dd0c6048f39b277fc7869426a33e88a824cf7238b645b01bbc5810a773ed919ddf4cd050c9db2b9e86c80a35c905107202a4383e0c82e89ebe43f5bd4d2f37074e93bb2d57661e83a0ce6be55d07201592686ee6a7f09b0187325085f1a61a3b68c4b5ee2d4a55255056b390c4a5ac05ad878570759cd8f4d349f4f3573ea7676b57a27b75f479356cab0cbd336d3d81a7fd0c138d63769b97b51920549e74431a909b032d4878da9ffb3c1fdacc58ac46123c060070cb0631cd592f8531dd3166a7e9729b4e57b12de87a825926c3dc00e85f0d4d53d2c9c81b70bc78c15b62df1bc8fe69a9facdd674390b4ce91abd95eac2cb1b308558db5b8c6968df31a15007a3b8a32c8a1a3b18b51e77f096a7403ceb39aa01806bc256a4ae7fc9a1597f2ba542e3b437baadfdf02f9b25fb0c2a1668c6d725bb6478ec1a8e0ca60a9ffc5feea5d310f31accbf8d23960dfcd0e111809997998484fd230e0ff3f849c2edcfc59bf1714a96b9039823eb054004e0006221eadb0c882ed2544ff84ab7d440689513de9069fbc3c62f158f3378f8b55cca95a0189c85df32a9eba90cda7e44eb8be9032ab689de8996c8a96420596ed855db1c9b5c68f9ee6d338b70b2d21b2ab54a2c0ca777e6d4b8ff937f6e49cb3a8b24ce0c133616b6f949047aca783aeff4323015f1a295030f1bc11aa046011814df12cbe35e04aca18e6809a3505df2cfd3f142b45b98a3bab32aca1e3d0bf012c951f6a49be2ed09fc7cddff09aea6778e6f327e32241a47a7ca58f8a34b67ec5a57e08f18121f5ad20fbd3f44cf03096ddb76e0d59d5e4e285cdf4ac51ba27d526b04f08034f6e0820e8e12156926b2ab5aa62bc1e0d7631397e52ae3566c4aa82bc7b7463cd55bc07c9edb6d86572f074b986a1924011e7c41fc053a9c2fba04555c004aa70d669ab42d650452958a1da939bfc6a1f1c2f7b8836fc5d6191ae57f7ffe5eb04456ff389b4d123096ecf7db24c8438726502978d932bf55dcb0695f1422fb232c6efdfd9e5730050560eeed699930ee98aede3612127042ce11b4fdb5b7721d7c0b16ae7c0bbc062b8cda3627ea8978f5ae94129fbfb710403271c1b63b0e641d520dde6ff39c04e85b824b7292a603aa8afc01e5da29b642774e2ed9e92884d4e9d804afc1895f27ee4f6d4ea43507c7f239261183d62bcb01f5f169435394460e6d23f79b31a76ab7656a4148d60736b241f80d4bea379dc54861d20740e66c17c7247356d6c531b4eac5cd95018fc815fd7508c30c3b4f1c81735f79fe908b18a52aa01860017b60331ac7f81cac6550d3d832b4927ed85e22db0c4cf34b655de1ccbc79942d467849b4a87a893f884b7b10b5fd92ff48d3555899b6dbb6b103c3d1fddd3b5680e6790d693d5676fee5f2bd7685f36002e0a530085a76df57e50917fee92e53e95fd473e522e9110e131e3d7d6adc4c65985fbeac1736d7fec41344d77198ffb288ecf51e9ed70e02e8132a50991a88599d94901e4623029b0aaad195af9b53cc193e41444cb1400853cd4e0950989d5b5c5abb2e5df5f33039e5b4e91012ac696d907c47a69b7f2c68cb9e086076a2c0f3b2134934c8af306c650e940c51a8f85b425353471a877da2d8eb9b73944f368d15f009a8f3d59917069efc98be1ae9bb230dd9ef1da64768b210b9c0f89330844188a4dd220ea8fc7d8b2f6f9a94e5a15cf4a8c954136c9ca0042c79156b710f96a58775f5127be23db3fcf969e8c232adfcc6b7f080bd3650098c25d27ed0a5fbdc34f843fba7f89947ff9c8a40109ff8af9336eef96f77f039e87cbf10f94c9188dcc57d110eebba365839c880a5d87e8fb492a2dcbce7c6fa843b544c6e5ac73208416a08aa5e02a3bfb73199c768cfc2475aa7ac80bc526e2e49107018fda223921221d2acd39df79c4cd35f056012672d98de5bd71a7e430266a74f1ce02123d85fd2eb4ccd1c9c53e0bd046c54794db0c161156765e811809f794f0542ef23412400ba4e3275308c39fde7d8a98013a17d1803e9490f39294c59a431d95ac6e1448ca0bb292dcd98b3d2884a5c84b6907d3fcd4a4afa86e4fc13a964548026c4d66bccfbeea979084fabec5669be286c3ec9831410b270990242a674b0d192054ff344aa5fda85b63f72d1973c813db9756a2277ec24f916cecf8c2d1556e2860296429bea871b1724728495099fd965ccb36fb869d0c7448d93837b5c64e84da387ebf0a54c832a9ea1b645d23de5a43572d654c31fa3fef24f1c6b29a858760fc85bb649495e2e95c78bce70ba39661b07bdb2730f37041f684248568681011570885fd732f05174285d3dbe5466699d459963e61e89194ca33ec420d6be1d44b21521a9b081405f8049f8701f4c9775384cb12b2f2273682e8d86c3eb4acf9ab7580eda8966748c446d35e101131d1a74f55b7a5c4ce12fc737f2641dfd70b208410b38fd85bc0276c146aa4b5ccf88a8d207890614d44792fd020bdea5607951986734664f94d76ad847041241b88f07029dacbca9faad614aa3c564d1bf52d7fb17895738e61ce3837e4c93d2ec86e127e0b326d19e66b84a6c3776a6e0b760785550106a972ba42a30fe42ea8b07b8df11afac1f8c78bfdf64ba3213f6a1e963462ecea734413644aaf03e261c6c19a06701836069dc306acda5e7ccf5f9a6d246526f52ce91a3e0473bbb18bfd4cce3cf41afa26d659beaf2a374b8159bbc9741709520a503a3c4ad8c1e19561d474b350795ab800547e2a71a8773a7268108ee6e2a48cc68c43d96fff469c807e877379492e0af824afc94672f33c4d2ec6afd9e089539445e4d128cfb0fcbe5498d96b9a27801e7f783576ba0d9da31b79851aba21905e13b4fd1288f4bb4af1032cca5126b89d7c9c87c4126cb3f9119e5d3f0c8e55fa905abcb815b709bb83b694dce60758e6269b279cd6d6977102df55cd3d7a7919c8fdc073a7b62700735a958e36e352d4bae6d947ee31416af1bb5635a9ed258eb80495ced461fcc99b59cce1eb85ccf9e0e9895b6acf176aba9ea24de4feaf00836d774f135614df291fd2bbbf3afb16f6ba6d67f9ccd301990fa0fbe5fd4fb311552240c946f30ceb3fd364ec28d64d22ee6874572e0f607acd2d44c0a3f5837f643af79a6f02a948bdebf9a780a2a094c4bb13f3b4076d3c8dcc5015827cd9a1d02480607989f6b303eca03f0c2f3e4e6a868c8f909fa7acc0c3e1e9eaefff063234455b707b7d819096bee0e3f302070d141c24383c40606c707d96abc5d4d7ed2324292e4d515e5f636785959ab5cbd1f10000000000000000000013223546',
    },
  ],
} satisfies { octezVersion: string; provenance: string; vectors: OperationVector[] };
