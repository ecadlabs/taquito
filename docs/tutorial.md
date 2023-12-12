---
title: Tutorial
id: tutorial
author: Alireza Haghshenas
---

## Introduction

This tutorial will walk you through the process of creating a simple dApp using Taquito. We will:

1. Establish a high-level understanding of the blockchain, dApps, and Taquito
1. Create a simple command-line application that shows the balance of an address
1. Send a `Transfer` operation to the blockchain using Taquito
1. Interact with a smart contract using Taquito (mint an NFT on [objkt.com](https://objkt.com) NFT marketplace)
1. Implement a simple GUI to do the last step in a browser

If you are not interested in NFTs, don't worry; the concepts you learn are applicable to any dApp.

## Prerequisites

### Prior knowledge
In order to follow this tutorial, you need to have a basic understanding of the following concepts:
- Basic knowledge of JavaScript and programming in general
- A high-level understanding of blockchain technology and ecosystem (we will also cover this briefly in the tutorial)

### Development machine
We need a development machine with the following software installed:
- [Node.js](https://nodejs.org): one of the current versions (LTS recommended)
- A code editor: VS Code is recommended, but you can use your favorite editor

This tutorial should work on Windows, Linux, and macOS. On other systems like a Chromebook or a tablet, you might need additional setup not covered in the tutorial.

## What is a blockchain?

The blockchain is a way to trust a network of computers run by strangers (so you don't trust the individual people). It might seem impossible, but it works. How?

All computers that form a blockchain run the same software. They also store all the information needed to verify the integrity of the data. So anyone can verify that the data is correct. Techniques from cryptography are used to make this possible.

In order to work with a blockchain, a high level understanding is enough:

1. The blockchain is a network of computers that run the same software.
1. The blockchain stores data in a way that anyone can verify the integrity of the data.
1. The data is split into "blocks". Each block contains a list of operations (like sending some tokens from one account to another).
1. Once a block is created and the blockchain reaches a consensus on the information in it, it is impossible to change the data in the block.
1. In order to send an operation to the blockchain, you can send it to any of the nodes participating in the consensus. The node will forward the data to the other nodes.
1. In order to read data from the blockchain, you can send a request to any of the nodes.
1. Anyone can read data from the blockchain. But to send an operation to the blockchain, it needs to be cryptographically signed.

Like any complex system, the simple overview we just gave is vastly simplified by leaving out a lot of details, and avoiding unnecessary precision. I believe having a good mental model of the system is more important than being precise. As you keep working in the blockchain ecosystem, your mental model will become more accurate over time.

## What makes Tezos different?

Some interesting features in Tezos are designed to address the shortcomings of the earlier generations of blockchains. These features are:

1. Proof of stake (It is now being adopted by some other blockchains as well). This eliminates a big problem with earlier blockchains: the need for a lot of energy to run the network.
1. Evolution of the blockchain. Remember that the blockchain is a network of computers that run the same software. This means that if you want to upgrade the software, all the computers need to be upgraded at the same time. This is not easy to do. Tezos solves this problem by having evolution baked into the protocol. This means that the blockchain can evolve over time without the need for a "hard fork".
1. Delegation: Users can "delegate" their funds to a "baker". The baker will participate in the network consensus and will receive rewards. The baker will then share the rewards with the delegators. This makes it possible for users to participate in the network consensus without the need to run a node themselves, or to transfer their funds to a third party.

Different versions of Tezos protocol are named after historic cities. We are now in the "Nairobi" era. But the next protocol "Oxford" is being implemented and will be voted on soon.

The "mainnet" is the actual Tezos Blockchain. However, there are several "testnets" that are used for testing. One of them is named "ghostnet", and evolves to the new protocol much earlier than the mainnet, so that the ecosystem has enough time to implement features related to the new protocol and test them.

## Let's start with a simple command-line application

In this section, we will create a simple command-line application that shows the balance of an address. This will help us understand the basics of Taquito and the flow of events in a dApp.

Open a terminal and run the following commands:

```bash
mkdir my-cli-dapp
cd my-cli-dapp

npm init -y
npm install -D typescript ts-node
```

Then create a file named `index.ts` in the folder `my-cli-dapp` and add the following code:

```ts
console.log("Hello Tezos!");
```

Now, run the following command in the terminal:

```bash
npx ts-node index.ts
```

If everything is done right, you should be able to see the output `Hello Tezos!` in the terminal.
Now, we can start using Taquito to interact with the Tezos blockchain.

```bash
npm install -s @taquito/taquito
```

Now, open the file `index.ts` and replace the code with the following:

```ts
import { TezosToolkit } from "@taquito/taquito";

var tezosToolkit = new TezosToolkit("https://ghostnet.ecadinfra.com");
// TODO: ghostnet needs to be introduced

tezosToolkit.tz.getBalance("tz1YvE7Sfo92ueEPEdZceNWd5MWNeMNSt16L").then(balance => {
    console.log(balance.toNumber());
});
```

running `npx ts-node index.ts` should now show the balance of the specified address.

Congratulations! You have just interacted with the Tezos blockchain using Taquito.

## Sending a `Transfer` operation to the blockchain using Taquito

Now we want to send an operation to the blockchain. When reading, we just sent a read request. When sending an operation, we need to prove that we own the address. To do this, we need to sign the operation with the private key of the address.

In the next step, we will simply store the private key in the source code. This is not secure, and you should never do this in a production application.

Open the file `index.ts` and replace the code with the following:

```ts
import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";

async function main() {
    var tezosToolkit = new TezosToolkit("https://ghostnet.ecadinfra.com");

    // WARNING: DO NOT DO THIS IN PRODUCTION, KEEP YOUR SECRETS SAFE
    const signer = await InMemorySigner.fromSecretKey('spsk29SxqYRjnreqGzsYiAUEqxyhDwD8j2J57pJjaGgGtReZVD2UiD');

    const pkh = await signer.publicKeyHash();
    console.log(pkh);

    tezosToolkit.setProvider({ signer });

    const op = await tezosToolkit.contract.transfer({ to: 'tz1YvE7Sfo92ueEPEdZceNWd5MWNeMNSt16L', amount: 1 });
    await op.confirmation();

    console.log(op.hash);
}

main().catch(console.error);
```

Now if you run your app, you should be able to see the address of the signer (`tz2DZLWLuDRKUuR4BrWetimZ1C6Pg6pPAo3n`) and the hash of the operation in the terminal.

What is happening here? Let's break it down:

1. We create a new instance of `TezosToolkit` and pass the URL of the node we want to connect to.
1. We create a new instance of `InMemorySigner` and pass the private key of the address we want to use to sign the operation.
1. We get the public key hash of the address.
1. We set the provider of the `TezosToolkit` instance to the signer we created in step 2.
1. We send a `Transfer` operation to the blockchain.
1. We wait for the operation to be included in a block.
1. We print the hash of the operation.

For the purpose of this section, I have created a new address and funded it on testnet. You are sharing the same secret key with everyone else doing this tutorial. So don't use this address for anything important.

<details>
  <summary>How to create my own public/private key pair?</summary>
  
  Most users can simply use a wallet to create addresses. This is useful for dApps that run inside a browser. If you are running a dApp as a desktop, mobile, or server process, you can create your own key pair. Here is how you can do it:

  ```bash
    docker run --pull always -it --entrypoint sh docker.io/tezos/tezos:latest

    # inside the docker container
    octez-client -E https://ghostnet.ecadinfra.com gen keys mysamplekey -s secp256k1
    octez-client -E https://ghostnet.ecadinfra.com show address mysamplekey -S
  ```
  The new address you just created has a balance of zero. For the testnet, You can go to [faucet.ghostnet.teztnets.xyz](https://faucet.ghostnet.teztnets.xyz/) and send some ꜩ to it for free.

  On mainnet, you need to buy actual Tez on an exchange.
</details>

Congratulations! You have just sent an operation to the Tezos blockchain using Taquito.

## Interacting with a smart contract using Taquito

In this section, we will interact with a smart contract using Taquito. We will mint an NFT on [objkt.com](https://objkt.com) NFT marketplace.

Well, objk.com is the production service. We will use the testnet one: [ghostnet.objkt.com](https://ghostnet.objkt.com/) because to mint NFT on it you only need ghostnet ꜩ which is free, also because I want to put my test secret key here, and I don't like to share my mainnet secret key with actual ꜩ in it with everyone.

Most dApps interact with smart contracts. You can think of a smart contract as a program that runs on the blockchain. The smart contract can store data and execute code. The code is executed when a user sends an operation to one of the smart contract's `entrypoint`s. The smart contract can also send operations to the blockchain, or to other smart contracts.

In Tezos, smart contracts are written using one of the high-level languages (like Ligo), and compiled to Michelson. Then the contract is originated (deployed) to the blockchain. During origination, an address prefixed with `KT1` is created for the contract. You can then interact with the smart contract by sending operations to this address.

In objkt.com, any user can create a number of collections and then mint NFTs in any of these collections. I have already created a collection and made our test address (`tz2DZLWLuDRKUuR4BrWetimZ1C6Pg6pPAo3n`) an operator of the collection. So this user can now mint NFTs in this collection. Check out the collection [here](https://ghostnet.objkt.com/collection/KT1XmD31NdBrTcL7bPF3md6i5g4BbE6s2YLv), and note the number of tokens in it.

Open the file `index.ts` and change the `main` function to the following:

```ts
async function main() {
    var tezosToolkit = new TezosToolkit("https://ghostnet.ecadinfra.com");

    const signer = await InMemorySigner.fromSecretKey('spsk29SxqYRjnreqGzsYiAUEqxyhDwD8j2J57pJjaGgGtReZVD2UiD');
    tezosToolkit.setProvider({ signer });

    const contract = await tezosToolkit.contract.at('KT1JarALvhDLjtFhraeTMGGoeNLUkuL6jGtM');
    const op = await contract.methodsObject.mint_artist({
        collection_id: 71947,
        editions: 1,
        metadata_cid: '697066733a2f2f516d52325672336775713467594d45366268676b47474a34714656647652786867766e47516d7a6672346d364635',
        target: 'tz2DZLWLuDRKUuR4BrWetimZ1C6Pg6pPAo3n'
    }).send();

    await op.confirmation();

    console.log(op.hash);
}
```

Now if you run your app, you should be able to see the hash of the operation in the terminal.
After about a minute, you should be able to see the new NFT in the collection. Because everyone following this tutorial is minting NFTs with the same metadata, all the NFTs in this collection will look the same. But the number of tokens in the collection should increase by one.

Congratulations! You have just interacted with a smart contract using Taquito. Additionally, you programmatically minted an NFT.

Up until now, we created programs that run in a terminal. While some of the code written to interact with the blockchain might actually be such an application, most of the time, we will create a dApp that can be accessed in the browser.

For these "browser dApps", there is a problem: how do we sign the operations? We can't store the secret key in the source code because anyone can see it. We also should not ask users to enter their secret key in our dApp, because that requires them to fully trust our dApp.

As it turns out, there is an elegant solution to this problem.

## Architectural overview of dApps

A dApp is a web application that interacts with a blockchain. The blockchain is the source of truth for the dApp. The dApp interacts with the user, reads data from, and writes to the blockchain. The dApp might also communicate with other services, notably a blockchain indexer.

```mermaid
C4Component
title Component diagram for a Tezos based dApp

Person(user, User, "The end user of the dApp")
System_Ext(wallet, "User's Wallet", "Keeping user's secrets<br> signs operations")
System_Ext(blockchain, "Tezos Blockchain", "The source of truth for data")
System_Ext(indexer, "A blockchain<br> indexer/explorer", "Stores a searchable copy of<br> the blockchain")

Container_Boundary(c1, "the dApp") {
    Component(ui, "The User Interface", "HTML/CSS/Javascript", "The visual part of the dApp<br> shows data to the user<br> accepts user input")
    Component(taquito, "Taquito", "", "Abstracts away the complexity of<br> interacting with the blockchain")
    Container(beacon_sdk, "Beacon Sdk", "", "Abstracts away the complexity of<br> interacting with the user's wallet")

    Rel(ui, taquito, "Calls functions in")
    UpdateRelStyle(ui, taquito, $offsetX="-50", $offsetY="10")
    Rel(taquito, beacon_sdk, "sends operations<br> to be signed by")
    UpdateRelStyle(taquito, beacon_sdk, $offsetX="-50", $offsetY="20")
}
Rel(user, ui, "Interacts with")
UpdateRelStyle(user, ui, $offsetY="-20")

Rel(beacon_sdk, wallet, "Sends operations<br> to be signed by")
UpdateRelStyle(beacon_sdk, wallet, $offsetX="-190", $offsetY="-90")

Rel(wallet, blockchain, "Injects signed<br> operations to")
UpdateRelStyle(wallet, blockchain, $offsetX="-45", $offsetY="15")

Rel(taquito, blockchain, "Sends read-only<br> requests to")
UpdateRelStyle(taquito, blockchain, $offsetX="-50", $offsetY="-80")

Rel(blockchain, taquito, "Sends responses to")
UpdateRelStyle(blockchain, taquito, $offsetX="75", $offsetY="-90")

Rel(indexer, blockchain, "reads data from")
UpdateRelStyle(indexer, blockchain, $offsetX="-40", $offsetY="-20")

Rel(ui, indexer, "reads data from")
UpdateRelStyle(ui, indexer, $offsetX="150", $offsetY="-80")

Rel(wallet, user, "shows operations<br> to be signed to")
UpdateRelStyle(wallet, user, $offsetX="-40", $offsetY="30")
```

## The flow of events in the dApp

Here is a high-level summary of the flow of events in the dApp:
1. The user visits the dApp in their browser (by entering the URL or clicking on a link)
1. The browser loads the dApp's code from a web server
1. The dApp is loaded, and the user can interact with it
1. At this stage, the dApp can read data from the blockchain, as long as the data does not need to be limited to a specific user (in our example dApp, the list of ideas can be read by anyone, but to show a list of user's ideas or votes, the dApp needs to know who the user is)
1. The user makes an interaction that requires connecting the wallet
1. The dApp shows a popup to the user, asking them to choose a wallet to connect to
1. The user selects a wallet
1. The user visits their wallet (on their phone, computer, a browser extension, in another tab, or even a hardware wallet) and approves the connection
The user revisits the dApp. This time, the dApp might be showing additional information (such as the user's ideas or votes) or allowing the user to send operations to the blockchain (such as registering an idea or voting on an idea)
1. The user makes an interaction that requires sending an operation to the blockchain
1. The dApp sends the operation to the wallet
1. The wallet shows the operation to the user and asks them to approve it
1. The user approves the operation
1. The wallet sends the signed operation to the blockchain
1. The blockchain processes the operation
1. The dApp can wait for the operation to be included in a block
1. The dApp can read the result of the operation from the blockchain

## Creating a simple dApp that transfers ꜩ from the user's wallet to another address

We will start by creating a simple dApp that transfers ꜩ from the user's wallet to another address. This will help us understand the flow of events in a dApp and the role of Taquito and Beacon SDK in the process.
After that, we will add a smart contract to the mix and create a more complex dApp.

### creating the React app

Open your terminal and run the following commands:

```bash
npm create vite@latest my-dapp -- --template react-ts
cd my-dapp
npm i
npm run dev
```

Now open a browser and visit `http://localhost:4173/`. You should see a page that says: "Hello, Vite + React".

<details>
  <summary>Optional: Commit the initial code to git</summary>
```bash optional
git init #optional
git add . #optional
git commit -m "initial commit" #optional
```
</details>

### adding Taquito and Beacon SDK to the React app

In the next step, we add Taquito and Beacon SDK to the React app, and create a minimal UI to connect to the wallet and transfer ꜩ.

```bash
git init #optional
git add . #optional
git commit -m "initial commit" #optional
npm install @taquito/taquito @taquito/beacon-wallet
```

Open the file `index.html` and make the following changes:

```diff
-    <title>Vite + React</title>
+    <title>My dApp</title>
```

Open the file `src/App.css` and make the following changes:

```tsx
import { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import "./App.css";
import ConnectButton from "./components/ConnectWallet";
import Transfer from "./components/Transfer";
import { BeaconWallet } from "@taquito/beacon-wallet";

const App = () => {
  const [Tezos] = useState<TezosToolkit>(
    new TezosToolkit("https://ghostnet.ecadinfra.com")
  );
  const [wallet, setWallet] = useState<BeaconWallet | undefined>(undefined);
  const [userAddress, setUserAddress] = useState<string | undefined>(undefined);

  switch (userAddress) {
    case undefined: return <ConnectButton
      Tezos={Tezos}
      setUserAddress={setUserAddress}
      setWallet={setWallet}
      wallet={wallet}
    />;
    default: return <Transfer
      Tezos={Tezos}
    />;

  }
};

export default App;
```

### Connecting to the wallet

The first step in interacting with the blockchain is connecting to the user's wallet. Taquito provides a BeaconWallet class that abstracts away the complexity of connecting to the wallet. The BeaconWallet class is a wrapper around the Beacon SDK. The Beacon SDK is a library that provides a standard way for dApps to connect to wallets. The Beacon SDK supports several wallets, including Thanos, Temple, and Kukai.

Create a new file `src/components/ConnectWallet.tsx` and add the following code:

```tsx
import { Dispatch, SetStateAction, useEffect } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import {
  NetworkType,
} from "@airgap/beacon-dapp";

type ButtonProps = {
  Tezos: TezosToolkit;
  setUserAddress: Dispatch<SetStateAction<string | undefined>>;
  setWallet: Dispatch<SetStateAction<BeaconWallet | undefined>>;
  wallet: BeaconWallet | undefined;
};

const ConnectButton = ({
  Tezos,
  setUserAddress,
  setWallet,
  wallet,
}: ButtonProps): JSX.Element => {
  const connectWallet = async (): Promise<void> => {
    try {
      await wallet!.requestPermissions({
        network: {
          type: NetworkType.GHOSTNET,
          rpcUrl: "https://ghostnet.ecadinfra.com",
        },
      });
      const userAddress = await wallet!.getPKH();
      setUserAddress(userAddress);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      const wallet = new BeaconWallet({
        name: "My dApp",
        preferredNetwork: NetworkType.GHOSTNET,
        disableDefaultEvents: false,
      });
      Tezos.setWalletProvider(wallet);
      setWallet(wallet);
    })();
  }, []);

  return (
    <div className="buttons">
      <button className="button" onClick={connectWallet}>
        <span>
          <i className="fas fa-wallet"></i>&nbsp; Connect wallet
        </span>
      </button>
    </div>
  );
};

export default ConnectButton;

```

### Transferring ꜩ from the user's wallet to another address

After you connect to the wallet, you can send operations to the blockchain. In this step, we will create a simple UI to transfer ꜩ from the user's wallet to another address.

Create a new file `src/components/Transfer.tsx` and add the following code:

```tsx
import { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";

const Transfer = ({
  Tezos,
}: {
  Tezos: TezosToolkit;
}): JSX.Element => {
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sendTez = async (): Promise<void> => {
    if (recipient && amount) {
      setLoading(true);
      try {
        const op = await Tezos.wallet
          .transfer({ to: recipient, amount: parseInt(amount) })
          .send();
        await op.confirmation();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div id="transfer-inputs">
      Recipient: <input
        type="text"
        placeholder="Recipient"
        value={recipient}
        onChange={e => setRecipient(e.target.value)}
      />
      <br />
      Amount in uTez:<input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <br />
      <button
        className="button"
        disabled={!recipient && !amount}
        onClick={sendTez}
      >
        {loading ? (
          <span>
            <i className="fas fa-spinner fa-spin"></i>&nbsp; Sending...
          </span>
        ) : (
          <span>
            <i className="far fa-paper-plane"></i>&nbsp; Send
          </span>
        )}
      </button>
    </div>
  );
};

export default Transfer;

```

<details>
  <summary>Fixing node-specific dependencies in browser</summary>
The libraries Taquito and Beacon SDK are designed to run in a Node.js environment. However, we are running them in a browser. This causes some issues. For example, the Beacon SDK uses the Node.js `buffer`, `stream`, and `util` modules. These modules are not available in the browser. Fortunately, there are browser-compatible versions of these modules. We can use these versions instead of the Node.js versions. To do this, we need to install the following packages:

```bash
npm i --save buffer stream-browserify util
```

Now we need to tell Vite to use these packages instead of the Node.js versions. To do this, open the file `vite.config.ts` and add the following code:

```tsx
import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";

export default defineConfig({
  define: {
    global: {},
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      buffer: "buffer",
      stream: "stream-browserify",
      util: "util",
    },
  },
});
```

Also, create a file named `src/polyfills.ts` and add the following code:

```tsx
import { Buffer } from "buffer";

globalThis.Buffer = Buffer;
```
Also, add the following code to the file `index.html`:

```diff
    <div id="root"></div>
+    <script type="module" src="/src/polyfills.ts"></script>
    <script type="module" src="/src/main.tsx"></script>
  </body>

```
</details>

Make sure that the command `npm run dev` is still running in the terminal, and there are no build errors.

## Closing thoughts





### What is needed to make the dApp production-ready






### What's next




