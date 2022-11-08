import { PairToken } from './pair';

import { NatToken } from './comparable/nat';

import { StringToken } from './comparable/string';

import { BigMapToken } from './bigmap';

import { AddressToken } from './comparable/address';

import { MapToken } from './map';

import { BoolToken } from './comparable/bool';

import { TxRollupL2AddressToken } from './comparable/tx_rollup_l2_address';

import { OrToken } from './or';

import { ContractToken } from './contract';

import { ListToken } from './list';
import { MutezToken } from './comparable/mutez';
import { BytesToken } from './comparable/bytes';
import { OptionToken } from './option';
import { TimestampToken } from './comparable/timestamp';
import { IntToken } from './comparable/int';
import { UnitToken } from './unit';
import { KeyToken } from './key';
import { KeyHashToken } from './comparable/key_hash';
import { SignatureToken } from './signature';
import { LambdaToken } from './lambda';
import { OperationToken } from './operation';
import { SetToken } from './set';
import { ChainIDToken } from './chain-id';
import { TicketToken } from './ticket';
import { TicketDeprecatedToken } from './ticket-deprecated';
import { NeverToken } from './never';
import { SaplingStateToken } from './sapling-state';
import { SaplingTransactionToken } from './sapling-transaction';
import { SaplingTransactionDeprecatedToken } from './sapling-transaction-deprecated';
import { Bls12381frToken } from './bls12-381-fr';
import { Bls12381g1Token } from './bls12-381-g1';
import { Bls12381g2Token } from './bls12-381-g2';
import { ChestToken } from './chest';
import { ChestKeyToken } from './chest-key';
import { GlobalConstantToken } from './constant';

export const tokens = [
  PairToken,
  NatToken,
  StringToken,
  BigMapToken,
  AddressToken,
  TxRollupL2AddressToken,
  MapToken,
  BoolToken,
  OrToken,
  ContractToken,
  ListToken,
  MutezToken,
  BytesToken,
  OptionToken,
  TimestampToken,
  IntToken,
  UnitToken,
  KeyToken,
  KeyHashToken,
  SignatureToken,
  LambdaToken,
  OperationToken,
  SetToken,
  ChainIDToken,
  TicketToken,
  TicketDeprecatedToken,
  NeverToken,
  SaplingStateToken,
  SaplingTransactionToken,
  SaplingTransactionDeprecatedToken,
  Bls12381frToken,
  Bls12381g1Token,
  Bls12381g2Token,
  ChestToken,
  ChestKeyToken,
  GlobalConstantToken,
];
