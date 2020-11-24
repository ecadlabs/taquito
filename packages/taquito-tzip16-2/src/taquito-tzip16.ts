import { ConstructorWallet, ConstructorContractProvider, ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";
import { FetcherProvider } from "./fetcherProvider";

export class MetadataView {
  constructor(
  ) { }

  async execute() {
  }
}

export default function <TBase extends ConstructorContractProvider | ConstructorWallet>(Base: TBase, fetcher: FetcherProvider = new FetcherProvider()) {
  return class Tzip16ContractAbstraction extends Base {

    // fetcher :
    // User can use a custom fetcher instead of the default one
    // This covers a use case where the user needs to use authentication or custom headers as part of their individual workflow.
    public fetcher = fetcher;


    // public metadataViews: { [key: string]: (...args: any[]) => MetadataView } = {};


    // User can be interested to know where metadata are located
    // Need to fetch storage, extract value of the empty key in the big map and decode it
    async getUri() {
      return "test";
    }

    // fetch and return metadata JSON 
    async getMetadata() {
      return "test";
    }
  };
}

export class Tzip16ContractAbstraction2 {

  // fetcher :
  // User can use a custom fetcher instead of the default one
  // This covers a use case where the user needs to use authentication or custom headers as part of their individual workflow.
constructor(private abs: ContractAbstraction<ContractProvider | Wallet>, fetcher: FetcherProvider) {

}

  // public metadataViews: { [key: string]: (...args: any[]) => MetadataView } = {};


  // User can be interested to know where metadata are located
  // Need to fetch storage, extract value of the empty key in the big map and decode it
  async getUri() {
    return "test";
  }

  // fetch and return metadata JSON 
  async getMetadata() {
    return "test";
  }
}

export class Tzip16ContractAbstraction3 {

  // fetcher :
  // User can use a custom fetcher instead of the default one
  // This covers a use case where the user needs to use authentication or custom headers as part of their individual workflow.
constructor(private abs: ContractAbstraction<ContractProvider | Wallet>) {

}

  // public metadataViews: { [key: string]: (...args: any[]) => MetadataView } = {};


  // User can be interested to know where metadata are located
  // Need to fetch storage, extract value of the empty key in the big map and decode it
  async getUri2() {
    return "test";
  }

  // fetch and return metadata JSON 
  async getMetadata2() {
    return "test";
  }
}


