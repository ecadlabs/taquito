import { ParameterSchema } from '@taquito/michelson-encoder';
import { RpcClient, MichelsonV1Expression, MichelsonV1ExpressionExtended } from '@taquito/rpc';
import { ContractAbstraction, ContractProvider, Wallet } from '@taquito/taquito';
import { MichelineTzip16Expression } from '../metadata-interface';
import { IllegalInstructionInViewCode, InvalidViewParameterError, NoParameterExpectedError } from '../tzip16-errors';
import { View } from './interface';

export class MichelsonStorageView implements View {
    constructor(
        private viewName: string,
        private contract: ContractAbstraction<ContractProvider | Wallet>,
        private rpc: RpcClient,
        private returnType: MichelsonV1Expression,
        private code: MichelsonV1ExpressionExtended[],
        private viewParameterType?: MichelsonV1ExpressionExtended
    ) { }

    /**
     * @description According to the tzip-16 standard, the following instructions must not be used in the code of the view:
     * 'AMOUNT', 'CREATE_CONTRACT', 'SENDER', 'SET_DELEGATE', 'SOURCE', and 'TRANSFER_TOKENS'
     * @returns The method returns the first illegal instruction found (string) or undefined if there is no illegal instruction found
     */
    private illegalInstructionInCode() {
        const illegalInstructions = [
            'AMOUNT',
            'CREATE_CONTRACT',
            'SENDER',
            'SET_DELEGATE',
            'SOURCE',
            'TRANSFER_TOKENS'
        ];
        for (let instruction of illegalInstructions) {
            if (this.code.find((x: any) => x.prim === instruction)) {
                return instruction;
            }
        }
    }

    /**
     * @description According to the tzip-16 standard, in the first version of the specification, the instruction SELF should only be used before ADDRESS
     * @returns The method returns true if the instruction SELF is present, but not followed by ADDRESS
     */
    private illegalUseOfSelfInstruction() {
        for (let instruction of this.code) {
            if (instruction.prim === 'SELF') {
                const index = this.code.indexOf(instruction);
                const nextInstruction = this.code[index + 1] ? this.code[index + 1].prim : undefined;
                if (nextInstruction !== 'ADDRESS') {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @description Validate if the instructions in the code of the view are valid according to the tzip-16 standard
     * @returns The method returns true if the instructions are valid and false if one of them is not.
     */
    isValidViewCodeInstructions() {
        return !this.illegalInstructionInCode() && !this.illegalUseOfSelfInstruction() ? true : false;
    }

    /**
     * @description Loops through the view's code and replace SELF, BALANCE, NOW, and CHAIN_ID with Michelson expressions that match the current context, if applicable.
     */
    private adaptViewCodeToContext(contractBalance: string, blockTimeStamp: string, chainId: string) {
        const instructionsToReplace = {
            SELF: [
                { prim: 'PUSH', args: [{ prim: 'address' }, { string: this.contract.address }] },
                { prim: 'CONTRACT', args: [{ prim: 'unit' }] },
                { prim: 'IF_NONE', args: [[{ prim: 'UNIT' }, { prim: 'FAILWITH' }], []] }
            ],
            BALANCE: [{ prim: 'PUSH', args: [{ prim: 'mutez' }, { int: contractBalance }] }],
            NOW: [{ prim: 'PUSH', args: [{ prim: 'timestamp' }, { string: blockTimeStamp }] }],
            CHAIN_ID: [{ prim: 'PUSH', args: [{ prim: 'string' }, { string: chainId }] }]
        };

        const code = this.code;
        code.forEach((x: any, i: any) => {
            for (let instruction in instructionsToReplace) {
                if (x.prim === instruction) {
                    code[i] = Object(instructionsToReplace)[instruction];
                }
            }
        });
        return code;
    }

    private validateArgs = (args: any[], schema: ParameterSchema, viewName: string) => {
        const sigs = schema.ExtractSignatures();

        if (!sigs.find((x: any[]) => x.length === args.length)) {
            throw new InvalidViewParameterError(viewName, sigs, args);
        }
    };

    private formatArgsAndParameter(argView: any[]) {
        let args = argView;
        let viewParameterType = this.viewParameterType;
        if (!viewParameterType) {
            viewParameterType = { args: [], prim: 'unit', annots: [] }
        }

        if (viewParameterType.prim === 'unit') {
            if (args.length === 0) {
                args = ['Unit']
            }
            if (args.length !== 0 && args[0] !== 'Unit') {
                throw new NoParameterExpectedError(this.viewName, argView);
            }
        }
        const parameterViewSchema = new ParameterSchema(viewParameterType);
        this.validateArgs(args, parameterViewSchema, this.viewName);
        const arg = parameterViewSchema.Encode(...args);
        return { arg, viewParameterType };
    }

    async executeView(...args: any[]) {
        // validate view code against tzip-16 specifications
        const illegalInstructionInCode = this.illegalInstructionInCode();
        if (illegalInstructionInCode) {
            throw new IllegalInstructionInViewCode(illegalInstructionInCode);
        }

        if (this.illegalUseOfSelfInstruction()) {
            throw new IllegalInstructionInViewCode('the instruction SELF should only be used before ADDRESS');
        }

        const { arg, viewParameterType } = this.formatArgsAndParameter(args);

        const storageType: any = this.contract.script.code.find((x: any) => x.prim === 'storage');
        const storageArgs = storageType.args[0];
        const storageValue: any = this.contract.script.storage;

        // currentContext
        const chainId = await this.rpc.getChainId();
        const contractBalance = (await this.rpc.getBalance(this.contract.address)).toString();
        const blockTimestamp = (await this.rpc.getBlock()).header.timestamp.toString();
        const code = this.adaptViewCodeToContext(contractBalance, blockTimestamp, chainId);

        const viewScript = {
            script: [
                { prim: 'parameter', args: [{ prim: 'pair', args: [viewParameterType, storageArgs] }] },
                { prim: 'storage', args: [{ prim: 'option', args: [this.returnType] }] },
                {
                    prim: 'code',
                    args: [
                        [
                            { prim: 'CAR' }, // destructs the pair on top of the stack and leaves only the left part of it.
                            code,
                            { prim: 'SOME' }, // wraps the top element v of the stack, of type ty1 into the existing optional value Some
                            { prim: 'NIL', args: [{ prim: 'operation' }] }, // Push an empty list
                            { prim: 'PAIR' }
                        ]
                    ]
                }
            ],
            storage: { prim: 'None' },
            input: { prim: 'Pair', args: [arg, storageValue] },
            amount: '0',
            chain_id: chainId
        };

        const result: any = await this.rpc.runCode(viewScript as any);
        const viewResultSchema = new ParameterSchema(this.returnType);
        return viewResultSchema.Execute(result.storage.args[0]);
    }
}
