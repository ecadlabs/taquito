import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import {
  OperationContents,
  OperationContentsTransaction,
  OpKind,
  RPCSimulateOperationParam,
  RpcClient,
  RpcClientCache,
} from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import { Context } from '../../src/context';
import { Protocols } from '../../src/constants';
import { ForgedBytes } from '../../src/operations/types';
import { PreparedOperation } from '../../src/prepare';
import { Provider } from '../../src/provider';

const source = 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx';
const destination = 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM';
const branch = 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX';
const signature =
  'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg';

// Exercise the shared provider used by estimation, without preparation's separate counter logic.
class SimulationProvider extends Provider {
  run(op: RPCSimulateOperationParam, prepared?: PreparedOperation) {
    return this.simulate(op, prepared);
  }

  send(op: ForgedBytes) {
    return this.signAndInject(op);
  }
}

function transaction(counter: string): OperationContentsTransaction {
  return {
    kind: OpKind.TRANSACTION,
    source,
    counter,
    fee: '1000',
    gas_limit: '3000',
    storage_limit: '0',
    amount: '1',
    destination,
  };
}

function request(contents: OperationContents[] = [transaction('157')]): RPCSimulateOperationParam {
  return {
    operation: { branch, contents, signature },
    chain_id: 'NetXY2oPPzkxUW1',
    latency: 3,
    blocks_before_activation: 2,
  };
}

function httpError(
  body = JSON.stringify([
    {
      kind: 'temporary',
      id: 'failure',
      msg: 'No value found at the entrypoint output path /base/__simulation/result',
    },
  ]),
  status = STATUS_CODE.INTERNAL_SERVER_ERROR
) {
  return new HttpResponseError(
    'Simulation failed',
    status,
    'RPC error',
    body,
    'http://unused.invalid/chains/main/blocks/head/helpers/scripts/simulate_operation'
  );
}

function counterError(expected: string, found: string, direction: 'past' | 'future' = 'past') {
  return httpError(
    JSON.stringify([
      {
        kind: direction === 'past' ? 'branch' : 'temporary',
        id: `proto.025-PsUshuai.contract.counter_in_the_${direction}`,
        contract: source,
        expected,
        found,
      },
    ])
  );
}

function counters(op: RPCSimulateOperationParam) {
  return op.operation.contents?.flatMap((content) =>
    'counter' in content ? [content.counter] : []
  );
}

function setup() {
  const rpc = new RpcClient('http://unused.invalid');
  const context = new Context(rpc);
  const provider = new SimulationProvider(context);
  const getCounter = vi.spyOn(context.readProvider, 'getCounter').mockResolvedValue('155');
  const response = { contents: [] };
  const simulate = vi.spyOn(rpc, 'simulateOperation').mockResolvedValue(response);
  return { rpc, context, provider, getCounter, simulate, response };
}

describe('simulation counter recovery', () => {
  it.each(['155', '154'])(
    'recovers from a node reporting its stored counter, submitted %s',
    async (submitted) => {
      const { provider, simulate, response, getCounter } = setup();
      // Previewnet reports expected=stored, including when found is older than stored.
      simulate.mockImplementation(async (op) => {
        const found = counters(op)?.[0];
        if (!found) throw new Error('Missing manager counter');
        if (found !== '156') throw counterError('155', found);
        return response;
      });

      const result = await provider.run(request([transaction(submitted)]));

      expect(counters(result.op)).toEqual(['156']);
      expect(result.opResponse).toBe(response);
      expect(getCounter).toHaveBeenCalledTimes(1);
      expect(simulate).toHaveBeenCalledTimes(submitted === '155' ? 2 : 3);
      if (submitted === '154') {
        expect(counters(simulate.mock.calls[1][0])).toEqual(['155']);
      }
    }
  );

  it.each([
    { name: 'generic failure', error: httpError() },
    {
      name: 'HTML gateway error',
      error: httpError('<html>Bad gateway</html>', STATUS_CODE.BAD_GATEWAY),
    },
    {
      name: 'non-array JSON',
      error: httpError('{"error":"unavailable"}', STATUS_CODE.SERVICE_UNAVAILABLE),
    },
  ])('refreshes counters after an unmatched 5xx: $name', async ({ error }) => {
    const { provider, simulate, getCounter, response } = setup();
    simulate.mockRejectedValueOnce(error);

    const result = await provider.run(request());

    expect(counters(result.op)).toEqual(['156']);
    expect(result.opResponse).toBe(response);
    expect(simulate).toHaveBeenCalledTimes(2);
    expect(simulate.mock.calls[1][0]).toEqual(result.op);
    expect(getCounter).toHaveBeenCalledTimes(1);
    expect(getCounter).toHaveBeenCalledWith(source, 'head');
  });

  it('shifts a reveal and its batch together without changing the input or other fields', async () => {
    const { provider, simulate } = setup();
    simulate.mockRejectedValueOnce(httpError());
    const contents: OperationContents[] = [
      {
        kind: OpKind.REVEAL,
        source,
        counter: '154',
        fee: '200',
        gas_limit: '1000',
        storage_limit: '0',
        public_key: 'edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn',
      },
      { ...transaction('155'), parameters: { entrypoint: 'default', value: { prim: 'Unit' } } },
      {
        kind: OpKind.DELEGATION,
        source,
        counter: '156',
        fee: '300',
        gas_limit: '2000',
        storage_limit: '0',
        delegate: source,
      },
    ];
    const input = request(contents);
    const original = structuredClone(input);

    const result = await provider.run(input);

    expect(input).toEqual(original);
    expect(simulate.mock.calls[0][0]).toEqual(original);
    expect(result.op).toEqual({
      ...original,
      operation: {
        ...original.operation,
        contents: contents.map((content, index) => ({ ...content, counter: String(156 + index) })),
      },
    });
  });

  it('preserves counter gaps instead of repairing an invalid batch', async () => {
    const { provider, simulate } = setup();
    simulate.mockRejectedValueOnce(httpError());

    const result = await provider.run(request([transaction('157'), transaction('159')]));

    expect(counters(result.op)).toEqual(['156', '158']);
  });

  it('keeps exact counters above Number.MAX_SAFE_INTEGER', async () => {
    const { provider, simulate, getCounter } = setup();
    getCounter.mockResolvedValue('9007199254740993');
    simulate.mockRejectedValueOnce(httpError());

    const result = await provider.run(
      request([transaction('9007199254740992'), transaction('9007199254740993')])
    );

    expect(counters(result.op)).toEqual(['9007199254740994', '9007199254740995']);
  });

  it('refreshes through a populated RpcClientCache instead of reusing the stale head counter', async () => {
    const rpc = new RpcClient('http://unused.invalid');
    const cache = new RpcClientCache(rpc);
    const context = new Context(cache);
    const provider = new SimulationProvider(context);
    const getContract = vi.spyOn(rpc, 'getContract').mockResolvedValue({
      balance: new BigNumber(1000000),
      counter: '154',
      script: { code: [], storage: { prim: 'Unit' } },
    });
    const simulate = vi
      .spyOn(rpc, 'simulateOperation')
      .mockRejectedValueOnce(counterError('155', '155'))
      .mockResolvedValue({ contents: [] });
    try {
      expect(await context.readProvider.getCounter(source, 'head')).toBe('154');
      getContract.mockResolvedValue({
        balance: new BigNumber(1000000),
        counter: '155',
        script: { code: [], storage: { prim: 'Unit' } },
      });

      const result = await provider.run(request([transaction('155')]));

      expect(counters(result.op)).toEqual(['156']);
      expect(getContract).toHaveBeenCalledTimes(2);
      expect(getContract.mock.calls[1]).toEqual([source, { block: 'head' }]);
      expect(simulate).toHaveBeenCalledTimes(2);
    } finally {
      cache.deleteAllCachedData();
    }
  });

  it.each([
    { direction: 'past', expected: '160' },
    { direction: 'future', expected: '150' },
  ] satisfies { direction: 'past' | 'future'; expected: string }[])(
    'retains the existing L1 $direction correction without refreshing head',
    async ({ direction, expected }) => {
      const { provider, simulate, getCounter } = setup();
      simulate.mockRejectedValueOnce(counterError(expected, '157', direction));

      const result = await provider.run(request([transaction('157'), transaction('158')]));

      expect(counters(result.op)).toEqual([expected, String(BigInt(expected) + BigInt(1))]);
      expect(simulate).toHaveBeenCalledTimes(2);
      expect(getCounter).not.toHaveBeenCalled();
    }
  );

  it('does not refresh head after a successful simulation', async () => {
    const { provider, simulate, getCounter, response } = setup();
    const input = request();

    const result = await provider.run(input);

    expect(result.op).toBe(input);
    expect(result.opResponse).toBe(response);
    expect(simulate).toHaveBeenCalledTimes(1);
    expect(getCounter).not.toHaveBeenCalled();
  });

  it.each([
    STATUS_CODE.BAD_REQUEST,
    STATUS_CODE.UNAUTHORIZED,
    STATUS_CODE.NOT_FOUND,
    STATUS_CODE.TOO_MANY_REQUESTS,
  ])('does not use the fallback for HTTP %s', async (status) => {
    const { provider, simulate, getCounter } = setup();
    const error = httpError('[]', status);
    simulate.mockRejectedValue(error);

    await expect(provider.run(request())).rejects.toBe(error);

    expect(simulate).toHaveBeenCalledTimes(1);
    expect(getCounter).not.toHaveBeenCalled();
  });

  it('does not treat a non-HTTP failure as a counter error', async () => {
    const { provider, simulate, getCounter } = setup();
    const error = new Error('Connection lost');
    simulate.mockRejectedValue(error);

    await expect(provider.run(request())).rejects.toBe(error);

    expect(simulate).toHaveBeenCalledTimes(1);
    expect(getCounter).not.toHaveBeenCalled();
  });

  it('preserves the simulation error when the fresh counter would not change the request', async () => {
    const { provider, simulate, getCounter } = setup();
    const error = httpError();
    simulate.mockRejectedValue(error);

    await expect(provider.run(request([transaction('156')]))).rejects.toBe(error);

    expect(getCounter).toHaveBeenCalledTimes(1);
    expect(simulate).toHaveBeenCalledTimes(1);
  });

  it('preserves the simulation error when the counter lookup fails', async () => {
    const { provider, simulate, getCounter } = setup();
    const error = httpError();
    simulate.mockRejectedValue(error);
    getCounter.mockRejectedValue(new Error('Counter endpoint unavailable'));

    await expect(provider.run(request())).rejects.toBe(error);

    expect(getCounter).toHaveBeenCalledTimes(1);
    expect(simulate).toHaveBeenCalledTimes(1);
  });

  it('preserves the latest simulation error when a failed correction needs no further counter change', async () => {
    const { provider, simulate, getCounter } = setup();
    const retryError = httpError('second simulation failed');
    simulate
      .mockRejectedValueOnce(counterError('156', '157', 'future'))
      .mockRejectedValue(retryError);

    await expect(provider.run(request())).rejects.toBe(retryError);

    expect(getCounter).toHaveBeenCalledTimes(1);
    expect(simulate).toHaveBeenCalledTimes(2);
    expect(counters(simulate.mock.calls[1][0])).toEqual(['156']);
  });

  it.each(['garbage', '-1', '1.5', ''])(
    'preserves the simulation error for invalid head counter %j',
    async (counter) => {
      const { provider, simulate, getCounter } = setup();
      const error = httpError();
      simulate.mockRejectedValue(error);
      getCounter.mockResolvedValue(counter);

      await expect(provider.run(request())).rejects.toBe(error);

      expect(getCounter).toHaveBeenCalledTimes(1);
      expect(simulate).toHaveBeenCalledTimes(1);
    }
  );

  it('does not mask a malformed counter error with a BigInt conversion error', async () => {
    const { provider, simulate } = setup();
    const error = counterError('not-a-counter', '156');
    simulate.mockRejectedValue(error);

    await expect(provider.run(request([transaction('156')]))).rejects.toBe(error);

    expect(simulate).toHaveBeenCalledTimes(1);
  });

  it.each([
    { name: 'empty operation', contents: [] },
    {
      name: 'activation',
      contents: [{ kind: OpKind.ACTIVATION, pkh: source, secret: '00'.repeat(20) }],
    },
  ] satisfies { name: string; contents: OperationContents[] }[])(
    'does not refresh operations without manager counters: $name',
    async ({ contents }) => {
      const { provider, simulate, getCounter } = setup();
      const error = httpError();
      simulate.mockRejectedValue(error);

      await expect(provider.run(request(contents))).rejects.toBe(error);

      expect(getCounter).not.toHaveBeenCalled();
      expect(simulate).toHaveBeenCalledTimes(1);
    }
  );

  it.each([
    { name: 'another generic failure', error: httpError('second failure') },
    { name: 'another counter race', error: counterError('200', '156') },
  ])('stops after one refresh and propagates $name', async ({ error }) => {
    const { provider, simulate, getCounter } = setup();
    simulate.mockRejectedValueOnce(httpError()).mockRejectedValue(error);

    await expect(provider.run(request())).rejects.toBe(error);

    expect(getCounter).toHaveBeenCalledTimes(1);
    expect(simulate).toHaveBeenCalledTimes(2);
  });

  it('bounds recovery when an L1-shaped correction also fails', async () => {
    const { provider, simulate, getCounter } = setup();
    const finalError = httpError('still failing');
    simulate
      .mockRejectedValueOnce(counterError('155', '154'))
      .mockRejectedValueOnce(counterError('155', '155'))
      .mockRejectedValue(finalError);

    await expect(provider.run(request([transaction('154')]))).rejects.toBe(finalError);

    expect(getCounter).toHaveBeenCalledTimes(1);
    expect(simulate).toHaveBeenCalledTimes(3);
  });

  it.each(['gas-first', 'counter-first'])(
    'retains gas-limit recovery alongside the fallback (%s)',
    async (order) => {
      const { provider, simulate, context, getCounter } = setup();
      vi.spyOn(context.readProvider, 'getProtocolConstants').mockResolvedValue({
        hard_gas_limit_per_operation: new BigNumber(1040000),
        hard_gas_limit_per_block: new BigNumber(1040000),
        hard_storage_limit_per_operation: new BigNumber(60000),
        cost_per_byte: new BigNumber(250),
        smart_rollup_origination_size: 6314,
      });
      const gasError = httpError(
        JSON.stringify([
          { id: 'proto.025-PsUshuai.gas_limit_too_high' },
          { id: 'proto.025-PsUshuai.gas_exhausted.block' },
        ])
      );
      simulate
        .mockRejectedValueOnce(order === 'gas-first' ? gasError : httpError())
        .mockRejectedValueOnce(order === 'gas-first' ? httpError() : gasError);
      const contents = [transaction('157'), { ...transaction('158'), gas_limit: '1040000' }];
      const op = request(contents);
      const prepared: PreparedOperation = {
        opOb: { branch, contents, protocol: Protocols.PsUshuai9 },
        counter: 156,
        simulation: { gasLimitPatchableIndexes: [1] },
      };

      const result = await provider.run(op, prepared);

      expect(result.op).toEqual({
        ...op,
        operation: {
          ...op.operation,
          contents: [transaction('156'), { ...transaction('157'), gas_limit: '1037000' }],
        },
      });
      expect(simulate).toHaveBeenCalledTimes(3);
      expect(getCounter).toHaveBeenCalledTimes(1);
    }
  );

  it.each([
    { name: 'unmatched 5xx', error: httpError() },
    { name: 'expected equals found', error: counterError('157', '157') },
  ])('does not extend simulation recovery to signing or injection: $name', async ({ error }) => {
    const { provider, context, rpc, getCounter, simulate } = setup();
    const sign = vi.spyOn(context.signer, 'sign').mockResolvedValue({
      bytes: '00',
      sbytes: '0000',
      sig: signature,
      prefixSig: signature,
    });
    const preapply = vi.spyOn(rpc, 'preapplyOperations').mockRejectedValue(error);
    const inject = vi.spyOn(context.injector, 'inject').mockResolvedValue('unused');

    await expect(
      provider.send({ opbytes: '00', opOb: request().operation, counter: 156 })
    ).rejects.toBe(error);

    expect(sign).toHaveBeenCalledTimes(1);
    expect(preapply).toHaveBeenCalledTimes(1);
    expect(inject).not.toHaveBeenCalled();
    expect(simulate).not.toHaveBeenCalled();
    expect(getCounter).not.toHaveBeenCalled();
  });
});
