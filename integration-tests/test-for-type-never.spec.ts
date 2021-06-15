
import { MichelsonMap } from '@taquito/taquito';
import { CONFIGS } from './config';
import { contractWithNever } from './data/contract-with-never-in-param';

CONFIGS().forEach(({ lib, rpc, setup }) => {
	const Tezos = lib;
	describe(`Originate a voting contract using: ${rpc}`, () => {
		beforeEach(async (done) => {
			await setup();
			done();
		});

		it('originates a contract and tries to call its %admin entry-point of type never, expect the method call to fail', async (done) => {
			const op = await Tezos.contract.originate({
				code: contractWithNever,
				storage: {
					admin: "Unit",
					current_id: 1,
					max_auction_time: 1,
					max_config_to_start_time: 1,
					auctions: new MichelsonMap()
				}
			});
			await op.confirmation();
			expect(op.hash).toBeDefined();
			expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

			const contract = await op.contract();
			expect(contract).toBeDefined();

			try {
				await contract.methods.admin('test').send();
			} catch (e) {
				expect(e.message).toContain('Assigning a value to the type never is forbidden.');
			}

			done();
		});



		it('originates a contract having the type never in a set in its storage', async (done) => {
			const code = [
				{ prim: 'parameter', args: [{ prim: 'unit' }] },
				{ prim: 'storage', args: [{ prim: 'set', args: [{ prim: 'never' }] }] },
				{
					prim: 'code',
					args: [
						[
							{ prim: 'DROP' },
							{ prim: 'EMPTY_SET', args: [{ prim: 'never' }] },
							{ prim: 'NIL', args: [{ prim: 'operation' }] },
							{ prim: 'PAIR' }
						]
					]
				}
			];

			const op = await Tezos.contract.originate({
				code,
				storage: [] // empty set
			});
			await op.confirmation();
			expect(op.hash).toBeDefined();
			expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

			const contract = await op.contract();
			expect(contract).toBeDefined();

			done();
		});
	});
});
