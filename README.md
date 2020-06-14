# Vether - A strictly scarce asset

![Vether-UI](https://github.com/vetherasset/vether-dapp/blob/master/git/vether-ui.png)

## DApp Interface

The Vether DApp interfaces to the Vether Smart Contracts.

## Building Locally

**Configuration**

* Ensure the `DeployedVether.json` file matches the ABI of the Vether Smart Contract. 
* Ensure the `vetherAddr()` function in `src/client/web3.js` returns the Vether Contract address.
* Ensure the `infuraAPI()` function in `src/client/web3.js` returns a valid Infura API.

```
yarn
yarn start
```

## Deployment

All merges to `dev` branch deploy to: 
* vether-dapp-dev.web.app

*Testing should be done following a new deploy, prior to merging to master.*

All merges to `master` (from dev) deploy to:
* vetherasset.org (main)
* vetherasset.app (mirror)

## Implementation

* React (functional components & hooks)
* Javascript
* AntDesign
* AntDesignIcons


## Scraper

A contract scraper is provided to scrape all Eras and Days for:
* Burnt Ether
* Claimed Vether
* Vether Remaining

```bash
cd data
node scrape.js
```

This will be the basis for future graphs and analysis. 

