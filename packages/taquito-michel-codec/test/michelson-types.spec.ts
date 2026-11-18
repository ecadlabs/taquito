import {
  assertMichelsonComparableType,
  assertMichelsonContract,
  assertMichelsonType,
  InstructionList,
  isMichelsonCode,
  isMichelsonType,
  List,
  MichelsonCode,
  MichelsonContract,
  MichelsonContractCode,
  MichelsonContractParameter,
  MichelsonContractSection,
  MichelsonContractSectionByID,
  MichelsonContractStorage,
  MichelsonContractView,
  MichelsonSectionID,
  MichelsonSimpleComparableTypeID,
  MichelsonType,
  MichelsonTypeAddress,
  MichelsonTypeBigMap,
  MichelsonTypeBLS12_381_FR,
  MichelsonTypeBLS12_381_G1,
  MichelsonTypeBLS12_381_G2,
  MichelsonTypeBool,
  MichelsonTypeByID,
  MichelsonTypeBytes,
  MichelsonTypeChainID,
  MichelsonTypeChest,
  MichelsonTypeChestKey,
  MichelsonTypeContract,
  MichelsonTypeID,
  MichelsonTypeInt,
  MichelsonTypeKey,
  MichelsonTypeKeyHash,
  MichelsonTypeLambda,
  MichelsonTypeList,
  MichelsonTypeMap,
  MichelsonTypeMutez,
  MichelsonTypeNat,
  MichelsonTypeNever,
  MichelsonTypeOperation,
  MichelsonTypeOption,
  MichelsonTypeOr,
  MichelsonTypePair,
  MichelsonTypeSaplingState,
  MichelsonTypeSaplingTransaction,
  MichelsonTypeSaplingTransactionDeprecated,
  MichelsonTypeSet,
  MichelsonTypeSignature,
  MichelsonTypeString,
  MichelsonTypeTicket,
  MichelsonTypeTimestamp,
  MichelsonTypeTxRollupL2Address,
  MichelsonTypeUnit,
} from '../src/taquito-michel-codec';
import { isPairType } from '../src/utils';

type IsExact<A, B> =
  (<G>() => G extends A ? 1 : 2) extends <G>() => G extends B ? 1 : 2 ? true : false;

function expectExactType<A, B>(..._args: IsExact<A, B> extends true ? [] : [never]): void {
  // compile-time exact type assertion
}

function widenMichelsonType<K extends MichelsonTypeID>(t: MichelsonType<K>): MichelsonType {
  return t;
}

function widenComparableType<K extends MichelsonSimpleComparableTypeID>(
  t: MichelsonType<K>
): MichelsonType<MichelsonSimpleComparableTypeID> {
  return t;
}

function widenContractSection<S extends MichelsonSectionID>(
  s: MichelsonContractSection<S>
): MichelsonContractSection {
  return s;
}

describe('MichelsonType<T> and MichelsonContractSection<T>', () => {
  const allTypesByID: { [K in MichelsonTypeID]: MichelsonType<K> } = {
    int: { prim: 'int' },
    nat: { prim: 'nat' },
    string: { prim: 'string' },
    bytes: { prim: 'bytes' },
    mutez: { prim: 'mutez' },
    bool: { prim: 'bool' },
    key_hash: { prim: 'key_hash' },
    timestamp: { prim: 'timestamp' },
    address: { prim: 'address' },
    key: { prim: 'key' },
    unit: { prim: 'unit' },
    signature: { prim: 'signature' },
    operation: { prim: 'operation' },
    chain_id: { prim: 'chain_id' },
    option: { prim: 'option', args: [{ prim: 'int' }] },
    list: { prim: 'list', args: [{ prim: 'string' }] },
    contract: { prim: 'contract', args: [{ prim: 'unit' }] },
    ticket: { prim: 'ticket', args: [{ prim: 'bytes' }] },
    pair: { prim: 'pair', args: [{ prim: 'int' }, { prim: 'nat' }] },
    or: { prim: 'or', args: [{ prim: 'int' }, { prim: 'string' }] },
    lambda: { prim: 'lambda', args: [{ prim: 'nat' }, { prim: 'int' }] },
    set: { prim: 'set', args: [{ prim: 'int' }] },
    map: { prim: 'map', args: [{ prim: 'string' }, { prim: 'nat' }] },
    big_map: { prim: 'big_map', args: [{ prim: 'address' }, { prim: 'mutez' }] },
    never: { prim: 'never' },
    bls12_381_g1: { prim: 'bls12_381_g1' },
    bls12_381_g2: { prim: 'bls12_381_g2' },
    bls12_381_fr: { prim: 'bls12_381_fr' },
    sapling_transaction: { prim: 'sapling_transaction', args: [{ int: '8' }] },
    sapling_transaction_deprecated: {
      prim: 'sapling_transaction_deprecated',
      args: [{ int: '8' }],
    },
    sapling_state: { prim: 'sapling_state', args: [{ int: '8' }] },
    tx_rollup_l2_address: { prim: 'tx_rollup_l2_address' },
    chest_key: { prim: 'chest_key' },
    chest: { prim: 'chest' },
  };

  it('maps every MichelsonTypeID variant to its exact MichelsonType<K> definition and validates it', () => {
    expectExactType<keyof MichelsonTypeByID, MichelsonTypeID>();
    expectExactType<MichelsonType, MichelsonTypeByID[MichelsonTypeID]>();
    expectExactType<MichelsonType<'int'>, MichelsonTypeInt>();
    expectExactType<MichelsonType<'nat'>, MichelsonTypeNat>();
    expectExactType<MichelsonType<'string'>, MichelsonTypeString>();
    expectExactType<MichelsonType<'bytes'>, MichelsonTypeBytes>();
    expectExactType<MichelsonType<'mutez'>, MichelsonTypeMutez>();
    expectExactType<MichelsonType<'bool'>, MichelsonTypeBool>();
    expectExactType<MichelsonType<'key_hash'>, MichelsonTypeKeyHash>();
    expectExactType<MichelsonType<'timestamp'>, MichelsonTypeTimestamp>();
    expectExactType<MichelsonType<'address'>, MichelsonTypeAddress>();
    expectExactType<MichelsonType<'key'>, MichelsonTypeKey>();
    expectExactType<MichelsonType<'unit'>, MichelsonTypeUnit>();
    expectExactType<MichelsonType<'signature'>, MichelsonTypeSignature>();
    expectExactType<MichelsonType<'operation'>, MichelsonTypeOperation>();
    expectExactType<MichelsonType<'chain_id'>, MichelsonTypeChainID>();
    expectExactType<MichelsonType<'option'>, MichelsonTypeOption<MichelsonType>>();
    expectExactType<MichelsonType<'list'>, MichelsonTypeList<MichelsonType>>();
    expectExactType<MichelsonType<'contract'>, MichelsonTypeContract<MichelsonType>>();
    expectExactType<MichelsonType<'ticket'>, MichelsonTypeTicket<MichelsonType>>();
    expectExactType<MichelsonType<'pair'>, MichelsonTypePair<MichelsonType[]>>();
    expectExactType<MichelsonType<'or'>, MichelsonTypeOr<[MichelsonType, MichelsonType]>>();
    expectExactType<MichelsonType<'lambda'>, MichelsonTypeLambda<MichelsonType, MichelsonType>>();
    expectExactType<MichelsonType<'set'>, MichelsonTypeSet<MichelsonType>>();
    expectExactType<MichelsonType<'map'>, MichelsonTypeMap<MichelsonType, MichelsonType>>();
    expectExactType<MichelsonType<'big_map'>, MichelsonTypeBigMap<MichelsonType, MichelsonType>>();
    expectExactType<MichelsonType<'never'>, MichelsonTypeNever>();
    expectExactType<MichelsonType<'bls12_381_g1'>, MichelsonTypeBLS12_381_G1>();
    expectExactType<MichelsonType<'bls12_381_g2'>, MichelsonTypeBLS12_381_G2>();
    expectExactType<MichelsonType<'bls12_381_fr'>, MichelsonTypeBLS12_381_FR>();
    expectExactType<MichelsonType<'sapling_transaction'>, MichelsonTypeSaplingTransaction>();
    expectExactType<
      MichelsonType<'sapling_transaction_deprecated'>,
      MichelsonTypeSaplingTransactionDeprecated
    >();
    expectExactType<MichelsonType<'sapling_state'>, MichelsonTypeSaplingState>();
    expectExactType<MichelsonType<'tx_rollup_l2_address'>, MichelsonTypeTxRollupL2Address>();
    expectExactType<MichelsonType<'chest_key'>, MichelsonTypeChestKey>();
    expectExactType<MichelsonType<'chest'>, MichelsonTypeChest>();

    for (const k of Object.keys(allTypesByID) as MichelsonTypeID[]) {
      const widened: MichelsonType = widenMichelsonType(allTypesByID[k]);
      expect(assertMichelsonType(widened)).toBe(true);
    }

    const sequencePair: MichelsonType<'pair'> = [{ prim: 'int' }, { prim: 'string' }];
    const widenedPair: MichelsonType = sequencePair;
    expect(isPairType(widenedPair)).toBe(true);
    expect(assertMichelsonType(widenedPair)).toBe(true);

    const comparableUnion = widenComparableType(allTypesByID.key_hash);
    expect(assertMichelsonComparableType(comparableUnion)).toBe(true);
  });

  it('validates nested recursive MichelsonType expressions and InstructionList', () => {
    const deepType: MichelsonTypeOption<
      MichelsonTypeList<
        MichelsonTypeOr<
          [
            MichelsonTypeMap<
              MichelsonType<'string'>,
              MichelsonTypeBigMap<MichelsonType<'int'>, MichelsonTypeTicket<MichelsonType<'bytes'>>>
            >,
            MichelsonTypeLambda<
              MichelsonTypeContract<MichelsonType<'unit'>>,
              MichelsonTypeSet<MichelsonTypePair<[MichelsonType<'bytes'>, MichelsonType<'bool'>]>>
            >,
          ]
        >
      >
    > = {
      prim: 'option',
      args: [
        {
          prim: 'list',
          args: [
            {
              prim: 'or',
              args: [
                {
                  prim: 'map',
                  args: [
                    { prim: 'string' },
                    {
                      prim: 'big_map',
                      args: [{ prim: 'int' }, { prim: 'ticket', args: [{ prim: 'bytes' }] }],
                    },
                  ],
                },
                {
                  prim: 'lambda',
                  args: [
                    { prim: 'contract', args: [{ prim: 'unit' }] },
                    {
                      prim: 'set',
                      args: [
                        {
                          prim: 'pair',
                          args: [{ prim: 'bytes' }, { prim: 'bool' }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const asUnion: MichelsonType = deepType;
    expect(isMichelsonType(asUnion)).toBe(true);

    const listOfMap: MichelsonType<'list'> = {
      prim: 'list',
      args: [{ prim: 'map', args: [{ prim: 'string' }, { prim: 'int' }] }],
    };
    const element = listOfMap.args[0];
    if (!Array.isArray(element) && element.prim === 'map') {
      const mapElem: MichelsonType<'map'> = element;
      expect(isMichelsonType(mapElem)).toBe(true);
    }

    const nestedInstructions: InstructionList = [
      { prim: 'CAR' },
      [{ prim: 'NIL', args: [{ prim: 'operation' }] }, { prim: 'PAIR' }],
    ];
    const asList: List<MichelsonCode> = nestedInstructions;
    const roundTrippedInstructions: InstructionList = asList;
    const asCode: MichelsonCode = roundTrippedInstructions;
    expect(isMichelsonCode(asCode)).toBe(true);
  });

  it('maps every MichelsonSectionID variant to its exact MichelsonContractSection<T> definition', () => {
    expectExactType<keyof MichelsonContractSectionByID, MichelsonSectionID>();
    expectExactType<MichelsonContractSection, MichelsonContractSectionByID[MichelsonSectionID]>();
    expectExactType<MichelsonContractSection<'parameter'>, MichelsonContractParameter>();
    expectExactType<MichelsonContractSection<'storage'>, MichelsonContractStorage>();
    expectExactType<MichelsonContractSection<'view'>, MichelsonContractView>();
    expectExactType<MichelsonContractSection<'code'>, MichelsonContractCode>();

    const sectionsByID: { [S in MichelsonSectionID]: MichelsonContractSection<S> } = {
      parameter: { prim: 'parameter', args: [{ prim: 'unit' }] },
      storage: { prim: 'storage', args: [{ prim: 'unit' }] },
      code: {
        prim: 'code',
        args: [[{ prim: 'CDR' }, { prim: 'NIL', args: [{ prim: 'operation' }] }, { prim: 'PAIR' }]],
      },
      view: {
        prim: 'view',
        args: [
          { string: 'get_unit' },
          { prim: 'unit' },
          { prim: 'unit' },
          [{ prim: 'DROP' }, { prim: 'UNIT' }],
        ],
      },
    };

    const contract: MichelsonContract = [
      widenContractSection(sectionsByID.parameter),
      widenContractSection(sectionsByID.storage),
      widenContractSection(sectionsByID.code),
      widenContractSection(sectionsByID.view),
    ];
    expect(assertMichelsonContract(contract)).toBe(true);
  });
});
