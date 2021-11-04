import { GlobalConstantHashAndValue } from "@taquito/michel-codec";

type GlobalConstant = string;

export class DefaultGlobalConstantsProvider {
    private _globalConstantsLibrary: GlobalConstantHashAndValue = {};

    loadGlobalConstant(globalConstant: GlobalConstantHashAndValue) {
        for (let hash in globalConstant) {
            Object.assign(this._globalConstantsLibrary, {
                [hash]: globalConstant[hash]
            });
        }
    }

    async getGlobalConstantByHash(hash: GlobalConstant) {
        const value = this._globalConstantsLibrary[hash];
        if(!value) {
            throw new Error(`Please load the value associated with the constant ${hash} using the loadGlobalConstant method.`)
        }
        return value;
    }
}