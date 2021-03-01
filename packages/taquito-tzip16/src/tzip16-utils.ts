import CryptoJS from "crypto-js";

export function calculateSHA256Hash(preimage: string): string {
    return CryptoJS.SHA256(preimage).toString(CryptoJS.enc.Hex);
}