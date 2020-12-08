
import SHA256 from "crypto-js/sha256";

export class Crypto {
    sha256(_preimage:string){
        return SHA256(_preimage).toString();
    }
}