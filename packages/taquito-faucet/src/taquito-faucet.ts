import { InMemorySigner } from "@taquito/signer";
import { RemoteSigner } from "@taquito/remote-signer";
import axios from 'axios';

export interface MapleFaucetConfig {
  apiKey: string;
  endpoint?: string;
  network: string
  type: 'FRESH' | 'EPHEMERAL'
}

export const fromMapleFaucet = async (config: MapleFaucetConfig) => {
  console.log(config.apiKey)
  const response = await axios.get(`${config.endpoint ?? 'https://faucet.tezosmaple.com'}/${config.network}`, {
    headers: {
      "Authorization": config.apiKey
    }
  })
  if (config.type === 'EPHEMERAL') {
    console.log(response.data)
    const { id, pkh } = response.data;
    const url = `${config.endpoint ?? 'https://faucet.tezosmaple.com'}/${config.network}/${id}`;
    console.log(url)
    return new RemoteSigner(pkh, url, {
      headers: {
        "Authorization": config.apiKey
      }
    })
  } else {
    return InMemorySigner.fromSecretKey(response.data)
  }
}
