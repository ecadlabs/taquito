import { opMapping as opMappingGeneral } from './../constants';

export const opMappingProto13: { [key: string]: string } = {
  ...opMappingGeneral,
  '84': 'sapling_transaction_deprecated',
  '94': 'tx_rollup_l2_address',
  '95': 'MIN_BLOCK_TIME',
  '96': 'sapling_transaction',
};

export const opMappingReverseProto13 = (() => {
  const result: { [key: string]: string } = {};
  Object.keys(opMappingProto13).forEach((key: string) => {
    result[opMappingProto13[key]] = key;
  });
  return result;
})();
