import { Expr } from "@taquito/michel-codec";
import { UnconfiguredGlobalConstantsProviderError } from "./error";
import { GlobalConstantHash, GlobalConstantsProvider } from "./interface-global-constants-provider";

export class NoopGlobalConstantsProvider implements GlobalConstantsProvider {
    async getGlobalConstantByHash(_hash: GlobalConstantHash): Promise<Expr> {
        throw new UnconfiguredGlobalConstantsProviderError();
    }
}