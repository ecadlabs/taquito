import { CONFIGS } from './config';
import { ContractAbstraction, ContractProvider, TezosToolkit, Wallet } from '@taquito/taquito';
import { tzip16 } from '../packages/taquito-tzip16/src/composer';
import { tzip12 } from '../packages/taquito-tzip12/src/composer'
import { Tzip16Module } from '../packages/taquito-tzip16/src/tzip16-extension';
import { Tzip12Module } from '../packages/taquito-tzip12/src/tzip12-extension';

// Should be in Taquito
function createTzip12Tzip16ContractAbstraction<T extends ContractAbstraction<ContractProvider | Wallet>>(abs: T, tezos: TezosToolkit) {
	return tzip16(tzip12(abs, tezos['_context']), tezos['_context']);
}

CONFIGS().forEach(({ lib, rpc, setup }) => {
	const Tezos = lib;
	Tezos.addExtension(new Tzip12Module());
	Tezos.addExtension(new Tzip16Module());

	describe(`Execute views example from TZComet: ${rpc}`, () => {
		beforeEach(async (done) => {
			await setup();
			done();
		});

		it('test contract abstraction composition', async (done) => {

			const contract = createTzip12Tzip16ContractAbstraction(await Tezos.contract.at('KT1BAQ3nEsLrEeZdkij8KiekaWUVQERNF1Hi'), Tezos);
			const metadata = await contract.tzip16().getMetadata();
			console.log(metadata);

			// tzip12
			const tokenMetadata = contract.tzip12().getTokenMetadata();
			console.log('tokenMetadata', tokenMetadata)

			console.log(Tezos['_context'])

			expect(1).toEqual(1);

			done();
		});

	});
});
