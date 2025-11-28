import z from "zod";

export const PaymentRequirementSchema = z.object({
	scheme: z.string(),
	network: z.string(),
	asset: z.string(),
	amount: z.string(),
	recipient: z.string(),
	extra: z.object({
		name: z.string(),
		decimals: z.number()
	}).optional()
});

export const X402ResponseSchema = z.object({
	x402Version: z.number(),
	paymentRequirements: z.array(PaymentRequirementSchema)
});

export type PaymentRequirement = z.infer<typeof PaymentRequirementSchema>;
export type X402Response = z.infer<typeof X402ResponseSchema>;

export interface X402PaymentPayload {
	x402Version: number;
	scheme: "exact-tezos";
	network: string;
	asset: "XTZ";
	payload: {
		operationBytes: string;
		signature: string;
		publicKey: string;
		source: string;
	};
}
