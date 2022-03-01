import {
  LocalForger,
  Forger,
  ForgeParams,
  ForgeResponse,
  ProtocolsHash,
} from '@taquito/local-forging';
import { Protocols } from '../constants';
import { Context } from '../context';

export class TaquitoLocalForger implements Forger {
  constructor(private context: Context) {}

  private async getNextProto(): Promise<ProtocolsHash> {
    if (!this.context.proto) {
      const { next_protocol } = await this.context.rpc.getBlockMetadata();
      this.context.proto = next_protocol as Protocols;
    }
    return this.context.proto as unknown as ProtocolsHash;
  }

  async forge({ branch, contents }: ForgeParams): Promise<ForgeResponse> {
    const forger = new LocalForger(await this.getNextProto());
    return forger.forge({ branch, contents });
  }
}
