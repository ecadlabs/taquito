---
title: BeaconWallet singleton
author: Claude Barde
---

:::caution Outdated documentation
Since version 14, Taquito uses the beacon-dapp's `getDAppClientInstance` method instead of the `new DAppClient`. This new method ensures that only one instance is created. The same cached instance is returned if called multiple times.
:::

# How to use a single instance of the BeaconWallet?

> TL;DR: in order to avoid unexpected problems with the Beacon wallet instance, there should be only one __new BeaconWallet(options)__ in your whole app.

The `@taquito/beacon-wallet` package is a wrapper for the `Beacon SDK`. The Beacon SDK creates a peer-to-peer connection that must stay unique. If you try to create multiple instances of the Beacon wallet, you may encounter the following error: `[BEACON] It looks like you created multiple Beacon SDK Client instances. This can lead to problems. Only create one instance and re-use it everywhere`, encouraging you to keep a single instance of the Beacon wallet.  

In modern JavaScript frameworks, this can be achieved by passing the instance to the components through their props or by keeping the instance in the context (or state) of the dapp so that every component has access to the same instance.  

This is how this can be accomplished with 3 of the main JavaScript frameworks, [React](https://reactjs.org/), [Vue](https://vuejs.org/) and [Svelte](https://svelte.dev/).

## With React
### - Using "prop drilling"
It is possible to create a single instance of the `BeaconWallet` in one of the parent components and pass it down to its child components. This method can be preferred when there aren't many components down the tree. It becomes difficult to track when the instance is passed to many components and their props become redundant.  
   
Example:
```ts
const ParentComponent = () => {
    const [wallet, setWallet] = useState(new BeaconWallet(options));
    
    return <>
            <ChildComponent wallet={wallet} />
            <div wallet={wallet} />
        </>
}
    
const ChildComponent = ({wallet}) => {
    // component code
    
    return <>
            <OtherComponent wallet={wallet} />
            <OtherComponent wallet={wallet} />
            <OtherComponent wallet={wallet} />
        </>
}
    
const OtherComponent = ({wallet}) => {
    useEffect(() => {
        if(wallet.getActiveAccount()){
            ...
        }
    }, [])
}
```

### - Using the Context API and useContext
The Context API is the recommended way to set up the instance of the `BeaconWallet` as it ensures that a single instance is created and used by the different components of the application.  

Example:
```ts
const Context = React.createContext(undefined);

const ParentComponent = () => {
    const [wallet, setWallet] = useState(new BeaconWallet(options));   
    
    return (
        <Context.Provider value={wallet}>
            <ChildComponent />
            <div />
        </Context.Provider>
    )
}

const ChildComponent = () => {
    // component code
    
    return <>
            <OtherComponent />
            <OtherComponent />
            <OtherComponent />
        </>
}
    
const OtherComponent = () => {
    const context = useContext(Context);
    
    useEffect(() => {
        if(context.wallet.getActiveAccount()){
            ...
        }
    }, [])
}
```

## With Vue
### - Passing the instance through props
It is possible to do "prop drilling" in Vue and pass an instance of the `BeaconWallet` down to the children of a component. This method requires updating the value returned by the `data` method and catching the prop in the `props` array of the child component:
```ts
// In ParentComponent.vue
<script>
import ChildComponent from "./ChildComponent.vue";

export default {
    data() {
        const wallet = new BeaconWallet(options);
        
        return {
          wallet
        }
    },
    components: { ChildComponent },
}
</script>

<template>
  <ChildComponent :wallet="wallet" />
</template>
```
```ts
// In ChildComponent.vue
<script>
import OtherComponent from "./OtherComponent.vue";

export default {
    data() {
        return {
          wallet
        }
    },
    components: { OtherComponent },
    props: ["wallet"]
}
</script>

<template>
  <OtherComponent :wallet="wallet" />
  <OtherComponent :wallet="wallet" />
  <OtherComponent :wallet="wallet" />
</template>
```
```ts
// In OtherComponent.vue
<script>
export default {
    data() {
        ...
    },
    props: ["wallet"],
    mounted() {
        if(wallet.getActiveAccount()){
            ...
        }
    }
}
</script>

<template>
  ...
</template>
```

### - Using Vuex
If you want to be sure that all your components access a single instance of the `BeaconWallet`, the best solution is to use a store provided by `Vuex`. After creating the store, all your components can connect to the new store and access the instance of the `BeaconWallet`:
```ts
// In store.vue
import { createApp } from 'vue'
import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state () {
    return {
      wallet: new BeaconWallet(options)
    }
  },
  mutations: {
    ...
  }
})

const app = createApp({ /* your root component */ })

app.use(store)
```
```ts
// In your component
<script>
export default {
    data() {
        ...
    },
    mounted() {
        if(this.$store.state.wallet.getActiveAccount()){
            ...
        }
    }
}
</script>

<template>
  ...
</template>
```

## With Svelte
### - Passing the instance through props
Just like React and Vue, it is possible with Svelte to pass the instance through component props.  

Example:
```ts
// In ParentComponent.svelte
<script>
    import ChildComponent from "./ChildComponent.svelte";

    let wallet;

    onMount(() => {
        wallet = new BeaconWallet(options);
    })
</script>

<ChildComponent {wallet} />
```
```ts
// In ChildComponent.svelte
<script>
    import OtherComponent from "./OtherComponent.svelte";

    export let wallet;
</script>

<OtherComponent {wallet} />
<OtherComponent {wallet} />
<OtherComponent {wallet} />
```
```ts
// In OtherComponent.svelte
<script>
    import {onMount} from "svelte";

    export let wallet;

    onMount(() => {
        if(wallet.getActiveAccount()){
            ...
        }
    })
</script>

<div>Something</div>
```

### - Using a store
A Svelte store is the recommended way to store and use an instance of the `BeaconWallet`. You just need to import the store in the components that need access to the instance and you can be sure you have a single instance:  

Example:
```ts
// In store.ts
import { writable } from "svelte/store";

const wallet = new BeaconWallet(options);

const store = writable(wallet);

const state = {
  subscribe: store.subscribe,
  updateWallet: (wallet: BeaconWallet) =>
    store.update(store => wallet)
}

export default state;
```
```ts
// In ChildComponent.svelte
<script lang="ts">
    import OtherComponent from "./OtherComponent.svelte";
</script>

<OtherComponent />
```
```ts
// In OtherComponent.svelte
<script lang="ts">
    import {onMount} from "svelte";
    import wallet from "./store.ts"

    onMount(() => {
        if(wallet.getActiveAccount()){
            ...
        }
    })
</script>

<div>Something</div>
```