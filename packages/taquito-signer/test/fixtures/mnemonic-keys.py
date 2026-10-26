"""Generate the fixed public mnemonic vectors without Taquito or noble code."""

import hashlib
import hmac
import json
import re
import unicodedata
from pathlib import Path

from cryptography.hazmat.primitives.asymmetric import ec, ed25519
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat


FIXTURES = Path(__file__).resolve().parent
MNEMONIC = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
CURVES = {
    "ed25519": {
        "secret_key_prefix": [43, 246, 78, 7],
        "public_key_prefix": [13, 15, 37, 217],
        "address_prefix": [6, 161, 159],
        "seed_label": b"ed25519 seed",
        "order": None,
    },
    "secp256k1": {
        "secret_key_prefix": [17, 162, 224, 201],
        "public_key_prefix": [3, 254, 226, 86],
        "address_prefix": [6, 161, 161],
        "seed_label": b"Bitcoin seed",
        "order": int("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141", 16),
    },
    "p256": {
        "secret_key_prefix": [16, 81, 238, 189],
        "public_key_prefix": [3, 178, 139, 127],
        "address_prefix": [6, 161, 164],
        "seed_label": b"Nist256p1 seed",
        "order": int("FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551", 16),
    },
}


def base58check(prefix, payload):
    data = bytes(prefix) + payload
    checksum = hashlib.sha256(hashlib.sha256(data).digest()).digest()[:4]
    data += checksum
    number = int.from_bytes(data, "big")
    encoded = ""
    while number:
        number, remainder = divmod(number, 58)
        encoded = BASE58_ALPHABET[remainder] + encoded
    leading_zeros = len(data) - len(data.lstrip(b"\0"))
    return "1" * leading_zeros + encoded


def public_key_bytes(curve, secret_key):
    if curve == "ed25519":
        key = ed25519.Ed25519PrivateKey.from_private_bytes(secret_key)
        return key.public_key().public_bytes(Encoding.Raw, PublicFormat.Raw)
    elliptic_curve = ec.SECP256K1() if curve == "secp256k1" else ec.SECP256R1()
    key = ec.derive_private_key(int.from_bytes(secret_key, "big"), elliptic_curve)
    return key.public_key().public_bytes(Encoding.X962, PublicFormat.CompressedPoint)


def derive_key_tuple(parameters):
    curve = parameters.get("curve", "ed25519")
    path = parameters.get("derivationPath", "44'/1729'/0'/0'")
    password = unicodedata.normalize("NFKD", parameters.get("password", ""))
    mnemonic = unicodedata.normalize("NFKD", parameters["mnemonic"])
    seed = hashlib.pbkdf2_hmac(
        "sha512", mnemonic.encode(), ("mnemonic" + password).encode(), 2048
    )
    settings = CURVES[curve]
    order = settings["order"]
    digest = hmac.digest(settings["seed_label"], seed, "sha512")
    secret_key, chain_code = digest[:32], digest[32:]
    assert order is None or 0 < int.from_bytes(secret_key, "big") < order

    parts = path.split("/") if path else []
    if parts and parts[0] == "m":
        parts = parts[1:]
    for part in parts:
        component = re.fullmatch(r"([0-9]+)(['hH]?)", part)
        if component is None:
            raise ValueError("Invalid fixture derivation path component")
        number = int(component[1])
        hardened = bool(component[2])
        index = number + (0x80000000 if hardened else 0)
        data = b"\0" + secret_key if hardened else public_key_bytes(curve, secret_key)
        digest = hmac.digest(chain_code, data + index.to_bytes(4, "big"), "sha512")
        child_scalar = int.from_bytes(digest[:32], "big")
        chain_code = digest[32:]
        if curve == "ed25519":
            assert hardened
            secret_key = digest[:32]
        else:
            assert child_scalar < order
            child_scalar = (child_scalar + int.from_bytes(secret_key, "big")) % order
            assert child_scalar != 0
            secret_key = child_scalar.to_bytes(32, "big")

    public_key = public_key_bytes(curve, secret_key)
    address_hash = hashlib.blake2b(public_key, digest_size=20).digest()
    canonical_secret = secret_key + public_key if curve == "ed25519" else secret_key
    return {
        "publicKey": base58check(settings["public_key_prefix"], public_key),
        "publicKeyHash": base58check(settings["address_prefix"], address_hash),
        "secretKey": base58check(settings["secret_key_prefix"], canonical_secret),
    }


cases = [
    ("defaults", {}),
    ("account one", {"derivationPath": "44'/1729'/1'/0'"}),
    ("alternate hardened notation", {"derivationPath": "m/44h/1729H/0h/0h"}),
    ("root", {"derivationPath": "m"}),
    ("empty path", {"derivationPath": ""}),
    ("Unicode password", {"password": "caf\u00e9"}),
    ("normalized password", {"password": "cafe\u0301"}),
]
for curve in ("secp256k1", "p256"):
    cases.extend(
        [
            (curve + " hardened", {"curve": curve}),
            (curve + " nonhardened", {"curve": curve, "derivationPath": "44'/1729'/0/0"}),
            (curve + " password", {"curve": curve, "password": "TREZOR"}),
            (curve + " root", {"curve": curve, "derivationPath": "m"}),
        ]
    )

vectors = []
for label, options in cases:
    parameters = {"mnemonic": MNEMONIC, **options}
    vectors.append(
        {"label": label, "params": parameters, "expected": derive_key_tuple(parameters)}
    )

fixture = FIXTURES / "mnemonic-keys.json"
fixture.write_text(json.dumps(vectors, indent=2) + "\n")
print(f"Wrote {len(vectors)} independent key tuples")
