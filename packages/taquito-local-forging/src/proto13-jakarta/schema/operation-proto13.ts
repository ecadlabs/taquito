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
