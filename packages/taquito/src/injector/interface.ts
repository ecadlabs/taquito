export type InjectorParams = string; // Signed operation bytes

export type TxHash = string;

export interface Injector {
  inject(signedOperationBytes: InjectorParams): Promise<TxHash>;
}
