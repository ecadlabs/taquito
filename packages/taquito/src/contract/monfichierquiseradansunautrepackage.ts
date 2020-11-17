import { TezosToolkit } from "@taquito/taquito";
import { ContractAbstraction } from ".";
import { Constructor } from "./interface";

function Tzip16ContractAbstraction<TBase extends Constructor>(Base: TBase) {
    return class Tzip16ContractAbstraction extends Base {
  
        // User can be interested to know where metadata are located
        // Need to fetch storage, extract value of the empty key in the big map and decode it
      async getUri() {
        return "test";
      }

      // fetch and return metadata JSON 
      async getMetadata() {
          return null;
      }
    };
  }

  async() => {
    const test = await new TezosToolkit("").contract.at("", () => Tzip16ContractAbstraction(ContractAbstraction));
    test.storage()["metadata"]
}  

 function FA12<TBase extends Constructor>(Base: TBase) {
    return class Tzip16Abstraction extends Base {
  
      async getTotalSupply() {
        return this.storage();
      }

    };
  }

async() => {
    const test = await new TezosToolkit("").contract.at("", () => FA12(Tzip16ContractAbstraction(ContractAbstraction)));
    test.
} 
