import { ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";
import { hex2buf } from "@taquito/utils";
import CryptoJS from "crypto-js";

export function char2Bytes(str: string) {
    return Buffer.from(str, 'utf8').toString('hex');
}

export function bytes2Char(hex: string): string {
    return Buffer.from(hex2buf(hex)).toString('utf8');
}

export function sha256(preimage: string): string {
    return CryptoJS.SHA256(preimage).toString(CryptoJS.enc.Hex);
}

/**
 * Gets storage of a contract
 * @param contract A tezos contract abstraction containing storage that will be returned
 */
export async function getStorage(contract: ContractAbstraction<ContractProvider | Wallet>): Promise<Storage> {
    return await contract.storage();
}