import { CONFIGS } from '../../config';
import { MichelsonMap } from '@taquito/taquito';
import { tzip16, Tzip16Module } from '@taquito/tzip16';
import { stringToBytes } from '@taquito/utils';
import { contractCode, metadataViewsExample1, metadataViewsExample2 } from '../../data/metadataViews';

CONFIGS().forEach(({ lib, rpc, setup }) => {
	const Tezos = lib;
	Tezos.addExtension(new Tzip16Module());

	describe(`Test contract origination with metadata having views that return bytes and calls the views from TZComet through contract api using: ${rpc}`, () => {
		beforeEach(async () => {
			await setup();
		});

		test('Verify contract.originate for a contract with metadata having views that return bytes (example taken from TZComet) and then call the views', async () => {

			const metadataBigMAp = new MichelsonMap();
			metadataBigMAp.set("", stringToBytes('tezos-storage:here'));
			metadataBigMAp.set("here", stringToBytes(JSON.stringify(metadataViewsExample1)))

			const op = await Tezos.contract.originate({
				code: contractCode,
				storage: {
					0: 7,
					metadata: metadataBigMAp
				}
			});
			await op.confirmation();
			const contractAddress = (await op.contract()).address;

			const contractAbstraction = await Tezos.contract.at(contractAddress, tzip16);
			const metadataViews = await contractAbstraction.tzip16().metadataViews();

			const viewEmptyBytesResult = await metadataViews.emptyBytes().executeView();
			expect(viewEmptyBytesResult.toString()).toEqual('');

			const viewSomeJsonResult = await metadataViews.someJson().executeView();
			expect(viewSomeJsonResult.toString()).toEqual(
				'7b2268656c6c6f223a22776f726c64222c226d6f7265223a7b226c6f72656d223a34322c22697073756d223a5b22222c226f6e65222c2232225d7d7d'
			);

			const viewSomeTextResult = await metadataViews.someText().executeView();
			expect(viewSomeTextResult.toString()).toEqual(
				'0a4865726520697320736f6d6520746578742e0ad09bd0bed180d0b5d0bc20d0b8d0bfd181d183d0bc20d0b4d0bed0bbd0bed18020d181d0b8d18220d0b0d0bcd0b5d1822c20d0b0d0bbd0b8d18fd183d0b8d0b420d0b8d0bdd186d0bed180d180d183d0bfd182d0b520d182d185d0b5d0bed0bfd185d180d0b0d181d182d183d18120d0b5d18320d181d0b5d0b02c20d0b8d0bd0ad0b5d183d0bc20d181d0bed0bbd183d182d0b020d0bed0bfd182d0b8d0bed0bd20d0b4d0b5d184d0b8d0bdd0b8d182d0b8d0bed0bdd0b5d0bc2e20d090d18220d0bcd0b5d0b020d181d0b8d0bcd183d0bb20d0bed184d184d0b8d186d0b8d0b8d18120d0bcd0bed0bbd0b5d181d182d0b8d0b0d0b52c20d0b5d0bed1810ad18fd183d0b0d0b5d18fd183d0b520d0b8d0bdd0b2d0b8d0b4d183d0bdd18220d186d0bed0bdd0b2d0b5d0bdd0b8d180d0b520d0b8d0b42e20d090d18220d181d0bed0bbd0b5d0b0d18220d0b2d0bed0bbd183d182d0bfd0b0d18220d0b2d0b5d0bb2e20d0a1d0b5d0b420d0b5d0b820d0b8d0bdd0b5d180d0bcd0b8d1810ad0b2d0b5d180d0b8d182d183d1810a0aeca781eca084eb8c80ed86b5eba0b9ec9db420ec9786ec9d8420eb958cec9790eb8a9420eb8c80ed86b5eba0b9ec9db420eca780ebaa85ed959ceb8ba42c20eab7b820eca095ecb998eca08120eca491eba6bdec84b1ec9d800aeca480ec8898eb909ceb8ba42e20eab5adeab080eb8a9420ebb295eba5a0ec9db420eca095ed9598eb8a9420ebb094ec979020ec9d98ed9598ec97ac20eca095eb8bb9ec9ab4ec9881ec979020ed9584ec9a94ed959c20ec9e90eab888ec9d840aebb3b4eca1b0ed95a020ec889820ec9e88eb8ba42c20eab5b0ec82acebb295ec9b90ec9d9820eca1b0eca781c2b7eab68ced959c20ebb08f20ec9eaced8c90eab480ec9d9820ec9e90eab2a9ec9d8020ebb295eba5a0eba19c20eca095ed959ceb8ba42e0a'
			);

			const view200RandomCharactersResult = await metadataViews['200RandomCharacters']().executeView();
			expect(view200RandomCharactersResult.toString()).toEqual(
				'2816ce09c073f93c10cdc5ef498311acec06fb8183e9e84ecdcb6208783361f1751a1324c2fceebb745a61d1904161ec47db7e91286d6deed63f0b53a1542a85ded61f197fef65616151531034513522a9f59a97aae6e34049108a6b4f243f4b2790e6054de045b418b4956eb49a137e2ca1d7543d06da10dba28ac70eacc694da320f7b227fdcc395240c6a81f3c17cb364cc824018680a296edf578e0d48daddaaddd70cf53ec6c7d6bdbafe9a7f8e115c574abd338af29ef6bcc57a1fb363caf74ea5f206307d'
			);

			const view1000RandomCharactersResult = await metadataViews['1000RandomCharacters']().executeView();
			expect(view1000RandomCharactersResult.toString()).toEqual(
				'3488f2807fd9c671d0924896a5848488e4edf26c29e0002316c42660ad4167246167072495adddc4ba742238d966204e72ec5ad3ef2037445313f12b032a9e23fc47b93a4a5f529a5a029f0c4a258191bf7b469d62b173cf820c5993de7ce39fc3f75f19da85ddbbf8efe32a51abd10c903acb7fdafcfb6e4f10cf37d23b261104f53622c17c47a65834b8be5534df1d4721169d63eb031e0d2a47afd6fcc4f6f02c5d152c17c2e15b8b2f192fcf8b912fdac43a10242e2b2573daac7106b34e6519c06f3c95f6b4b4349a90c3949d33ff21dddb12fb1d17af20b499167c2fb6afeb7b726c7846ddf862c2d1c9da5b3788ac947f04d05e2726870d3b092d72600e06fe47ffce19ea888b98dfc0703f32dc3b17054084e5d983789c8596bc36fb82c40dcba161271c311d5dc948965712bc282f4dc3483b847c8dd3908838e30f5698a068cc5c4ff85c72c99c2d45e6599dc7dd55e97383ff5de05035a70d2c88b1f64417dea21113a802f0f3991ae20960aaee71a46708b86b05b06c51786e057517a208ec106339dfc34f898873f7b5a833aa637f2c5111fbfc86231d8905192982077e23584e4d6a4cf42bf0076322425ad0dea0cf1676102c3f179d833afe5e600ab1d247f00e87a0a76034b93a324f5816ae6127794ac34696cbd09552c4a6f5d6c5485e4ad8fd7823e19159a16b9746cce3b8a22a0ebda3709dd932da3b9b7f387b0b87045cc0318f04920eb5619c69aa8f3e6fd4649644631b7536198bf66a70a8cfbdd2537255f63ab8e972561a1a2a13a495932cb391858fcf19cdb6a20ac36cc07ac2fdd1aad2e76247c2a861942014b996bda9fefb458fb9960c0554aa916e6f4146eeaf06f41cd050d20125adad989c9160b111230184f9ddf9194f554ee08a10961299293386d18fbe1ba1fd2740146ab760c790f3721e470bf06740ed65656a26c6dcea0d5c1a33c6bb2e45cc0b2eac6919d03a5ba34895f2ec75140231f2ddd188dc34b035a47021f5d2c68235fe70153d895221bbfd12af3bf819790d099d2a0b8e804ade159ffc95eed7df4c0d0328076d35ddf5df76bbba473231c71568025d40cb19f6121ab5793204f30314cb44533d4ef6e512e6c5dbb7769819f1ffe23690e13f1325e182a732c0e6e03ff9f9887122b32e4fc525034e9c00f9159a98b9f9302e44bbd2eb6317dac650e2d265119d333138c00a36e390290e468d236c1e031642e7cdd5f39117857241ac9d11ebbd3d23c599ce9c78523ea145ef4c851de0092ebd976ea4a7bba8716fab4fd05868390723f8148f6058fd35bb1674a6e794a4ff53efbb8c5cd6a9402e166bbcb662ac71df601767550656699de965a1434879ce99fb50bb54d35e500173451fbdaaa89169951b3fa10652f0e11e28901e'
			);

		});

		test('Verify contract.originate for a contract with metadata having a couple of views (example taken from TZComet) and then call the views', async () => {

			const metadataBigMAp = new MichelsonMap();
			metadataBigMAp.set("", stringToBytes('tezos-storage:here'));
			metadataBigMAp.set("here", stringToBytes(JSON.stringify(metadataViewsExample2)))

			const op = await Tezos.contract.originate({
				code: contractCode,
				storage: {
					0: 7,
					metadata: metadataBigMAp
				}
			});
			await op.confirmation();
			const contractAddress = (await op.contract()).address;
			const contractAbstraction = await Tezos.contract.at(contractAddress, tzip16);
			const metadataViews = await contractAbstraction.tzip16().metadataViews();

			try {
				await metadataViews['an-empty-useless-view']().executeView();
			} catch (e: any) {
				expect(e.message).toContain('Http error response');
			}

			const viewMultiplyNegativeNumberResult = await metadataViews['multiply-negative-number-or-call-failwith']().executeView(-2);
			expect(viewMultiplyNegativeNumberResult.toString()).toEqual('-4');

			const viewMultiplyNatInStorageResult = await metadataViews['multiply-the-nat-in-storage']().executeView(10);
			expect(viewMultiplyNatInStorageResult.toString()).toEqual('70');

			const viewCallBalanceResult = await metadataViews['just-call-balance']().executeView();
			expect(viewCallBalanceResult.toString()).toEqual('0');

			const viewIdentityResult = await metadataViews['the-identity']().executeView(1, 'test', 200000);
			expect(JSON.stringify(viewIdentityResult)).toEqual(`{"arg_zero":"1","arg_one_result":"test","arg_two":"200000"}`);

			const viewContractAddressResult = await metadataViews['get-contract-address']().executeView();
			expect(viewContractAddressResult.toString()).toEqual(contractAddress);

		})
	});
});
