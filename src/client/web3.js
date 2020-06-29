import Web3 from 'web3'
import VETHER from '../artifacts/Vether3.json'
import UNISWAP from '../artifacts/UniswapPair.json'
import REGISTRY from '../artifacts/UniswapRegistry.json'

const TESTNET = (process.env.REACT_APP_TESTNET === 'TRUE') ? true : false

export const getEtherscanURL = () => {
    if(TESTNET) {
        return "https://rinkeby.etherscan.io/"
    } else {
        return "https://etherscan.io/"
    }
}

export const vetherAddr1 = () => {
    if(TESTNET) {
        return '0x3aaC4384E118388076C7E4085f39d364781D8604'
    } else {
        return '0x31Bb711de2e457066c6281f231fb473FC5c2afd3'
    }
}

export const vetherAddr2 = () => {
    if(TESTNET) {
        return '0x53753efb66b420fe461263e190fbb45f40ba1f79'
    } else {
        return '0x75572098dc462F976127f59F8c97dFa291f81d8b'
    }
}

export const vetherAddr = () => {
    if(TESTNET) {
        return '0x68BDD33B0185b3Bf97Da0DEeC0f6d8EF2525193F'
    } else {
        return '0x75572098dc462F976127f59F8c97dFa291f81d8b'
    }
}

export const vetherAbi = () => {
	return VETHER.abi
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
        return '0x8ccfbbcdeb7c9bb62e545a20a3b43b05a04e3682'
    } else {
        return '0x8ccfbbcdeb7c9bb62e545a20a3b43b05a04e3682'
    }
}

export const uniSwapAbi = () => {
	return UNISWAP.abi
}

export const registryAddr = () => {
    if(TESTNET) {
        return '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
    } else {
        return '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
    }
}

export const registryAbi = () => {
	return REGISTRY.abi
}

export const getUniswapPriceEth = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
    const contract = new web3.eth.Contract(uniSwapAbi(), uniSwapAddr())
    const regExp = /e-(\d+)/;
    let valueEth;

    try {
        const pool = await contract.methods.getReserves().call()
        valueEth = pool.reserve1/pool.reserve0
        valueEth = valueEth.toString()
        valueEth = valueEth.replace(regExp, '')
        valueEth = Number(valueEth).toFixed(6)
    } catch(err) {
        valueEth = 0.00
        console.log(err)
    }
    return (valueEth)
}

export const getExchangeAddr = async (token) =>{
    const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
    const registry = new web3.eth.Contract(registryAbi(), registryAddr())
    const exchange = await registry.methods.getExchange(token).call()
    console.log(exchange, token)
    return exchange
}

export const getUniswapDetails = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
    const contract = new web3.eth.Contract(vetherAbi(), vetherAddr())
    const ethBalance = convertFromWei(await web3.eth.getBalance(uniSwapAddr()))
	const vethBalance = convertFromWei(await contract.methods.balanceOf(uniSwapAddr()).call())
    return {"eth":ethBalance, "veth":vethBalance, address:uniSwapAddr()}
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

function convertFromWei(number) {
    return number / 1000000000000000000
}
