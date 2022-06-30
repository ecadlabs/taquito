import { CODEC } from '../../constants';

export const TransferTicketSchema = {
  source: CODEC.PKH,
  fee: CODEC.ZARITH,
  counter: CODEC.ZARITH,
  gas_limit: CODEC.ZARITH,
  storage_limit: CODEC.ZARITH,
  ticket_contents: CODEC.VALUE,
  ticket_ty: CODEC.VALUE,
  ticket_ticketer: CODEC.ADDRESS,
  ticket_amount: CODEC.ZARITH,
  destination: CODEC.ADDRESS,
  entrypoint: CODEC.ENTRYPOINT,
};

export const TxRollupOriginationSchema = {
  source: CODEC.PKH,
  fee: CODEC.ZARITH,
  counter: CODEC.ZARITH,
  gas_limit: CODEC.ZARITH,
  storage_limit: CODEC.ZARITH,
  tx_rollup_origination: CODEC.TX_ROLLUP_ORIGINATION_PARAM,
};

export const TxRollupSubmitBatchSchema = {
  source: CODEC.PKH,
  fee: CODEC.ZARITH,
  counter: CODEC.ZARITH,
  gas_limit: CODEC.ZARITH,
  storage_limit: CODEC.ZARITH,
  rollup: CODEC.TX_ROLLUP_ID,
  content: CODEC.TX_ROLLUP_BATCH_CONTENT,
  burn_limit: CODEC.BURN_LIMIT,
};
