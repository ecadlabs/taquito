import { InvalidAddressError, InvalidScriptFormatError } from '../src/errors';
import { ContractsLibrary } from '../src/taquito-contracts-library';
import { entrypoints, entrypoints2 } from './data/contract-entrypoints';
import { script, script2 } from './data/contract-script';
import { TezosToolkit } from '@taquito/taquito';
import { Tzip16Module } from '@taquito/tzip16';
import { VERSION } from '../src/version';
import { validateAddress } from '@taquito/utils';

describe('ContractsLibrary tests', () => {
  it('ContractsLibrary is instantiable', () => {
    expect(new ContractsLibrary()).toBeInstanceOf(ContractsLibrary);
  });
  
  it('get VERSION for ContractsLibrary', () => {
    const version = VERSION
    expect(version).toBeDefined
    expect(version.commitHash).toHaveLength(40)
    expect(version.version).toHaveLength(6)
  });

  it('adds one contract to the library', () => {
    const contractAddress = 'KT1NGV6nvvedwwjMjCsWY6Vfm6p1q5sMMLDY';
    const contractLib = new ContractsLibrary();

    contractLib.addContract({
      [contractAddress]: {
        script,
        entrypoints,
      },
    });
    const contractData = contractLib.getContract(contractAddress);

    expect(contractData.entrypoints).toEqual(entrypoints);
    expect(contractData.script).toEqual(script);
  });

  it('adds two contracts to the library', () => {
    const contractAddress = 'KT1NGV6nvvedwwjMjCsWY6Vfm6p1q5sMMLDY';
    const contractAddress2 = 'KT1HN6wQquJDFBvRH4Tsbx9SVazK7KzHXZYs';

    const contractLib = new ContractsLibrary();

    contractLib.addContract({
      [contractAddress]: {
        script,
        entrypoints,
      },
      [contractAddress2]: {
        script: script2,
        entrypoints: entrypoints2,
      },
    });
    const contractData = contractLib.getContract(contractAddress);
    const contractData2 = contractLib.getContract(contractAddress2);

    expect(contractData.entrypoints).toEqual(entrypoints);
    expect(contractData.script).toEqual(script);
    expect(contractData2.entrypoints).toEqual(entrypoints2);
    expect(contractData2.script).toEqual(script2);
  });

  it('replaces a contract entry in the library', () => {
    const contractAddress = 'KT1NGV6nvvedwwjMjCsWY6Vfm6p1q5sMMLDY';

    const contractLib = new ContractsLibrary();

    contractLib.addContract({
      [contractAddress]: {
        script,
        entrypoints,
      },
    });

    contractLib.addContract({
      [contractAddress]: {
        script: script2,
        entrypoints: entrypoints2,
      },
    });
    const contractData = contractLib.getContract(contractAddress);

    expect(contractData.entrypoints).toEqual(entrypoints2);
    expect(contractData.script).toEqual(script2);
  });

  it('returns undefined when querying a contract address that is not in the library', () => {
    const contractAdress = 'KT1NGV6nvvedwwjMjCsWY6Vfm6p1q5sMMLDY';
    const contractLib = new ContractsLibrary();

    expect(contractLib.getContract(contractAdress)).toBeUndefined();
  });

  it('throw an InvalidAddress error if the contract address is invalid', () => {
    const contractAddress = 'KTinvalid';
    const contractLib = new ContractsLibrary();

    try {
      contractLib.addContract({
        [contractAddress]: {
          script,
          entrypoints,
        },
    
      });
    } catch (e: any) {
      expect
      expect(validateAddress(contractAddress)).toEqual(0)
      expect(e).toBeInstanceOf(InvalidAddressError);
      expect(e.message).toEqual(`Address is invalid: ${contractAddress}`);
      expect(e).toBeInstanceOf(Error);
    }
  });

  it('do not throw an InvalidAddress error if the contract address is valid', () => {
    const contractAddress = 'KT1NGV6nvvedwwjMjCsWY6Vfm6p1q5sMMLDY';
    const contractLib = new ContractsLibrary();

    contractLib.addContract({
      [contractAddress]: {
        script,
        entrypoints,
      },
    });
  });

  it('throw an InvalidScriptFormatError error if the script format is invalid', () => {
    const contractAddress = 'KT1NGV6nvvedwwjMjCsWY6Vfm6p1q5sMMLDY';
    const contractLib = new ContractsLibrary();
    const script: any = 'invalid';

    !expect(script.code);

    try {
      contractLib.addContract({
        [contractAddress]: {
          script,
          entrypoints,
        },
      });
    } catch (e: any) {
      expect(e).toBeInstanceOf(InvalidScriptFormatError);
      expect(e.message).toEqual(
        `An invalid script property has been provided for ${contractAddress}. The script property can be retrieved from TezosToolkit.rpc.getNormalizedScript(${contractAddress}). Invalid script: ${script}`
      );
      expect(e).toBeInstanceOf(Error);
    }
  });

  it('Test the configure context function', () => {
    const Tezos = new TezosToolkit('fake');
    const contractsLibrary = new ContractsLibrary();
    const contractAddress = 'KT1NGV6nvvedwwjMjCsWY6Vfm6p1q5sMMLDY';
    contractsLibrary.addContract({
      [contractAddress]: {
        script,
        entrypoints,
      },
    });
    const contractData = contractsLibrary.getContract(contractAddress);
    expect(contractData.entrypoints).toEqual(entrypoints);
    expect(contractData.script).toEqual(script);
    expect(Tezos.addExtension([contractsLibrary, new Tzip16Module()])).toBeDefined
  });
});