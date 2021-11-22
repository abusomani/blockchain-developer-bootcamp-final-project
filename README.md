# Decentralized Pinterest
## Project description
My idea for blockchain bootcamp is to create a decentralized pinterest where people can share images. People can also like images shared by others. This action transfers some amount of cryptocurrency (0.1 ETH) to the author of the image being liked.

## Installation:

### Prerequisites

- Install [Node.js >= v14](https://nodejs.org/en/download/)
- Install [Truffle](https://www.trufflesuite.com/docs/truffle/getting-started/installation) and [Ganache](https://www.trufflesuite.com/ganache)
- Yarn
- `git checkout main`
- Install [MetaMask](https://metamask.io/) extension in your browser

### Contracts

- Run `yarn install` in project root to install Truffle build and smart contract dependencies
- Run local testnet in port `7545` with an Ethereum client, e.g. Ganache
- `truffle migrate --network development`
- `truffle console --network development`
- Run tests in Truffle console: `test`
- `development` network id is 1337, remember to change it in Metamask as well!

### Frontend

- `cd client`
- `yarn install`
- `yarn start`
- Open `http://localhost:3000`

### How to populate locally deployed contract with listings

- `truffle migrate --network development`
- `truffle console --network development`
- `let dp = await Depinterest.deployed()`
- Add two images:
- `dp.uploadImage("https://images.hdqwalls.com/wallpapers/doge-to-the-moon-05.jpg", "Doge coin is the best. Wohhooo!")`
- `dp.uploadImage("https://themarketperiodical.com/wp-content/uploads/2021/08/s2-3.jpg", "Solana is the future folks.")`
- Send ETH to local wallet: `web3.eth.sendTransaction({ from: "<your local address>", to: "<your local network wallet>", value: web3.utils.toWei("10") })`
- `cd client && yarn start`
- Open local ui from `http://localhost:3000`
- Make sure your Metamask localhost network is in port `7545` and chain id is `1337`.
- If you get `TXRejectedError` when sending a transaction, reset your Metamask account from Advanced settings.

## Screencast link

TBU

## Public Ethereum wallet for certification:

`TBU`


## Simple workflow

1. Enter website
2. Login with Metamask
3. Browse images
4. Select image
5. Pay a tip to the image author with Metamask (smart contract call)

## Directory structure

- `client`: Project's React frontend.
- `contracts`: Smart contracts that are deployed in the Ropsten testnet.
- `migrations`: Migration files for deploying contracts in `contracts` directory.
- `test`: Tests for smart contracts.

## Documentation
Run this command to generate the documntaion for the smart contract. The generated \*.md files wil appear in the `docs/` folder. 
```
npx solidity-docgen --solc-module solc-0.8 
```

## Environment variables (not needed for running project locally)

```
ROPSTEN_INFURA_PROJECT_ID=
ROPSTEN_MNEMONIC=
```

## TODO features

- Fund withdrawal
- Custom tipping