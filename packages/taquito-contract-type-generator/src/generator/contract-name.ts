export const normalizeContractName = (text: string) => text
    .replace(/[^A-Za-z0-9]/g, '_')
    .split("_")
    .filter(x => x)
    .map(x => x[0].toUpperCase() + x.substring(1))
    .join('');
