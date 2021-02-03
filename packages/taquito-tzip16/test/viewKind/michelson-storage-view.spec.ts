import { ForbiddenInstructionInViewCode, NoParameterExpectedError } from '../../src/tzip16-errors';
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
		mockContractAbstraction.script = { "code": [{ "prim": "parameter", "args": [{ "prim": "unit" }] }, { "prim": "storage", "args": [{ "prim": "pair", "args": [{ "prim": "nat" }, { "prim": "big_map", "args": [{ "prim": "string" }, { "prim": "bytes" }], "annots": ["%metadata"] }] }] }, { "prim": "code", "args": [[{ "prim": "PUSH", "args": [{ "prim": "nat" }, { "int": "42" }] }, { "prim": "FAILWITH" }]] }], "storage": { "prim": "Pair", "args": [{ "int": "7" }, { "int": "38671" }] } }

		mockRpcClient.getBlock.mockResolvedValue({ operations: [[{ hash: 'test' }], [], [], []], header: { timestamp: "2021-01-06T05:14:43Z" } });
		mockRpcClient.getBalance.mockResolvedValue("0");
		mockRpcClient.getChainId.mockResolvedValue("NetTest");
	});

	it('Should succesfully execute a view that get the balance of the contrat', async (done) => {
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
		const viewCode = [{ "prim": "AMOUNT", "args": [], "annots": [] }] // code
		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			viewCode
		);

		try {
			await michelsonStorageView.executeView();
		}
		catch (e) {
			expect(e).toBeInstanceOf(ForbiddenInstructionInViewCode);
			expect(e.message).toEqual('Erreur found in the code of the view. It contains a forbidden instruction: AMOUNT.')
		}
		done();
	});

	it('Should throw ForbiddenInstructionInViewCode when code of the view contains the instruction CREATE_CONTRACT', async (done) => {
		const viewCode = [{ "prim": "CAR", "args": [], "annots": [] }, { "prim": "CREATE_CONTRACT", "args": [], "annots": [] }, { "prim": "DROP", "args": [], "annots": [] }] // code

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			viewCode
		);

		try {
			await michelsonStorageView.executeView();
		}
		catch (e) {
			expect(e).toBeInstanceOf(ForbiddenInstructionInViewCode);
			expect(e.message).toEqual('Erreur found in the code of the view. It contains a forbidden instruction: CREATE_CONTRACT.')
		}
		done();
	});

	it('Should throw ForbiddenInstructionInViewCode when code of the view contains the instruction SENDER', async (done) => {
		const viewCode = [{ "prim": "CAR", "args": [], "annots": [] }, { "prim": "SENDER", "args": [], "annots": [] }] // code

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			viewCode
		);

		try {
			await michelsonStorageView.executeView();
		}
		catch (e) {
			expect(e).toBeInstanceOf(ForbiddenInstructionInViewCode);
			expect(e.message).toEqual('Erreur found in the code of the view. It contains a forbidden instruction: SENDER.')
		}
		done();
	});

	it('Should throw ForbiddenInstructionInViewCode when code of the view contains the instruction SET_DELEGATE', async (done) => {
		const viewCode = [{ "prim": "SET_DELEGATE", "args": [], "annots": [] }] // code
		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			viewCode
		);

		try {
			await michelsonStorageView.executeView();
		}
		catch (e) {
			expect(e).toBeInstanceOf(ForbiddenInstructionInViewCode);
			expect(e.message).toEqual('Erreur found in the code of the view. It contains a forbidden instruction: SET_DELEGATE.')
		}
		done();
	});

	it('Should throw ForbiddenInstructionInViewCode when code of the view contains the instruction SOURCE', async (done) => {
		const viewCode = [{ "prim": "SOURCE", "args": [], "annots": [] }] // code
		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			viewCode
		);

		try {
			await michelsonStorageView.executeView();
		}
		catch (e) {
			expect(e).toBeInstanceOf(ForbiddenInstructionInViewCode);
			expect(e.message).toEqual('Erreur found in the code of the view. It contains a forbidden instruction: SOURCE.')
		}
		done();
	});

	it('Should throw ForbiddenInstructionInViewCode when code of the view contains the instruction TRANSFER_TOKENS', async (done) => {
		const viewCode = [{ "prim": "TRANSFER_TOKENS", "args": [], "annots": [] }] // code
		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			viewCode
		);

		try {
			await michelsonStorageView.executeView();
		}
		catch (e) {
			expect(e).toBeInstanceOf(ForbiddenInstructionInViewCode);
			expect(e.message).toEqual('Erreur found in the code of the view. It contains a forbidden instruction: TRANSFER_TOKENS.')
		}
		done();
	});

	it('Should throw ForbiddenInstructionInViewCode when code of the view contains a nested forbidden instruction', async (done) => {
		const viewCode = [{ "prim": "test", "args": [{ "prim": "test2", "args": [{ "prim": 'TRANSFER_TOKENS' }] }], "annots": [] }] // code
		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			viewCode
		);

		try {
			await michelsonStorageView.executeView();
		}
		catch (e) {
			expect(e).toBeInstanceOf(ForbiddenInstructionInViewCode);
			expect(e.message).toEqual('Erreur found in the code of the view. It contains a forbidden instruction: TRANSFER_TOKENS.')
		}
		done();
	});

	it('Should throw ForbiddenInstructionInViewCode when code of the view contains the instruction SELF which is not followed by an instruction ADDRESS', async (done) => {
		const viewCode = [{ "prim": "SELF", "args": [], "annots": [] }, { "prim": "CONTRACT", "args": [], "annots": [] }] // code

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			viewCode
		);

		try {
			await michelsonStorageView.executeView();
		}
		catch (e) {
			expect(e).toBeInstanceOf(ForbiddenInstructionInViewCode);
			expect(e.message).toEqual('Erreur found in the code of the view. It contains a forbidden instruction: the instruction SELF should only be used before ADDRESS.')
		}
		done();
	});

	it('Should throw ForbiddenInstructionInViewCode when code of the view contains the instruction SELF which is not followed by an instruction ADDRESS', async (done) => {
		const viewCode = [{ "prim": "test", "args": [{ "prim": "SELF" }, { "prim": "test2" }], "annots": [] }] // code

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			viewCode
		);

		try {
			await michelsonStorageView.executeView();
		}
		catch (e) {
			expect(e).toBeInstanceOf(ForbiddenInstructionInViewCode);
			expect(e.message).toEqual('Erreur found in the code of the view. It contains a forbidden instruction: the instruction SELF should only be used before ADDRESS.')
		}
		done();
	});

	it('Should be valid when code of the view contains the instruction SELF followed by an instruction ADDRESS', async (done) => {
		mockRpcClient.runCode.mockResolvedValue({ "storage": { "prim": "Some", "args": [{ "int": "0" }] }, "operations": [] });
		const viewCode = [{ "prim": "CAR", "args": [], "annots": [] }, { "prim": "SELF", "args": [], "annots": [] }, { "prim": "ADDRESS", "args": [], "annots": [] }, { "prim": "CAR", "args": [], "annots": [] }] // code

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			viewCode
		);

		const result = await michelsonStorageView.executeView();

		expect(result.toString()).toEqual('0');
		done();
	});

	it('Should adapt view code to context', async (done) => {
		const viewCode = [{ "prim": "CAR" }, { "prim": "NOW", "args": [], "annots": [] }, { "prim": "SELF", "args": [], "annots": [] }, { "prim": "ADDRESS", "args": [], "annots": [] }, { "prim": "CAR", "args": [], "annots": [] }, { "prim": "BALANCE", "args": [], "annots": [] }, { "prim": "CAR", "args": [], "annots": [] }, { "prim": "CHAIN_ID", "args": [], "annots": [] }] // code

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			viewCode
		);

		const code = michelsonStorageView['adaptViewCodeToContext'](viewCode, '1000', "2000-01-06T05:14:43Z", 'chainTest')
		expect(code).toEqual([{ "prim": "CAR" }, [{ prim: 'PUSH', args: [{ prim: 'timestamp' }, { string: "2000-01-06T05:14:43Z" }] }], [{ prim: 'PUSH', args: [{ prim: 'address' }, { string: 'KT1test' }] }, { prim: 'CONTRACT', args: [{ prim: 'unit' }] }, { prim: 'IF_NONE', args: [[{ prim: 'UNIT' }, { prim: 'FAILWITH' }], []] }], { "prim": "ADDRESS", "args": [], "annots": [] }, { "prim": "CAR", "args": [], "annots": [] }, [{ prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '1000' }] }], { "prim": "CAR", "args": [], "annots": [] }, [{ prim: 'PUSH', args: [{ prim: 'string' }, { string: 'chainTest' }] }]]);
		done();
	});

	it('Should adapt view code to context when instruction to replace is not at first level of the array, test 1', async (done) => {
		const viewCode = [{ "prim": "test" }, { "prim": "test2", "args": [{ "prim": "BALANCE" }, { "prim": "test3", "args": [{ "prim": "CHAIN_ID" }] }] }, { "prim": "test4" }] // code

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			viewCode
		);

		const code = michelsonStorageView['adaptViewCodeToContext'](viewCode, '1000', "2000-01-06T05:14:43Z", 'chainTest')
		expect(code).toEqual([{ "prim": "test" }, { "prim": "test2", "args": [[{ "prim": 'PUSH', "args": [{ "prim": 'mutez' }, { "int": '1000' }] }], { "prim": "test3", "args": [[{ "prim": 'PUSH', "args": [{ "prim": 'string' }, { "string": 'chainTest' }] }]] }] }, { "prim": "test4" }]);
		done();
	});

	it('Should adapt view code to context when instruction to replace is not at first level of the array, test 1', async (done) => {
		const viewCode = [{ "prim": "test", "args": [{ "prim": "test2", "args": [{ "prim": "test3", "args": [{ "prim": "test4" }, { "prim": "BALANCE" }] }] }] }, { "prim": "CHAIN_ID" }, { "prim": "test4" }] // code

		const michelsonStorageView = new MichelsonStorageView(
			'test',
			mockContractAbstraction,
			mockRpcClient,
			{ "prim": "mutez", "args": [], "annots": [] }, // returnType
			viewCode
		);

		const code = michelsonStorageView['adaptViewCodeToContext'](viewCode, '1000', "2000-01-06T05:14:43Z", 'chainTest')
		expect(code).toEqual([{ "prim": "test", "args": [{ "prim": "test2", "args": [{ "prim": "test3", "args": [{ "prim": "test4" }, [{ prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '1000' }] }]] }] }] }, [{ prim: 'PUSH', args: [{ prim: 'string' }, { string: 'chainTest' }] }], { "prim": "test4" }]);
		done();
	});

	it('Should format Unit arguments and Unit view parameter properly, test 1', async (done) => {
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
