# Decentralized Pinterest

### https://depinterest.vercel.app/

[View the deployed contract](https://ropsten.etherscan.io/address/0x0ecf210b6c62F790160bA346589267a6314aAE6b)

## Project description
My idea for blockchain bootcamp is to create a decentralized pinterest where people can share images. People can also like images shared by others. This action transfers some amount of cryptocurrency (0.01 ETH) to the author of the image being liked.
The idea is to move away from Pinterest having central authority over the platform. This ensures decentralized uploading of images
and allows people to appreciate art by tipping the author of the image. 

### Use cases :
- Users should be able to upload image
- Users should be able to scroll through their feed and see all the images uploaded across the globe
- Users should be able to tip any image they like with 0.01 ETH
- User is shown tip confirmation with some level of determinis

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
[Youtube Link](https://www.youtube.com/watch?v=emnChd3ZPpI)

## Public Ethereum wallet for certification:

`0x9fd84217708c3360F50372533f57B35Aaa2B9606`


## Happy Path Workflow

1. Enter the website
2. Login with Metamask
3. Browse the images
4. Select an image
5. Pay a tip to the image author with Metamask (smart contract call) as a token of appreciation.
6. The tip is successful after there are 2 Block confirmations added to the chain as a guard rail.

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