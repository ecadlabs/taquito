import { Packer } from './interface';
import { Context } from '../context';
import { packDataBytes, MichelsonData, MichelsonType } from '@taquito/michel-codec'
import { PackDataResponse, PackDataParams } from '@taquito/rpc';

export class MichelCodecPacker implements Packer {
  constructor(private context: Context) {}

  async packData(data: PackDataParams): Promise<PackDataResponse> {
    const { bytes } = packDataBytes(data.data as MichelsonData, data.type as MichelsonType);
    return { packed: bytes }
  }
}
