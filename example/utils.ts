export function string2Bin(str: string) {
    var result: number[] = [];
    for (var i = 0; i < str.length; i++) {
        result.push(str.charCodeAt(i));
    }
    return result;
}

export function bin2String(array: number[]) {
    return String.fromCharCode.apply(String, array);
}

// Convert a hex string to a byte array
export function hexToBytes(hex: string) {
    for (var bytes: number[] = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

// Convert a byte array to a hex string
export function bytesToHex(bytes: number[]) {
    for (var hex: string[] = [], i = 0; i < bytes.length; i++) {
        var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xF).toString(16));
    }
    return hex.join("");
}

export const toJSON = (x: any) => JSON.parse(JSON.stringify(x));