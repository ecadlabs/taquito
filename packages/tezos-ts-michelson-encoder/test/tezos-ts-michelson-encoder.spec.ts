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

import { storage as storage6, rpcContractResponse as rpcContractResponse6 } from '../data/sample6';
import { storage as storage7, rpcContractResponse as rpcContractResponse7 } from '../data/sample7';
import BigNumber from 'bignumber.js';

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
      totalSupply: new BigNumber('1000'),
      version: new BigNumber('1'),
    });
  });

  it('Should parse storage with map that have string as key properly', () => {
    const schema = new Schema(storage2);
    const s = schema.Execute(rpcContractResponse2.script.storage);
    expect(s).toEqual({
      '0': {},
      admin: 'tz1M9CMEtsXm3QxA7FmMU2Qh7xzsuGXVbcDr',
      metaData: {
        By: 'https://SmartPy.io',
        Help: 'Use Build to define a new game board and Play to make moves',
        'Play at':
          'https://smartpy.io/demo/explore.html?address=KT1UvfyLytrt71jh63YV4Yex5SmbNXpWHxtg',
        'SmartPy Template': 'https://smartpy.io/demo/index.html?template=tictactoeFactory.py',
      },
      paused: false,
    });
  });

  it('Should parse storage with mutez properly', () => {
    const schema = new Schema(storage3);
    const s = schema.Execute(rpcContractResponse3.script.storage);
    expect(s).toEqual({
      balances: {
        KT18oQnGxZNPST7GndCN1w5o3RjCKMPRuQYb: new BigNumber('0'),
        KT1BPE6waJrv3CagjRYwtfF3ZbE4nKxCa35Q: new BigNumber('79540178'),
        KT1BgkG1u8oQ5x1nySJq9TSExZYZvuUHxG4d: new BigNumber('94738111'),
        KT1CDEg2oY3VfMa1neB7hK5LoVMButvivKYv: new BigNumber('972668'),
        KT1CSecsvPEUbnjQ58UAStVvanN2CghEuDNr: new BigNumber('850791'),
        KT1ETj1iC48XWpa7fGhD9AAArZgLkgNrk35W: new BigNumber('6694159084'),
        KT1F7Gn9YupQLwU4qM8u9CgcRzBa3gDRd1e5: new BigNumber('2244700000'),
        KT1GtaRfTTHXTYVNGZFsZjoB9T2yn3bToZEs: new BigNumber('67923763011'),
        KT1GvYJfGNqrLtUCPc4JithuXco72sxa9Ewh: new BigNumber('6067881716'),
        KT1J7u8E5XDz5LWQTr1ZKY7coDYNMh2vwvwX: new BigNumber('702521'),
        KT1KRzRDQxbGZDobSCdyWCnB6nShX3MvFLAW: new BigNumber('47371547783'),
        KT1LuVQUALxtVMnNTa36SDVwtDmpNbosZEh8: new BigNumber('50694800896'),
        KT1NkYSVn7FqXGqyi9ruiqHS7mjUzDyv6fmc: new BigNumber('5938869113'),
        KT1QB4Tib11b8gYrC77Xs9bXU8TGJTXPAK7J: new BigNumber('60414680184'),
        KT1QX5woZXV5N6iqFFHkrgZrwH9uhh7Ma6qz: new BigNumber('3977008911'),
        KT1RJ2HjvmGcrDqpPoFwy6uVDk9uf71iv7dF: new BigNumber('11416957072'),
        KT1SE8DxcSsfA7upZtdpcZGGRRP3guqSk4nM: new BigNumber('2155481887'),
        KT1SGQmwvK5s49ovZLXxLbW8RzNB1vSbtE5b: new BigNumber('3902114120'),
        KT1VqoJ5jEAY1UEugRFiSTXhTVXAsj65tsUv: new BigNumber('8992531001'),
        KT1Vqq4nD2Mgwz4bYZVFbjKUESAmxrVFfRAr: new BigNumber('99496052'),
        KT1VvGrrdJmVTwRER39btAXC64b56sLqbXkY: new BigNumber('9879704715'),
        KT1XBbG1xtdsSWDsy5dwqXpUQEEgLPm6RGRb: new BigNumber('482601406'),
        tz1LBAWdvnHjqxNNyYJhy9eBcaj3mE3cjhNQ: new BigNumber('700000000'),
        tz1LWXJ1rZKCBeQzqtPriNiFpKU5gWo2u8zT: new BigNumber('11220754689'),
        tz1NNf9KDcPa6iSi64gy1na5msfjcv3XWJs2: new BigNumber('37742509148'),
        tz1QXuUweuLrxC3LmDMoPxmpT19ijhPTc1bt: new BigNumber('9967227'),
        tz1R6ZvSYDHYCqeK3NckyjN9z1H5rHVc1xr9: new BigNumber('20856441766'),
        tz1S6yEw9hZKcNkWnoVnyjQ5Qfakt3kdYLE9: new BigNumber('0'),
        tz1TowqAmCuYzkeZ98xyacN2SnKnzJM6ssVE: new BigNumber('26757313041'),
        tz1VLcYgQsvarbcWCPfUw1Fcz27jVrB2zYBr: new BigNumber('995650005'),
        tz1WTcM46fg6fN5fdbhz1LgX2GbqyKTczzR7: new BigNumber('1043871972'),
        tz1WzAsDfPhpTA75h37pCbN2jC9JPYyhUuc2: new BigNumber('21165644772'),
        tz1amzJBBjgMaUfpEoX4npYQuXqdb4fvuBpr: new BigNumber('14268243108'),
        tz1b22ii76LksTJm7JTi6wtCYEXFa82FdwaH: new BigNumber('4193732'),
        tz1bPGEnW2wGjpyceJdUSpDHFShGddPysAHE: new BigNumber('49644981635'),
        tz1bxHfbJyEFaHzeiCfpmtwUoGtLE6VT94HC: new BigNumber('5581647542'),
        tz1cf4tBruBKA7keMHiHqivsz4oDcBBGSVDm: new BigNumber('1902576'),
        tz1cxjPRxvdYoLCUzfcJthAkdnTAunA2Dm5U: new BigNumber('8417961239'),
        tz1d8x5yMzMQRVjpuSZUUBgJtqRGMzbunvQP: new BigNumber('17437358995'),
        tz1eDP1gCVMZkukT4dxetSJMZJHmkTMBY2mL: new BigNumber('2498000000'),
        tz1eSmgHg4Xoy2RJy2owdjGsYzj5eKxaoKYr: new BigNumber('35524185304'),
        tz1ee26q3xzbsZF4AMkzysR8CxK8eZiLRzKF: new BigNumber('48718359'),
        tz1i8p76UJXw2WJt2o2puAbrt2c36DohjuzW: new BigNumber('123799839'),
      },
      buyPrice: new BigNumber('1062727'),
      decimals: new BigNumber('6'),
      inBaker: new BigNumber('570674096663'),
      name: 'Tez-Baking Token',
      owner: 'tz1LBEKXaxQbd5Gtzbc1ATCwc3pppu81aWGc',
      sellPrice: new BigNumber('1062060'),
      symbol: 'BAKER',
      totalSupply: new BigNumber('542476246169'),
    });
  });

  it('Should parse big map properly', () => {
    const schema = new Schema(storage);
    const s = schema.ExecuteOnBigMapDiff(bigMapDiff);
    expect(s).toEqual({
      tz1Ra8yQVQN4Nd7LpPQ6UT6t3bsWWqHZ9wa6: {
        allowances: {
          tz1fPjyo55HwUAkd1xcL5vo6DGzJrkxAMpiD: new BigNumber('60'),
        },
        balance: new BigNumber('200'),
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
        '2': new BigNumber('60'),
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
        totalSupply: new BigNumber('1000'),
        approver: 'tz1g3oS1UPgWFFpxrc2pEn4sgV3ky1Z6Qaz2',
        centralBank: 'tz1g3oS1UPgWFFpxrc2pEn4sgV3ky1Z6Qaz2',
      });
    });
  });

  describe('Sample6', () => {
    it('Should parse storage properly', () => {
      const schema = new Schema(storage6);
      const storage = schema.Execute(rpcContractResponse6.script.storage);
      expect(storage).toEqual({
        replay_counter: new BigNumber('8001'),
        key_groups: [
          {
            signatories: [
              'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
              'edpktm3zeGMzfzFuqgyYftt7uNyVRANTjrJCdU7bURwgGb9bRZwmJq',
              'edpkucCnbeGPWNvGHeTQ5hENHPrc8txBBiQXNphu3jgv9KYbhQBovd',
              'edpkuNjKKT48xBoT5asPrWdmuM1Yw8D93MwgFgVvtca8jb5pstzaCh',
            ],
            group_threshold: new BigNumber('2'),
          },
          {
            signatories: [
              'edpkukogJzCZSAfc5foRpEZGsryMjiXj77VxcFLzZoreB1vZWFeKc2',
              'edpkuSZ1GoM6MALh4fPZBrwDhGwY9vENEoyctcXuDK3yoiX4xWhMaA',
              'edpkvXL9B32DcEbMNiMangcSFMvAd8NBwH8AfmRb6iBbHxLgx3J59P',
              'edpkumCFhgS94cjZXiFnnq7MFsaWBz4Tp78AX2fZfhB9J9hcgcKxgy',
            ],
            group_threshold: new BigNumber('2'),
          },
          {
            signatories: [
              'edpkv9eiqPP8bxCPEem6BBUNokwwy64G7ARYov77oNyCfK6fP3H5hz',
              'edpktjDaR4gmEZNSnnuSWMmJ4fhYmMD4Lk1WkDCfWRWdbGHQ9eNT45',
              'edpkuapDV7oaWqK5fStnPbhEm2g7kvhhtbBNs9hhq3KWXS2qcWcdNQ',
              'edpkuzAzJ5yQeSHsfRqwkdGBELdJjAGGR6gw3Ar1iVVDvFef5e6Juk',
            ],
            group_threshold: new BigNumber('2'),
          },
          {
            signatories: [
              'edpkuhBM7RhVwtityNcxMZchDX8yAQejxe8qhBLBLKxuNtDYaBto7u',
              'edpkuALgGd9Y5SWLXPfUJV9EG2rv6EkCBA4C47mrt4cAmE11EHQrCs',
              'edpkvZRBMfmC2pcv6xnbHPzKpwH7U9sPgFieXGjQFdW2Tzu9vcd5f8',
              'edpkvZkwaGFpqU3aRuUedeGx1xah6wLMre4nNYMvNyvaDZgKicvFWe',
            ],
            group_threshold: new BigNumber('2'),
          },
          {
            signatories: [
              'edpkuBBAoSWWAUfRNGVZu5H4TBnCmRVhWW1sZApLA53pYfY3tKjnev',
              'edpkvQpud1huJmJqUfF84uHjkpR7AQ32uKP1wkEqnJhgH1nXPQheUh',
              'edpkuiacWZrSDn6LtkXkwq9mY7VPefGzoyZoL1PWGBj4EngM95D1Md',
              'edpkuXtt222Rdkg2dAQzcBkPL9EAn9e9RzjFSYr3MhG2NnjS7ihMxh',
            ],
            group_threshold: new BigNumber('2'),
          },
          {
            signatories: [
              'edpkv7k8jhUUuxHp4b2rrg2o9mZZB2SxM8i4bh1goebvQEporktRrr',
              'edpkvStZUa8YbsVuFQWHXWoBkJ8kyf4W26TXjRu2HXS7ymfeHrnquP',
              'edpktxdeLBghuHVyAq8q7SUKEJNMeFwPKVtWyJv9Pi51jWPXwhiFU4',
              'edpkvSC9HasAnmjfX3Qt5f88PVo24kx5LRzzpqNVzq5Q9Rm7Q71ubB',
            ],
            group_threshold: new BigNumber('2'),
          },
          {
            signatories: [
              'edpkvZ471mmT7nCrge44mzLwW6mmpLh5n2ykXX5zHunqgxMc4JcTgE',
              'edpktsM8qruHNaGKM5wor6UDmkn5YeH9rekmTayUMAP5zyL8RCvGic',
              'edpkuT8WzhehsZjyUqCYVQEvwUJ4Nez2mSjfrWxPvnUNCZjjYHbyMB',
              'edpktepTo31j8SYSBCupfRA8VEdTXXvgtbZEEejuumpAGU6xKEi4sf',
            ],
            group_threshold: new BigNumber('2'),
          },
        ],
        overall_threshold: new BigNumber('4'),
        vested_balance: new BigNumber('0'),
        vesting_increment: new BigNumber('199041301565'),
        next_payout: '2018-07-30T05:30:00Z',
        payout_interval: new BigNumber('2629800'),
        pour_info: {
          pour_dest: 'tz3WMqdzXqRWXwyvj5Hp2H7QEepaUuS7vd9K',
          pour_authorizer: 'edpkv4vUwGVVYnmmuafbEirXrXhT1bzcuJ2xQ3SHfeUVUr56YwgipC',
        },
      });
    });
  });

  describe('Sample7', () => {
    it('Should parse storage properly', () => {
      const schema = new Schema(storage7);
      const storage = schema.Execute(rpcContractResponse7.script.storage);
      expect(storage).toEqual({
        game: null,
        oracle_id: 'tz1Zwusa1tLQHRyB1KL1p44KjgDbi5KjNKay',
      });
    });
  });
});
