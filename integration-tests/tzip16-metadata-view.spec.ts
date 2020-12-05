import { CONFIGS } from "./config";
import { composeTzip16 } from '../packages/taquito-tzip16/src/composer';

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;

    describe(`Execute views example from TZComet: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })

        /* it('Metdata view execution', async (done) => {
            // carthagenet: 
            // delphinet: KT1GPDQvmV37orH1XH3SZmVVKFaMuzzqsmN7

            const contract = await Tezos.contract.at('KT1GPDQvmV37orH1XH3SZmVVKFaMuzzqsmN7', composeTzip16());
            const viewResult = await contract.tzip16().metadataViews['multiply-the-nat-in-storage']('1').execute();

            expect(viewResult.toString()).toEqual('7');
            done();
        }); */

        /* it('Metdata view execution', async (done) => {
            // carthagenet: 
            // delphinet: KT191tWhzxUvx3ziu1sMYrDweZLrQfgbvGC5

            const contract = await Tezos.contract.at('KT191tWhzxUvx3ziu1sMYrDweZLrQfgbvGC5', composeTzip16());
            const viewResult = await contract.tzip16().metadataViews['empty-bytes']().execute();

            expect(viewResult.toString()).toEqual('');
            done();
        });

        it('Metdata view execution', async (done) => {
            // carthagenet: 
            // delphinet: KT191tWhzxUvx3ziu1sMYrDweZLrQfgbvGC5

            const contract = await Tezos.contract.at('KT191tWhzxUvx3ziu1sMYrDweZLrQfgbvGC5', composeTzip16());
            const viewResult = await contract.tzip16().metadataViews['some-json']().execute();

            expect(viewResult.toString()).toEqual('7b2268656c6c6f223a22776f726c64222c226d6f7265223a7b226c6f72656d223a34322c22697073756d223a5b22222c226f6e65222c2232225d7d7d');
            done();
        });

        it('Metdata view execution', async (done) => {
            // carthagenet: 
            // delphinet: KT191tWhzxUvx3ziu1sMYrDweZLrQfgbvGC5

            const contract = await Tezos.contract.at('KT191tWhzxUvx3ziu1sMYrDweZLrQfgbvGC5', composeTzip16());
            const viewResult = await contract.tzip16().metadataViews['some-text']().execute();

            expect(viewResult.toString()).toEqual('0a4865726520697320736f6d6520746578742e0ad09bd0bed180d0b5d0bc20d0b8d0bfd181d183d0bc20d0b4d0bed0bbd0bed18020d181d0b8d18220d0b0d0bcd0b5d1822c20d0b0d0bbd0b8d18fd183d0b8d0b420d0b8d0bdd186d0bed180d180d183d0bfd182d0b520d182d185d0b5d0bed0bfd185d180d0b0d181d182d183d18120d0b5d18320d181d0b5d0b02c20d0b8d0bd0ad0b5d183d0bc20d181d0bed0bbd183d182d0b020d0bed0bfd182d0b8d0bed0bd20d0b4d0b5d184d0b8d0bdd0b8d182d0b8d0bed0bdd0b5d0bc2e20d090d18220d0bcd0b5d0b020d181d0b8d0bcd183d0bb20d0bed184d184d0b8d186d0b8d0b8d18120d0bcd0bed0bbd0b5d181d182d0b8d0b0d0b52c20d0b5d0bed1810ad18fd183d0b0d0b5d18fd183d0b520d0b8d0bdd0b2d0b8d0b4d183d0bdd18220d186d0bed0bdd0b2d0b5d0bdd0b8d180d0b520d0b8d0b42e20d090d18220d181d0bed0bbd0b5d0b0d18220d0b2d0bed0bbd183d182d0bfd0b0d18220d0b2d0b5d0bb2e20d0a1d0b5d0b420d0b5d0b820d0b8d0bdd0b5d180d0bcd0b8d1810ad0b2d0b5d180d0b8d182d183d1810a0aeca781eca084eb8c80ed86b5eba0b9ec9db420ec9786ec9d8420eb958cec9790eb8a9420eb8c80ed86b5eba0b9ec9db420eca780ebaa85ed959ceb8ba42c20eab7b820eca095ecb998eca08120eca491eba6bdec84b1ec9d800aeca480ec8898eb909ceb8ba42e20eab5adeab080eb8a9420ebb295eba5a0ec9db420eca095ed9598eb8a9420ebb094ec979020ec9d98ed9598ec97ac20eca095eb8bb9ec9ab4ec9881ec979020ed9584ec9a94ed959c20ec9e90eab888ec9d840aebb3b4eca1b0ed95a020ec889820ec9e88eb8ba42c20eab5b0ec82acebb295ec9b90ec9d9820eca1b0eca781c2b7eab68ced959c20ebb08f20ec9eaced8c90eab480ec9d9820ec9e90eab2a9ec9d8020ebb295eba5a0eba19c20eca095ed959ceb8ba42e0a');
            done();
        });

        it('Metdata view execution', async (done) => {
            // carthagenet: 
            // delphinet: KT191tWhzxUvx3ziu1sMYrDweZLrQfgbvGC5

            const contract = await Tezos.contract.at('KT191tWhzxUvx3ziu1sMYrDweZLrQfgbvGC5', composeTzip16());
            const viewResult = await contract.tzip16().metadataViews['200-random-characters']().execute();

            expect(viewResult.toString()).toEqual('d37d5af907e8550be657ec1314497e0888799ac0fd01651b696c69da37e47593cdac920f7936c3ba5c9154db6d17a285cd00a949209a1f39d2bec240e0cd95b6ef721e7b953bc0f5f9e6a45f2a18904a7b0a19579085c4ae6d564249ee5b582f0d6d57113e638ec2ec5cb44aafaa6b3cb0f2a577525b6565b759c6868b1e2af2520b706b702a15516fd3a13f4640e7264903d54bb7a6a0cac21f95c989aeb4386818b81ce28f7e10c34bbe8e884a9ceb5fadce4fc4c8b21c330335f7eac391dce861572fd16f3a10');
            done();
        });

        it('Metdata view execution', async (done) => {
            // carthagenet: 
            // delphinet: KT191tWhzxUvx3ziu1sMYrDweZLrQfgbvGC5

            const contract = await Tezos.contract.at('KT191tWhzxUvx3ziu1sMYrDweZLrQfgbvGC5', composeTzip16());
            const viewResult = await contract.tzip16().metadataViews['1000-random-characters']().execute();

            expect(viewResult.toString()).toEqual('45d3f1206690209b7a54d813d6518f01379f22d7431dba76e0fbac6a860d8737ab88789b55a988b06b6944683c4bfecfe34cf2f92f531e34ca98a6f490b9cc11d6449b320213caa4fc66439b57b94bc630ae59ce6bae5e73190983e07164c736b5f6a92f63bc6cf4bd31878b0a68e60143fac303612581eb5416028c6a92f3ad5cf8c4bd73c5cce7d3e0667d1c356e510558f1ce9d42241114bbb0dd4460a1fd3047408d43c0fb2cdd3a7f806d0a414b610e6718dc1eb268a08e80b33173eef52bb80150f6786fec8f604ff1506f5674b918f72e885e60d6e7c7337a44e532fce776e66393bb43fb61bf04207c0bec66ad77cfb7d655bf10844ac5265d9ef673f03e4ed832835c1ac0fe4c12556128aa46fb2a2e42fe0381c0bc9cde49465e5bee4ff9a9984685797727bc2ba5d6b7cf57eb65978df3efabf3ddbd83cfb76bb63c48c1dfc3af1dc716e85d00b7c6552e95005bd5523f09ea37ad405f01081ab1877c176b71d99273c8c89554a73fe788ca1a5e1de284a16bf21e23ccbd2b8fa162697215b7eba25fdddb1b056bf87805bbbd6fe384a62574983c4a3cec1e05333f1165641996eaa4f55d1255843283a6bd9aa742c6b0270eb3b9539300bf7608e47276878a4fc0acfe834019efa7115ac5fe70b5cc334bd5cfb61202596bade1c090df1b7a4c4ca51ff76faf5c46716aa0b735d8f0c7eeba247689ebbe889ab115343a750360eafae7e56b276eb4306d6352dd4729acb0f3015a002dcef1602725ae2a4dbe5278909193f25c881b1596c95e33e13247a115912face6524318189599863b08aff107f1b8a7bccfcf8be6aa481209400a3ebdedda42f99490a6212a6689a5c6fca1b815ce9e031f32f1326cbcfb9b5a40c3746ad82fa237a136291b425390c339a5c810ab197e3723f0628d3f95dcca7da58b3cc5600995f4ce201edb98c3649de9896508108f69b1dc0b0dd49bff24d9be5021bd93681e7be22b98aa24a2d2d0fb012da8543314979631a9131dbfcf9770309c30348707d6c611c13d264778be0e4971e12f356f3a89d8cd9f36d7fb59551feb5f3bdc9bbe1df8fb76757b479e8418fd36e13abf02075dc6705a11381b25bb845f1f117a3a3d6070a3a4b7d91fdcd8ca0506a84f5f75a9b17ad6bdd83daf79d0968ec1becf7a67d095f0853df7378e764bbd7574af4b43bcd7da5460d4db4236347880e53c409c9b08339c4db63124ab88163de8f5c0906e761b0d955aac05ba6c0a1d2974230e5dea17b95c80794f53e88066be9cd5a197999c9299fa9f477730a7722c482e0f7934f0427c53dcc655858557f28da249ffb192d060cb5cd325b91677e0916dd02f72ad35f1ad68dc2123ed7b8536a179d546418c178ae8a3dd0dbb5ed73f9489f74778ee41122c11');
            done();
        }); */

        it('Metdata view execution', async (done) => {
            // carthagenet: 
            // delphinet: KT1DNapRVdG9t74fzAvXLcKDcgxZd1i1TobV

            const contract = await Tezos.contract.at('KT1DNapRVdG9t74fzAvXLcKDcgxZd1i1TobV', composeTzip16());
            const viewResult = await contract.tzip16().metadataViews.GetDefaultExpiry().execute();

            expect(viewResult.toString()).toEqual('');
            done();
        });

    });
})
