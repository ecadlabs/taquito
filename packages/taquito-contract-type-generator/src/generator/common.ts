
export class GenerateApiError implements Error {
    name = `GenerateApiError`;
    constructor(public message: string, readonly data: unknown) {
        console.error(`❌ GenerateApiError: ${message}`, data);
    }
}

export const assertExhaustive = (value: never, message: string): void => {
    console.error(message, { value });
};

export const reduceFlatMap = <T>(out: T[], x: T[]): T[] => {
    out.push(...x);
    return out;
}

// const reduceFlatMapTest = () => {
//     const items = [['a'], ['b']];
//     const itemsFlat = items.reduce(reduceFlatMap);
// };
