import { convertToPartialParamsWithKind } from '../src/beacon-types';
import {
  PartialTezosDelegationOperation,
  PartialTezosIncreasePaidStorageOperation,
  TezosActivateAccountOperation,
  TezosFailingNoopOperation,
  PartialTezosOriginationOperation,
  TezosOperationType,
  PartialTezosSmartRollupAddMessagesOperation,
  PartialTezosSmartRollupOriginateOperation,
  PartialTezosSmartRollupExecuteOutboxMessageOperation,
  PartialTezosTransactionOperation,
  PartialTezosTransferTicketOperation,
  PartialTezosUpdateConsensusKeyOperation,
  PartialTezosRegisterGlobalConstantOperation,
  PartialTezosRevealOperation
} from '@airgap/beacon-dapp';
import { PvmKind, ScriptedContracts } from '@taquito/rpc';
import { OpKind } from '@taquito/taquito';

describe('convertToPartialParamsWithKind', () => {
  it('should convert ACTIVATE_ACCOUNT operation', () => {
    const op: TezosActivateAccountOperation = {
      kind: TezosOperationType.ACTIVATE_ACCOUNT,
      pkh: 'tz1...',
      secret: 'secret',
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.ACTIVATION,
      pkh: 'tz1...',
      secret: 'secret',
    });
  });

  it('should convert DELEGATION operation', () => {
    const op: PartialTezosDelegationOperation = {
      kind: TezosOperationType.DELEGATION,
      source: 'tz1...',
      delegate: 'tz1...',
      fee: '1000',
      gas_limit: '2000',
      storage_limit: '3000',
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.DELEGATION,
      source: 'tz1...',
      delegate: 'tz1...',
      fee: 1000,
      gasLimit: 2000,
      storageLimit: 3000,
    });
  });

  it('should convert partial DELEGATION operation', () => {
    const op: PartialTezosDelegationOperation = {
      kind: TezosOperationType.DELEGATION,
      delegate: 'tz1...',
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.DELEGATION,
      source: 'source not provided',
      delegate: 'tz1...',
      fee: undefined,
      gasLimit: undefined,
      storageLimit: undefined,
    });
  });

  it('should convert FAILING_NOOP operation', () => {
    const op: TezosFailingNoopOperation = {
      kind: TezosOperationType.FAILING_NOOP,
      arbitrary: 'noop',
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.FAILING_NOOP,
      arbitrary: 'noop',
      basedOnBlock: 'head',
    });
  });

  it('should convert INCREASE_PAID_STORAGE operation', () => {
    const op: PartialTezosIncreasePaidStorageOperation = {
      kind: TezosOperationType.INCREASE_PAID_STORAGE,
      source: 'tz1...',
      amount: '1000',
      destination: 'tz1...',
      fee: '1000',
      gas_limit: '2000',
      storage_limit: '3000',
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.INCREASE_PAID_STORAGE,
      source: 'tz1...',
      amount: 1000,
      destination: 'tz1...',
      fee: 1000,
      gasLimit: 2000,
      storageLimit: 3000,
    });
  });

  it('should convert partial INCREASE_PAID_STORAGE operation', () => {
    const op: PartialTezosIncreasePaidStorageOperation = {
      kind: TezosOperationType.INCREASE_PAID_STORAGE,
      amount: '1000',
      destination: 'tz1...',
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.INCREASE_PAID_STORAGE,
      source: undefined,
      amount: 1000,
      destination: 'tz1...',
      fee: undefined,
      gasLimit: undefined,
      storageLimit: undefined,
    });
  });

  it('should convert ORIGINATION operation', () => {
    const script: ScriptedContracts = { // This contract adds the parameter to the storage value
      code: [
        { prim: "parameter", args: [{ prim: "int" }] },
        { prim: "storage", args: [{ prim: "int" }] },
        { prim: "code",
          args: [[
              { prim: "DUP" },                                // Duplicate the parameter (parameter is pushed onto the stack)
              { prim: "CAR" },                                // Access the parameter from the stack (parameter is on top)
              { prim: "DIP", args: [[{ prim: "CDR" }]] },     // Access the storage value (storage is on the stack)
              { prim: "ADD" },                                // Add the parameter to the storage value
              { prim: "NIL", args: [{ prim: "operation" }] }, // Create an empty list of operations
              { prim: "PAIR" }                                // Pair the updated storage with the empty list of operations
          ]]
        }
      ],
      storage: { int: "10" }
    };
    const stringifiedScript = script as unknown as string;
    const op: PartialTezosOriginationOperation = {
      kind: TezosOperationType.ORIGINATION,
      balance: '1000',
      delegate: 'tz1...',
      script: stringifiedScript,
      fee: '1000',
      gas_limit: '2000',
      storage_limit: '3000',
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.ORIGINATION,
      balance: 1000,
      code: script.code,
      init: script.storage,
      delegate: 'tz1...',
      fee: 1000,
      gasLimit: 2000,
      storageLimit: 3000,
    });
  });

  it('should convert ORIGINATION operation', () => {
    const script: ScriptedContracts = {
      code: [
        { prim: "parameter", args: [{ prim: "unit" }] },
        { prim: "storage", args: [{ prim: "unit" }] },
        { prim: "code",
          args: [[
              { prim: "CDR" },
              { prim: "PAIR" } // Pair the updated storage with the empty list of operations
          ]]
        }
      ],
      storage: { prim: "unit" }
    };
    const stringifiedScript = script as unknown as string;
    const op: PartialTezosOriginationOperation = {
      kind: TezosOperationType.ORIGINATION,
      balance: '1000',
      delegate: 'tz1...',
      script: stringifiedScript,
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.ORIGINATION,
      balance: 1000,
      code: script.code,
      init: script.storage,
      delegate: 'tz1...',
      fee: undefined,
      gasLimit: undefined,
      storageLimit: undefined,
    });
  });

  it('should convert REGISTER_GLOBAL_CONSTANT operation', () => {
    const op: PartialTezosRegisterGlobalConstantOperation = {
      kind: TezosOperationType.REGISTER_GLOBAL_CONSTANT,
      source: 'tz1...',
      value: { 
        prim: 'Pair', 
        args: [{ int: '1' }, { int: '2' }],
      },
      fee: '1000',
      gas_limit: '2000',
      storage_limit: '3000',
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.REGISTER_GLOBAL_CONSTANT,
      source: 'tz1...',
      value: { 
        prim: 'Pair', 
        args: [{ int: '1' }, { int: '2' }],
      },
      fee: 1000,
      gasLimit: 2000,
      storageLimit: 3000,
    });
  });

  it('should convert partial REGISTER_GLOBAL_CONSTANT operation', () => {
    const op: PartialTezosRegisterGlobalConstantOperation = {
      kind: TezosOperationType.REGISTER_GLOBAL_CONSTANT,
      value: { 
        prim: 'Pair', 
        args: [{ int: '1' }, { int: '2' }],
      },
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.REGISTER_GLOBAL_CONSTANT,
      source: undefined,
      value: { 
        prim: 'Pair', 
        args: [{ int: '1' }, { int: '2' }],
      },
      fee: undefined,
      gasLimit: undefined,
      storageLimit: undefined,
    });
  });

  it('should convert SMART_ROLLUP_ADD_MESSAGES operation', () => {
    const op: PartialTezosSmartRollupAddMessagesOperation = {
      kind: TezosOperationType.SMART_ROLLUP_ADD_MESSAGES,
      source: 'tz1...',
      message: ['0x54656e646572', '0x537461726b4e6574776f726b'], // Array of messages to add to the rollup
      fee: '1000',
      gas_limit: '2000',
      storage_limit: '3000',
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.SMART_ROLLUP_ADD_MESSAGES,
      source: 'tz1...',
      message: ['0x54656e646572', '0x537461726b4e6574776f726b'],
      fee: 1000,
      gasLimit: 2000,
      storageLimit: 3000,
    });
  });

  it('should convert partial SMART_ROLLUP_ADD_MESSAGES operation', () => {
    const op: PartialTezosSmartRollupAddMessagesOperation = {
      kind: TezosOperationType.SMART_ROLLUP_ADD_MESSAGES,
      message: ['0x54656e646572', '0x537461726b4e6574776f726b'], // Array of messages to add to the rollup
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.SMART_ROLLUP_ADD_MESSAGES,
      source: undefined,
      message: ['0x54656e646572', '0x537461726b4e6574776f726b'],
      fee: undefined,
      gasLimit: undefined,
      storageLimit: undefined,
    });
  });

  it('should convert SMART_ROLLUP_ORIGINATE operation', () => {
    const op: PartialTezosSmartRollupOriginateOperation = {
      kind: TezosOperationType.SMART_ROLLUP_ORIGINATE,
      source: 'tz1...',
      pvm_kind: PvmKind.WASM2,
      kernel: 'your-kernel-code-here', // Kernel code for rollup
      parameters_ty: { prim: 'unit' },
      whitelist: ['tz1...1', 'tz1...2'], // Optional: whitelist of addresses. Will be ignored
      fee: '1000',
      gas_limit: '2000',
      storage_limit: '3000',
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.SMART_ROLLUP_ORIGINATE,
      source: 'tz1...',
      pvmKind: PvmKind.WASM2,
      kernel: 'your-kernel-code-here',
      parametersType: { prim: 'unit' },
      fee: 1000,
      gasLimit: 2000,
      storageLimit: 3000,
    });
  });

  it('should convert partial SMART_ROLLUP_ORIGINATE operation', () => {
    const op: PartialTezosSmartRollupOriginateOperation = {
      kind: TezosOperationType.SMART_ROLLUP_ORIGINATE,
      pvm_kind: PvmKind.WASM2,
      kernel: 'your-kernel-code-here', // Kernel code for rollup
      parameters_ty: { prim: 'unit' },
      whitelist: ['tz1...1', 'tz1...2'], // Optional: whitelist of addresses. Will be ignored
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.SMART_ROLLUP_ORIGINATE,
      source: undefined,
      pvmKind: PvmKind.WASM2,
      kernel: 'your-kernel-code-here',
      parametersType: { prim: 'unit' },
      fee: undefined,
      gasLimit: undefined,
      storageLimit: undefined,
    });
  });

  it('should throw an error for illegal pvm kind on SMART_ROLLUP_ORIGINATE operation', () => {
    const op: PartialTezosSmartRollupOriginateOperation = {
      kind: TezosOperationType.SMART_ROLLUP_ORIGINATE,
      source: 'tz1...',
      pvm_kind: "illegal-pvm-kind" as PvmKind, // Invalid PvmKind
      kernel: 'your-kernel-code-here', // Kernel code for rollup
      parameters_ty: { prim: 'unit' },
      whitelist: ['tz1...1', 'tz1...2'], // Optional: whitelist of addresses. Will be ignored
      fee: '1000',
      gas_limit: '2000',
      storage_limit: '3000',
    };

    expect(() => convertToPartialParamsWithKind(op)).toThrow(
      new Error("Invalid PvmKind: illegal-pvm-kind")
    );
  });

  it('should convert SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE operation', () => {
    const op: PartialTezosSmartRollupExecuteOutboxMessageOperation = {
      kind: TezosOperationType.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE,
      source: 'tz1...',
      rollup: 'rollup',
      cemented_commitment: 'commitment',
      output_proof: 'proof',
      fee: '1000',
      gas_limit: '2000',
      storage_limit: '3000',
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE,
      source: 'tz1...',
      rollup: 'rollup',
      cementedCommitment: 'commitment',
      outputProof: 'proof',
      fee: 1000,
      gasLimit: 2000,
      storageLimit: 3000,
    });
  });

  it('should convert partial SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE operation', () => {
    const op: PartialTezosSmartRollupExecuteOutboxMessageOperation = {
      kind: TezosOperationType.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE,
      rollup: 'rollup',
      cemented_commitment: 'commitment',
      output_proof: 'proof',
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE,
      source: undefined,
      rollup: 'rollup',
      cementedCommitment: 'commitment',
      outputProof: 'proof',
      fee: undefined,
      gasLimit: undefined,
      storageLimit: undefined,
    });
  });

  it('should convert TRANSACTION operation', () => {
    const op: PartialTezosTransactionOperation = {
      kind: TezosOperationType.TRANSACTION,
      destination: 'tz1...',
      amount: '1000',
      source: 'tz1...',
      fee: '1000',
      gas_limit: '2000',
      storage_limit: '3000',
      parameters: { entrypoint: "default", value: { int: "20" }},
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.TRANSACTION,
      to: 'tz1...',
      amount: 1000,
      mutez: true,
      source: 'tz1...',
      fee: 1000,
      gasLimit: 2000,
      storageLimit: 3000,
      parameter: { entrypoint: "default", value: { int: "20" }},
    });
  });

  it('should convert partial TRANSACTION operation', () => {
    const op: PartialTezosTransactionOperation = {
      kind: TezosOperationType.TRANSACTION,
      destination: 'tz1...',
      amount: '1000',
      parameters: { entrypoint: "default", value: { int: "20" }},
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.TRANSACTION,
      to: 'tz1...',
      amount: 1000,
      mutez: true,
      source: undefined,
      fee: undefined,
      gasLimit: undefined,
      storageLimit: undefined,
      parameter: { entrypoint: "default", value: { int: "20" }},
    });
  });

  it('should convert TRANSFER_TICKET operation', () => {
    const op: PartialTezosTransferTicketOperation = {
      kind: TezosOperationType.TRANSFER_TICKET,
      source: 'tz1...',
      fee: '1000', // fee in mutez
      counter: '123456',
      gas_limit: '2000',
      storage_limit: '3000',
      ticket_contents: { string: 'ticket-content-example' }, // Example content
      ticket_ty: { prim: 'string' }, // Type of the ticket, e.g., string, nat, etc.
      ticket_ticketer: 'KT1ExampleTicketerAddress', // Address of the smart contract that issued the ticket
      ticket_amount: '10', // Number of tickets to transfer
      destination: 'tz1ReceiverAddressHere', // Receiver address
      entrypoint: 'default', // Entrypoint to call on the destination contract
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.TRANSFER_TICKET,
      source: 'tz1...',
      ticketContents:  { string: 'ticket-content-example' },
      ticketTy: { prim: 'string' },
      ticketTicketer: 'KT1ExampleTicketerAddress',
      ticketAmount: 10,
      destination: 'tz1ReceiverAddressHere',
      entrypoint: 'default',
      fee: 1000,
      gasLimit: 2000,
      storageLimit: 3000,
    });
  });

  it('should convert partial TRANSFER_TICKET operation', () => {
    const op: PartialTezosTransferTicketOperation = {
      kind: TezosOperationType.TRANSFER_TICKET,
      ticket_contents: { string: 'ticket-content-example' }, // Example content
      ticket_ty: { prim: 'string' }, // Type of the ticket, e.g., string, nat, etc.
      ticket_ticketer: 'KT1ExampleTicketerAddress', // Address of the smart contract that issued the ticket
      ticket_amount: '10', // Number of tickets to transfer
      destination: 'tz1ReceiverAddressHere', // Receiver address
      entrypoint: 'default', // Entrypoint to call on the destination contract
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.TRANSFER_TICKET,
      source: undefined,
      ticketContents:  { string: 'ticket-content-example' },
      ticketTy: { prim: 'string' },
      ticketTicketer: 'KT1ExampleTicketerAddress',
      ticketAmount: 10,
      destination: 'tz1ReceiverAddressHere',
      entrypoint: 'default',
      fee: undefined,
      gasLimit: undefined,
      storageLimit: undefined,
    });
  });

  it('should convert UPDATE_CONSENSUS_KEY operation', () => {
    const op: PartialTezosUpdateConsensusKeyOperation = {
      kind: TezosOperationType.UPDATE_CONSENSUS_KEY,
      source: 'tz1...',
      pk: 'publicKey',
      fee: '1000',
      gas_limit: '2000',
      storage_limit: '3000',
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.UPDATE_CONSENSUS_KEY,
      source: 'tz1...',
      pk: 'publicKey',
      fee: 1000,
      gasLimit: 2000,
      storageLimit: 3000,
    });
  });

  it('should convert partial UPDATE_CONSENSUS_KEY operation', () => {
    const op: PartialTezosUpdateConsensusKeyOperation = {
      kind: TezosOperationType.UPDATE_CONSENSUS_KEY,
      pk: 'publicKey',
    };

    const result = convertToPartialParamsWithKind(op);
    expect(result).toEqual({
      kind: OpKind.UPDATE_CONSENSUS_KEY,
      source: undefined,
      pk: 'publicKey',
      fee: undefined,
      gasLimit: undefined,
      storageLimit: undefined,
    });
  });

  it('should throw an error for unsupported operation kind', () => {
    const op: PartialTezosRevealOperation = {
      kind: TezosOperationType.REVEAL,
      source: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
      fee: '1420',          // Fee in mutez
      counter: '3',         // Counter value, typically the number of operations from this source
      gas_limit: '10400',   // Gas limit in units
      storage_limit: '0',   // Storage limit in mutez (reveal operation typically does not require storage)
      public_key: 'edpkvD67yTLLAF8yXPB6rmHwvQr5Q3sVGJzqTLuSf4wozLqNvXieQz'  // Public key associated with the source
    };
  
    expect(() => convertToPartialParamsWithKind(op)).toThrow(
      new Error("Operation kind is not part of ParamsWithKind: reveal")
    );
  });
});
