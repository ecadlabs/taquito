import { RequestSignPayloadInput, SigningType } from "@airgap/beacon-sdk";
import { char2Bytes } from "@taquito/utils";

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

export const preparePayloadToSign = (
  input: string,
  userAddress: string
): {
  payload: RequestSignPayloadInput;
  formattedInput: string;
} => {
  const formattedInput = `Tezos Signed Message: taquito-test-dapp.netlify.app/ ${new Date().toISOString()} ${input}`;
  const bytes = char2Bytes(formattedInput);
  const bytesLength = (bytes.length / 2).toString(16);
  const addPadding = `00000000${bytesLength}`;
  const paddedBytesLength = addPadding.slice(addPadding.length - 8);
  const payloadBytes = '05' + '01' + paddedBytesLength + bytes;
  const payload: RequestSignPayloadInput = {
    signingType: SigningType.MICHELINE,
    payload: payloadBytes,
    sourceAddress: userAddress
  };
  return {
    payload,
    formattedInput
  };
};
