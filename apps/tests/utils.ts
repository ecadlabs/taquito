/* eslint-disable no-prototype-builtins */

type HasHash = { opHash: string } | { hash: string };

export const isWalletOperation = (op: HasHash): op is { opHash: string } => {
    return op.hasOwnProperty("opHash");
}

export const getHash = (op: HasHash) => {
    return isWalletOperation(op) ? op.opHash : op.hash;
}

export const matches = (obj: unknown, pattern: unknown) => {
    if (typeof pattern === 'string' && pattern === '_') {
        return true;
    }
    if (typeof pattern === 'string' || typeof pattern === 'number') {
        return obj === pattern;
    }
    if (typeof pattern === 'object' && pattern !== null) {
        if (Array.isArray(pattern)) {
            return arrayMatches(obj, pattern);
        }
        return objectMatches(obj, pattern);
    }
    throw new Error(`Unsupported pattern: ${pattern}`);
}

function arrayMatches(obj: unknown, pattern: unknown[]) {
    if (!Array.isArray(obj)) {
        return false;
    }
    if (obj.length !== pattern.length) {
        return false;
    }
    for (let i = 0; i < pattern.length; i++) {
        if (!matches(obj[i], pattern[i])) {
            return false;
        }
    }
    return true;
}

function objectMatches(obj: unknown, pattern: object) {
    if (typeof obj !== 'object' || !obj) {
        return false;
    }
    const pattern2 = pattern as Record<string, unknown>;
    const obj2 = obj as Record<string, unknown>;
    for (const key in pattern) {
        if (!pattern.hasOwnProperty(key)) {
            continue;
        }
        if (!matches(obj2[key], pattern2[key])) {
            return false;
        }
    }
    return true;
}
