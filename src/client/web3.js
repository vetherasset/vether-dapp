import Web3 from 'web3'
import defaults from "../common/defaults"
import WETHER from '../artifacts/Wether.json'
import VETHER from '../artifacts/Vether3.json'
import VADERUTILS from '../artifacts/VaderUtils.json'
import UNISWAPPAIR from '../artifacts/UniswapPair.json'
import { BN2Str, oneBN } from '../common/utils'

const TESTNET = (process.env.REACT_APP_TESTNET === 'TRUE')

export const ETH = '0x0000000000000000000000000000000000000000'

export const getEtherscanURL = () => {
    if(TESTNET) {
        return "https://rinkeby.etherscan.io/"
    } else {
        return "https://etherscan.io/"
    }
}

export const wetherAddr = () => {
    if(TESTNET) {
        return '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
    } else {
        return '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
    }
}

export const vetherAddr = () => {
    if(TESTNET) {
        return '0x95d0c08e59bbc354ee2218da9f82a04d7cdb6fdf'
    } else {
        return '0x4ba6ddd7b89ed838fed25d208d4f644106e34279'
    }
}

export const vetherPools2Addr = () => {
    if(TESTNET) {
        return '0xCFE254e64Bb766bDb0998801F7b9F2E6762a92DB'
    } else {
        return '0x52DEcc80d5233d35d3E2dCdC0Ad2ba0373155c45'
    }
}

export const vaderRouterAddr = () => {
    if (TESTNET) {
        return null
    } else {
        return '0xAa5CCD27Aba925F6885D7A9AdeB54dFf22185d1C'
    }
}

export const vaderUtilsAddr = () => {
    if (TESTNET) {
        return null
    } else {
        return '0x2E74525c491954BE67E8847B087ed1c3C988635d'
    }
}

export const uniSwapAbi = () => {
    return UNISWAPPAIR.abi
}

export const wetherAbi = () => {
    return WETHER.abi
}

export const vetherAbi = () => {
	return VETHER.abi
}

export const vaderUtilsAbi = () => {
    return VADERUTILS.abi
}

export const getWeb3 = () => {
    return new Web3(Web3.givenProvider || "http://localhost:7545")
}

export const getUtilsContract = () => {
    var web3 = getWeb3()
    return new web3.eth.Contract(vaderUtilsAbi(), vaderUtilsAddr())
}

export const getVetherPrice = async () => {
    try {
        const web3_ = new Web3(new Web3.providers.HttpProvider(defaults.api.url))
        const poolContract = new web3_.eth.Contract(vaderUtilsAbi(), vaderUtilsAddr())
        return (Web3.utils.fromWei(await poolContract.methods.calcValueInToken(ETH, BN2Str(oneBN)).call()))
    } catch (err) {
        console.log(err)
    }
}

export const getAccounts = async (i) => {
    const web3_ = getWeb3()
    const accounts = await web3_.eth.getAccounts()
    return accounts[i]
}

export const getBalance = async (acc) => {
    return await getWeb3().eth.getBalance(acc)
}

export const vetherContract = () => {
    const abi_ = vetherAbi()
    const addr_ = vetherAddr()
    const web3_ = getWeb3()
    return new web3_.eth.Contract(abi_, addr_)
}

export const getVethBalance = async (acc) => {
    return await vetherContract().methods.balanceOf(acc).call()
}
