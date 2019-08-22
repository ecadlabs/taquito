import { PairToken } from './pair';

import { NatToken } from './comparable/nat';

import { StringToken } from './comparable/string';

import { BigMapToken } from './bigmap';

import { AddressToken } from './comparable/address';

import { MapToken } from './map';

import { BoolToken } from './comparable/bool';

import { OrToken } from './or';

import { ContractToken } from './contract';

import { ListToken } from './list';
import { MutezToken } from './comparable/mutez';
import { BytesToken } from './comparable/bytes';
import { OptionToken } from './option';
import { TimestampToken } from './comparable/timestamp';
import { IntToken } from './comparable/int';
import { UnitToken } from './unit';

export const tokens = [
  PairToken,
  NatToken,
  StringToken,
  BigMapToken,
  AddressToken,
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
];
