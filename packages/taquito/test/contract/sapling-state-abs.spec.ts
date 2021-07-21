import BigNumber from 'bignumber.js';
import { SaplingStateAbstraction } from '../../src/contract/sapling-state-abstraction';

/**
 * SaplingStateAbstraction test
 */
describe('SaplingStateAbstraction test', () => {
    let rpcContractProvider: {
        getSaplingDiffByID: jest.Mock<any, any>;
    };

    beforeEach(() => {
        rpcContractProvider = {
            getSaplingDiffByID: jest.fn()
        };

        rpcContractProvider.getSaplingDiffByID.mockResolvedValue({
            root: '84d1adee98ebdff44b9c034c341e4c18674d88930dbaa10999462c22190c5a4c',
            commitments_and_ciphertexts: [
                [
                    'e74e78ab4c320947cd09fb0c052a94b2c468259f282efc78bffa733b8775ac28',
                    {
                        cv: 'fb8f448a2893fb2c992d18461a735dbb12067df7fcb78f0e9deeda3fe032a857',
                        epk: '4736b27e00f5e717b52b1f656dd595d3656b9875ed0f1b99bff55edb6226735e',
                        payload_enc:
                            '9fc014bcfaef6e6c29824f3bda4546292a385dc4096867065e002678b98248fd976d7a719bf1005ccd9949b6ef569248c84ad075c2a212b8fe1ab431500f90ada78edd65879f7fd5ce787931a1821b',
                        nonce_enc: 'b7014a4a114d1d9c92e0996402b2d25e3491afbaeb755af6',
                        payload_out:
                            'f527db4267ce314d4ade22861fc630ebe71cab31b40642b0b68ab7a4a039b7cb842beb7bfea00c22c5bb4272f95120ed121c4dc231fb2aec162f136ee5d75eff28b450afca2ab335260afc8779cbd4b4',
                        nonce_out: '8e05d9bce67d637b4110988efdcfc14e2bbc63d0266e14db'
                    }
                ],
                [
                    '06b2cd10bf5076cec0acfb93198456035274ca5721720b4da802136ffecdd53e',
                    {
                        cv: '20dac0b71d64e491f6e7e353f362f15097bdebcb9e8088e72d4bd33092525eed',
                        epk: 'd63fe9f564ed09fcace057219d86dd7f52c7128d0da238f05f082a16065e070a',
                        payload_enc:
                            'fcb623369efba44db0853055885f5fd0e83a0413b9ff666bc276ed950a45441e957ef906434e14e92e973ef5f2b7df022392f4a93a2dfec5e65fb36a9e3b6d27aa8751018be0776b6ee5e6b8e59b61',
                        nonce_enc: 'e71201ffcc91cd79cbfc91f7007b5ee31c70d8bf84784426',
                        payload_out:
                            'a8f50d745a3fe60a91efa9de36577da44a43917024da7c5141ed1a878de56a6d72df3c7b042b14200dfcc15fca6c2914d2dd79ad50e5b9da0631ca3e78f31fabcfddcf8631d653a3b6eb314378f73332',
                        nonce_out: 'f2db1d8f2eb19c73f010c7ef68155166418e35fe314e65f0'
                    }
                ],
                [
                    'e70c635aa411f819a795299f0278e8063e5fdb60305596bbd75355c026b82841',
                    {
                        cv: '5fedaa6eddfc86d691fe219b55ed6e0ab9c352e60ac4e8b99a6fb39a12f6df89',
                        epk: '931ff665ace3f29ec4672a542049e9aefcbdb4e12e6ca5dc49eb3f15deeaea8f',
                        payload_enc:
                            '111d4983e3e22e62dd20eb649807c1d83481e21618b5cc8d780b4cdee3e4a18a6850ae4456dea2e8e635a7d4a06bfaafefebdec494e9b5c25d8933d8c7c607d81425fe6c931b3d867c4c023383bfe7',
                        nonce_enc: 'fa929e775accad7186ef08af1703e235ed1879e57bba4de6',
                        payload_out:
                            '58be23cf42661f9def28098babb5b38fb16be46758a5a181e5a27505c2817aa20124d75f3ebd24acefbb5bd714e589fb7cbec3c7fa48f29c2d549f94b5074334c068ebc95d0e8a71cffc69d1fc93bc6b',
                        nonce_out: '04b4ecf86c15138126d0e70c0852f3588b4ab325beaf3992'
                    }
                ],
                [
                    '40810750298fa5761a50f0fbcff63275af55c38cd4591329e618521ceddca908',
                    {
                        cv: 'b36dc290b6624d1d8b21c6d4ecad06e7de00db7962adfe52a62398c72709ab67',
                        epk: '3c99895492e8b4621d364c49b11b050ca0f6e2379fe134a244daf06449c2a95c',
                        payload_enc:
                            'dcf20df9d23a9b78c95598afe14d38d7f86268c431f992cb927271697b75390c2c27f7102dd11da7bd16bd10289197bb22c31ba486b1a1bf2e70f8b12e6e325c4de27cd25218dc91078e4724cebd80',
                        nonce_enc: 'bdef7552f73bac576d511afdb148d55d8749c721767b124c',
                        payload_out:
                            '62b7c1eaada6873762c4e10f2668ecb5bd74f8bae89992ae6b54cf2ed02b4e280b5db0361f27d4b53efb022a061a87d51b6227392f2802764b0b6ae2264fb464aba8aaa05e0aa0fd037f6f4c39edd849',
                        nonce_out: '16f32d56198fa56f0a1dfab25ef8e18ba1440fc5e9601a1e'
                    }
                ],
                [
                    '7be1c4073c6e638fd069179a850fd58bba3a482f12510d940c02194251956801',
                    {
                        cv: '1a450ae8a674fcd9b30cbba409db99af639fc61be879d9d9ce93f782bbb96fc1',
                        epk: '06380b0434cb1d134ca7bfa7c96295d9bc16c20d0d190c62de17af039f45bcb4',
                        payload_enc:
                            'd86b1806da061159d2b40df3080e6234f060aa3417f147f1e9c4a171249bee5c504cd6cc4f52d525343aba2143cb65ca85841b988fca654109a5ba40f35af5d983d6cb93da84b9227f6182155b93dd',
                        nonce_enc: '3147f1fb1dc4b56b4266c708dade7997d3b8e9603bcdf383',
                        payload_out:
                            '7c3fcd3898f3af11a3cf5bb425040c31217750d4bc1f453463e2e951a96de24b89c819c44a147a2a0bd9457659d0322b5129ab571577105bf9b0ae482ffd7845a8328f89a81f1f5500957a9a6eec62ed',
                        nonce_out: '28a2f90e987c4b0f5ab3f07f6e730210513939a19c82d798'
                    }
                ]
            ],
            nullifiers: [
                '10ffea87a7e59fb4d239fab9c7d2b8682d1f752db6ddbefc383452e7de0f8526',
                'aa96bf02d788eb4a9c91be1f7052803f34adb27c77c8d86b21cb3069fee0ee84'
            ]
        });
    });

    describe('SaplingStateAbstraction getSaplingDiff method', () => {
        it('returns the sapling state diff', async (done) => {
            const saplingState = new SaplingStateAbstraction(
                new BigNumber('1'),
                rpcContractProvider as any
            );
            const result = await saplingState.getSaplingDiff();

            expect(rpcContractProvider.getSaplingDiffByID).toHaveBeenCalledWith('1', undefined);
            expect(result.root).toEqual('84d1adee98ebdff44b9c034c341e4c18674d88930dbaa10999462c22190c5a4c');
            expect(result.commitments_and_ciphertexts.length).toEqual(5);
            expect(result.commitments_and_ciphertexts[4][0]).toEqual('7be1c4073c6e638fd069179a850fd58bba3a482f12510d940c02194251956801');
            expect(result.commitments_and_ciphertexts[4][1].cv).toEqual('1a450ae8a674fcd9b30cbba409db99af639fc61be879d9d9ce93f782bbb96fc1');
            expect(result.commitments_and_ciphertexts[4][1].epk).toEqual('06380b0434cb1d134ca7bfa7c96295d9bc16c20d0d190c62de17af039f45bcb4');
            expect(result.commitments_and_ciphertexts[4][1].payload_enc).toEqual('d86b1806da061159d2b40df3080e6234f060aa3417f147f1e9c4a171249bee5c504cd6cc4f52d525343aba2143cb65ca85841b988fca654109a5ba40f35af5d983d6cb93da84b9227f6182155b93dd');
            expect(result.commitments_and_ciphertexts[4][1].nonce_enc).toEqual('3147f1fb1dc4b56b4266c708dade7997d3b8e9603bcdf383');
            expect(result.commitments_and_ciphertexts[4][1].payload_out).toEqual('7c3fcd3898f3af11a3cf5bb425040c31217750d4bc1f453463e2e951a96de24b89c819c44a147a2a0bd9457659d0322b5129ab571577105bf9b0ae482ffd7845a8328f89a81f1f5500957a9a6eec62ed');
            expect(result.commitments_and_ciphertexts[4][1].nonce_out).toEqual('28a2f90e987c4b0f5ab3f07f6e730210513939a19c82d798');
            expect(result.nullifiers.length).toEqual(2);
            expect(result.nullifiers[0]).toEqual('10ffea87a7e59fb4d239fab9c7d2b8682d1f752db6ddbefc383452e7de0f8526');
            done();
        });

        it('returns the sapling state diff when call with a specified block', async (done) => {
            const saplingState = new SaplingStateAbstraction(
                new BigNumber('1'),
                rpcContractProvider as any
            );
            const result = await saplingState.getSaplingDiff(111111);

            expect(rpcContractProvider.getSaplingDiffByID).toHaveBeenCalledWith('1', 111111);
            expect(result.root).toEqual('84d1adee98ebdff44b9c034c341e4c18674d88930dbaa10999462c22190c5a4c');
            expect(result.commitments_and_ciphertexts.length).toEqual(5);
            expect(result.nullifiers.length).toEqual(2);
            done();
        });

        it('returns the sapling state id', async (done) => {
            const saplingState = new SaplingStateAbstraction(
                new BigNumber('12'),
                rpcContractProvider as any
            );
            const id = saplingState.getId();

            expect(id).toEqual('12');
            done();
        });

    });

});
