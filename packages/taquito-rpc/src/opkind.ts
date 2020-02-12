export enum OpKind {
  ORIGINATION = 'origination',
  DELEGATION = 'delegation',
  REVEAL = 'reveal',
  TRANSACTION = 'transaction',
  ACTIVATION = 'activate_account',
  ENDORSEMENT = 'endorsement',
  SEED_NONCE_REVELATION = 'seed_nonce_revelation',
  DOUBLE_ENDORSEMENT_EVIDENCE = 'double_endorsement_evidence',
  DOUBLE_BAKING_EVIDENCE = 'double_baking_evidence',
  PROPOSALS = 'proposals',
  BALLOT = 'ballot',
}
