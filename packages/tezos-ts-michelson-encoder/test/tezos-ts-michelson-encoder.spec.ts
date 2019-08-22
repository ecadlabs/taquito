import { Schema, ParameterSchema } from '../src/tezos-ts-michelson-encoder';

import { storage, rpcContractResponse, bigMapDiff, params, txParams } from '../data/sample1';

import { storage as storage2, rpcContractResponse as rpcContractResponse2 } from '../data/sample2';

import { storage as storage3, rpcContractResponse as rpcContractResponse3 } from '../data/sample3';

import {
  storage as storage4,
  rpcContractResponse as rpcContractResponse4,
  bigMapValue,
} from '../data/sample4';

import { storage as storage5, rpcContractResponse as rpcContractResponse5 } from '../data/sample5';

describe('Schema test', () => {
  it('Should extract schema properly', () => {
    const schema = new Schema(storage);
    const s = schema.ExtractSchema();
    expect(s).toEqual({
      accounts: {
        address: {
          allowances: {
            address: 'nat',
          },
          balance: 'nat',
        },
      },
      name: 'string',
      owner: 'address',
      symbol: 'string',
      totalSupply: 'nat',
      version: 'nat',
    });
  });

  it('Should parse storage properly', () => {
    const schema = new Schema(storage);
    const s = schema.Execute(rpcContractResponse.script.storage);
    expect(s).toEqual({
      accounts: {},
      name: 'Token B',
      owner: 'tz1ccqAEwfPgeoipnXtjAv1iucrpQv3DFmmS',
      symbol: 'B',
      totalSupply: '1000',
      version: '1',
    });
  });

  it('Should parse storage with map that have string as key properly', () => {
    const schema = new Schema(storage2);
    const s = schema.Execute(rpcContractResponse2.script.storage);
    expect(s).toEqual({
      '0': {},
      '1': {
        admin: 'tz1M9CMEtsXm3QxA7FmMU2Qh7xzsuGXVbcDr',
        metaData: {
          By: 'https://SmartPy.io',
          Help: 'Use Build to define a new game board and Play to make moves',
          'Play at':
            'https://smartpy.io/demo/explore.html?address=KT1UvfyLytrt71jh63YV4Yex5SmbNXpWHxtg',
          'SmartPy Template': 'https://smartpy.io/demo/index.html?template=tictactoeFactory.py',
        },
      },
      paused: 'False',
    });
  });

  it('Should parse storage with mutez properly', () => {
    const schema = new Schema(storage3);
    const s = schema.Execute(rpcContractResponse3.script.storage);
    expect(s).toEqual({
      balances: {
        KT18oQnGxZNPST7GndCN1w5o3RjCKMPRuQYb: '0',
        KT1BPE6waJrv3CagjRYwtfF3ZbE4nKxCa35Q: '79540178',
        KT1BgkG1u8oQ5x1nySJq9TSExZYZvuUHxG4d: '94738111',
        KT1CDEg2oY3VfMa1neB7hK5LoVMButvivKYv: '972668',
        KT1CSecsvPEUbnjQ58UAStVvanN2CghEuDNr: '850791',
        KT1ETj1iC48XWpa7fGhD9AAArZgLkgNrk35W: '6694159084',
        KT1F7Gn9YupQLwU4qM8u9CgcRzBa3gDRd1e5: '2244700000',
        KT1GtaRfTTHXTYVNGZFsZjoB9T2yn3bToZEs: '67923763011',
        KT1GvYJfGNqrLtUCPc4JithuXco72sxa9Ewh: '6067881716',
        KT1J7u8E5XDz5LWQTr1ZKY7coDYNMh2vwvwX: '702521',
        KT1KRzRDQxbGZDobSCdyWCnB6nShX3MvFLAW: '47371547783',
        KT1LuVQUALxtVMnNTa36SDVwtDmpNbosZEh8: '50694800896',
        KT1NkYSVn7FqXGqyi9ruiqHS7mjUzDyv6fmc: '5938869113',
        KT1QB4Tib11b8gYrC77Xs9bXU8TGJTXPAK7J: '60414680184',
        KT1QX5woZXV5N6iqFFHkrgZrwH9uhh7Ma6qz: '3977008911',
        KT1RJ2HjvmGcrDqpPoFwy6uVDk9uf71iv7dF: '11416957072',
        KT1SE8DxcSsfA7upZtdpcZGGRRP3guqSk4nM: '2155481887',
        KT1SGQmwvK5s49ovZLXxLbW8RzNB1vSbtE5b: '3902114120',
        KT1VqoJ5jEAY1UEugRFiSTXhTVXAsj65tsUv: '8992531001',
        KT1Vqq4nD2Mgwz4bYZVFbjKUESAmxrVFfRAr: '99496052',
        KT1VvGrrdJmVTwRER39btAXC64b56sLqbXkY: '9879704715',
        KT1XBbG1xtdsSWDsy5dwqXpUQEEgLPm6RGRb: '482601406',
        tz1LBAWdvnHjqxNNyYJhy9eBcaj3mE3cjhNQ: '700000000',
        tz1LWXJ1rZKCBeQzqtPriNiFpKU5gWo2u8zT: '11220754689',
        tz1NNf9KDcPa6iSi64gy1na5msfjcv3XWJs2: '37742509148',
        tz1QXuUweuLrxC3LmDMoPxmpT19ijhPTc1bt: '9967227',
        tz1R6ZvSYDHYCqeK3NckyjN9z1H5rHVc1xr9: '20856441766',
        tz1S6yEw9hZKcNkWnoVnyjQ5Qfakt3kdYLE9: '0',
        tz1TowqAmCuYzkeZ98xyacN2SnKnzJM6ssVE: '26757313041',
        tz1VLcYgQsvarbcWCPfUw1Fcz27jVrB2zYBr: '995650005',
        tz1WTcM46fg6fN5fdbhz1LgX2GbqyKTczzR7: '1043871972',
        tz1WzAsDfPhpTA75h37pCbN2jC9JPYyhUuc2: '21165644772',
        tz1amzJBBjgMaUfpEoX4npYQuXqdb4fvuBpr: '14268243108',
        tz1b22ii76LksTJm7JTi6wtCYEXFa82FdwaH: '4193732',
        tz1bPGEnW2wGjpyceJdUSpDHFShGddPysAHE: '49644981635',
        tz1bxHfbJyEFaHzeiCfpmtwUoGtLE6VT94HC: '5581647542',
        tz1cf4tBruBKA7keMHiHqivsz4oDcBBGSVDm: '1902576',
        tz1cxjPRxvdYoLCUzfcJthAkdnTAunA2Dm5U: '8417961239',
        tz1d8x5yMzMQRVjpuSZUUBgJtqRGMzbunvQP: '17437358995',
        tz1eDP1gCVMZkukT4dxetSJMZJHmkTMBY2mL: '2498000000',
        tz1eSmgHg4Xoy2RJy2owdjGsYzj5eKxaoKYr: '35524185304',
        tz1ee26q3xzbsZF4AMkzysR8CxK8eZiLRzKF: '48718359',
        tz1i8p76UJXw2WJt2o2puAbrt2c36DohjuzW: '123799839',
      },
      buyPrice: '1062727',
      decimals: '6',
      inBaker: '570674096663',
      name: 'Tez-Baking Token',
      owner: 'tz1LBEKXaxQbd5Gtzbc1ATCwc3pppu81aWGc',
      sellPrice: '1062060',
      symbol: 'BAKER',
      totalSupply: '542476246169',
    });
  });

  it('Should parse big map properly', () => {
    const schema = new Schema(storage);
    const s = schema.ExecuteOnBigMapDiff(bigMapDiff);
    expect(s).toEqual({
      tz1Ra8yQVQN4Nd7LpPQ6UT6t3bsWWqHZ9wa6: {
        allowances: {
          tz1fPjyo55HwUAkd1xcL5vo6DGzJrkxAMpiD: '60',
        },
        balance: '200',
      },
    });
  });

  it('Should build parameter schema properly', () => {
    const schema = new ParameterSchema(params);
    const s = schema.ExtractSchema();
    expect(s).toEqual({
      allowance: {
        '4': 'address',
        '5': 'address',
        NatNatContract: 'contract',
      },
      approve: {
        '1': 'address',
        '2': 'nat',
      },
      balanceOf: {
        '3': 'address',
        NatContract: 'contract',
      },
      createAccount: {
        '5': 'address',
        '6': 'nat',
      },
      createAccounts: 'list',
      transfer: {
        '0': 'address',
        '1': 'nat',
      },
      transferFrom: {
        '2': 'address',
        '3': 'address',
        '4': 'nat',
      },
    });
  });

  it('Should parse parameter properly', () => {
    const schema = new ParameterSchema(params);
    const s = schema.Execute(txParams);
    expect(s).toEqual({
      approve: {
        '1': 'tz1fPjyo55HwUAkd1xcL5vo6DGzJrkxAMpiD',
        '2': '60',
      },
    });
  });

  describe('Sample4', () => {
    it('Should encode key properly', () => {
      const schema = new Schema(storage4);
      const encoded = schema.EncodeBigMapKey('AZEAZEJAZEJ');
      expect(encoded).toEqual({
        key: {
          string: 'AZEAZEJAZEJ',
        },
        type: {
          prim: 'string',
        },
      });
    });

    it('Should parse storage properly', () => {
      const schema = new Schema(storage4);
      const storage = schema.Execute(rpcContractResponse4.script.storage);
      expect(storage).toEqual({
        '0': {},
        '1': 'tz1W8qq2VPJcbXkAMxG8zwXCbtwbDPMfTRZd',
      });
    });

    it('Should parse big map value properly', () => {
      const schema = new Schema(storage4);
      const value = schema.ExecuteOnBigMapValue(bigMapValue);
      expect(value).toEqual({
        clients: [],
        userRecord: ['1234567891', '123456', '123456'],
      });
    });
  });

  describe('Sample5', () => {
    it('Should parse storage properly', () => {
      const schema = new Schema(storage5);
      const storage = schema.Execute(rpcContractResponse5.script.storage);
      expect(storage).toEqual({
        '0': {},
        totalSupply: '1000',
        approver: 'tz1g3oS1UPgWFFpxrc2pEn4sgV3ky1Z6Qaz2',
        centralBank: 'tz1g3oS1UPgWFFpxrc2pEn4sgV3ky1Z6Qaz2',
      });
    });
  });
});
