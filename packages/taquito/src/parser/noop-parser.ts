import { OriginateParams } from "../operations/types";
import { ParserProvider } from "./interface";

export class NoopParser implements ParserProvider {
    async prepareCodeOrigination(params: OriginateParams): Promise<OriginateParams> {
        return params;
    }
}