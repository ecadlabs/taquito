export enum OpKind {
  ORIGINATION = 'origination',
  DELEGATION = 'delegation',
  REVEAL = 'reveal',
  TRANSACTION = 'transaction',
  ACTIVATION = 'activate_account',
  ENDORSEMENT = 'endorsement',
  ENDORSEMENT_WITH_SLOT = 'endorsement_with_slot',
  SEED_NONCE_REVELATION = 'seed_nonce_revelation',
  DOUBLE_ENDORSEMENT_EVIDENCE = 'double_endorsement_evidence',
  DOUBLE_BAKING_EVIDENCE = 'double_baking_evidence',
  PROPOSALS = 'proposals',
  BALLOT = 'ballot',
  FAILING_NOOP = 'failing_noop',
  REGISTER_GLOBAL_CONSTANT = 'register_global_constant'
}
