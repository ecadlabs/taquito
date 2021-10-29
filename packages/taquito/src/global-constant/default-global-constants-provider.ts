import { MichelsonV1Expression } from "@taquito/rpc";

type GlobalConstant = string;

interface GlobalConstantHashAndValue {
    [globalConstantHash: string]: MichelsonV1Expression;
}

export class DefaultGlobalConstantsProvider {
    private _globalConstantsLibrary: GlobalConstantHashAndValue = {};

    loadGlobalConstant(globalConstant: GlobalConstantHashAndValue) {
        for (let hash in globalConstant) {
            Object.assign(this._globalConstantsLibrary, {
                [hash]: { ...globalConstant[hash] },
            });
        }
    }

    getGlobalConstantByHash(hash: GlobalConstant) {
        const value = this._globalConstantsLibrary[hash];
        if(!value) {
            throw new Error(`Please load the value associated with the constant ${hash} using the loadGlobalConstant method.`)
        }
        return value;
    }
}