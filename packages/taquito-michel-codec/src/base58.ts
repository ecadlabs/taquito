const H = [
    0x6a09e667 | 0,
    0xbb67ae85 | 0,
    0x3c6ef372 | 0,
    0xa54ff53a | 0,
    0x510e527f | 0,
    0x9b05688c | 0,
    0x1f83d9ab | 0,
    0x5be0cd19 | 0
];

const K = [
    0x428a2f98 | 0, 0x71374491 | 0, 0xb5c0fbcf | 0, 0xe9b5dba5 | 0, 0x3956c25b | 0, 0x59f111f1 | 0, 0x923f82a4 | 0, 0xab1c5ed5 | 0,
    0xd807aa98 | 0, 0x12835b01 | 0, 0x243185be | 0, 0x550c7dc3 | 0, 0x72be5d74 | 0, 0x80deb1fe | 0, 0x9bdc06a7 | 0, 0xc19bf174 | 0,
    0xe49b69c1 | 0, 0xefbe4786 | 0, 0x0fc19dc6 | 0, 0x240ca1cc | 0, 0x2de92c6f | 0, 0x4a7484aa | 0, 0x5cb0a9dc | 0, 0x76f988da | 0,
    0x983e5152 | 0, 0xa831c66d | 0, 0xb00327c8 | 0, 0xbf597fc7 | 0, 0xc6e00bf3 | 0, 0xd5a79147 | 0, 0x06ca6351 | 0, 0x14292967 | 0,
    0x27b70a85 | 0, 0x2e1b2138 | 0, 0x4d2c6dfc | 0, 0x53380d13 | 0, 0x650a7354 | 0, 0x766a0abb | 0, 0x81c2c92e | 0, 0x92722c85 | 0,
    0xa2bfe8a1 | 0, 0xa81a664b | 0, 0xc24b8b70 | 0, 0xc76c51a3 | 0, 0xd192e819 | 0, 0xd6990624 | 0, 0xf40e3585 | 0, 0x106aa070 | 0,
    0x19a4c116 | 0, 0x1e376c08 | 0, 0x2748774c | 0, 0x34b0bcb5 | 0, 0x391c0cb3 | 0, 0x4ed8aa4a | 0, 0x5b9cca4f | 0, 0x682e6ff3 | 0,
    0x748f82ee | 0, 0x78a5636f | 0, 0x84c87814 | 0, 0x8cc70208 | 0, 0x90befffa | 0, 0xa4506ceb | 0, 0xbef9a3f7 | 0, 0xc67178f2 | 0
];

// https://tools.ietf.org/html/rfc6234
function sha256(msg: number[] | Uint8Array): number[] {
    // pad the message
    const r = (msg.length + 9) % 64;
    const pad = r === 0 ? 0 : 64 - r;

    if (msg.length > 268435455) {
        throw new Error(`sha256: message length is too big: ${msg.length}`);
    }

    const l = msg.length << 3;
    const buffer = [
        ...msg,
        0x80,
        ...(new Array<number>(pad).fill(0)),
        0, 0, 0, 0, (l >> 24) & 0xff, (l >> 16) & 0xff, (l >> 8) & 0xff, l & 0xff,
    ];

    function ror(x: number, n: number): number {
        return (x >>> n) | (x << (32 - n));
    }

    const h = [...H];
    const w = new Array<number>(64);
    const v = new Array<number>(8);

    for (let offset = 0; offset < buffer.length; offset += 64) {
        let q = offset;
        let i = 0;
        while (i < 16) {
            w[i] = (buffer[q] << 24) | (buffer[q + 1] << 16) | (buffer[q + 2] << 8) | buffer[q + 3];
            q += 4;
            i++;
        }
        while (i < 64) {
            const s0 = ror(w[i - 15], 7) ^ ror(w[i - 15], 18) ^ (w[i - 15] >>> 3);
            const s1 = ror(w[i - 2], 17) ^ ror(w[i - 2], 19) ^ (w[i - 2] >>> 10);
            w[i] = ((s1 | 0) + w[i - 7] + s0 + w[i - 16]) | 0;
            i++;
        }

        for (let i = 0; i < 8; i++) {
            v[i] = h[i];
        }

        for (let i = 0; i < 64; i++) {
            const b0 = ror(v[0], 2) ^ ror(v[0], 13) ^ ror(v[0], 22);
            const b1 = ror(v[4], 6) ^ ror(v[4], 11) ^ ror(v[4], 25);
            const t1 = (v[7] + b1 + ((v[4] & v[5]) ^ ((~v[4]) & v[6])) + K[i] + w[i]) | 0;
            const t2 = (b0 + (((v[0] & v[1]) ^ (v[0] & v[2]) ^ (v[1] & v[2])))) | 0;

            v[7] = v[6];
            v[6] = v[5];
            v[5] = v[4];
            v[4] = (v[3] + t1) | 0;
            v[3] = v[2];
            v[2] = v[1];
            v[1] = v[0];
            v[0] = (t1 + t2) | 0;
        }

        for (let i = 0; i < 8; i++) {
            h[i] = (h[i] + v[i]) | 0;
        }
    }

    const digest: number[] = [];
    for (const v of h) {
        digest.push((v >> 24) & 0xff);
        digest.push((v >> 16) & 0xff);
        digest.push((v >> 8) & 0xff);
        digest.push(v & 0xff);
    }

    return digest;
}

const base58alphabetFwd: number[] = [
    0, 1, 2, 3, 4, 5, 6,
    7, 8, -1, -1, -1, -1, -1, -1,
    -1, 9, 10, 11, 12, 13, 14, 15,
    16, -1, 17, 18, 19, 20, 21, -1,
    22, 23, 24, 25, 26, 27, 28, 29,
    30, 31, 32, -1, -1, -1, -1, -1,
    -1, 33, 34, 35, 36, 37, 38, 39,
    40, 41, 42, 43, -1, 44, 45, 46,
    47, 48, 49, 50, 51, 52, 53, 54,
    55, 56, 57
];

const base58alphabetBwd: number[] = [
    0, 1, 2, 3, 4, 5, 6, 7,
    8, 16, 17, 18, 19, 20, 21, 22,
    23, 25, 26, 27, 28, 29, 31, 32,
    33, 34, 35, 36, 37, 38, 39, 40,
    41, 48, 49, 50, 51, 52, 53, 54,
    55, 56, 57, 58, 60, 61, 62, 63,
    64, 65, 66, 67, 68, 69, 70, 71,
    72, 73
];

function byteAt(src: string, i: number): number {
    const c = src.charCodeAt(i) - 49;
    if (c >= base58alphabetFwd.length || base58alphabetFwd[c] === -1) {
        throw new Error(`Base58 decoding error: unexpected character at position ${i}: ${src[i]}`);
    }
    return base58alphabetFwd[c];
}

export function decodeBase58(src: string): number[] {
    const acc: number[] = [];
    let i = 0;
    // count and skip leading zeros
    while (i < src.length && byteAt(src, i) === 0) { i++; }
    let zeros = i;
    while (i < src.length) {
        let carry = byteAt(src, i++);
        /*
        for every symbol x
        acc = acc * 58 + x
        where acc is a little endian arbitrary length integer
        */
        let ii = 0;
        while (carry !== 0 || ii < acc.length) {
            const m = (acc[ii] || 0) * 58 + carry;
            acc[ii++] = m % 256;
            carry = Math.floor(m / 256);
        }
    }
    while (zeros-- > 0) {
        acc.push(0);
    }
    return acc.reverse();
}

export function encodeBase58(src: number[] | Uint8Array): string {
    const acc: number[] = [];
    let i = 0;
    // count and skip leading zeros
    while (i < src.length && src[i] === 0) { i++; }
    let zeros = i;
    while (i < src.length) {
        let carry = src[i++];
        let ii = 0;
        while (carry !== 0 || ii < acc.length) {
            const m = (acc[ii] || 0) * 256 + carry;
            acc[ii++] = m % 58;
            carry = Math.floor(m / 58);
        }
    }
    while (zeros-- > 0) {
        acc.push(0);
    }
    acc.reverse();
    return String.fromCharCode(...acc.map(v => base58alphabetBwd[v] + 49));
}

export function decodeBase58Check(src: string): number[] {
    const buffer = decodeBase58(src);
    if (buffer.length < 4) {
        throw new Error(`Base58Check decoding error: data is too short ${buffer.length}`);
    }

    const data = buffer.slice(0, buffer.length - 4);
    const sum = buffer.slice(buffer.length - 4);
    const computed = sha256(sha256(data));
    if (sum[0] !== computed[0] ||
        sum[1] !== computed[1] ||
        sum[2] !== computed[2] ||
        sum[3] !== computed[3]) {
        throw new Error("Base58Check decoding error: invalid checksum");
    }

    return data;
}

export function encodeBase58Check(src: number[] | Uint8Array): string {
    const sum = sha256(sha256(src));
    return encodeBase58([...src, ...sum]);
}