# Vether - A strictly scarce asset

![Vether-UI](https://github.com/vetherasset/vether-dapp/blob/master/git/vether-ui.png)

## DApp Interface

The Vether DApp interfaces to the Vether Smart Contracts.

## Building Locally

**Configuration**

* Set up `.env` to have as a minimum:
```
REACT_APP_TESTNET=FALSE
REACT_APP_INFURA_API=<your-key>
REACT_APP_ETHPLORER_API=freekey
REACT_APP_BLOCKLYTICS_API=<can-leave-empty>
```

```
yarn
yarn start
```

## Deployment

All merges to `dev` branch deploy to: 
* https://vether-dapp-dev.web.app

*Testing should be done following a new deploy, prior to merging to master.*

All merges to `master` (from dev) deploy to:
* https://vetherasset.org (main)
* https://vetherasset.app (mirror)

## Implementation

* React (functional components & hooks)
* Javascript
* AntDesign
* AntDesignIcons
