export interface RollupRPCOptions {
  block: string;
}

// TODO CHANGE
export const rollupDefaultChain = 'something';
export const RollupDefaultRPCOptions: RollupRPCOptions = { block: 'head' };


export interface RollupRpcClientInterface {
  getTxAddressBalanceCommand(tz4Address: string): Promise<string>;
  transfer(quantity: number, ticketAddress: string, walletPkh: string, tz4Destination: string): Promise<string>;
  withdraw(amount: number, ticketAddress: string, tz4Address: string, destinationWallet: string): Promise<string>;
}

export enum RollupRPCMethodName {
  GET_TX_ADDRESS_BALANCE_COMMAND = 'getTxAddressBalanceCommand',
  TRANSFER = 'transfer',
  WITHDRAW = 'withdraw'
}
