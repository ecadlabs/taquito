const fs = require("fs");

// const content = fs.readFileSync(
//     "./node_modules/@airgap/beacon-sdk/package.json",
//     { encoding: "utf8" }
//   );

//   const newContent = content
//     .split("dist/cjs/index.js")
//     .join("./dist/walletbeacon.min.js");

//   fs.writeFileSync("./node_modules/@airgap/beacon-sdk/package.json", newContent, {
//     encoding: "utf8",
//   });

content = fs.readFileSync(
  "./node_modules/@airgap/beacon-sdk/dist/walletbeacon.min.js",
  { encoding: "utf8" }
);

const newContent = content;

fs.writeFileSync(
  "./node_modules/@airgap/beacon-sdk/dist/cjs/index.js",
  newContent,
  {
    encoding: "utf8",
  }
);

fs.rmdirSync("./node_modules/@airgap/beacon-sdk/dist/esm", { recursive: true });
