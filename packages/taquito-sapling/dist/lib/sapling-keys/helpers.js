"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptKey = decryptKey;
const errors_1 = require("../errors");
const typedarray_to_buffer_1 = require("typedarray-to-buffer");
const nacl_1 = require("@stablelib/nacl");
const pbkdf2_1 = require("pbkdf2");
const utils_1 = require("@taquito/utils");
const core_1 = require("@taquito/core");
function decryptKey(spendingKey, password) {
    const [keyArr, pre] = (() => {
        try {
            return (0, utils_1.b58DecodeAndCheckPrefix)(spendingKey, [
                utils_1.PrefixV2.SaplingSpendingKey,
                utils_1.PrefixV2.EncryptedSaplingSpendingKey,
            ]);
        }
        catch (err) {
            if (err instanceof core_1.ParameterValidationError) {
                throw new errors_1.InvalidSpendingKey(spendingKey, 'invalid spending key');
            }
            else {
                throw err;
            }
        }
    })();
    if (pre === utils_1.PrefixV2.EncryptedSaplingSpendingKey) {
        if (!password) {
            throw new errors_1.InvalidSpendingKey(spendingKey, 'no password provided to decrypt');
        }
        const salt = (0, typedarray_to_buffer_1.default)(keyArr.slice(0, 8));
        const encryptedSk = (0, typedarray_to_buffer_1.default)(keyArr.slice(8));
        const encryptionKey = pbkdf2_1.default.pbkdf2Sync(password, salt, 32768, 32, 'sha512');
        const decrypted = (0, nacl_1.openSecretBox)(new Uint8Array(encryptionKey), new Uint8Array(24), new Uint8Array(encryptedSk));
        if (!decrypted) {
            throw new errors_1.InvalidSpendingKey(spendingKey, 'incorrect password or unable to decrypt');
        }
        return (0, typedarray_to_buffer_1.default)(decrypted);
    }
    else {
        return (0, typedarray_to_buffer_1.default)(keyArr);
    }
}
