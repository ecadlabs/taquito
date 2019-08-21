import BigNumber from "bignumber.js";

export function tzFormatter(amount: string | BigNumber, format?: "tz" | "mtz") {
  if (new BigNumber(amount).toString() === "NaN") {
    return amount;
  }

  if (format === "tz") {
    return `${new BigNumber(amount).div(1000000).toString()} ꜩ`;
  } else if (format === "mtz") {
    return `${new BigNumber(amount).div(1000000000).toString()} mꜩ`;
  } else {
    return amount;
  }
}
