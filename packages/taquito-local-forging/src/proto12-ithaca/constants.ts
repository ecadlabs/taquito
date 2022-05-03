import { kindMapping } from '../constants';
import { pad } from '../utils';

const { [0x00]: _ommited, ...kindMappingNoEndorsement } = kindMapping;

export const kindMappingProto12: { [key: number]: string } = {
  ...kindMappingNoEndorsement,
  0x15: 'endorsement',
};

export const kindMappingReverseProto12 = (() => {
  const result: { [key: string]: string } = {};
  Object.keys(kindMappingProto12).forEach((key: number | string) => {
    const keyNum = typeof key === 'string' ? parseInt(key, 10) : key;
    result[kindMappingProto12[keyNum]] = pad(keyNum, 2);
  });
  return result;
})();
