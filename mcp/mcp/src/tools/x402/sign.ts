import { TezosToolkit, OpKind } from "@taquito/taquito";
import { LocalForger, ForgeParams } from "@taquito/local-forging";
import { X402PaymentPayload } from "./types.js";

export interface SignPaymentParams {
	network: string;
	amount: number;
	recipient: string;
}

export interface SignedPayment {
	payload: X402PaymentPayload;
	base64: string;
}

export async function signX402Payment(
	Tezos: TezosToolkit,
	params: SignPaymentParams
): Promise<SignedPayment> {
	const { network, amount, recipient } = params;

	// Get source address and public key from the signer
	let source: string;
	let publicKey: string;

	try {
		source = await Tezos.signer.publicKeyHash();
	} catch (error) {
		throw new Error(`Failed to get source address from signer. Is SPENDING_PRIVATE_KEY set correctly? Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}

	try {
		publicKey = await Tezos.signer.publicKey();
	} catch (error) {
		throw new Error(`Failed to get public key from signer. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}

	// Validate we got proper values
	if (!source.startsWith('tz1') && !source.startsWith('tz2') && !source.startsWith('tz3')) {
		throw new Error(`Invalid source address format: ${source}`);
	}
	if (!publicKey.startsWith('edpk') && !publicKey.startsWith('sppk') && !publicKey.startsWith('p2pk')) {
		throw new Error(`Invalid public key format: ${publicKey}`);
	}

	// Get the current block hash for the branch
	const block = await Tezos.rpc.getBlockHeader();
	const branch = block.hash;

	// Get the counter for the source account
	const counter = await Tezos.rpc.getContract(source);
	const nextCounter = (parseInt(counter.counter || "0") + 1).toString();

	// Build the transfer operation
	const operation: ForgeParams = {
		branch,
		contents: [
			{
				kind: OpKind.TRANSACTION,
				source,
				fee: "1500",
				counter: nextCounter,
				gas_limit: "1527",
				storage_limit: "257",
				amount: amount.toString(),
				destination: recipient,
			}
		]
	};

	// Forge the operation using LocalForger
	const forger = new LocalForger();
	const forgedBytes = await forger.forge(operation);

	// Sign the operation (with generic operation watermark 0x03)
	const signature = await Tezos.signer.sign(forgedBytes, new Uint8Array([3]));

	// Create x402 payload in the facilitator-compatible format
	const payload: X402PaymentPayload = {
		x402Version: 1,
		scheme: "exact-tezos",
		network,
		asset: "XTZ",
		payload: {
			operationBytes: forgedBytes,
			signature: signature.prefixSig,
			publicKey,
			source,
		}
	};

	// Base64 encode the payload
	const base64 = Buffer.from(JSON.stringify(payload)).toString("base64");

	return {
		payload,
		base64,
	};
}
