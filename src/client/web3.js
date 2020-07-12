import Web3 from 'web3'
import WETHER from '../artifacts/Wether.json'
import VETHER from '../artifacts/Vether3.json'
import UNISWAP from '../artifacts/UniswapPair.json'
import ROUTER from '../artifacts/Router.json'

const TESTNET = (process.env.REACT_APP_TESTNET === 'TRUE') ? true : false

export const getEtherscanURL = () => {
    if(TESTNET) {
        return "https://rinkeby.etherscan.io/"
    } else {
        return "https://etherscan.io/"
    }
}

export const wetherAddr = () => {
    if(TESTNET) {
        return null
    } else {
        return '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
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
        return '0x01217729940055011F17BeFE6270e6E59B7d0337'
    }
}

export const vetherAddr = () => {
    if(TESTNET) {
        return '0xe4A4616b053affD80a3EaD0b15C30BbCD3872868'
    } else {
        return '0x4ba6ddd7b89ed838fed25d208d4f644106e34279'
    }
}

export const wetherAbi = () => {
    return WETHER.abi
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
        return null
    } else {
        return '0x3696fa5ad6e5c74fdcbced9af74379d94c4b775a'
    }
}

export const uniSwapAbi = () => {
	return UNISWAP.abi
}

export const uniSwapRouterAddr = () => {
    if(TESTNET) {
        return null
    } else {
        return '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
    }
}

export const uniSwapRouterAbi = () => {
	return ROUTER.abi
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
        valueEth = Number(valueEth).toFixed(5)
    } catch(err) {
        valueEth = 0.00
        console.log(err)
    }
    return (valueEth)
}

export const getUniswapDetails = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
    const contract = new web3.eth.Contract(vetherAbi(), vetherAddr())
    const wrappedEther = new web3.eth.Contract(wetherAbi(), wetherAddr())
    const ethBalance = convertFromWei(await wrappedEther.methods.balanceOf(uniSwapAddr()).call())
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
