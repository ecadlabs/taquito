export const OperationsQuery = `query OperationsQuery($filter: OperationsFilterInput!, $orderBy: OperationsOrderByInput!, $opCount: Int, $after: Cursor){
  operations(filter: $filter, orderBy: $orderBy, first: $opCount, after: $after) {
    page_info {
      has_previous_page
      has_next_page
      start_cursor
      end_cursor
    }
    edges {
          node {
              kind
              hash
              sender: source {
                  address
              }
              timestamp
              level
              block
              status
              ... on Endorsement {
                delegate
                slots
            }
            ... on Transaction {
                fee
                counter
                gas_limit
                storage_limit
                amount
                parameters
                entrypoint
                destination
                transaction_consumed_milligas: consumed_milligas
            }
            ... on Reveal {
                fee
                counter
                gas_limit
                reveal_consumed_milligas: consumed_milligas
            }
            ... on Origination {
                counter
                contract_address
                fee
                gas_limit
                storage_limit
                origination_consumed_milligas: consumed_milligas
            }
            ... on Delegation {
                fee
                counter
                gas_limit
                delegate
                delegation_consumed_milligas: consumed_milligas
            }
          }
      }
  }
}`;
