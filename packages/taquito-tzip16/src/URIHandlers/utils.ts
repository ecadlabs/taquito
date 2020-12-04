
import CryptoJS from "crypto-js";

export class Crypto {
    sha256(_preimage:string){
        return CryptoJS.SHA256(_preimage).toString();
    }
}