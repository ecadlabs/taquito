import { CONFIGS } from "../../config";
import { PrefixV2 } from "@taquito/utils";
import { UnitValue, OpKind } from "@taquito/taquito";
import crypto from 'crypto';
import { PvmKind } from "@taquito/rpc";

CONFIGS().forEach(({ lib, rpc, setup, knownBaker, createAddress, knownTicketContract }) => {
  const Tz2 = lib;
  let contractAddress = 'KT1XgwgLtcD79LzFifBKxU2TYwKzQ6iUwwj1'

  describe(`Test tz2 account operations through contract API using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup(true)
    })

    it('verify that reveal fee and gas is sufficient', async () => {
      const estimated = await Tz2.estimate.reveal({})
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(277)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(155)
      expect(estimated?.storageLimit).toBe(0)

      const revealOp = await Tz2.contract.reveal({})
      await revealOp.confirmation()
      expect(revealOp.status).toBe('applied')
    })

    it('verify that transfer to revealed account fee and gas is sufficient', async () => {
      const estimated = await Tz2.estimate.transfer({ to: knownBaker, amount: 1 })
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(367)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(2101)
      expect(estimated?.storageLimit).toBe(0)

      const transferOp = await Tz2.contract.transfer({ to: knownBaker, amount: 1 })
      await transferOp.confirmation()
      expect(transferOp.status).toBe('applied')
    })

    it('verify that transfer to unrevealed account fee and gas is sufficient', async () => {
      const unrevealedAcc = await createAddress(PrefixV2.P256SecretKey)
      const unrevealedPkh = await unrevealedAcc.signer.publicKeyHash()
      const estimated = await Tz2.estimate.transfer({ to: unrevealedPkh, amount: 1 })
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(368)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(2101)
      expect(estimated?.storageLimit).toBe(277)

      const transferOp = await Tz2.contract.transfer({ to: unrevealedPkh, amount: 1 })
      await transferOp.confirmation()
      expect(transferOp.status).toBe('applied')
    })

    it('verify that originate fee and gas is sufficient', async () => {
      const estimated = await Tz2.estimate.originate({ code: "parameter unit; storage unit; code {CDR; NIL operation; PAIR};", storage: "unit" })
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(232)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(609)
      expect(estimated?.storageLimit).toBe(315)

      const originateOp = await Tz2.contract.originate({ code: "parameter unit; storage unit; code {CDR; NIL operation; PAIR};", storage: "unit" })
      await originateOp.confirmation()
      contractAddress = originateOp.contractAddress!
      expect(originateOp.status).toBe('applied')
    })

    it('verify that contractCall fee and gas is sufficient', async () => {
      const contract = await Tz2.contract.at(contractAddress)
      const method = contract.methodsObject.default(UnitValue)
      const estimated = await Tz2.estimate.contractCall(method)
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(195)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(404)
      expect(estimated?.storageLimit).toBe(0)

      const contractCallOp = await method.send()
      await contractCallOp.confirmation()
      expect(contractCallOp.status).toBe('applied')
    })

    it('verify that setDelegate fee and gas is sufficient', async () => {
      const estimated = await Tz2.estimate.setDelegate({ delegate: knownBaker, source: await Tz2.signer.publicKeyHash() })
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(161)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(100)
      expect(estimated?.storageLimit).toBe(0)

      const setDelegateOp = await Tz2.contract.setDelegate({ delegate: knownBaker, source: await Tz2.signer.publicKeyHash() })
      await setDelegateOp.confirmation()
      expect(setDelegateOp.status).toBe('applied')
    })

    it('verify that registerDelegate fee and gas is sufficient', async () => {
      const estimated = await Tz2.estimate.registerDelegate({})
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(161)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(100)
      expect(estimated?.storageLimit).toBe(0)

      const registerDelegateOp = await Tz2.contract.registerDelegate({})
      await registerDelegateOp.confirmation()
      expect(registerDelegateOp.status).toBe('applied')
    })

    it('verify that increase_paid_storage fee and gas is sufficient', async () => {
      const estimated = await Tz2.estimate.increasePaidStorage({ amount: 3, destination: contractAddress })
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(162)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(100)
      expect(estimated?.storageLimit).toBe(0)

      const increasePaidStorageOp = await Tz2.contract.increasePaidStorage({ amount: 3, destination: contractAddress })
      await increasePaidStorageOp.confirmation()
      expect(increasePaidStorageOp.status).toBe('applied')
    })

    it('verify that register_global_constant fee and gas is sufficient', async () => {
      const randomAnnots = () => crypto.randomBytes(3).toString('hex');
      const code = {
        prim: 'list',
        args: [{ prim: 'nat' }],
        annots: [`%${randomAnnots()}`]
      }

      const estimated = await Tz2.estimate.registerGlobalConstant({ value: code })
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(193)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(433)
      expect(estimated?.storageLimit).toBe(100)

      const registerGlobalConstantOp = await Tz2.contract.registerGlobalConstant({
        value: code,
      })
      await registerGlobalConstantOp.confirmation()
      expect(registerGlobalConstantOp.status).toBe('applied')
    })

    it('verify that update_consensus_key fee and gas is sufficient', async () => {
      const consensusAcc = await createAddress(PrefixV2.Ed25519Seed)
      const consensusPk = await consensusAcc.signer.publicKey()
      const estimated = await Tz2.estimate.batch([
        { kind: OpKind.DELEGATION, source: await Tz2.signer.publicKeyHash(), delegate: await Tz2.signer.publicKeyHash() },
        { kind: OpKind.UPDATE_CONSENSUS_KEY, pk: consensusPk }])
      // delegate estimate
      expect(estimated[1]?.suggestedFeeMutez).toBeGreaterThanOrEqual(161)
      expect(estimated[1]?.gasLimit).toBeGreaterThanOrEqual(100)
      expect(estimated[1]?.storageLimit).toBe(0)
      // update consensus key estimate
      expect(estimated[2]?.suggestedFeeMutez).toBeGreaterThanOrEqual(185)
      expect(estimated[2]?.gasLimit).toBeGreaterThanOrEqual(200)
      expect(estimated[2]?.storageLimit).toBe(0)

      const updateConsensusKeyOp = await Tz2.contract.batch()
        .withDelegation({ source: await Tz2.signer.publicKeyHash(), delegate: await Tz2.signer.publicKeyHash() })
        .withUpdateConsensusKey({ pk: consensusPk })
        .send()
      await updateConsensusKeyOp.confirmation()
      expect(updateConsensusKeyOp.status).toBe('applied')
    })

    it('verify that update_companion_key fee and gas is sufficient', async () => {
      const companionAcc = await createAddress(PrefixV2.BLS12_381SecretKey)
      const companionPk = await companionAcc.signer.publicKey()

      const estimated = await Tz2.estimate.batch([
        { kind: OpKind.DELEGATION, source: await Tz2.signer.publicKeyHash(), delegate: await Tz2.signer.publicKeyHash() },
        { kind: OpKind.UPDATE_COMPANION_KEY, pk: companionPk, proof: (await companionAcc.signer.provePossession!()).prefixSig }])

      // delegate estimate
      expect(estimated[1]?.suggestedFeeMutez).toBeGreaterThanOrEqual(161)
      expect(estimated[1]?.gasLimit).toBeGreaterThanOrEqual(100)
      expect(estimated[1]?.storageLimit).toBe(0)
      // update companion key estimate
      expect(estimated[2]?.suggestedFeeMutez).toBeGreaterThanOrEqual(458)
      expect(estimated[2]?.gasLimit).toBeGreaterThanOrEqual(1772)
      expect(estimated[2]?.storageLimit).toBe(0)

      const updateCompanionKeyOp = await Tz2.contract.batch()
        .withDelegation({ source: await Tz2.signer.publicKeyHash(), delegate: await Tz2.signer.publicKeyHash() })
        .withUpdateCompanionKey({ pk: companionPk, proof: (await companionAcc.signer.provePossession!()).prefixSig })
        .send()
      await updateCompanionKeyOp.confirmation()
      expect(updateCompanionKeyOp.status).toBe('applied')
    })

    it('verify that transferTicket fee and gas is sufficient', async () => {
      // prerequisite: issuing tickets
      const ticketContract = await Tz2.contract.at(knownTicketContract)
      const ticket = { ticketer: knownTicketContract, content_type: { prim: 'string' }, content: { string: 'Ticket' } };

      const Tz2Pkh = await Tz2.signer.publicKeyHash()
      const estimated = await Tz2.estimate.batch([
        {
          kind: OpKind.TRANSACTION, amount: 0, to: knownTicketContract, parameter: {
            entrypoint: 'default', value: {
              "prim": "Pair",
              "args": [{ "string": Tz2Pkh }, { "int": "3" }]
            }
          }
        },
        {
          kind: OpKind.TRANSFER_TICKET,
          ticketContents: ticket.content,
          ticketTy: ticket.content_type,
          ticketTicketer: ticket.ticketer,
          ticketAmount: 1,
          destination: knownBaker,
          entrypoint: 'default'
        }
      ])

      expect(estimated[2]?.suggestedFeeMutez).toBeGreaterThanOrEqual(362)
      expect(estimated[2]?.gasLimit).toBeGreaterThanOrEqual(1545)
      expect(estimated[2]?.storageLimit).toBe(0)

      const transferTicketOp = await Tz2.contract.batch()
      .withContractCall(ticketContract.methodsObject.default([Tz2Pkh, '3']))
      .withTransferTicket({
        ticketContents: ticket.content,
        ticketTy: ticket.content_type,
        ticketTicketer: ticket.ticketer,
        ticketAmount: 1,
        destination: knownBaker,
        entrypoint: 'default',
      }).send()
      await transferTicketOp.confirmation()
      expect(transferTicketOp.status).toBe('applied')
    })

    it('verify that smart_rollup_originate fee and gas is sufficient', async () => {
      const kernel = '23212f7573722f62696e2f656e762073680a6578706f7274204b45524e454c3d22303036313733366430313030303030303031323830373630303337663766376630313766363030323766376630313766363030353766376637663766376630313766363030313766303036303031376630313766363030323766376630303630303030303032363130333131373336643631373237343566373236663663366337353730356636333666373236353061373236353631363435663639366537303735373430303030313137333664363137323734356637323666366336633735373035663633366637323635306337373732363937343635356636663735373437303735373430303031313137333664363137323734356637323666366336633735373035663633366637323635306237333734366637323635356637373732363937343635303030323033303530343033303430353036303530333031303030313037313430323033366436353664303230303061366236353732366536353663356637323735366530303036306161343031303432613031303237663431666130303266303130303231303132303030326630313030323130323230303132303032343730343430343165343030343131323431303034316534303034313030313030323161306230623038303032303030343163343030366230623530303130353766343166653030326430303030323130333431666330303266303130303231303232303030326430303030323130343230303032663031303032313035323030313130303432313036323030343230303334363034343032303030343130313661323030313431303136623130303131613035323030353230303234363034343032303030343130373661323030363130303131613062306230623164303130313766343164633031343138343032343139303163313030303231303034313834303232303030313030353431383430323130303330623062333830353030343165343030306231323266366236353732366536353663326636353665373632663732363536323666366637343030343166383030306230323030303130303431666130303062303230303032303034316663303030623032303030303030343166653030306230313031220a'
      const parametersType = { prim: 'bytes' }
      const estimated = await Tz2.estimate.smartRollupOriginate({
        pvmKind: PvmKind.WASM2,
        kernel,
        parametersType,
      })
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(1191)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(1965)
      expect(estimated?.storageLimit).toBe(6572)

      const smartRollupOriginateOp = await Tz2.contract.smartRollupOriginate({
        pvmKind: PvmKind.WASM2,
        kernel,
        parametersType,
      })
      await smartRollupOriginateOp.confirmation()
      expect(smartRollupOriginateOp.status).toBe('applied')
    })

    it('verify that smart_rollup_add_messages fee and gas is sufficient', async () => {
      const message = ['0000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74']
      const estimated = await Tz2.estimate.smartRollupAddMessages({
        message,
      })
      expect(estimated?.suggestedFeeMutez).toBeGreaterThanOrEqual(213)
      expect(estimated?.gasLimit).toBeGreaterThanOrEqual(203)
      expect(estimated?.storageLimit).toBe(0)

      const smartRollupAddMessagesOp = await Tz2.contract.smartRollupAddMessages({
        message,
      })
      await smartRollupAddMessagesOp.confirmation()
      expect(smartRollupAddMessagesOp.status).toBe('applied')
    })
  });
})
