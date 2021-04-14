import { PackDataParams, PackDataResponse } from '@taquito/rpc';

export interface Packer {
    packData(data: PackDataParams): Promise<PackDataResponse>
}