"use strict";
exports.__esModule = true;
var OpKind;
(function (OpKind) {
    OpKind["ORIGINATION"] = "origination";
    OpKind["DELEGATION"] = "delegation";
    OpKind["REVEAL"] = "reveal";
    OpKind["TRANSACTION"] = "transaction";
    OpKind["ACTIVATION"] = "activate_account";
    OpKind["ENDORSEMENT"] = "endorsement";
    OpKind["SEED_NONCE_REVELATION"] = "seed_nonce_revelation";
    OpKind["DOUBLE_ENDORSEMENT_EVIDENCE"] = "double_endorsement_evidence";
    OpKind["DOUBLE_BAKING_EVIDENCE"] = "double_baking_evidence";
    OpKind["PROPOSALS"] = "proposals";
    OpKind["BALLOT"] = "ballot";
})(OpKind = exports.OpKind || (exports.OpKind = {}));
