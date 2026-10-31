import { verifySignature } from '../src/verify-signature';
import { b58DecodeAndCheckPrefix, b58Encode, PrefixV2 } from '../src/taquito-utils';
import { InvalidMessageError, InvalidPublicKeyError, InvalidSignatureError } from '@taquito/core';
import blsFixture from '../../../test-fixtures/bls-aggregate-proofs.json';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';
import { vi } from 'vitest';

describe('utils signature validation tests', () => {
  describe('SECP256K1 curve', () => {
    it('Should successfully validate signature', () => {
      const message =
        '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
      const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
      const sig =
        'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx';

      expect(verifySignature(message, pk, sig)).toBeTruthy();
    });

    it('Should successfully validate signature when signature has generic prefix', () => {
      const message =
        '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
      const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
      const sig =
        'sigtofRkQAsLW8ne1HcGhbuBg2Ja2Yt9A2gfpwZFBsdjRWLPSVVqN9BVRpGr7DMwz1e4WjyF8iAjpf1LKyZMcJTSPrDaRzsx';

      expect(verifySignature(message, pk, sig)).toBeTruthy();
    });

    it("Should return false if message and signature don't match", () => {
      const message =
        '0322c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
      const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
      const sig =
        'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx';

      expect(verifySignature(message, pk, sig)).toBeFalsy();
    });

    it("Should return false if message and signature don't match when signature has generic prefix", () => {
      const message =
        '0322c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
      const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
      const sig =
        'sigtofRkQAsLW8ne1HcGhbuBg2Ja2Yt9A2gfpwZFBsdjRWLPSVVqN9BVRpGr7DMwz1e4WjyF8iAjpf1LKyZMcJTSPrDaRzsx';

      expect(verifySignature(message, pk, sig)).toBeFalsy();
    });

    it("Should return false if public key doesn't match", () => {
      const message =
        '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
      const pk = 'sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH';
      const sig =
        'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx';

      expect(verifySignature(message, pk, sig)).toBeFalsy();
    });

    it("Should return false if public key doesn't match when signature has generic prefix", () => {
      const message =
        '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
      const pk = 'sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH';
      const sig =
        'sigtofRkQAsLW8ne1HcGhbuBg2Ja2Yt9A2gfpwZFBsdjRWLPSVVqN9BVRpGr7DMwz1e4WjyF8iAjpf1LKyZMcJTSPrDaRzsx';

      expect(verifySignature(message, pk, sig)).toBeFalsy();
    });

    it('Should throw if the public key format is invalid', () => {
      const message =
        '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
      const pk = 'sppk7c4hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
      const sig =
        'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx';

      expect(() => verifySignature(message, pk, sig)).toThrow(InvalidPublicKeyError);
    });

    it('Should throw if the signature does not have a valid prefix', () => {
      const message =
        '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
      const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
      const sig =
        'ssig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx';

      expect(() => verifySignature(message, pk, sig)).toThrow(InvalidSignatureError);
    });
  });

  describe('SECP256K1 curve', () => {
    it('Should successfully validate signature for P256 curve', () => {
      const message =
        '03cb87b51ef159103aabe530068d82ca0eb92e7599fd3626a7c8d3239c527d37086b02fc42be07e9e7bc9f6cd1767fd794684de9164e7ff602deb235cc08000203315f70a6ad19fd18316ffdc918adb8d66173b572c86190534abd4ba4c67860dd6d02fc42be07e9e7bc9f6cd1767fd794684de9164e7f9404dfb235e10bb402000000000024020000001f05000369050103690502020000001003210316034c0317031a053d036d0342000000070a00000002cafe';
      const pk = 'p2pk66tej1sH5x3q6nKJPRQzrwdNLZaEJ7pxJF6PqxFnDtnoLwxASPC';
      const sig =
        'p2sigagM3BrzRFALwKGP18QdzJ9SxBwu5S71QLBgcT1TRTJS2xgjFXJfa5tsaYBeH4V2awuKYHouqo19RLDAzMHY6Xo2H1APy5';

      expect(verifySignature(message, pk, sig)).toBeTruthy();
    });

    it('Should successfully validate signature for P256 curve when signature has generic prefix', () => {
      const message =
        '03cb87b51ef159103aabe530068d82ca0eb92e7599fd3626a7c8d3239c527d37086b02fc42be07e9e7bc9f6cd1767fd794684de9164e7ff602deb235cc08000203315f70a6ad19fd18316ffdc918adb8d66173b572c86190534abd4ba4c67860dd6d02fc42be07e9e7bc9f6cd1767fd794684de9164e7f9404dfb235e10bb402000000000024020000001f05000369050103690502020000001003210316034c0317031a053d036d0342000000070a00000002cafe';
      const pk = 'p2pk66tej1sH5x3q6nKJPRQzrwdNLZaEJ7pxJF6PqxFnDtnoLwxASPC';
      const sig =
        'sigbN8C6mSKnEJUP1ckQp7CngfZoHfpLgbBtQqE3Z28Er9VRQww9FaLoiTHMF83dHTGKsoXDZyWJ3q3wXFFkqLfG6gF4HMQW';

      expect(verifySignature(message, pk, sig)).toBeTruthy();
    });

    it("Should return false if message and signature don't match", () => {
      const message =
        '0322c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
      const pk = 'p2pk66tej1sH5x3q6nKJPRQzrwdNLZaEJ7pxJF6PqxFnDtnoLwxASPC';
      const sig =
        'p2sigagM3BrzRFALwKGP18QdzJ9SxBwu5S71QLBgcT1TRTJS2xgjFXJfa5tsaYBeH4V2awuKYHouqo19RLDAzMHY6Xo2H1APy5';

      expect(verifySignature(message, pk, sig)).toBeFalsy();
    });

    it("Should return false if message and signature don't match when signature has generic prefix", () => {
      const message =
        '0322c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
      const pk = 'p2pk66tej1sH5x3q6nKJPRQzrwdNLZaEJ7pxJF6PqxFnDtnoLwxASPC';
      const sig =
        'sigbN8C6mSKnEJUP1ckQp7CngfZoHfpLgbBtQqE3Z28Er9VRQww9FaLoiTHMF83dHTGKsoXDZyWJ3q3wXFFkqLfG6gF4HMQW';

      expect(verifySignature(message, pk, sig)).toBeFalsy();
    });

    it("Should return false if public key doesn't match", () => {
      const message =
        '03cb87b51ef159103aabe530068d82ca0eb92e7599fd3626a7c8d3239c527d37086b02fc42be07e9e7bc9f6cd1767fd794684de9164e7ff602deb235cc08000203315f70a6ad19fd18316ffdc918adb8d66173b572c86190534abd4ba4c67860dd6d02fc42be07e9e7bc9f6cd1767fd794684de9164e7f9404dfb235e10bb402000000000024020000001f05000369050103690502020000001003210316034c0317031a053d036d0342000000070a00000002cafe';
      const pk = 'p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV';
      const sig =
        'p2sigagM3BrzRFALwKGP18QdzJ9SxBwu5S71QLBgcT1TRTJS2xgjFXJfa5tsaYBeH4V2awuKYHouqo19RLDAzMHY6Xo2H1APy5';

      expect(verifySignature(message, pk, sig)).toBeFalsy();
    });

    it("Should return false if public key doesn't match when signature has generic prefix", () => {
      const message =
        '03cb87b51ef159103aabe530068d82ca0eb92e7599fd3626a7c8d3239c527d37086b02fc42be07e9e7bc9f6cd1767fd794684de9164e7ff602deb235cc08000203315f70a6ad19fd18316ffdc918adb8d66173b572c86190534abd4ba4c67860dd6d02fc42be07e9e7bc9f6cd1767fd794684de9164e7f9404dfb235e10bb402000000000024020000001f05000369050103690502020000001003210316034c0317031a053d036d0342000000070a00000002cafe';
      const pk = 'p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV';
      const sig =
        'sigbN8C6mSKnEJUP1ckQp7CngfZoHfpLgbBtQqE3Z28Er9VRQww9FaLoiTHMF83dHTGKsoXDZyWJ3q3wXFFkqLfG6gF4HMQW';

      expect(verifySignature(message, pk, sig)).toBeFalsy();
    });

    it('Should throw if the public key format is invalid', () => {
      const message =
        '03cb87b51ef159103aabe530068d82ca0eb92e7599fd3626a7c8d3239c527d37086b02fc42be07e9e7bc9f6cd1767fd794684de9164e7ff602deb235cc08000203315f70a6ad19fd18316ffdc918adb8d66173b572c86190534abd4ba4c67860dd6d02fc42be07e9e7bc9f6cd1767fd794684de9164e7f9404dfb235e10bb402000000000024020000001f05000369050103690502020000001003210316034c0317031a053d036d0342000000070a00000002cafe';
      const pk = 'p2pk6tej1sH5x3q6nKJPRQzrwdNLZaEJ7pxJF6PqxFnDtnoLwxASPC';
      const sig =
        'p2sigagM3BrzRFALwKGP18QdzJ9SxBwu5S71QLBgcT1TRTJS2xgjFXJfa5tsaYBeH4V2awuKYHouqo19RLDAzMHY6Xo2H1APy5';

      expect(() => verifySignature(message, pk, sig)).toThrow(InvalidPublicKeyError);
    });

    it('Should throw if the signature does not have a valid prefix', () => {
      const message =
        '03cb87b51ef159103aabe530068d82ca0eb92e7599fd3626a7c8d3239c527d37086b02fc42be07e9e7bc9f6cd1767fd794684de9164e7ff602deb235cc08000203315f70a6ad19fd18316ffdc918adb8d66173b572c86190534abd4ba4c67860dd6d02fc42be07e9e7bc9f6cd1767fd794684de9164e7f9404dfb235e10bb402000000000024020000001f05000369050103690502020000001003210316034c0317031a053d036d0342000000070a00000002cafe';
      const pk = 'p2pk66tej1sH5x3q6nKJPRQzrwdNLZaEJ7pxJF6PqxFnDtnoLwxASPC';
      const sig =
        't2sigagM3BrzRFALwKGP18QdzJ9SxBwu5S71QLBgcT1TRTJS2xgjFXJfa5tsaYBeH4V2awuKYHouqo19RLDAzMHY6Xo2H1APy5';

      expect(() => verifySignature(message, pk, sig)).toThrow(InvalidSignatureError);
    });
  });

  describe('ED25519 curve', () => {
    it('Should successfully validate signature', () => {
      const message =
        '039a0dc8355685fc5f7031495dd9361dae2c2c3c48868afb590efe07529ea32d1d6c004ae9ee0aa42817b42a3939a0b99ab8f72c035f6d9804caa320b5120200010f9ea64ac1c6dc91458c13ae950911e5edb3d4bf00ff00000000070a00000002cafe';
      const pk = 'edpkuHBANnEDH17ZPrwmXVq3XDY72u6B4q7rLqSmWqD1ZwKUGGVLyc';
      const sig =
        'edsigtZAr36wyLRsSsCdbXY2gwfyqVGL7QFaHEbSryhdU3By6Na7X1uwNNpZXD7GGrAk6QrRVb87TPrtf2PSvBfd2iY99h3JnHk';

      expect(verifySignature(message, pk, sig)).toBeTruthy();
    });

    it('Should successfully validate signature when signature has generic prefix', () => {
      const message =
        '039a0dc8355685fc5f7031495dd9361dae2c2c3c48868afb590efe07529ea32d1d6c004ae9ee0aa42817b42a3939a0b99ab8f72c035f6d9804caa320b5120200010f9ea64ac1c6dc91458c13ae950911e5edb3d4bf00ff00000000070a00000002cafe';
      const pk = 'edpkuHBANnEDH17ZPrwmXVq3XDY72u6B4q7rLqSmWqD1ZwKUGGVLyc';
      const sig =
        'sigPMNv3j54VgQp1eJPWBVzNhKiSFBRchgruh8FMdV2qx94kAvX22HHmKcAWeUkhZjyJwsfcL6ZEvtHbQiXXH4XV53paEUGE';

      expect(verifySignature(message, pk, sig)).toBeTruthy();
    });

    it("Should return false if message and signature don't match", () => {
      const message =
        '039a1dc8355685fc5f7031495dd9361dae2c2c3c48868afb590efe07529ea32d1d6c004ae9ee0aa42817b42a3939a0b99ab8f72c035f6d9804caa320b5120200010f9ea64ac1c6dc91458c13ae950911e5edb3d4bf00ff00000000070a00000002cafe';
      const pk = 'edpkuHBANnEDH17ZPrwmXVq3XDY72u6B4q7rLqSmWqD1ZwKUGGVLyc';
      const sig =
        'edsigtZAr36wyLRsSsCdbXY2gwfyqVGL7QFaHEbSryhdU3By6Na7X1uwNNpZXD7GGrAk6QrRVb87TPrtf2PSvBfd2iY99h3JnHk';

      expect(verifySignature(message, pk, sig)).toBeFalsy();
    });

    it("Should return false if message and signature don't match when signature has generic prefix", () => {
      const message =
        '039a1dc8355685fc5f7031495dd9361dae2c2c3c48868afb590efe07529ea32d1d6c004ae9ee0aa42817b42a3939a0b99ab8f72c035f6d9804caa320b5120200010f9ea64ac1c6dc91458c13ae950911e5edb3d4bf00ff00000000070a00000002cafe';
      const pk = 'edpkuHBANnEDH17ZPrwmXVq3XDY72u6B4q7rLqSmWqD1ZwKUGGVLyc';
      const sig =
        'sigPMNv3j54VgQp1eJPWBVzNhKiSFBRchgruh8FMdV2qx94kAvX22HHmKcAWeUkhZjyJwsfcL6ZEvtHbQiXXH4XV53paEUGE';

      expect(verifySignature(message, pk, sig)).toBeFalsy();
    });

    it("Should return false if public key doesn't match", () => {
      const message =
        '039a0dc8355685fc5f7031495dd9361dae2c2c3c48868afb590efe07529ea32d1d6c004ae9ee0aa42817b42a3939a0b99ab8f72c035f6d9804caa320b5120200010f9ea64ac1c6dc91458c13ae950911e5edb3d4bf00ff00000000070a00000002cafe';
      const pk = 'edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t';
      const sig =
        'edsigtZAr36wyLRsSsCdbXY2gwfyqVGL7QFaHEbSryhdU3By6Na7X1uwNNpZXD7GGrAk6QrRVb87TPrtf2PSvBfd2iY99h3JnHk';

      expect(verifySignature(message, pk, sig)).toBeFalsy();
    });

    it("Should return false if public key doesn't match when signature has generic prefix", () => {
      const message =
        '039a0dc8355685fc5f7031495dd9361dae2c2c3c48868afb590efe07529ea32d1d6c004ae9ee0aa42817b42a3939a0b99ab8f72c035f6d9804caa320b5120200010f9ea64ac1c6dc91458c13ae950911e5edb3d4bf00ff00000000070a00000002cafe';
      const pk = 'edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t';
      const sig =
        'sigPMNv3j54VgQp1eJPWBVzNhKiSFBRchgruh8FMdV2qx94kAvX22HHmKcAWeUkhZjyJwsfcL6ZEvtHbQiXXH4XV53paEUGE';

      expect(verifySignature(message, pk, sig)).toBeFalsy();
    });

    it('Should throw if the public key format is invalid', () => {
      const message =
        '039a0dc8355685fc5f7031495dd9361dae2c2c3c48868afb590efe07529ea32d1d6c004ae9ee0aa42817b42a3939a0b99ab8f72c035f6d9804caa320b5120200010f9ea64ac1c6dc91458c13ae950911e5edb3d4bf00ff00000000070a00000002cafe';
      const pk = 'edpkuHBANnEDH17ZPrwmXVq3XDY72ou6B4q7rLqSmWqD1ZwKUGGVLyc';
      const sig =
        'edsigtZAr36wyLRsSsCdbXY2gwfyqVGL7QFaHEbSryhdU3By6Na7X1uwNNpZXD7GGrAk6QrRVb87TPrtf2PSvBfd2iY99h3JnHk';

      expect(() => verifySignature(message, pk, sig)).toThrow(InvalidPublicKeyError);
    });

    it('Should throw if the signature does not have a valid prefix', () => {
      const message =
        '039a0dc8355685fc5f7031495dd9361dae2c2c3c48868afb590efe07529ea32d1d6c004ae9ee0aa42817b42a3939a0b99ab8f72c035f6d9804caa320b5120200010f9ea64ac1c6dc91458c13ae950911e5edb3d4bf00ff00000000070a00000002cafe';
      const pk = 'edpkuHBANnEDH17ZPrwmXVq3XDY72u6B4q7rLqSmWqD1ZwKUGGVLyc';
      const sig =
        'esigtZAr36wyLRsSsCdbXY2gwfyqVGL7QFaHEbSryhdU3By6Na7X1uwNNpZXD7GGrAk6QrRVb87TPrtf2PSvBfd2iY99h3JnHk';

      expect(() => verifySignature(message, pk, sig)).toThrow(InvalidSignatureError);
    });
  });

  describe('Invalid cases', () => {
    it('Should throw InvalidMessageError if the message is an empty string', () => {
      const message = '';
      const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
      const sig =
        'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx';

      expect(() => verifySignature(message, pk, sig)).toThrow(InvalidMessageError);
    });

    it('Should throw InvalidPublicKeyError if the public key is an empty string', () => {
      const message =
        '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
      const pk = '';
      const sig =
        'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx';

      expect(() => verifySignature(message, pk, sig)).toThrow(InvalidPublicKeyError);
    });

    it('Should throw InvalidPublicKeyError if the prefix of the public key is unknown', () => {
      const message =
        '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
      const pk = 'rppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
      const sig =
        'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx';

      expect(() => verifySignature(message, pk, sig)).toThrow(InvalidPublicKeyError);
    });

    it('Should throw InvalidPublicKeyError if the public key is invalid', () => {
      const message =
        '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
      const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHw8JAT4e14KJwzoey';
      const sig =
        'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx';

      expect(() => verifySignature(message, pk, sig)).toThrow(InvalidPublicKeyError);
    });

    it('Should throw InvalidSignatureError if the prefix of the signature is unknown', () => {
      const message =
        '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
      const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
      const sig =
        'spesig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx';

      expect(() => verifySignature(message, pk, sig)).toThrow(InvalidSignatureError);
    });

    it('Should throw InvalidSignatureError if the checksum of the signature is invalid', () => {
      const message =
        '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
      const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
      const sig =
        'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47';

      expect(() => verifySignature(message, pk, sig)).toThrow(InvalidSignatureError);
    });
  });

  describe('verifyProofOfPossession', () => {
    it('Should successfully validate pop signature', () => {
      const pk = 'BLpk1qzd7m4PibCB3tgSLU265g3cuB8kqp1CtvdtVfZu2UQLMYRmJDSN6nPhxnAYCBbnuoRMsfRB';
      const [data] = b58DecodeAndCheckPrefix(pk, [PrefixV2.BLS12_381PublicKey]);
      const sig =
        'BLsig9X9PUJ7igNjt5cJC1ZbkfPxBxMwbmAfDUkYf1Mk3nUGS8aSvTFch93nENYSf8wACohcg1NpByVRBJoao4RKF23j3kpLurSkNhoQqA2aeyrxq7bD66kdEhJVV6C723t2ExQpYS3d25';
      expect(verifySignature(data, pk, sig, undefined, true)).toBeTruthy();
    });

    it('Validates Octez v25.3 self proofs, aggregate proofs, and point subgroup edge cases', () => {
      const [m0, m1] = blsFixture.members;
      const aggregatePk = blsFixture.aggregate.public_key;

      const [m0PkBytes] = b58DecodeAndCheckPrefix(m0.publicKey, [PrefixV2.BLS12_381PublicKey]);
      const [m1PkBytes] = b58DecodeAndCheckPrefix(m1.publicKey, [PrefixV2.BLS12_381PublicKey]);
      const [aggPkBytes] = b58DecodeAndCheckPrefix(aggregatePk, [PrefixV2.BLS12_381PublicKey]);

      expect(verifySignature(m0PkBytes, m0.publicKey, m0.selfProof, undefined, true)).toBe(true);
      expect(verifySignature(m1PkBytes, m1.publicKey, m1.selfProof, undefined, true)).toBe(true);

      // Override proof is signed over aggregate public key bytes, so it fails against self pk bytes
      expect(verifySignature(m0PkBytes, m0.publicKey, m0.overrideProof, undefined, true)).toBe(false);
      expect(verifySignature(m1PkBytes, m1.publicKey, m1.overrideProof, undefined, true)).toBe(false);

      // Verify override proofs against aggregate public key bytes with member public keys
      expect(verifySignature(aggPkBytes, m0.publicKey, m0.overrideProof, undefined, true)).toBe(true);
      expect(verifySignature(aggPkBytes, m1.publicKey, m1.overrideProof, undefined, true)).toBe(true);

      // Aggregate proof validates against aggregate public key
      expect(verifySignature(aggPkBytes, aggregatePk, blsFixture.aggregateProof, undefined, true)).toBe(true);

      // Point validation edge cases from Octez fixture
      const infinityPoint = blsFixture.points.find((p) => p.label === 'infinity')!;
      const [infPkBytes] = b58DecodeAndCheckPrefix(infinityPoint.publicKey, [
        PrefixV2.BLS12_381PublicKey,
      ]);
      // Member 0's override PoP over the infinity public key is valid against m0.publicKey,
      // while G1.ZERO itself is rejected as a verifier public key.
      expect(verifySignature(infPkBytes, m0.publicKey, infinityPoint.proof!, undefined, true)).toBe(
        true
      );
      expect(
        verifySignature(infPkBytes, infinityPoint.publicKey, infinityPoint.proof!, undefined, true)
      ).toBe(false);

      for (const badPoint of blsFixture.points.filter((p) => !p.accepted)) {
        const [badPkBytes] = b58DecodeAndCheckPrefix(badPoint.publicKey, [
          PrefixV2.BLS12_381PublicKey,
        ]);
        expect(verifySignature(badPkBytes, badPoint.publicKey, m0.selfProof, undefined, true)).toBe(
          false
        );
      }
    });
  });

  describe('BLS12-381 (tz4) signature verification and domain separation', () => {
    const pk = 'BLpk1oWB1ZbeKePu8FiRMpktQoZw1rPs67qu6zbnYxiCcJDyZih8PXUiGnLyMWR6Fay9cDNyCzj9';
    const otherPk = 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt';
    const messageHex = '01020304';
    const blsSig =
      'BLsigAMExDCYjNtvjLUqvLiEQJro6VrJFZ7yr7eNY4YCAVTYVerMnrNtk7cY8ve8D4HfJ55YtK93sQNFTcXTYGt8c6HutFneTz31aR198QkbBfZpHmvJV4zGQTHKroNFDRWLw3c3eJXyAu';
    const popSig =
      'BLsigAp94rBWCJU7yM7X5F4zSw15AKkW1JZ5dwkqa2Xjdo1y4jhcQKVf6Sh7GFV261MUEx3WbfStUkP83tmKRpAucD4NEo1bLCB3s1TM4ByDUYZ1vUV5qsAWFLagvbnHfn61DnouoxmTij';

    it('Validates BLS12-381 signature with BLsig prefix (hex and Uint8Array messages)', () => {
      expect(verifySignature(messageHex, pk, blsSig)).toBe(true);
      expect(verifySignature(new Uint8Array([1, 2, 3, 4]), pk, blsSig)).toBe(true);
    });

    it('Rejects wrong message, wrong public key, watermark mismatch, and domain-separated PoP signatures', () => {
      expect(verifySignature('01020305', pk, blsSig)).toBe(false);
      expect(verifySignature(messageHex, otherPk, blsSig)).toBe(false);
      expect(verifySignature(messageHex, pk, blsSig, new Uint8Array([3]))).toBe(false);

      // Domain separation: normal signature must not verify as PoP, and PoP must not verify as normal message
      const [pkBytes] = b58DecodeAndCheckPrefix(pk, [PrefixV2.BLS12_381PublicKey]);
      expect(verifySignature(pkBytes, pk, popSig, undefined, false)).toBe(false);
      expect(verifySignature(messageHex, pk, blsSig, undefined, true)).toBe(false);
    });

    it('Returns false on malformed G2 signature bytes and on the (G1.ZERO, G2.ZERO) identity pair', () => {
      const g1InfinityBytes = new Uint8Array(48);
      g1InfinityBytes[0] = 0xc0;
      const g1InfinityPk = b58Encode(g1InfinityBytes, PrefixV2.BLS12_381PublicKey);

      const g2InfinityBytes = new Uint8Array(96);
      g2InfinityBytes[0] = 0xc0;
      const g2InfinitySig = b58Encode(g2InfinityBytes, PrefixV2.BLS12_381Signature);

      // A naive pairing check without subgroup/identity rejection would accept (G1.ZERO, G2.ZERO)
      expect(verifySignature(messageHex, g1InfinityPk, g2InfinitySig, undefined, false)).toBe(
        false
      );
      expect(verifySignature(g1InfinityBytes, g1InfinityPk, g2InfinitySig, undefined, true)).toBe(
        false
      );
      expect(verifySignature(messageHex, pk, g2InfinitySig)).toBe(false);

      const nonCanonicalG2Bytes = new Uint8Array(96).fill(0xff);
      const nonCanonicalSig = b58Encode(nonCanonicalG2Bytes, PrefixV2.BLS12_381Signature);
      expect(verifySignature(messageHex, pk, nonCanonicalSig)).toBe(false);
    });
  });

  describe('Malformed, non-canonical, and Octez high-S ECDSA signature handling', () => {
    const secp256k1Order = BigInt(
      '0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141'
    );
    const p256Order = BigInt('0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551');

    const to32ByteBigEndian = (value: bigint): Uint8Array => {
      const hex = value.toString(16).padStart(64, '0');
      return new Uint8Array(Buffer.from(hex, 'hex'));
    };

    const buildSigWithComponents = (
      rBytes: Uint8Array,
      sBytes: Uint8Array,
      prefix: PrefixV2.Secp256k1Signature | PrefixV2.P256Signature
    ): string => {
      const raw = new Uint8Array(64);
      raw.set(rBytes, 0);
      raw.set(sBytes, 32);
      return b58Encode(raw, prefix);
    };

    it('Rejects high-S malleable, zero-component, and out-of-range secp256k1 signatures independently', () => {
      const message =
        '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
      const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
      const sig =
        'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx';

      // Positive control
      expect(verifySignature(message, pk, sig)).toBe(true);

      const [rawSig] = b58DecodeAndCheckPrefix(sig, [PrefixV2.Secp256k1Signature]);
      const validR = rawSig.subarray(0, 32);
      const validS = rawSig.subarray(32, 64);
      const s = BigInt('0x' + Buffer.from(validS).toString('hex'));

      // High-S malleable twin (s' = n - s) must be rejected for secp256k1 (libsecp256k1 / lowS:true)
      const highSSig = buildSigWithComponents(
        validR,
        to32ByteBigEndian(secp256k1Order - s),
        PrefixV2.Secp256k1Signature
      );
      expect(verifySignature(message, pk, highSSig)).toBe(false);

      // Independent component boundary checks
      expect(
        verifySignature(
          message,
          pk,
          buildSigWithComponents(new Uint8Array(32), validS, PrefixV2.Secp256k1Signature)
        )
      ).toBe(false);
      expect(
        verifySignature(
          message,
          pk,
          buildSigWithComponents(validR, new Uint8Array(32), PrefixV2.Secp256k1Signature)
        )
      ).toBe(false);
      expect(
        verifySignature(
          message,
          pk,
          buildSigWithComponents(
            to32ByteBigEndian(secp256k1Order),
            validS,
            PrefixV2.Secp256k1Signature
          )
        )
      ).toBe(false);
      expect(
        verifySignature(
          message,
          pk,
          buildSigWithComponents(
            validR,
            to32ByteBigEndian(secp256k1Order),
            PrefixV2.Secp256k1Signature
          )
        )
      ).toBe(false);
      // r in [n, p)
      expect(
        verifySignature(
          message,
          pk,
          buildSigWithComponents(
            to32ByteBigEndian(secp256k1Order + 1n),
            validS,
            PrefixV2.Secp256k1Signature
          )
        )
      ).toBe(false);
    });

    it('Rejects zero-component and out-of-range P-256 signatures independently while accepting valid Octez high-S P-256 signatures', () => {
      const message =
        '03cb87b51ef159103aabe530068d82ca0eb92e7599fd3626a7c8d3239c527d37086b02fc42be07e9e7bc9f6cd1767fd794684de9164e7ff602deb235cc08000203315f70a6ad19fd18316ffdc918adb8d66173b572c86190534abd4ba4c67860dd6d02fc42be07e9e7bc9f6cd1767fd794684de9164e7f9404dfb235e10bb402000000000024020000001f05000369050103690502020000001003210316034c0317031a053d036d0342000000070a00000002cafe';
      const pk = 'p2pk66tej1sH5x3q6nKJPRQzrwdNLZaEJ7pxJF6PqxFnDtnoLwxASPC';
      const sig =
        'p2sigagM3BrzRFALwKGP18QdzJ9SxBwu5S71QLBgcT1TRTJS2xgjFXJfa5tsaYBeH4V2awuKYHouqo19RLDAzMHY6Xo2H1APy5';

      // Positive control
      expect(verifySignature(message, pk, sig)).toBe(true);

      const [rawSig] = b58DecodeAndCheckPrefix(sig, [PrefixV2.P256Signature]);
      const validR = rawSig.subarray(0, 32);
      const validS = rawSig.subarray(32, 64);
      const s = BigInt('0x' + Buffer.from(validS).toString('hex'));

      // Octez Hacl.P256.sign does not normalize s <= n/2, and Hacl.P256.verify accepts high-S.
      // 1. High-S twin (n - s) of the existing vector:
      const highSTwinSig = buildSigWithComponents(
        validR,
        to32ByteBigEndian(p256Order - s),
        PrefixV2.P256Signature
      );
      expect(verifySignature(message, pk, highSTwinSig)).toBe(true);

      // 2. Genuine high-S signature produced directly by `octez-client --protocol PtSeouLouXkx sign bytes 0x031234` (Octez 25.2)
      // for p2sk2obfVMEuPUnadAConLWk7Tf4Dt3n4svSgJwrgpamRqJXvaYcg1 (p2pk66tTYL5EvahKAXncbtbRPBkAnxo3CszzUho5wPCgWauBMyvybuB):
      const octezHighSSig =
        'p2sigPq98UmduHmzWaE3uoizfxbAeNYDvCXpwUFRvXpQvyJNhdC7mZjAke9YWT61hMCNtqXUv2wNgT7VTb6snmoTsP9KCNwVn7';
      expect(
        verifySignature(
          '1234',
          'p2pk66tTYL5EvahKAXncbtbRPBkAnxo3CszzUho5wPCgWauBMyvybuB',
          octezHighSSig,
          new Uint8Array([3])
        )
      ).toBe(true);

      // Independent component boundary checks
      expect(
        verifySignature(
          message,
          pk,
          buildSigWithComponents(new Uint8Array(32), validS, PrefixV2.P256Signature)
        )
      ).toBe(false);
      expect(
        verifySignature(
          message,
          pk,
          buildSigWithComponents(validR, new Uint8Array(32), PrefixV2.P256Signature)
        )
      ).toBe(false);
      expect(
        verifySignature(
          message,
          pk,
          buildSigWithComponents(to32ByteBigEndian(p256Order), validS, PrefixV2.P256Signature)
        )
      ).toBe(false);
      expect(
        verifySignature(
          message,
          pk,
          buildSigWithComponents(validR, to32ByteBigEndian(p256Order), PrefixV2.P256Signature)
        )
      ).toBe(false);
      expect(
        verifySignature(
          message,
          pk,
          buildSigWithComponents(to32ByteBigEndian(p256Order + 1n), validS, PrefixV2.P256Signature)
        )
      ).toBe(false);
    });
  });

  describe('Noble curves v2 compatibility for @taquito/utils', () => {
    const resolveNobleCurvesV2Dir = (): string => {
      const req = createRequire(import.meta.url);
      const directEntryPath = req.resolve('@noble/curves/ed25519.js');
      const directDir = path.dirname(directEntryPath);
      const directPkg = JSON.parse(readFileSync(path.join(directDir, 'package.json'), 'utf8')) as {
        version: string;
      };
      if (Number(directPkg.version.split('.')[0]) >= 2) {
        return directDir;
      }
      const pqEntryPath = req.resolve('@noble/post-quantum/ml-dsa.js');
      const nestedEntryPath = createRequire(pqEntryPath).resolve('@noble/curves/ed25519.js');
      const nestedDir = path.dirname(nestedEntryPath);
      const nestedPkg = JSON.parse(readFileSync(path.join(nestedDir, 'package.json'), 'utf8')) as {
        version: string;
      };
      expect(Number(nestedPkg.version.split('.')[0])).toBeGreaterThanOrEqual(2);
      return nestedDir;
    };

    const hasExtensionlessCurveExports = (): boolean => {
      try {
        createRequire(import.meta.url).resolve('@noble/curves/secp256k1');
        return true;
      } catch {
        return false;
      }
    };

    const mockNobleCurvesV2 = () => {
      const v2Dir = resolveNobleCurvesV2Dir();
      const importV2 = (subpath: string) =>
        import(pathToFileURL(path.join(v2Dir, subpath)).href);

      const hasExtensionless = hasExtensionlessCurveExports();

      for (const curve of ['secp256k1', 'nist', 'ed25519', 'bls12-381']) {
        vi.doMock(`@noble/curves/${curve}.js`, () => importV2(`${curve}.js`));
        if (hasExtensionless) {
          vi.doMock(`@noble/curves/${curve}`, () => importV2(`${curve}.js`));
        }
      }
      vi.resetModules();
    };

    afterEach(() => {
      const hasExtensionless = hasExtensionlessCurveExports();
      for (const curve of ['secp256k1', 'nist', 'ed25519', 'bls12-381']) {
        vi.doUnmock(`@noble/curves/${curve}.js`);
        if (hasExtensionless) {
          vi.doUnmock(`@noble/curves/${curve}`);
        }
      }
      vi.resetModules();
    });

    it('uses explicit .js subpath specifiers for @noble/curves in verify-signature.ts and marks all 4 curve subpaths external in Rollup config', async () => {
      const pkgDir = path.resolve(__dirname, '..');
      const bareCurveSpecifier = /['"]@noble\/curves\/(secp256k1|nist|ed25519|bls12-381)['"]/g;
      const content = readFileSync(path.join(pkgDir, 'src/verify-signature.ts'), 'utf8');
      const matches = content.match(bareCurveSpecifier) ?? [];
      expect(
        matches,
        'src/verify-signature.ts contains extensionless @noble/curves specifiers'
      ).toEqual([]);

      const rollupConfigModule = await import('../rollup.config');
      const rollupConfig = rollupConfigModule.default as {
        external?: string[] | ((id: string) => boolean);
      };
      const isExternal = (id: string): boolean => {
        if (typeof rollupConfig.external === 'function') {
          return Boolean(rollupConfig.external(id));
        }
        return Array.isArray(rollupConfig.external) && rollupConfig.external.includes(id);
      };

      for (const subpath of [
        '@noble/curves/ed25519.js',
        '@noble/curves/secp256k1.js',
        '@noble/curves/nist.js',
        '@noble/curves/bls12-381.js',
      ]) {
        expect(isExternal(subpath), `${subpath} must be external in rollup.config.ts`).toBe(true);
      }
    });

    it('verifies tz2 (secp256k1) known-answer signatures under @noble/curves v2 without double-prehashing', async () => {
      mockNobleCurvesV2();
      const { verifySignature: v2VerifySignature } = await import('../src/verify-signature');

      expect(
        v2VerifySignature(
          '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001',
          'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey',
          'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx'
        )
      ).toBe(true);
    });

    it('verifies tz3 (P-256) low-S and Octez high-S signatures under @noble/curves v2', async () => {
      mockNobleCurvesV2();
      const { verifySignature: v2VerifySignature } = await import('../src/verify-signature');

      // Low-S P-256 vector (fails in v2 without prehash: false)
      expect(
        v2VerifySignature(
          '03cb87b51ef159103aabe530068d82ca0eb92e7599fd3626a7c8d3239c527d37086b02fc42be07e9e7bc9f6cd1767fd794684de9164e7ff602deb235cc08000203315f70a6ad19fd18316ffdc918adb8d66173b572c86190534abd4ba4c67860dd6d02fc42be07e9e7bc9f6cd1767fd794684de9164e7f9404dfb235e10bb402000000000024020000001f05000369050103690502020000001003210316034c0317031a053d036d0342000000070a00000002cafe',
          'p2pk66tej1sH5x3q6nKJPRQzrwdNLZaEJ7pxJF6PqxFnDtnoLwxASPC',
          'p2sigagM3BrzRFALwKGP18QdzJ9SxBwu5S71QLBgcT1TRTJS2xgjFXJfa5tsaYBeH4V2awuKYHouqo19RLDAzMHY6Xo2H1APy5'
        )
      ).toBe(true);

      // Genuine Octez 25.2 high-S P-256 signature (fails in v2 without BOTH prehash: false and lowS: false)
      expect(
        v2VerifySignature(
          '1234',
          'p2pk66tTYL5EvahKAXncbtbRPBkAnxo3CszzUho5wPCgWauBMyvybuB',
          'p2sigPq98UmduHmzWaE3uoizfxbAeNYDvCXpwUFRvXpQvyJNhdC7mZjAke9YWT61hMCNtqXUv2wNgT7VTb6snmoTsP9KCNwVn7',
          new Uint8Array([3])
        )
      ).toBe(true);
    });

    it('verifies tz1 (Ed25519) and tz4 (BLS12-381) signatures and aggregate proofs under @noble/curves v2', async () => {
      mockNobleCurvesV2();
      const { verifySignature: v2VerifySignature } = await import('../src/verify-signature');

      expect(
        v2VerifySignature(
          '039a0dc8355685fc5f7031495dd9361dae2c2c3c48868afb590efe07529ea32d1d6c004ae9ee0aa42817b42a3939a0b99ab8f72c035f6d9804caa320b5120200010f9ea64ac1c6dc91458c13ae950911e5edb3d4bf00ff00000000070a00000002cafe',
          'edpkuHBANnEDH17ZPrwmXVq3XDY72u6B4q7rLqSmWqD1ZwKUGGVLyc',
          'edsigtZAr36wyLRsSsCdbXY2gwfyqVGL7QFaHEbSryhdU3By6Na7X1uwNNpZXD7GGrAk6QrRVb87TPrtf2PSvBfd2iY99h3JnHk'
        )
      ).toBe(true);

      const [aggPkBytes] = b58DecodeAndCheckPrefix(blsFixture.aggregate.public_key, [
        PrefixV2.BLS12_381PublicKey,
      ]);
      expect(
        v2VerifySignature(
          '01020304',
          'BLpk1oWB1ZbeKePu8FiRMpktQoZw1rPs67qu6zbnYxiCcJDyZih8PXUiGnLyMWR6Fay9cDNyCzj9',
          'BLsigAMExDCYjNtvjLUqvLiEQJro6VrJFZ7yr7eNY4YCAVTYVerMnrNtk7cY8ve8D4HfJ55YtK93sQNFTcXTYGt8c6HutFneTz31aR198QkbBfZpHmvJV4zGQTHKroNFDRWLw3c3eJXyAu'
        )
      ).toBe(true);
      expect(
        v2VerifySignature(
          aggPkBytes,
          blsFixture.aggregate.public_key,
          blsFixture.aggregateProof,
          undefined,
          true
        )
      ).toBe(true);
    });
  });
});
