export const ticketsDeposit = `parameter (pair string nat tx_rollup_l2_address address);
storage unit;
code {
       CAR;
       UNPAIR 4;
       TICKET;
       PAIR;
       SWAP;
       CONTRACT %deposit (pair (ticket string) tx_rollup_l2_address);
       ASSERT_SOME;
       SWAP;
       PUSH mutez 0;
       SWAP;
       TRANSFER_TOKENS;
       UNIT;
       NIL operation;
       DIG 2;
       CONS;
       PAIR;
     };`
