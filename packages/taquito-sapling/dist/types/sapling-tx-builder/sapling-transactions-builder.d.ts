import { SaplingForger } from '../sapling-forger/sapling-forger';
import BigNumber from 'bignumber.js';
import { Input, SaplingTransactionOutput, SaplingTransactionInput, ParametersBindingSig, ChosenSpendableInputs, ParametersOutputDescription, ParametersCiphertext, Ciphertext, SaplingContractDetails, SaplingTransaction, SaplingTransactionParams } from '../types';
import { TzReadProvider } from '@taquito/taquito';
import { SaplingWrapper } from '../sapling-module-wrapper';
import { InMemorySpendingKey } from '../sapling-keys/in-memory-spending-key';
import { InMemoryProvingKey } from '../sapling-keys/in-memory-proving-key';
export declare class SaplingTransactionBuilder {
    #private;
    constructor(keys: {
        saplingSigner: InMemorySpendingKey;
        saplingProver?: InMemoryProvingKey;
    }, saplingForger: SaplingForger, saplingContractDetails: SaplingContractDetails, readProvider: TzReadProvider, saplingWrapper?: SaplingWrapper);
    createShieldedTx(saplingTransactionParams: SaplingTransactionParams[], txTotalAmount: BigNumber, boundData: Buffer): Promise<Pick<SaplingTransaction, 'inputs' | 'outputs' | 'signature' | 'balance'>>;
    createSaplingTx(saplingTransactionParams: SaplingTransactionParams[], txTotalAmount: BigNumber, boundData: Buffer, chosenInputs: ChosenSpendableInputs): Promise<{
        inputs: SaplingTransactionInput[];
        outputs: SaplingTransactionOutput[];
        signature: Buffer;
        balance: BigNumber;
    }>;
    calculateTransactionBalance(inputTotal: string, outputTotal: string): BigNumber;
    prepareSaplingOutputDescription(parametersOutputDescription: ParametersOutputDescription): Promise<SaplingTransactionOutput>;
    prepareSaplingSpendDescription(saplingContext: number, inputsToSpend: Input[]): Promise<SaplingTransactionInput[]>;
    encryptCiphertext(parametersCiphertext: ParametersCiphertext): Promise<Pick<Ciphertext, 'payloadEnc' | 'nonceEnc' | 'payloadOut' | 'nonceOut'>>;
    createPaybackOutput(params: ParametersOutputDescription, sumSelectedInputs: BigNumber): Promise<{
        payBackOutput: SaplingTransactionOutput;
        payBackAmount: string;
    }>;
    createBindingSignature(parametersBindingSig: ParametersBindingSig): Promise<Buffer>;
    getAntiReplay(): Promise<Buffer>;
}
