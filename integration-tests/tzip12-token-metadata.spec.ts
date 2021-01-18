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

			// tzip12 token metadata in a view token_metadata
			/// const contract = createTzip12Tzip16ContractAbstraction(await Tezos.contract.at('KT1Nu6FHWrpWF3wAkKkWs1Tb1MMTgNesFrUn'), Tezos);
			// const tokenMetadata = await contract.tzip12().getTokenMetadata(0);
			// console.log('tokenMetadata', tokenMetadata)

			// tzip12 token metadata in a big map token_metadata
			const contract2 = createTzip12Tzip16ContractAbstraction(await Tezos.contract.at('KT1TjX9Uz8eDs3boTTMPfak8nghVFmAgPgLa'), Tezos);
			const tokenMetadata2 = await contract2.tzip12().getTokenMetadata(0);
			const test = await contract2.tzip12().isTzip12Compliant()
			console.log('tokenMetadata2', tokenMetadata2)
			console.log(test)

			// tzip12 token metadata in bigmap with uri
			// const contract3 = createTzip12Tzip16ContractAbstraction(await Tezos.contract.at('KT1TjX9Uz8eDs3boTTMPfak8nghVFmAgPgLa'), Tezos);
			// const tokenMetadata3 = await contract3.tzip12().getTokenMetadata(1);
			// console.log('tokenMetadata3', tokenMetadata3)

			expect(1).toEqual(1);

			done();
		});

	});
});
