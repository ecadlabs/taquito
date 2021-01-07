import { IllegalInstructionInViewCode, NoParameterExpectedError } from '../../src/tzip16-errors';
import { MichelsonStorageView } from '../../src/viewKind/michelson-storage-view';

describe('MichelsonStorageView test', () => {
	let mockContractAbstraction: any = {};
	let mockRpcClient: any;

	beforeEach(() => {
		mockRpcClient = {
			getBlock: jest.fn(),
			getBalance: jest.fn(),
			getChainId: jest.fn(),
			runCode: jest.fn()
		};

		mockContractAbstraction.address = 'KT1test';

		mockRpcClient.getBlock.mockResolvedValue({ operations: [[{ hash: 'test' }], [], [], []], header: { timestamp: "2021-01-06T05:14:43Z" } });
		mockRpcClient.getBalance.mockResolvedValue("0");
		mockRpcClient.getChainId.mockResolvedValue("NetTest");
	});

	it('Should succesfully execute a view that get the balance of the contrat', async (done) => {
		mockContractAbstraction.script = { "code": [{ "prim": "parameter", "args": [{ "prim": "unit" }] }, { "prim": "storage", "args": [{ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "big_map", "args": [{ "prim": "string" }, { "prim": "bytes" }], "annots": ["%metadata"] }] }] }, { "prim": "code", "args": [[{ "prim": "PUSH", "args": [{ "prim": "nat" }, { "int": "42" }] }, { "prim": "FAILWITH" }]] }], "storage": { "prim": "Pair", "args": [{ "int": "7" }, { "int": "38671" }] } }

		mockRpcClient.runCode.mockResolvedValue({ "storage": { "prim": "Some", "args": [{ "int": "0" }] }, "operations": [] });

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] },
			[{ "prim": "DROP", "args": [], "annots": [] }, { "prim": "BALANCE", "args": [], "annots": [] }]
		);
		const result = await michelsonStorageView.executeView();

		expect(result.toString()).toEqual('0');
		done();
	});

	it('Should throw IllegalInstructionInViewCode when code of the view contains the instruction AMOUNT', async (done) => {
		mockContractAbstraction.script = { "code": [{ "prim": "parameter", "args": [{ "prim": "unit" }] }, { "prim": "storage", "args": [{ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "big_map", "args": [{ "prim": "string" }, { "prim": "bytes" }], "annots": ["%metadata"] }] }] }, { "prim": "code", "args": [[{ "prim": "PUSH", "args": [{ "prim": "nat" }, { "int": "42" }] }, { "prim": "FAILWITH" }]] }], "storage": { "prim": "Pair", "args": [{ "int": "7" }, { "int": "38671" }] } }

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			[{ "prim": "AMOUNT", "args": [], "annots": [] }] // code
		);

		expect(michelsonStorageView.isValidViewCodeInstructions()).toEqual(false);
		try {
			await michelsonStorageView.executeView();
		}
		catch (e) {
			expect(e).toBeInstanceOf(IllegalInstructionInViewCode);
			expect(e.message).toEqual('Failed to execute the view. The code of the view contains an illegal instruction: AMOUNT.')
		}
		done();
	});

	it('Should throw IllegalInstructionInViewCode when code of the view contains the instruction CREATE_CONTRACT', async (done) => {
		mockContractAbstraction.script = { "code": [{ "prim": "parameter", "args": [{ "prim": "unit" }] }, { "prim": "storage", "args": [{ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "big_map", "args": [{ "prim": "string" }, { "prim": "bytes" }], "annots": ["%metadata"] }] }] }, { "prim": "code", "args": [[{ "prim": "PUSH", "args": [{ "prim": "nat" }, { "int": "42" }] }, { "prim": "FAILWITH" }]] }], "storage": { "prim": "Pair", "args": [{ "int": "7" }, { "int": "38671" }] } }

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			[{ "prim": "CAR", "args": [], "annots": [] }, { "prim": "CREATE_CONTRACT", "args": [], "annots": [] }, { "prim": "DROP", "args": [], "annots": [] }] // code
		);

		expect(michelsonStorageView.isValidViewCodeInstructions()).toEqual(false);
		try {
			await michelsonStorageView.executeView();
		}
		catch (e) {
			expect(e).toBeInstanceOf(IllegalInstructionInViewCode);
			expect(e.message).toEqual('Failed to execute the view. The code of the view contains an illegal instruction: CREATE_CONTRACT.')
		}
		done();
	});

	it('Should throw IllegalInstructionInViewCode when code of the view contains the instruction SENDER', async (done) => {
		mockContractAbstraction.script = { "code": [{ "prim": "parameter", "args": [{ "prim": "unit" }] }, { "prim": "storage", "args": [{ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "big_map", "args": [{ "prim": "string" }, { "prim": "bytes" }], "annots": ["%metadata"] }] }] }, { "prim": "code", "args": [[{ "prim": "PUSH", "args": [{ "prim": "nat" }, { "int": "42" }] }, { "prim": "FAILWITH" }]] }], "storage": { "prim": "Pair", "args": [{ "int": "7" }, { "int": "38671" }] } }

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			[{ "prim": "CAR", "args": [], "annots": [] }, { "prim": "SENDER", "args": [], "annots": [] }] // code
		);

		expect(michelsonStorageView.isValidViewCodeInstructions()).toEqual(false);
		try {
			await michelsonStorageView.executeView();
		}
		catch (e) {
			expect(e).toBeInstanceOf(IllegalInstructionInViewCode);
			expect(e.message).toEqual('Failed to execute the view. The code of the view contains an illegal instruction: SENDER.')
		}
		done();
	});

	it('Should throw IllegalInstructionInViewCode when code of the view contains the instruction SET_DELEGATE', async (done) => {
		mockContractAbstraction.script = { "code": [{ "prim": "parameter", "args": [{ "prim": "unit" }] }, { "prim": "storage", "args": [{ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "big_map", "args": [{ "prim": "string" }, { "prim": "bytes" }], "annots": ["%metadata"] }] }] }, { "prim": "code", "args": [[{ "prim": "PUSH", "args": [{ "prim": "nat" }, { "int": "42" }] }, { "prim": "FAILWITH" }]] }], "storage": { "prim": "Pair", "args": [{ "int": "7" }, { "int": "38671" }] } }

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			[{ "prim": "SET_DELEGATE", "args": [], "annots": [] }] // code
		);

		expect(michelsonStorageView.isValidViewCodeInstructions()).toEqual(false);
		try {
			await michelsonStorageView.executeView();
		}
		catch (e) {
			expect(e).toBeInstanceOf(IllegalInstructionInViewCode);
			expect(e.message).toEqual('Failed to execute the view. The code of the view contains an illegal instruction: SET_DELEGATE.')
		}
		done();
	});

	it('Should throw IllegalInstructionInViewCode when code of the view contains the instruction SOURCE', async (done) => {
		mockContractAbstraction.script = { "code": [{ "prim": "parameter", "args": [{ "prim": "unit" }] }, { "prim": "storage", "args": [{ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "big_map", "args": [{ "prim": "string" }, { "prim": "bytes" }], "annots": ["%metadata"] }] }] }, { "prim": "code", "args": [[{ "prim": "PUSH", "args": [{ "prim": "nat" }, { "int": "42" }] }, { "prim": "FAILWITH" }]] }], "storage": { "prim": "Pair", "args": [{ "int": "7" }, { "int": "38671" }] } }

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			[{ "prim": "SOURCE", "args": [], "annots": [] }] // code
		);

		expect(michelsonStorageView.isValidViewCodeInstructions()).toEqual(false);
		try {
			await michelsonStorageView.executeView();
		}
		catch (e) {
			expect(e).toBeInstanceOf(IllegalInstructionInViewCode);
			expect(e.message).toEqual('Failed to execute the view. The code of the view contains an illegal instruction: SOURCE.')
		}
		done();
	});

	it('Should throw IllegalInstructionInViewCode when code of the view contains the instruction TRANSFER_TOKENS', async (done) => {
		mockContractAbstraction.script = { "code": [{ "prim": "parameter", "args": [{ "prim": "unit" }] }, { "prim": "storage", "args": [{ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "big_map", "args": [{ "prim": "string" }, { "prim": "bytes" }], "annots": ["%metadata"] }] }] }, { "prim": "code", "args": [[{ "prim": "PUSH", "args": [{ "prim": "nat" }, { "int": "42" }] }, { "prim": "FAILWITH" }]] }], "storage": { "prim": "Pair", "args": [{ "int": "7" }, { "int": "38671" }] } }

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			[{ "prim": "TRANSFER_TOKENS", "args": [], "annots": [] }] // code
		);

		expect(michelsonStorageView.isValidViewCodeInstructions()).toEqual(false);
		try {
			await michelsonStorageView.executeView();
		}
		catch (e) {
			expect(e).toBeInstanceOf(IllegalInstructionInViewCode);
			expect(e.message).toEqual('Failed to execute the view. The code of the view contains an illegal instruction: TRANSFER_TOKENS.')
		}
		done();
	});

	it('Should throw IllegalInstructionInViewCode when code of the view contains the instruction SELF which is not followed by an instruction ADDRESS', async (done) => {
		mockContractAbstraction.script = { "code": [{ "prim": "parameter", "args": [{ "prim": "unit" }] }, { "prim": "storage", "args": [{ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "big_map", "args": [{ "prim": "string" }, { "prim": "bytes" }], "annots": ["%metadata"] }] }] }, { "prim": "code", "args": [[{ "prim": "PUSH", "args": [{ "prim": "nat" }, { "int": "42" }] }, { "prim": "FAILWITH" }]] }], "storage": { "prim": "Pair", "args": [{ "int": "7" }, { "int": "38671" }] } }

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			[{ "prim": "SELF", "args": [], "annots": [] }, { "prim": "CONTRACT", "args": [], "annots": [] }] // code
		);

		expect(michelsonStorageView.isValidViewCodeInstructions()).toEqual(false);
		try {
			await michelsonStorageView.executeView();
		}
		catch (e) {
			expect(e).toBeInstanceOf(IllegalInstructionInViewCode);
			expect(e.message).toEqual('Failed to execute the view. The code of the view contains an illegal instruction: the instruction SELF should only be used before ADDRESS.')
		}
		done();
	});

	it('Should be valid when code of the view contains the instruction SELF followed by an instruction ADDRESS', async (done) => {
		mockContractAbstraction.script = { "code": [{ "prim": "parameter", "args": [{ "prim": "unit" }] }, { "prim": "storage", "args": [{ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "big_map", "args": [{ "prim": "string" }, { "prim": "bytes" }], "annots": ["%metadata"] }] }] }, { "prim": "code", "args": [[{ "prim": "PUSH", "args": [{ "prim": "nat" }, { "int": "42" }] }, { "prim": "FAILWITH" }]] }], "storage": { "prim": "Pair", "args": [{ "int": "7" }, { "int": "38671" }] } }

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			[{ "prim": "CAR", "args": [], "annots": [] }, { "prim": "SELF", "args": [], "annots": [] }, { "prim": "ADDRESS", "args": [], "annots": [] }, { "prim": "CAR", "args": [], "annots": [] }] // code
		);

		expect(michelsonStorageView.isValidViewCodeInstructions()).toEqual(true);
		done();
	});

	it('Should adapt view code to context', async (done) => {
		mockContractAbstraction.script = { "code": [{ "prim": "parameter", "args": [{ "prim": "unit" }] }, { "prim": "storage", "args": [{ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "big_map", "args": [{ "prim": "string" }, { "prim": "bytes" }], "annots": ["%metadata"] }] }] }, { "prim": "code", "args": [[{ "prim": "PUSH", "args": [{ "prim": "nat" }, { "int": "42" }] }, { "prim": "FAILWITH" }]] }], "storage": { "prim": "Pair", "args": [{ "int": "7" }, { "int": "38671" }] } }

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			[{ "prim": "CAR", "args": [], "annots": [] }, { "prim": "NOW", "args": [], "annots": [] }, { "prim": "SELF", "args": [], "annots": [] }, { "prim": "ADDRESS", "args": [], "annots": [] }, { "prim": "CAR", "args": [], "annots": [] }, { "prim": "BALANCE", "args": [], "annots": [] }, { "prim": "CAR", "args": [], "annots": [] }, { "prim": "CHAIN_ID", "args": [], "annots": [] }] // code
		);

		const code = michelsonStorageView['adaptViewCodeToContext']('1000', "2000-01-06T05:14:43Z", 'chainTest')
		expect(code).toEqual([{ "prim": "CAR", "args": [], "annots": [] }, [{ prim: 'PUSH', args: [{ prim: 'timestamp' }, { string: "2000-01-06T05:14:43Z" }] }], [{ prim: 'PUSH', args: [{ prim: 'address' }, { string: 'KT1test' }] }, { prim: 'CONTRACT', args: [{ prim: 'unit' }] }, { prim: 'IF_NONE', args: [[{ prim: 'UNIT' }, { prim: 'FAILWITH' }], []] }], { "prim": "ADDRESS", "args": [], "annots": [] }, { "prim": "CAR", "args": [], "annots": [] }, [{ prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '1000' }] }], { "prim": "CAR", "args": [], "annots": [] }, [{ prim: 'PUSH', args: [{ prim: 'string' }, { string: 'chainTest' }] }]]
		);
		done();
	});

	it('Should format Unit arguments and Unit view parameter properly, test 1', async (done) => {
		mockContractAbstraction.script = { "code": [{ "prim": "parameter", "args": [{ "prim": "unit" }] }, { "prim": "storage", "args": [{ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "big_map", "args": [{ "prim": "string" }, { "prim": "bytes" }], "annots": ["%metadata"] }] }] }, { "prim": "code", "args": [[{ "prim": "PUSH", "args": [{ "prim": "nat" }, { "int": "42" }] }, { "prim": "FAILWITH" }]] }], "storage": { "prim": "Pair", "args": [{ "int": "7" }, { "int": "38671" }] } }

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			[{ "prim": "CAR", "args": [], "annots": [] }] // code
		);

		const { arg, viewParameterType } = michelsonStorageView['formatArgsAndParameter']([]);
		expect(arg).toEqual({ prim: 'Unit' });
		expect(viewParameterType).toEqual({ args: [], prim: 'unit', annots: [] });
		done();
	});

	it('Should format Unit arguments and Unit view parameter properly, test 2', async (done) => {
		mockContractAbstraction.script = { "code": [{ "prim": "parameter", "args": [{ "prim": "unit" }] }, { "prim": "storage", "args": [{ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "big_map", "args": [{ "prim": "string" }, { "prim": "bytes" }], "annots": ["%metadata"] }] }] }, { "prim": "code", "args": [[{ "prim": "PUSH", "args": [{ "prim": "nat" }, { "int": "42" }] }, { "prim": "FAILWITH" }]] }], "storage": { "prim": "Pair", "args": [{ "int": "7" }, { "int": "38671" }] } }

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			[{ "prim": "CAR", "args": [], "annots": [] }] // code
		);

		const { arg, viewParameterType } = michelsonStorageView['formatArgsAndParameter'](['Unit']);
		expect(arg).toEqual({ prim: 'Unit' });
		expect(viewParameterType).toEqual({ args: [], prim: 'unit', annots: [] });
		done();
	});

	it('Should format Unit arguments and Unit view parameter properly, test 2', async (done) => {
		mockContractAbstraction.script = { "code": [{ "prim": "parameter", "args": [{ "prim": "unit" }] }, { "prim": "storage", "args": [{ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "big_map", "args": [{ "prim": "string" }, { "prim": "bytes" }], "annots": ["%metadata"] }] }] }, { "prim": "code", "args": [[{ "prim": "PUSH", "args": [{ "prim": "nat" }, { "int": "42" }] }, { "prim": "FAILWITH" }]] }], "storage": { "prim": "Pair", "args": [{ "int": "7" }, { "int": "38671" }] } }

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			[{ "prim": "CAR", "args": [], "annots": [] }], // code
			{ args: [], prim: 'unit', annots: [] }
		);

		const { arg, viewParameterType } = michelsonStorageView['formatArgsAndParameter'](['Unit']);
		expect(arg).toEqual({ prim: 'Unit' });
		expect(viewParameterType).toEqual({ args: [], prim: 'unit', annots: [] });
		done();
	});

	it('Should format Unit arguments and Unit view parameter properly, test 2', async (done) => {
		mockContractAbstraction.script = { "code": [{ "prim": "parameter", "args": [{ "prim": "unit" }] }, { "prim": "storage", "args": [{ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "big_map", "args": [{ "prim": "string" }, { "prim": "bytes" }], "annots": ["%metadata"] }] }] }, { "prim": "code", "args": [[{ "prim": "PUSH", "args": [{ "prim": "nat" }, { "int": "42" }] }, { "prim": "FAILWITH" }]] }], "storage": { "prim": "Pair", "args": [{ "int": "7" }, { "int": "38671" }] } }

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			[{ "prim": "CAR", "args": [], "annots": [] }], // code
			{ args: [], prim: 'unit', annots: [] }
		);

		const { arg, viewParameterType } = michelsonStorageView['formatArgsAndParameter']([]);
		expect(arg).toEqual({ prim: 'Unit' });
		expect(viewParameterType).toEqual({ args: [], prim: 'unit', annots: [] });
		done();
	});

	it('Should throw NoParameterExpectedError, test 1', async (done) => {
		mockContractAbstraction.script = { "code": [{ "prim": "parameter", "args": [{ "prim": "unit" }] }, { "prim": "storage", "args": [{ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "big_map", "args": [{ "prim": "string" }, { "prim": "bytes" }], "annots": ["%metadata"] }] }] }, { "prim": "code", "args": [[{ "prim": "PUSH", "args": [{ "prim": "nat" }, { "int": "42" }] }, { "prim": "FAILWITH" }]] }], "storage": { "prim": "Pair", "args": [{ "int": "7" }, { "int": "38671" }] } }

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			[{ "prim": "CAR", "args": [], "annots": [] }], // code
			{ args: [], prim: 'unit', annots: [] }
		);

		try {
			michelsonStorageView['formatArgsAndParameter'](['test']);
		} catch (e) {
			expect(e).toBeInstanceOf(NoParameterExpectedError)
		}
		done();
	});

	it('Should throw NoParameterExpectedError, test2', async (done) => {
		mockContractAbstraction.script = { "code": [{ "prim": "parameter", "args": [{ "prim": "unit" }] }, { "prim": "storage", "args": [{ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "big_map", "args": [{ "prim": "string" }, { "prim": "bytes" }], "annots": ["%metadata"] }] }] }, { "prim": "code", "args": [[{ "prim": "PUSH", "args": [{ "prim": "nat" }, { "int": "42" }] }, { "prim": "FAILWITH" }]] }], "storage": { "prim": "Pair", "args": [{ "int": "7" }, { "int": "38671" }] } }

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			[{ "prim": "CAR", "args": [], "annots": [] }], // code
		);

		try {
			michelsonStorageView['formatArgsAndParameter'](['test']);
		} catch (e) {
			expect(e).toBeInstanceOf(NoParameterExpectedError)
		}
		done();
	});
});
