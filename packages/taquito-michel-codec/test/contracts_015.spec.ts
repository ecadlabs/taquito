import fs from 'fs';
import path from 'path';
import { inspect } from 'util';
// import { InvalidDataExpressionError, InvalidTypeExpressionError } from '../src/error';
import { Contract, ContractOptions } from '../src/michelson-contract';
import { Protocol } from '../src/michelson-types';
// import { MichelsonValidationError } from '../src/michelson-validator';
import { MichelsonError } from '../src/utils';

const contracts: {
  [group: string]: string[];
} = {
  attic: [
    'accounts.tz',
    'add1_list.tz',
    'add1.tz',
    'after_strategy.tz',
    'always.tz',
    'append.tz',
    'at_least.tz',
    'auction.tz',
    'bad_lockup.tz',
    'big_map_union.tz',
    'cadr_annotation.tz',
    'concat.tz',
    'conditionals.tz',
    'cons_twice.tz',
    'cps_fact.tz',
    'create_add1_lists.tz',
    'data_publisher.tz',
    'dispatch.tz',
    'empty.tz',
    'fail_amount.tz',
    'faucet.tz',
    'forward.tz',
    'id.tz',
    'infinite_loop.tz',
    'insertion_sort.tz',
    'int_publisher.tz',
    'king_of_tez.tz',
    'list_of_transactions.tz',
    'queue.tz',
    'reduce_map.tz',
    'reentrancy.tz',
    'reservoir.tz',
    'scrutable_reservoir.tz',
    'spawn_identities.tz',
  ],
  entrypoints: [
    'big_map_entrypoints.tz',
    'delegatable_target.tz',
    'manager.tz',
    'no_default_target.tz',
    'no_entrypoint_target.tz',
    'rooted_target.tz',
    'simple_entrypoints.tz',
  ],
  ill_typed: [
    'big_dip.tz',
    'big_drop.tz',
    'chain_id_arity.tz',
    'comb0.tz',
    'comb1.tz',
    'contract_annotation_default.tz',
    'create_contract_rootname.tz',
    'dup0.tz',
    'fail_rec.tz',
    'failwith_big_map.tz',
    'invalid_self_entrypoint.tz',
    'map_failwith.tz',
    'missing_only_code_field.tz',
    'missing_only_parameter_field.tz',
    'missing_only_storage_field.tz',
    'missing_parameter_and_storage_fields.tz',
    'multiple_code_field.tz',
    'multiple_parameter_field.tz',
    'multiple_storage_and_code_fields.tz',
    'multiple_storage_field.tz',
    'never_literal.tz',
    'pack_big_map.tz',
    'pack_operation.tz',
    'pack_sapling_state.tz',
    'push_big_map_with_id_without_parens.tz',
    'push_big_map_with_id_with_parens.tz',
    'sapling_build_empty_state_with_int_parameter.tz',
    'set_update_non_comparable.tz',
    'stack_bottom_undig2able.tz',
    'stack_bottom_undigable.tz',
    'stack_bottom_undip2able.tz',
    'stack_bottom_undipable.tz',
    'stack_bottom_undropable.tz',
    'stack_bottom_undug2able.tz',
    'stack_bottom_undugable.tz',
    'stack_bottom_undup2able.tz',
    'stack_bottom_unfailwithable.tz',
    'stack_bottom_ungetable.tz',
    'stack_bottom_unleftable.tz',
    'stack_bottom_unpairable.tz',
    'stack_bottom_unpopable_in_lambda.tz',
    'stack_bottom_unpopable.tz',
    'stack_bottom_unrightable.tz',
    'ticket_apply.tz',
    'ticket_dup.tz',
    'ticket_in_ticket.tz',
    'ticket_unpack.tz',
    'uncomb0.tz',
    'uncomb1.tz',
    'unpack_sapling_state.tz',
    'unpair_field_annotation_mismatch.tz',
    'view_op_bad_name_invalid_char_set.tz',
    'view_op_bad_name_invalid_type.tz',
    'view_op_bad_name_non_printable_char.tz',
    'view_op_bad_name_too_long.tz',
    'view_op_bad_return_type.tz',
    'view_op_dupable_type.tz',
    'view_op_invalid_arity.tz',
    'view_op_lazy_storage_type.tz',
    'view_op_lazy_storage.tz',
    'view_toplevel_bad_input_type.tz',
    'view_toplevel_bad_name_invalid_char_set.tz',
    'view_toplevel_bad_name_invalid_type.tz',
    'view_toplevel_bad_name_non_printable_char.tz',
    'view_toplevel_bad_name_too_long.tz',
    'view_toplevel_bad_return_type.tz',
    'view_toplevel_bad_type.tz',
    'view_toplevel_dupable_type_input.tz',
    'view_toplevel_dupable_type_output.tz',
    'view_toplevel_duplicated_name.tz',
    'view_toplevel_invalid_arity.tz',
    'view_toplevel_lazy_storage_input.tz',
    'view_toplevel_lazy_storage_output.tz',
  ],
  lib_protocol: [
    'emit.tz',
    'int-store.tz',
    // 'omega.tz', TODO add new instruction LAMDBA_REC
    // 'rec_fact_apply_store.tz', TODO add new instruction LAMDBA_REC
    // 'rec_fact_apply.tz', TODO add new instruction LAMDBA_REC
    // 'rec_fact_store.tz', TODO add new instruction LAMDBA_REC
    // 'rec_fact.tz', TODO add new instruction LAMDBA_REC
    'sapling_contract_double.tz',
    'sapling_contract_drop.tz',
    'sapling_contract_send.tz',
    'sapling_contract_state_as_arg.tz',
    'sapling_contract.tz',
    'sapling_use_existing_state.tz',
    'temp_big_maps.tz',
    'timelock.tz',
  ],
  macros: [
    'assert_cmpeq.tz',
    'assert_cmpge.tz',
    'assert_cmpgt.tz',
    'assert_cmple.tz',
    'assert_cmplt.tz',
    'assert_cmpneq.tz',
    'assert_eq.tz',
    'assert_ge.tz',
    'assert_gt.tz',
    'assert_le.tz',
    'assert_lt.tz',
    'assert_neq.tz',
    'assert.tz',
    'big_map_get_add.tz',
    'big_map_mem.tz',
    'build_list.tz',
    'carn_and_cdrn.tz',
    'compare_bytes.tz',
    'compare.tz',
    'fail.tz',
    'guestbook.tz',
    'macro_annotations.tz',
    'map_caddaadr.tz',
    'max_in_list.tz',
    'min.tz',
    'pair_macro.tz',
    'set_caddaadr.tz',
    'take_my_money.tz',
    'unpair_macro.tz',
  ],
  mini_scenarios: [
    // 'add_clear_tickets.tz', TODO fix TICKET ASSERT_SOME
    'authentication.tz',
    'big_map_entrypoints.tz',
    'big_map_magic.tz',
    'big_map_read.tz',
    'big_map_store.tz',
    'big_map_write.tz',
    'create_contract_simple.tz',
    'create_contract.tz',
    'default_account.tz',
    'execution_order_appender.tz',
    'execution_order_caller.tz',
    'execution_order_storer.tz',
    'fa12_reference.tz',
    'generic_multisig.tz',
    'groth16.tz',
    'hardlimit.tz',
    'legacy_multisig.tz',
    'lockup.tz',
    'lqt_fa12.mligo.tz',
    'multiple_en2.tz',
    'multiple_entrypoints_counter.tz',
    'originate_contract.tz',
    'parameterized_multisig.tz',
    'receive_tickets_in_big_map.tz',
    'replay.tz',
    'reveal_signed_preimage.tz',
    'self_address_receiver.tz',
    'self_address_sender.tz',
    // 'send_tickets_in_big_map.tz', TODO fix TICKET ASSERT_SOME
    // 'ticket_builder_fungible.tz', TODO fix TICKET ASSERT_SOME
    // 'ticket_builder_non_fungible.tz', TODO fix TICKET ASSERT_SOME
    'ticket_wallet_fungible.tz',
    'ticket_wallet_non_fungible.tz',
    'vote_for_delegate.tz',
    'weather_insurance.tz',
    'xcat_dapp.tz',
    'xcat.tz',
  ],
  non_regression: ['bad_annot_contract.tz', 'bug_262.tz', 'bug_843.tz', 'pairk_annot.tz'],
  opcodes: [
    'abs.tz',
    'add_bls12_381_fr.tz',
    'add_bls12_381_g1.tz',
    'add_bls12_381_g2.tz',
    'add_delta_timestamp.tz',
    'address.tz',
    'add_timestamp_delta.tz',
    'add.tz',
    'amount_after_fib_view.tz',
    'amount_after_nonexistent_view.tz',
    'amount_after_view.tz',
    'and_binary.tz',
    'and_logical_1.tz',
    'and.tz',
    'balance_after_fib_view.tz',
    'balance_after_nonexistent_view.tz',
    'balance_after_view.tz',
    'balance.tz',
    'big_map_mem_nat.tz',
    'big_map_mem_string.tz',
    'big_map_to_self.tz',
    'bls12_381_fr_push_bytes_not_padded.tz',
    'bls12_381_fr_push_nat.tz',
    'bls12_381_fr_to_int.tz',
    'bls12_381_fr_to_mutez.tz',
    'bls12_381_fr_z_int.tz',
    'bls12_381_fr_z_nat.tz',
    'bls12_381_z_fr_int.tz',
    'bls12_381_z_fr_nat.tz',
    'bytes.tz',
    'car.tz',
    'cdr.tz',
    'chain_id_store.tz',
    'chain_id.tz',
    'check_signature.tz',
    'comb-get.tz',
    'comb-literals.tz',
    'comb-set-2.tz',
    'comb-set.tz',
    'comb.tz',
    'compare_big_type2.tz',
    'compare_big_type.tz',
    'compare.tz',
    'comparisons.tz',
    'concat_hello_bytes.tz',
    'concat_hello.tz',
    'concat_list.tz',
    'cons.tz',
    'contains_all.tz',
    'contract.tz',
    'create_contract_rootname_alt.tz',
    'create_contract_rootname.tz',
    'create_contract.tz',
    'create_contract_with_view.tz',
    'diff_timestamps.tz',
    'dig_eq.tz',
    'dign.tz',
    'dipn.tz',
    'dip.tz',
    'dropn.tz',
    'dugn.tz',
    'dup-n.tz',
    'ediv_mutez.tz',
    'ediv.tz',
    'emit.tz',
    'empty_map.tz',
    'exec_concat.tz',
    'first.tz',
    'get_and_update_big_map.tz',
    'get_and_update_map.tz',
    'get_big_map_value.tz',
    'get_map_value.tz',
    'hash_consistency_checker.tz',
    'hash_key.tz',
    'hash_string.tz',
    'if_some.tz',
    'if.tz',
    'int.tz',
    'iter_fail.tz',
    'keccak.tz',
    'left_right.tz',
    'level.tz',
    'list_concat_bytes.tz',
    'list_concat.tz',
    'list_id_map.tz',
    'list_id.tz',
    'list_iter.tz',
    'list_map_block.tz',
    'list_size.tz',
    'loop_failwith.tz',
    'loop_left_failwith.tz',
    'loop_left.tz',
    'map_car.tz',
    'map_id.tz',
    'map_iter.tz',
    'map_map_sideeffect.tz',
    'map_map.tz',
    'map_mem_nat.tz',
    'map_mem_string.tz',
    'map_size.tz',
    'merge_comparable_pairs.tz',
    'mul_bls12_381_fr.tz',
    'mul_bls12_381_g1.tz',
    'mul_bls12_381_g2.tz',
    'mul_overflow.tz',
    'mul.tz',
    'munch.tz',
    'mutez_to_bls12_381_fr.tz',
    'neg_bls12_381_fr.tz',
    'neg_bls12_381_g1.tz',
    'neg_bls12_381_g2.tz',
    'neg.tz',
    'none.tz',
    'noop.tz',
    'not_binary.tz',
    'not.tz',
    'or_binary.tz',
    'originate_big_map.tz',
    'or.tz',
    'packunpack_rev_cty.tz',
    'packunpack_rev.tz',
    'packunpack.tz',
    'pair_id.tz',
    'pairing_check.tz',
    'pexec_2.tz',
    'pexec.tz',
    'proxy.tz',
    'ret_int.tz',
    'reverse_loop.tz',
    'reverse.tz',
    'sapling_empty_state.tz',
    'self_address_after_fib_view.tz',
    'self_address_after_nonexistent_view.tz',
    'self_address_after_view.tz',
    'self_address.tz',
    'self_after_fib_view.tz',
    'self_after_nonexistent_view.tz',
    'self_after_view.tz',
    'self.tz',
    'self_with_default_entrypoint.tz',
    'self_with_entrypoint.tz',
    'sender_after_fib_view.tz',
    'sender_after_nonexistent_view.tz',
    'sender_after_view.tz',
    'sender.tz',
    'set_car.tz',
    'set_cdr.tz',
    'set_delegate.tz',
    'set_id.tz',
    'set_iter.tz',
    'set_member.tz',
    'set_size.tz',
    'sets.tz',
    'sha3.tz',
    'shifts.tz',
    'slice_bytes.tz',
    'slices.tz',
    'slice.tz',
    'source.tz',
    'split_bytes.tz',
    'split_string.tz',
    'store_bls12_381_fr.tz',
    'store_bls12_381_g1.tz',
    'store_bls12_381_g2.tz',
    'store_input.tz',
    'store_now.tz',
    'str_id.tz',
    'subset.tz',
    'sub_timestamp_delta.tz',
    'tez_add_sub.tz',
    'ticket_bad.tz',
    // 'ticket_big_store.tz', TODO fix TICKET ASSERT_SOME
    // 'ticketer-2.tz', TODO fix TICKET ASSERT_SOME
    // 'ticketer.tz', TODO fix TICKET ASSERT_SOME
    'ticket_join.tz',
    'ticket_read.tz',
    'ticket_split.tz',
    'ticket_store-2.tz',
    'ticket_store.tz',
    'transfer_amount.tz',
    'transfer_tokens.tz',
    'uncomb.tz',
    'unpair.tz',
    'update_big_map.tz',
    'utxo_read.tz',
    // 'utxor.tz', TODO fix TICKET ASSERT_SOME
    'view_fib.tz',
    'view_mutual_recursion.tz',
    'view_op_add.tz',
    'view_op_constant.tz',
    'view_op_id.tz',
    'view_op_nonexistent_addr.tz',
    'view_op_nonexistent_func.tz',
    'view_op_test_step_contants.tz',
    'view_op_toplevel_inconsistent_input_type.tz',
    'view_op_toplevel_inconsistent_output_type.tz',
    'view_rec.tz',
    'view_toplevel_lib.tz',
    'voting_power.tz',
    'xor.tz',
  ],
};

describe('PtLimaPtL', () => {
  for (const [group, list] of Object.entries(contracts)) {
    describe(group, () => {
      for (const contract of list) {
        it(contract, () => {
          const options: ContractOptions = {
            protocol: Protocol.PtLimaPtL,
          };

          const filename = path.resolve(__dirname, 'contracts_015', group, contract);
          const src = fs.readFileSync(filename).toString();
          if (group === 'ill_typed') {
            expect(() => Contract.parse(src, options)).toThrow();
            return;
          }

          try {
            Contract.parse(src, options);
          } catch (err) {
            if (err instanceof MichelsonError) {
              console.log(inspect(err, false, null));
            }
            throw err;
          }
        });

        // it('parse check null case', () => {
        //   const options: ContractOptions = {
        //     protocol: Protocol.PtLimaPtL,
        //   };
        //   const src = '';
        //   expect(() => Contract.parse(src, options)).toThrow('empty contract');
        //   expect(() => Contract.parse(src, options)).toThrow(
        //     expect.objectContaining({
        //       name: expect.stringContaining('InvalidContractError'),
        //     })
        //   );
        //   expect(() => Contract.parse(src, options)).toThrow(
        //     expect.objectContaining({
        //       message: expect.stringContaining('empty contract'),
        //     })
        //   );
        // });

        // it('parseTypeExpression null case', () => {
        //   const options: ContractOptions = {
        //     protocol: Protocol.PtLimaPtL,
        //   };
        //   const src = '';
        //   expect(() => Contract.parseTypeExpression(src, options)).toThrow(
        //     InvalidTypeExpressionError
        //   );
        //   expect(() => Contract.parseTypeExpression(src, options)).toThrow(
        //     expect.objectContaining({
        //       message: expect.stringContaining('empty type expression'),
        //     })
        //   );
        // });

        // it('parse error case', () => {
        //   const options: ContractOptions = {
        //     protocol: Protocol.PtLimaPtL,
        //   };
        //   const contract = `{ parameter unit ;
        //     unit ;
        //     code { DROP ;
        //            UNIT ;
        //            PUSH nat 10 ;
        //            LEFT string ;
        //            EMIT %event ;
        //            PUSH string "lorem ipsum" ;
        //            RIGHT nat ;
        //            EMIT %event (or (nat %number) (string %words)) ;
        //            NIL operation ;
        //            SWAP ;
        //            CONS ;
        //            SWAP ;
        //            CONS ;
        //            PAIR } }`;
        //   expect(() => Contract.parse(contract, options)).toThrow(MichelsonValidationError);
        //   expect(() => Contract.parse(contract, options)).toThrow(
        //     expect.objectContaining({
        //       message: expect.stringContaining('unexpected contract section: unit'),
        //     })
        //   );
        // });

        // it('parseDataExpression check the null case', () => {
        //   const options: ContractOptions = {
        //     protocol: Protocol.PtLimaPtL,
        //   };
        //   expect(() => Contract.parseDataExpression('', options)).toThrow(
        //     InvalidDataExpressionError
        //   );
        //   expect(() => Contract.parseDataExpression('', options)).toThrow(
        //     expect.objectContaining({
        //       message: expect.stringContaining('empty data expression'),
        //     })
        //   );
        // });
      }
    });
  }
});
