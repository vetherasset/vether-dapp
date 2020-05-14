import Web3 from 'web3'
import VETHER from '../artifacts/DeployedVether.json'
import UNISWAP from '../artifacts/UniswapExchange.json'
require('dotenv').config({path:"./.env"})
//import ERC20 from '../artifacts/ERC20.json'
// import TOKEN1 from '../artifacts/Token1.json'
// import TOKEN2 from '../artifacts/Token2.json'
// import TOKEN3 from '../artifacts/Token3.json'


export const vetherAddr = () => {
	return '0x31Bb711de2e457066c6281f231fb473FC5c2afd3'
}

export const vetherAbi = () => {
	return VETHER.abi
}

export const infuraAPI = () => {
	return 'https://mainnet.infura.io/v3/9c3ac79a15634ba2be4be91580218365'
}

export const getWeb3 = () => {
    return new Web3(Web3.givenProvider || "http://localhost:7545") 
}

export const uniSwapAddr = () => {
    return `0x506D07722744E4A390CD7506a2Ba1A8157E63745`
}

export const uniSwapAbi = () => {
	return UNISWAP.abi
}

export const getUniswapPriceEth = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
    const contract = new web3.eth.Contract(uniSwapAbi(), uniSwapAddr())
    const _1 = (1*10**18).toString()
    const valueEth = await contract.methods.getTokenToEthInputPrice(_1).call()
    return convertFromWei(valueEth)
}

export const getUniswapBalances = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
    const contract = new web3.eth.Contract(vetherAbi(), vetherAddr())
    var ethBalance = convertFromWei(await window.web3.eth.getBalance(uniSwapAddr()))
	const vethBalance = convertFromWei(await contract.methods.balanceOf(uniSwapAddr()).call())
    const uniswapBalances = {"eth":ethBalance, "veth":vethBalance}
    return uniswapBalances
}

function convertFromWei(number) {
    return number / 1000000000000000000
}

export const getAccounts = async (i) => {
    var web3_ = getWeb3()
    var accounts = await web3_.eth.getAccounts()
    return accounts[i]
}

export const getBalance = async (acc) => {
    var bal_ = await getWeb3().eth.getBalance(acc)
    return bal_
}

export const vetherContract = () => {
    var abi_ = vetherAbi()
    var addr_ = vetherAddr() 
    var web3_ = getWeb3()
    return new web3_.eth.Contract(abi_, addr_)
}

export const getVethBalance = async (acc) => {
    var bal_ = await vetherContract().methods.balanceOf(acc).call()
    return bal_
}

// export const tokenAddr = (i) => {
//     var tokenArray = [TOKEN1, TOKEN2, TOKEN3]
//     return tokenArray[i].networks[5777].address
// }