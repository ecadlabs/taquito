import BigNumber from 'bignumber.js';
import {
  params as params3,
  rpcContractResponse as rpcContractResponse3,
  storage as storage3,
} from '../data/sample3';
import { ParameterSchema } from '../src/schema/parameter';
import { Schema } from '../src/schema/storage';
import { MichelsonMap } from '../src/michelson-map';

describe('Schema test', () => {
  it('Should parse storage with mutez properly', () => {
    const schema = new Schema(storage3);
    const s = schema.Execute(rpcContractResponse3.script.storage);
    expect(s).toEqual({
      balances: MichelsonMap.fromLiteral(
        {
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
        },
        { prim: 'big_map', args: [{ prim: 'address' }, { prim: 'nat' }] }
      ),
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

  it('Should encode storage properly', () => {
    const schema = new Schema(storage3);

    const result = schema.Encode({
      balances: MichelsonMap.fromLiteral({
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
      }),
      buyPrice: new BigNumber('1062727'),
      decimals: new BigNumber('6'),
      inBaker: new BigNumber('570674096663'),
      name: 'Tez-Baking Token',
      owner: 'tz1LBEKXaxQbd5Gtzbc1ATCwc3pppu81aWGc',
      sellPrice: new BigNumber('1062060'),
      symbol: 'BAKER',
      totalSupply: new BigNumber('542476246169'),
    });
    expect(result).toMatchObject(rpcContractResponse3.script.storage);
  });

  it('Should extract signature properly', () => {
    const schema = new ParameterSchema(params3);
    expect(schema.ExtractSignatures()).toContainEqual([
      'deposit',
      { __michelsonType: 'unit', schema: 'unit' },
    ]);
  });

  it('Should encode parameter schema properly', () => {
    const schema = new ParameterSchema(params3);
    const result = schema.Encode('deposit');
    expect(result).toEqual({
      prim: 'Right',
      args: [
        {
          prim: 'Right',
          args: [
            {
              prim: 'Right',
              args: [
                {
                  prim: 'Left',
                  args: [{ prim: 'Unit' }],
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
