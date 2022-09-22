export const shortenHash = (hash: string): string =>
  hash ? hash.slice(0, 5) + "..." + hash.slice(-5) : "";

export const formatTokenAmount = (
  amount: number,
  decimals?: number
): number => {
  if (decimals) {
    return amount ? +amount.toFixed(decimals) / 1 : 0;
  } else {
    return amount ? +amount.toFixed(5) / 1 : 0;
  }
};
