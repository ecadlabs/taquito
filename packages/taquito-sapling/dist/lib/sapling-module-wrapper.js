"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaplingWrapper = void 0;
const sapling = require("@airgap/sapling-wasm");
const random_1 = require("@stablelib/random");
const sapling_params_provider_1 = require("./sapling-params-provider");
let saplingInitPromise;
class SaplingWrapper {
    withProvingContext(action) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initSaplingParameters();
            return sapling.withProvingContext(action);
        });
    }
    getRandomBytes(length) {
        return (0, random_1.randomBytes)(length);
    }
    randR() {
        return __awaiter(this, void 0, void 0, function* () {
            return sapling.randR();
        });
    }
    getOutgoingViewingKey(vk) {
        return __awaiter(this, void 0, void 0, function* () {
            return sapling.getOutgoingViewingKey(vk);
        });
    }
    preparePartialOutputDescription(parametersOutputProof) {
        return __awaiter(this, void 0, void 0, function* () {
            const partialOutputDesc = yield sapling.preparePartialOutputDescription(parametersOutputProof.saplingContext, parametersOutputProof.address, parametersOutputProof.randomCommitmentTrapdoor, parametersOutputProof.ephemeralPrivateKey, parametersOutputProof.amount);
            return {
                commitmentValue: partialOutputDesc.cv,
                commitment: partialOutputDesc.cm,
                proof: partialOutputDesc.proof,
            };
        });
    }
    getDiversifiedFromRawPaymentAddress(decodedDestination) {
        return __awaiter(this, void 0, void 0, function* () {
            return sapling.getDiversifiedFromRawPaymentAddress(decodedDestination);
        });
    }
    deriveEphemeralPublicKey(diversifier, esk) {
        return __awaiter(this, void 0, void 0, function* () {
            return sapling.deriveEphemeralPublicKey(diversifier, esk);
        });
    }
    getPkdFromRawPaymentAddress(destination) {
        return __awaiter(this, void 0, void 0, function* () {
            return sapling.getPkdFromRawPaymentAddress(destination);
        });
    }
    keyAgreement(p, sk) {
        return __awaiter(this, void 0, void 0, function* () {
            return sapling.keyAgreement(p, sk);
        });
    }
    createBindingSignature(saplingContext, balance, transactionSigHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return sapling.createBindingSignature(saplingContext, balance, transactionSigHash);
        });
    }
    initSaplingParameters() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!saplingInitPromise) {
                saplingInitPromise = (() => __awaiter(this, void 0, void 0, function* () {
                    const { spend, output } = yield (0, sapling_params_provider_1.getSaplingParams)();
                    const spendParams = Buffer.from(spend.saplingSpendParams, 'base64');
                    const outputParams = Buffer.from(output.saplingOutputParams, 'base64');
                    yield sapling.initParameters(spendParams, outputParams);
                }))();
            }
            return saplingInitPromise;
        });
    }
}
exports.SaplingWrapper = SaplingWrapper;
