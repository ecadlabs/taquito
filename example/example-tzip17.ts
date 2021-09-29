import { TezosToolkit } from "@taquito/taquito";
import { InMemorySigner } from "@taquito/signer";
import { tzip17 } from '../packages/taquito-tzip17/src/composer';

async function example() {
  try {
    const signer: any = new InMemorySigner('edskRtmEwZxRzwd1obV9pJzAoLoxXFWTSHbgqpDBRHx1Ktzo5yVuJ37e2R4nzjLnNbxFU4UiBU1iHzAy52pK5YBRpaFwLbByca');

    const aliceAddress = "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb";
    const bobAddress = "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6";

    const tezos = new TezosToolkit('https://granadanet.api.tez.ie');
    tezos.setSignerProvider(signer);

    const contract = await tezos.contract.at("KT1ShFVQPoLvekQu21pvuJst7cG1TjtnzdvW", tzip17)
    const permit = await contract.tzip17().methods.transfer(aliceAddress, bobAddress, 14).createPermit();
    console.log(permit);

  } catch (ex) {
    console.error(ex);
  }
}

// tslint:disable-next-line: no-floating-promises
example();
