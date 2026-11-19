import vectors from './nac-vectors.json' with { type: 'json' };

export function exerciseTezosX(api) {
  const transfer = api.toTransferParams(
    api.buildMichelsonToEvmCall({ to: vectors.evm, value: 1000000000000000n })
  );
  const evm = api.buildEvmToMichelsonCall({
    kind: 'transfer',
    destination: vectors.account,
    amount: 1000,
  });
  const message = api.buildEvmToMichelsonCall({
    kind: 'call-michelson',
    destination: vectors.destination,
    entrypoint: 'message',
    parameter: { value: { bytes: '7461717569746f20f09f909920636166c3a9' } },
  });

  return {
    transferAmount: transfer.amount,
    gatewayParameter: transfer.parameter.value,
    evmData: evm.data,
    evmValue: evm.value,
    messageData: message.data,
  };
}

export const expectedTezosX = {
  transferAmount: 1000,
  gatewayParameter: vectors.nativeParameter,
  evmData: vectors.evmTransferData,
  evmValue: 1000000000000000n,
  messageData: vectors.utf8Bytes.calldata,
};

export default async function ({ assert, load }) {
  const api = await load('@taquito/tezosx');
  assert.deepEqual(exerciseTezosX(api), expectedTezosX);
  assert.match(api.VERSION.commitHash, /^[0-9a-f]{40}$/);
}
