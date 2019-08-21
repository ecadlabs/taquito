import BigNumber from "bignumber.js";

const TZ_DECIMALS = 6;
const MTZ_DECIMALS = 9;

export function tzFormatter(amount: string | BigNumber, format?: "tz" | "mtz") {
  const bigNum = new BigNumber(amount);
  if (bigNum.isNaN()) {
    return amount;
  }

  if (format === "tz") {
    return `${new BigNumber(amount).div(Math.pow(10, TZ_DECIMALS)).toString()} ꜩ`;
  } else if (format === "mtz") {
    return `${new BigNumber(amount).div(Math.pow(10, MTZ_DECIMALS)).toString()} mꜩ`;
  } else {
    return bigNum.toString();
  }
}
