import Web3 from 'web3'
import WETHER from '../artifacts/Wether.json'
import VETHER from '../artifacts/Vether3.json'
import VETHERPOOLS from '../artifacts/VetherPools.json'
import VETHERPOOLS2 from '../artifacts/VetherPools2.json'
import VADERROUTER from '../artifacts/VaderRouter.json'
import VADERUTILS from '../artifacts/VaderUtils.json'
import UNISWAP from '../artifacts/UniswapPair.json'
import UNISWAPROUTER from '../artifacts/UniswapRouter.json'
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

export const vetherPoolsAddr = () => {
    if(TESTNET) {
        return '0xFc355B3FE802CCB65dA381dE4E0F7219FDD369E6'
    } else {
        return '0xa806Af507d0B05714CD08EAA0039B4A829016099'
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
        return '0xe16e64Da1338d8E56dFd8355Ba7642D0A79e253c'
    }
}

export const vaderUtilsAddr = () => {
    if (TESTNET) {
        return null
    } else {
        return '0x0f216323076dfe029f01B3DeB3bC1682B1ea8A37'
    }
}

export const wetherAbi = () => {
    return WETHER.abi
}

export const vetherAbi = () => {
	return VETHER.abi
}

export const vetherPoolsAbi = () => {
	return VETHERPOOLS.abi
}

export const vetherPools2Abi = () => {
	return VETHERPOOLS2.abi
}

export const vaderRouterAbi = () => {
    return VADERROUTER.abi
}

export const vaderUtilsAbi = () => {
    return VADERUTILS.abi
}

export const infuraAPI = () => {
    const apiKey = process.env.REACT_APP_INFURA_API
    if(TESTNET) {
        return ('https://rinkeby.infura.io/v3/' + apiKey)
    } else {
        return ('https://mainnet.infura.io/v3/' + apiKey)
    }
}

export const getWeb3 = () => {
    return new Web3(Web3.givenProvider || "http://localhost:7545")
}

export const uniSwapAddr = () => {
    if(TESTNET) {
        return '0x3696fa5ad6e5c74fdcbced9af74379d94c4b775a'
    } else {
        return '0x3696fa5ad6e5c74fdcbced9af74379d94c4b775a'
    }
}

export const uniSwapAbi = () => {
	return UNISWAP.abi
}

export const uniSwapRouterAddr = () => {
    if(TESTNET) {
        return '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
    } else {
        return '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
    }
}

export const uniSwapRouterAbi = () => {
	return UNISWAPROUTER.abi
}

export const getUniswapPriceEth = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
    const contract = new web3.eth.Contract(uniSwapAbi(), uniSwapAddr())
    const regExp = /e-(\d+)/
    let valueEth

    try {
        const pool = await contract.methods.getReserves().call()
        valueEth = pool.reserve1/pool.reserve0
        valueEth = valueEth.toString()
        valueEth = valueEth.replace(regExp, '')
        valueEth = Number(valueEth).toFixed(5)
    } catch(err) {
        valueEth = 0.00
        console.log(err)
    }
    return (valueEth)
}

export const getVetherPrice = async () => {
    const web3_ = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
    const poolContract = new web3_.eth.Contract(vetherPools2Abi(), vetherPools2Addr())
    let price

    try {
        price = await poolContract.methods.calcValueInAsset(BN2Str(oneBN), ETH).call()
    } catch (err) {
        console.log(err)
    }

    return(price)
}

export const getAccounts = async (i) => {
    let web3_ = getWeb3()
    let accounts = await web3_.eth.getAccounts()
    return accounts[i]
}

export const getBalance = async (acc) => {
    return await getWeb3().eth.getBalance(acc)
}

export const vetherContract = () => {
    let abi_ = vetherAbi()
    let addr_ = vetherAddr()
    let web3_ = getWeb3()
    return new web3_.eth.Contract(abi_, addr_)
}

export const getVethBalance = async (acc) => {
    return await vetherContract().methods.balanceOf(acc).call()
}