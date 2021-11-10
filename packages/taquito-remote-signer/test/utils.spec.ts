import { InvalidPublicKeyError, InvalidSignatureError } from '../src/errors';
import { verifySignature } from '../src/utils';

describe('utils signature validation tests', () => {

    describe('SECP256K1 curve', () => {

        it('Should succesfully validate signature', async (done) => {
            const message = '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
            const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
            const sig = 'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx'

            const response = await verifySignature(message, pk, sig);
            expect(response).toBeTruthy()

            done();
        });

        it('Should succesfully validate signature when signature has generic prefix', async (done) => {
            const message = '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
            const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
            const sig = 'sigtofRkQAsLW8ne1HcGhbuBg2Ja2Yt9A2gfpwZFBsdjRWLPSVVqN9BVRpGr7DMwz1e4WjyF8iAjpf1LKyZMcJTSPrDaRzsx'

            const response = await verifySignature(message, pk, sig);
            expect(response).toBeTruthy()

            done();
        });

        it("Should return false if message and signature don't match", async (done) => {
            const message = '0322c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
            const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
            const sig = 'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx'

            const response = await verifySignature(message, pk, sig);
            expect(response).toBeFalsy();

            done();
        });

        it("Should return false if message and signature don't match when signature has generic prefix", async (done) => {
            const message = '0322c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
            const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
            const sig = 'sigtofRkQAsLW8ne1HcGhbuBg2Ja2Yt9A2gfpwZFBsdjRWLPSVVqN9BVRpGr7DMwz1e4WjyF8iAjpf1LKyZMcJTSPrDaRzsx'

            const response = await verifySignature(message, pk, sig);
            expect(response).toBeFalsy();

            done();
        });

        it("Should return false if public key doesn't match", async (done) => {
            const message = '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
            const pk = 'sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH';
            const sig = 'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx'

            const response = await verifySignature(message, pk, sig);
            expect(response).toBeFalsy();

            done();
        });

        it("Should return false if public key doesn't match when signature has generic prefix", async (done) => {
            const message = '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
            const pk = 'sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH';
            const sig = 'sigtofRkQAsLW8ne1HcGhbuBg2Ja2Yt9A2gfpwZFBsdjRWLPSVVqN9BVRpGr7DMwz1e4WjyF8iAjpf1LKyZMcJTSPrDaRzsx'

            const response = await verifySignature(message, pk, sig);
            expect(response).toBeFalsy();

            done();
        });

        it('Should throw if the public key format is invalid', async (done) => {
            const message = '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
            const pk = 'sppk7c4hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
            const sig = 'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx'

            try {
                await verifySignature(message, pk, sig)
            } catch (err) {
                expect(err).toBeInstanceOf(InvalidPublicKeyError)
            }

            done();
        });

        it('Should throw if the signature does not have a valid prefix', async (done) => {
            const message = '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
            const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
            const sig = 'ssig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx'

            try {
                await verifySignature(message, pk, sig)
            } catch (err) {
                expect(err).toBeInstanceOf(InvalidSignatureError)
            }

            done();
        });
    });

    describe('SECP256K1 curve', () => {

        it('Should succesfully validate signature for P256 curve', async (done) => {
            const message = '03cb87b51ef159103aabe530068d82ca0eb92e7599fd3626a7c8d3239c527d37086b02fc42be07e9e7bc9f6cd1767fd794684de9164e7ff602deb235cc08000203315f70a6ad19fd18316ffdc918adb8d66173b572c86190534abd4ba4c67860dd6d02fc42be07e9e7bc9f6cd1767fd794684de9164e7f9404dfb235e10bb402000000000024020000001f05000369050103690502020000001003210316034c0317031a053d036d0342000000070a00000002cafe';
            const pk = 'p2pk66tej1sH5x3q6nKJPRQzrwdNLZaEJ7pxJF6PqxFnDtnoLwxASPC';
            const sig = 'p2sigagM3BrzRFALwKGP18QdzJ9SxBwu5S71QLBgcT1TRTJS2xgjFXJfa5tsaYBeH4V2awuKYHouqo19RLDAzMHY6Xo2H1APy5'

            const response = await verifySignature(message, pk, sig);
            expect(response).toBeTruthy()

            done();
        });

        it('Should succesfully validate signature for P256 curve when signature has generic prefix', async (done) => {
            const message = '03cb87b51ef159103aabe530068d82ca0eb92e7599fd3626a7c8d3239c527d37086b02fc42be07e9e7bc9f6cd1767fd794684de9164e7ff602deb235cc08000203315f70a6ad19fd18316ffdc918adb8d66173b572c86190534abd4ba4c67860dd6d02fc42be07e9e7bc9f6cd1767fd794684de9164e7f9404dfb235e10bb402000000000024020000001f05000369050103690502020000001003210316034c0317031a053d036d0342000000070a00000002cafe';
            const pk = 'p2pk66tej1sH5x3q6nKJPRQzrwdNLZaEJ7pxJF6PqxFnDtnoLwxASPC';
            const sig = 'sigbN8C6mSKnEJUP1ckQp7CngfZoHfpLgbBtQqE3Z28Er9VRQww9FaLoiTHMF83dHTGKsoXDZyWJ3q3wXFFkqLfG6gF4HMQW'

            const response = await verifySignature(message, pk, sig);
            expect(response).toBeTruthy()

            done();
        });

        it("Should return false if message and signature don't match", async (done) => {
            const message = '0322c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
            const pk = 'p2pk66tej1sH5x3q6nKJPRQzrwdNLZaEJ7pxJF6PqxFnDtnoLwxASPC';
            const sig = 'p2sigagM3BrzRFALwKGP18QdzJ9SxBwu5S71QLBgcT1TRTJS2xgjFXJfa5tsaYBeH4V2awuKYHouqo19RLDAzMHY6Xo2H1APy5'

            const response = await verifySignature(message, pk, sig);
            expect(response).toBeFalsy();

            done();
        });

        it("Should return false if message and signature don't match when signature has generic prefix", async (done) => {
            const message = '0322c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
            const pk = 'p2pk66tej1sH5x3q6nKJPRQzrwdNLZaEJ7pxJF6PqxFnDtnoLwxASPC';
            const sig = 'sigbN8C6mSKnEJUP1ckQp7CngfZoHfpLgbBtQqE3Z28Er9VRQww9FaLoiTHMF83dHTGKsoXDZyWJ3q3wXFFkqLfG6gF4HMQW'

            const response = await verifySignature(message, pk, sig);
            expect(response).toBeFalsy();

            done();
        });

        it("Should return false if public key doesn't match", async (done) => {
            const message = '03cb87b51ef159103aabe530068d82ca0eb92e7599fd3626a7c8d3239c527d37086b02fc42be07e9e7bc9f6cd1767fd794684de9164e7ff602deb235cc08000203315f70a6ad19fd18316ffdc918adb8d66173b572c86190534abd4ba4c67860dd6d02fc42be07e9e7bc9f6cd1767fd794684de9164e7f9404dfb235e10bb402000000000024020000001f05000369050103690502020000001003210316034c0317031a053d036d0342000000070a00000002cafe';
            const pk = 'p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV';
            const sig = 'p2sigagM3BrzRFALwKGP18QdzJ9SxBwu5S71QLBgcT1TRTJS2xgjFXJfa5tsaYBeH4V2awuKYHouqo19RLDAzMHY6Xo2H1APy5'

            const response = await verifySignature(message, pk, sig);
            expect(response).toBeFalsy();

            done();
        });

        it("Should return false if public key doesn't match when signature has generic prefix", async (done) => {
            const message = '03cb87b51ef159103aabe530068d82ca0eb92e7599fd3626a7c8d3239c527d37086b02fc42be07e9e7bc9f6cd1767fd794684de9164e7ff602deb235cc08000203315f70a6ad19fd18316ffdc918adb8d66173b572c86190534abd4ba4c67860dd6d02fc42be07e9e7bc9f6cd1767fd794684de9164e7f9404dfb235e10bb402000000000024020000001f05000369050103690502020000001003210316034c0317031a053d036d0342000000070a00000002cafe';
            const pk = 'p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV';
            const sig = 'sigbN8C6mSKnEJUP1ckQp7CngfZoHfpLgbBtQqE3Z28Er9VRQww9FaLoiTHMF83dHTGKsoXDZyWJ3q3wXFFkqLfG6gF4HMQW'

            const response = await verifySignature(message, pk, sig);
            expect(response).toBeFalsy();

            done();
        });

        it('Should throw if the public key format is invalid', async (done) => {
            const message = '03cb87b51ef159103aabe530068d82ca0eb92e7599fd3626a7c8d3239c527d37086b02fc42be07e9e7bc9f6cd1767fd794684de9164e7ff602deb235cc08000203315f70a6ad19fd18316ffdc918adb8d66173b572c86190534abd4ba4c67860dd6d02fc42be07e9e7bc9f6cd1767fd794684de9164e7f9404dfb235e10bb402000000000024020000001f05000369050103690502020000001003210316034c0317031a053d036d0342000000070a00000002cafe';
            const pk = 'p2pk6tej1sH5x3q6nKJPRQzrwdNLZaEJ7pxJF6PqxFnDtnoLwxASPC';
            const sig = 'p2sigagM3BrzRFALwKGP18QdzJ9SxBwu5S71QLBgcT1TRTJS2xgjFXJfa5tsaYBeH4V2awuKYHouqo19RLDAzMHY6Xo2H1APy5'

            try {
                await verifySignature(message, pk, sig)
            } catch (err) {
                expect(err).toBeInstanceOf(InvalidPublicKeyError)
            }

            done();
        });

        it('Should throw if the signature does not have a valid prefix', async (done) => {
            const message = '03cb87b51ef159103aabe530068d82ca0eb92e7599fd3626a7c8d3239c527d37086b02fc42be07e9e7bc9f6cd1767fd794684de9164e7ff602deb235cc08000203315f70a6ad19fd18316ffdc918adb8d66173b572c86190534abd4ba4c67860dd6d02fc42be07e9e7bc9f6cd1767fd794684de9164e7f9404dfb235e10bb402000000000024020000001f05000369050103690502020000001003210316034c0317031a053d036d0342000000070a00000002cafe';
            const pk = 'p2pk66tej1sH5x3q6nKJPRQzrwdNLZaEJ7pxJF6PqxFnDtnoLwxASPC';
            const sig = 't2sigagM3BrzRFALwKGP18QdzJ9SxBwu5S71QLBgcT1TRTJS2xgjFXJfa5tsaYBeH4V2awuKYHouqo19RLDAzMHY6Xo2H1APy5'

            try {
                await verifySignature(message, pk, sig)
            } catch (err) {
                expect(err).toBeInstanceOf(InvalidSignatureError)
            }

            done();
        });
    });

    describe('ED25519 curve', () => {
        it('Should succesfully validate signature', async (done) => {
            const message = '039a0dc8355685fc5f7031495dd9361dae2c2c3c48868afb590efe07529ea32d1d6c004ae9ee0aa42817b42a3939a0b99ab8f72c035f6d9804caa320b5120200010f9ea64ac1c6dc91458c13ae950911e5edb3d4bf00ff00000000070a00000002cafe';
            const pk = 'edpkuHBANnEDH17ZPrwmXVq3XDY72u6B4q7rLqSmWqD1ZwKUGGVLyc';
            const sig = 'edsigtZAr36wyLRsSsCdbXY2gwfyqVGL7QFaHEbSryhdU3By6Na7X1uwNNpZXD7GGrAk6QrRVb87TPrtf2PSvBfd2iY99h3JnHk'

            const response = await verifySignature(message, pk, sig);
            expect(response).toBeTruthy()

            done();
        });

        it('Should succesfully validate signature when signature has generic prefix', async (done) => {
            const message = '039a0dc8355685fc5f7031495dd9361dae2c2c3c48868afb590efe07529ea32d1d6c004ae9ee0aa42817b42a3939a0b99ab8f72c035f6d9804caa320b5120200010f9ea64ac1c6dc91458c13ae950911e5edb3d4bf00ff00000000070a00000002cafe';
            const pk = 'edpkuHBANnEDH17ZPrwmXVq3XDY72u6B4q7rLqSmWqD1ZwKUGGVLyc';
            const sig = 'sigPMNv3j54VgQp1eJPWBVzNhKiSFBRchgruh8FMdV2qx94kAvX22HHmKcAWeUkhZjyJwsfcL6ZEvtHbQiXXH4XV53paEUGE'

            const response = await verifySignature(message, pk, sig);
            expect(response).toBeTruthy()

            done();
        });

        it("Should return false if message and signature don't match", async (done) => {
            const message = '039a1dc8355685fc5f7031495dd9361dae2c2c3c48868afb590efe07529ea32d1d6c004ae9ee0aa42817b42a3939a0b99ab8f72c035f6d9804caa320b5120200010f9ea64ac1c6dc91458c13ae950911e5edb3d4bf00ff00000000070a00000002cafe';
            const pk = 'edpkuHBANnEDH17ZPrwmXVq3XDY72u6B4q7rLqSmWqD1ZwKUGGVLyc';
            const sig = 'edsigtZAr36wyLRsSsCdbXY2gwfyqVGL7QFaHEbSryhdU3By6Na7X1uwNNpZXD7GGrAk6QrRVb87TPrtf2PSvBfd2iY99h3JnHk'

            const response = await verifySignature(message, pk, sig);
            expect(response).toBeFalsy();

            done();
        });

        it("Should return false if message and signature don't match when signature has generic prefix", async (done) => {
            const message = '039a1dc8355685fc5f7031495dd9361dae2c2c3c48868afb590efe07529ea32d1d6c004ae9ee0aa42817b42a3939a0b99ab8f72c035f6d9804caa320b5120200010f9ea64ac1c6dc91458c13ae950911e5edb3d4bf00ff00000000070a00000002cafe';
            const pk = 'edpkuHBANnEDH17ZPrwmXVq3XDY72u6B4q7rLqSmWqD1ZwKUGGVLyc';
            const sig = 'sigPMNv3j54VgQp1eJPWBVzNhKiSFBRchgruh8FMdV2qx94kAvX22HHmKcAWeUkhZjyJwsfcL6ZEvtHbQiXXH4XV53paEUGE'

            const response = await verifySignature(message, pk, sig);
            expect(response).toBeFalsy();

            done();
        });

        it("Should return false if public key doesn't match", async (done) => {
            const message = '039a0dc8355685fc5f7031495dd9361dae2c2c3c48868afb590efe07529ea32d1d6c004ae9ee0aa42817b42a3939a0b99ab8f72c035f6d9804caa320b5120200010f9ea64ac1c6dc91458c13ae950911e5edb3d4bf00ff00000000070a00000002cafe';
            const pk = 'edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t';
            const sig = 'edsigtZAr36wyLRsSsCdbXY2gwfyqVGL7QFaHEbSryhdU3By6Na7X1uwNNpZXD7GGrAk6QrRVb87TPrtf2PSvBfd2iY99h3JnHk'

            const response = await verifySignature(message, pk, sig);
            expect(response).toBeFalsy();

            done();
        });

        it("Should return false if public key doesn't match when signature has generic prefix", async (done) => {
            const message = '039a0dc8355685fc5f7031495dd9361dae2c2c3c48868afb590efe07529ea32d1d6c004ae9ee0aa42817b42a3939a0b99ab8f72c035f6d9804caa320b5120200010f9ea64ac1c6dc91458c13ae950911e5edb3d4bf00ff00000000070a00000002cafe';
            const pk = 'edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t';
            const sig = 'sigPMNv3j54VgQp1eJPWBVzNhKiSFBRchgruh8FMdV2qx94kAvX22HHmKcAWeUkhZjyJwsfcL6ZEvtHbQiXXH4XV53paEUGE'

            const response = await verifySignature(message, pk, sig);
            expect(response).toBeFalsy();

            done();
        });

        it('Should throw if the public key format is invalid', async (done) => {
            const message = '039a0dc8355685fc5f7031495dd9361dae2c2c3c48868afb590efe07529ea32d1d6c004ae9ee0aa42817b42a3939a0b99ab8f72c035f6d9804caa320b5120200010f9ea64ac1c6dc91458c13ae950911e5edb3d4bf00ff00000000070a00000002cafe';
            const pk = 'edpkuHBANnEDH17ZPrwmXVq3XDY72ou6B4q7rLqSmWqD1ZwKUGGVLyc';
            const sig = 'edsigtZAr36wyLRsSsCdbXY2gwfyqVGL7QFaHEbSryhdU3By6Na7X1uwNNpZXD7GGrAk6QrRVb87TPrtf2PSvBfd2iY99h3JnHk'

            try {
                await verifySignature(message, pk, sig)
            } catch (err) {
                expect(err).toBeInstanceOf(InvalidPublicKeyError)
            }

            done();
        });

        it('Should throw if the signature does not have a valid prefix', async (done) => {
            const message = '039a0dc8355685fc5f7031495dd9361dae2c2c3c48868afb590efe07529ea32d1d6c004ae9ee0aa42817b42a3939a0b99ab8f72c035f6d9804caa320b5120200010f9ea64ac1c6dc91458c13ae950911e5edb3d4bf00ff00000000070a00000002cafe';
            const pk = 'edpkuHBANnEDH17ZPrwmXVq3XDY72u6B4q7rLqSmWqD1ZwKUGGVLyc';
            const sig = 'esigtZAr36wyLRsSsCdbXY2gwfyqVGL7QFaHEbSryhdU3By6Na7X1uwNNpZXD7GGrAk6QrRVb87TPrtf2PSvBfd2iY99h3JnHk'

            try {
                await verifySignature(message, pk, sig)
            } catch (err) {
                expect(err).toBeInstanceOf(InvalidSignatureError)
            }

            done();
        });
    });
})