import { CONFIGS } from "../../config";
import { PrefixV2 } from "@taquito/utils";
import { Protocols, TezosToolkit } from "@taquito/taquito";
import { ProtoGreaterOrEqual } from "@taquito/michel-codec";
import crypto from 'crypto';
import { PvmKind } from "@taquito/rpc";

CONFIGS().forEach(({ lib, rpc, setup, protocol, createAddress, knownBaker, knownTicketContract }) => {
  const seoulnetAndAlpha = ProtoGreaterOrEqual(protocol, Protocols.PtSeouLou) ? test : test.skip;
  const Tezos = lib;
  let contractAddress = 'KT1XgwgLtcD79LzFifBKxU2TYwKzQ6iUwwj1'
  let Bls1: TezosToolkit

  describe(`Test bls account operations through contract API using: ${rpc}`, () => {

    beforeAll(async () => {
      await setup(true)
      try {
        Bls1 = await createAddress(PrefixV2.BLS12_381SecretKey)
        let fundingOp = await Tezos.contract.transfer({ to: await Bls1.signer.publicKeyHash(), amount: 8 })
        await fundingOp.confirmation()

      } catch (e) {
        console.log('beforeAll fundingOp error', e)
      }
    })

    seoulnetAndAlpha('verify that estimate.reveal fee and gas is sufficient', async () => {
      const estimated = await Bls1.estimate.reveal()
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(735)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(3250)

      const revealOp = await Bls1.contract.reveal({})
      await revealOp.confirmation()
      expect(revealOp.status).toBe('applied')
    })

    seoulnetAndAlpha('verify that estimate.transfer to revealed account fee and gas is sufficient', async () => {
      const estimated = await Bls1.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 1 })

      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(654)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(3674)

      const transferOp = await Bls1.contract.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 1 })
      await transferOp.confirmation()
      expect(transferOp.status).toBe('applied')
    })

    seoulnetAndAlpha('verify that estimate.transfer to unrevealed account fee and gas is sufficient', async () => {
      const estimated = await Bls1.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 1 })

      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(654) // taquito 643
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(3674)

      const transferOp = await Bls1.contract.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 1 })
      await transferOp.confirmation()
      expect(transferOp.status).toBe('applied')
    })

    seoulnetAndAlpha('verify that estimate.originate fee and gas is sufficient', async () => {
      const estimated = await Bls1.estimate.originate({ code: "parameter unit; storage unit; code {CDR; NIL operation; PAIR};", storage: "unit" })
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(520)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(2083)

      const originateOp = await Bls1.contract.originate({ code: "parameter unit; storage unit; code {CDR; NIL operation; PAIR};", storage: "unit" })
      await originateOp.confirmation()
      contractAddress = originateOp.contractAddress!
      expect(originateOp.status).toBe('applied')
    })

    seoulnetAndAlpha('verify that estimate.contractCall fee and gas is sufficient', async () => {
      const contract = await Bls1.contract.at(contractAddress)
      const endpoint = contract.methodsObject.default(null)
      const estimated = await Bls1.estimate.contractCall(endpoint)
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(573)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(2783)

      const contractCallOp = await endpoint.send()
      await contractCallOp.confirmation()
      expect(contractCallOp.status).toBe('applied')
    })

    seoulnetAndAlpha('verify that estimate.setDelegate fee and gas is sufficient', async () => {
      const estimated = await Bls1.estimate.setDelegate({ delegate: knownBaker, source: await Bls1.signer.publicKeyHash() })
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(450) // taquito *2.5 665
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(1674)

      const setDelegateOp = await Bls1.contract.setDelegate({ delegate: knownBaker, source: await Bls1.signer.publicKeyHash() })
      await setDelegateOp.confirmation()
      expect(setDelegateOp.status).toBe('applied')
    })

    seoulnetAndAlpha('verify that estimate.registerDelegate fee and gas is sufficient', async () => {
      const estimated = await Bls1.estimate.registerDelegate({})
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(450)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(1674)

      const registerDelegateOp = await Bls1.contract.registerDelegate({})
      await registerDelegateOp.confirmation()
      expect(registerDelegateOp.status).toBe('applied')
    })

    seoulnetAndAlpha('verify that estimate.increase_paid_storage fee and gas is sufficient', async () => {
      const estimated = await Bls1.estimate.increasePaidStorage({ amount: 3, destination: contractAddress })
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(450)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(1674)

      const increasePaidStorageOp = await Bls1.contract.increasePaidStorage({ amount: 3, destination: contractAddress })
      await increasePaidStorageOp.confirmation()
      expect(increasePaidStorageOp.status).toBe('applied')
    })

    seoulnetAndAlpha('verify that estimate.register_global_constant fee and gas is sufficient', async () => {
      const randomAnnots = () => crypto.randomBytes(3).toString('hex');
      const code = {
        prim: 'list',
        args: [{ prim: 'nat' }],
        annots: [`%${randomAnnots()}`]
      }
      const estimated = await Bls1.estimate.registerGlobalConstant({
        value: code,
      })

      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(480)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(2006)

      const registerGlobalConstantOp = await Bls1.contract.registerGlobalConstant({
        value: code,
      })
      await registerGlobalConstantOp.confirmation()
      expect(registerGlobalConstantOp.status).toBe('applied')
    })

    seoulnetAndAlpha('verify that estimate.update_consensus_key fee and gas is sufficient', async () => {
      const consensusAcc = await createAddress(PrefixV2.BLS12_381SecretKey)
      const consensusPk = await consensusAcc.signer.publicKey()
      const pop = await consensusAcc.signer.provePossession!()
      const estimated = await Bls1.estimate.updateConsensusKey({ pk: consensusPk, proof: pop.prefixSig })
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(745)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(3350)

      const updateConsensusKeyOp = await Bls1.contract.updateConsensusKey({ pk: consensusPk, proof: pop.prefixSig })
      await updateConsensusKeyOp.confirmation()
      expect(updateConsensusKeyOp.status).toBe('applied')
    })

    seoulnetAndAlpha('verify that estimate.update_companion_key fee and gas is sufficient', async () => {
      const companionAcc = await createAddress(PrefixV2.BLS12_381SecretKey)
      const companionPk = await companionAcc.signer.publicKey()
      const pop = await companionAcc.signer.provePossession!()
      const estimated = await Bls1.estimate.updateCompanionKey({ pk: companionPk, proof: pop.prefixSig })
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(745)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(3350)

      const updateCompanionKeyOp = await Bls1.contract.updateCompanionKey({ pk: companionPk, proof: pop.prefixSig })
      await updateCompanionKeyOp.confirmation()
      expect(updateCompanionKeyOp.status).toBe('applied')
    })

    seoulnetAndAlpha('verify that estimate.transferTicket fee and gas is sufficient', async () => {
      const ticketContract = await Tezos.contract.at(knownTicketContract)
      const ticket = { ticketer: knownTicketContract, content_type: { prim: 'string' }, content: { string: 'Ticket' } };
      const issueOp = await ticketContract.methodsObject.default([await Bls1.signer.publicKeyHash(), '3']).send()
      await issueOp.confirmation()

      const estimated = await Bls1.estimate.transferTicket({
        ticketContents: ticket.content,
        ticketTy: ticket.content_type,
        ticketTicketer: ticket.ticketer,
        ticketAmount: 1,
        destination: await Tezos.signer.publicKeyHash(),
        entrypoint: 'default',
      })
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(341)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(1325)

      const transferTicketOp = await Bls1.contract.transferTicket({
        ticketContents: ticket.content,
        ticketTy: ticket.content_type,
        ticketTicketer: ticket.ticketer,
        ticketAmount: 1,
        destination: await Tezos.signer.publicKeyHash(),
        entrypoint: 'default',
      })
      await transferTicketOp.confirmation()
      expect(transferTicketOp.status).toBe('applied')
    })

    seoulnetAndAlpha('verify that estimate.smart_rollup_originate fee and gas is sufficient', async () => {
      const estimated = await Bls1.estimate.smartRollupOriginate({
        pvmKind: PvmKind.WASM2,
        kernel: '23212f7573722f62696e2f656e762073680a6578706f7274204b45524e454c3d22303036313733366430313030303030303031323830373630303337663766376630313766363030323766376630313766363030353766376637663766376630313766363030313766303036303031376630313766363030323766376630303630303030303032363130333131373336643631373237343566373236663663366337353730356636333666373236353061373236353631363435663639366537303735373430303030313137333664363137323734356637323666366336633735373035663633366637323635306337373732363937343635356636663735373437303735373430303031313137333664363137323734356637323666366336633735373035663633366637323635306237333734366637323635356637373732363937343635303030323033303530343033303430353036303530333031303030313037313430323033366436353664303230303061366236353732366536353663356637323735366530303036306161343031303432613031303237663431666130303266303130303231303132303030326630313030323130323230303132303032343730343430343165343030343131323431303034316534303034313030313030323161306230623038303032303030343163343030366230623530303130353766343166653030326430303030323130333431666330303266303130303231303232303030326430303030323130343230303032663031303032313035323030313130303432313036323030343230303334363034343032303030343130313661323030313431303136623130303131613035323030353230303234363034343032303030343130373661323030363130303131613062306230623164303130313766343164633031343138343032343139303163313030303231303034313834303232303030313030353431383430323130303330623062333830353030343165343030306231323266366236353732366536353663326636353665373632663732363536323666366637343030343166383030306230323030303130303431666130303062303230303032303034316663303030623032303030303030343166653030306230313031220a',
        parametersType: { prim: 'bytes' }
      })
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(1481)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(3568)

      const smartRollupOriginateOp = await Bls1.contract.smartRollupOriginate({
        pvmKind: PvmKind.WASM2,
        kernel: '23212f7573722f62696e2f656e762073680a6578706f7274204b45524e454c3d22303036313733366430313030303030303031323830373630303337663766376630313766363030323766376630313766363030353766376637663766376630313766363030313766303036303031376630313766363030323766376630303630303030303032363130333131373336643631373237343566373236663663366337353730356636333666373236353061373236353631363435663639366537303735373430303030313137333664363137323734356637323666366336633735373035663633366637323635306337373732363937343635356636663735373437303735373430303031313137333664363137323734356637323666366336633735373035663633366637323635306237333734366637323635356637373732363937343635303030323033303530343033303430353036303530333031303030313037313430323033366436353664303230303061366236353732366536353663356637323735366530303036306161343031303432613031303237663431666130303266303130303231303132303030326630313030323130323230303132303032343730343430343165343030343131323431303034316534303034313030313030323161306230623038303032303030343163343030366230623530303130353766343166653030326430303030323130333431666330303266303130303231303232303030326430303030323130343230303032663031303032313035323030313130303432313036323030343230303334363034343032303030343130313661323030313431303136623130303131613035323030353230303234363034343032303030343130373661323030363130303131613062306230623164303130313766343164633031343138343032343139303163313030303231303034313834303232303030313030353431383430323130303330623062333830353030343165343030306231323266366236353732366536353663326636353665373632663732363536323666366637343030343166383030306230323030303130303431666130303062303230303032303034316663303030623032303030303030343166653030306230313031220a',
        parametersType: { prim: 'bytes' }
      })
      await smartRollupOriginateOp.confirmation()
      expect(smartRollupOriginateOp.status).toBe('applied')
    })

    seoulnetAndAlpha('verify that estimate.smart_rollup_add_messages fee and gas is sufficient', async () => {
      const estimated = await Bls1.estimate.smartRollupAddMessages({
        message: [
          '0000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74'
        ],
      })
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(500)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(1777)

      const smartRollupAddMessagesOp = await Bls1.contract.smartRollupAddMessages({
        message: [
          '0000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74'
        ],
      })
      await smartRollupAddMessagesOp.confirmation()
      expect(smartRollupAddMessagesOp.status).toBe('applied')
    })
  });
})
