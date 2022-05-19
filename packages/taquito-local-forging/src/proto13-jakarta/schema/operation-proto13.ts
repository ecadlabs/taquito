export const TransferTicketSchema = {
  source: 'pkh',
  fee: 'zarith',
  counter: 'zarith',
  gas_limit: 'zarith',
  storage_limit: 'zarith',
  ticket_contents: 'value',
  ticket_ty: 'value',
  ticket_ticketer: 'address',
  ticket_amount: 'zarith',
  destination: 'address',
  entrypoint: 'entrypoint',
};

export const TxRollupOriginationSchema = {
  source: 'pkh',
  fee: 'zarith',
  counter: 'zarith',
  gas_limit: 'zarith',
  storage_limit: 'zarith',
  tx_rollup_origination: 'tx_rollup_origination_param',
};

export const TxRollupSubmitBatchSchema = {
  source: 'pkh',
  fee: 'zarith',
  counter: 'zarith',
  gas_limit: 'zarith',
  storage_limit: 'zarith',
  rollup: 'tx_rollup_id',
  content: 'tx_rollup_batch_content',
  burn_limit: 'burn_limit',
};
