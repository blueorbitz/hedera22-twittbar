# Twittbar

## Getting started
1. install [Hashpack](https://www.hashpack.app) browser extension
1. install [Ngrok](https://ngrok.com)
1. `cd contract` & `yarn install`
1. rename `.env.sample` to `.env` and fill in the variable
1. `yarn build` - to build (rollup) the stratojs and `.sol` into a `dist/*.js` library for web-browser usage
1. copy `dist/hedera-strato.hashpack.js` to `nextapp/public/hedera-strato.hashpack-esm.js`.

1. `cd nextapp` & `yarn install`
1. rename `.env.local.sample` to `.env.local` and fill in the variable
1. `yarn dev`
1. start `ngrok http 3000` - This is needed due to "HashPack" only validate from `https://`.

# Reference link
- [Get started with smart contract](https://hedera.com/blog/how-to-deploy-smart-contracts-on-hedera-part-1-a-simple-getter-and-setter-contract)
- [Solidity Dev](https://remix.ethereum.org)
- [First contract Eg](https://docs.hedera.com/guides/getting-started/try-examples/deploy-your-first-smart-contract)
- [Oracle reference](https://github.com/provable-things/ethereum-api/blob/master/oraclizeAPI_0.5.sol)
- [Using Oracle Example](https://fravoll.github.io/solidity-patterns/oracle.html)
- [Next JS doc](https://nextjs.org/docs)
- [Hashconnect on Next](https://www.youtube.com/watch?v=5klHbH0LEdU)
- [Stratos JS](https://hsj-docs.buidlerlabs.com)
- [Stratos JS Sample](https://github.com/buidler-labs/hsj-example/blob/main/.env.sample)
- [Stratos JS Rollup Demo](https://github.com/buidler-labs/hsj-rollup-demo)
- [PR to fix fail example](https://github.com/buidler-labs/hsj-rollup-demo/pull/1)
- [Twitter DM](https://github.com/PLhery/node-twitter-api-v2/blob/77f48eb5e06e2a15fd0f6906adecc1678801f75d/doc/examples.md#direct-messages)