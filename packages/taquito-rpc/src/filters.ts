import { InternalOperationResult } from "./types";

export const eventFilter = (result: InternalOperationResult, address?: string, tag?: string) => {
    if (result.kind === 'event') {
        let match = true;
        if (address) {
            match &&= result.source === address;
        }
        if (tag) {
            match &&= result.tag === tag;
        }
        return match;
    }
    return false;
};
