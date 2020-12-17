import { hex2buf } from "@taquito/utils";
import CryptoJS from "crypto-js";

export function char2Bytes(str: string) {
    return Buffer.from(str, 'utf8').toString('hex');
}

export function bytes2Char(hex: string): string {
    return Buffer.from(hex2buf(hex)).toString('utf8');
}

export function calculateSHA256Hash(preimage: string): string {
    return CryptoJS.SHA256(preimage).toString(CryptoJS.enc.Hex);
}