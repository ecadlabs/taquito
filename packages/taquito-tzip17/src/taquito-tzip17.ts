import { Context, ContractAbstraction, ContractMethod, ContractProvider, Wallet } from "@taquito/taquito";
import { buf2hex } from "@taquito/utils";
import { blake2b } from "blakejs";
import { MichelsonData, packDataBytes } from "@taquito/michel-codec";

const sigParamData = (chainId: string, contractAddress: string, counter: string, methodHash: string): MichelsonData => {
  return {
    prim: "Pair",
    args: [
      {
        prim: "Pair",
        args: [
          {
            string: chainId
          },
          {
            string: contractAddress
          }
        ]
      },
      {
        prim: "Pair",
        args: [
          {
            int: counter
          },
          {
            bytes: methodHash
          }
        ]
      }
    ]
  }
};

const sigParamType: any = {
  prim: "pair",
  args: [
    {
      prim: "pair",
      args: [
        {
          prim: "chain_id"
        },
        { prim: "address" }
      ]
    },
    {
      prim: "pair",
      args: [{ prim: "nat" }, { prim: "bytes" }]
    }
  ]
};

class ContractMethodTzip17<T extends ContractProvider | Wallet> {

  constructor(
    private context: Context,
    private contractAbs: ContractAbstraction<T>,
    private method: (...args: any[]) => ContractMethod<T>,
    private parameterType: object,
    private args: any[]
  ) { }
  async createPermit() {
    const methodHash = await this.prepareMethodHash();
    const packedData = await this.packData(methodHash);
    const signature = await this.context.signer.sign(packedData.bytes);
    const publicKey = await this.context.signer.publicKey();
    return { publicKey, signature: signature.sig, methodHash }

  }
  private createTransferParam() {
    return this.method(...this.args).toTransferParams().parameter?.value;
  }

  private async packTransfeerParam() {
    const rawPacked = await this.context.rpc.packData({
      data: this.createTransferParam()!,
      type: this.parameterType
    });
    return rawPacked.packed;
  }

  private async prepareMethodHash() {
    const packedParam = await this.packTransfeerParam();
    return buf2hex(Buffer.from(blake2b(packedParam)));
  }

  private async packData(methodHash: string) {
    const chainId = await this.context.rpc.getChainId();
    const contractStorage: any = await this.contractAbs.storage();
    const counter = contractStorage.counter;
    return packDataBytes(sigParamData(chainId, this.contractAbs.address, counter, methodHash), sigParamType);
  }
}

export class Tzip17ContractAbstraction {
  methods: { [key: string]: (...args: any[]) => ContractMethodTzip17<ContractProvider | Wallet> } = {};
  constructor(
    private contractAbstraction: ContractAbstraction<ContractProvider | Wallet>,
    private context: Context
  ) {
    for (let method in this.contractAbstraction.methods) {
      const methodFx = (...args: any[]) => {
        return new ContractMethodTzip17<ContractProvider | Wallet>(
          context,
          this.contractAbstraction,
          this.contractAbstraction.methods[method],
          this.contractAbstraction.entrypoints.entrypoints[method],
          args
        )
      }
      this.methods[method] = methodFx
    }
  }
}
