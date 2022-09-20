import { defineConfig } from "vite";
import path from "path";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default ({ command }) => {
  // const isBuild = command === "build";
  return defineConfig({
    plugins: [svelte()],
    define: {
      global: {}
    },
    build: {
      target: "esnext",
      commonjsOptions: {
        transformMixedEsModules: true
      }
    },
    server: {
      port: 3030
    },
    resolve: {
      alias: {
        // dedupe @airgap/beacon-sdk
        // I almost have no idea why it needs `cjs` on dev and `esm` on build, but this is how it works 🤷‍♂️
        "@airgap/beacon-dapp": path.resolve(
          path.resolve(),
          // "./src/walletbeacon.dapp.min.js"
          // `./node_modules/@airgap/beacon-dapp/dist/${
          //   isBuild ? "esm" : "cjs"
          // }/index.js`
          `./node_modules/@airgap/beacon-dapp/dist/walletbeacon.dapp.min.js`
        ),
        // polyfills
        "readable-stream": "vite-compatible-readable-stream",
        stream: "vite-compatible-readable-stream"
      }
    }
  });
};
