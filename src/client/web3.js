import Web3 from 'web3'
import VETHER from '../artifacts/DeployedVether.json'
require('dotenv').config()
//import ERC20 from '../artifacts/ERC20.json'
// import TOKEN1 from '../artifacts/Token1.json'
// import TOKEN2 from '../artifacts/Token2.json'
// import TOKEN3 from '../artifacts/Token3.json'
// import UNISWAP from '../artifacts/UniswapExchange.json'

export const vetherAddr = () => {
	return '0xd447B74e5Ff9fAF98eB66dC59DC2C91DD47736dC'
}

export const vetherAbi = () => {
	return VETHER.abi
}

export const infuraAPI = () => {
	return process.env.INFURA
}

export const getWeb3 = () => {
    return new Web3(Web3.givenProvider || "http://localhost:7545") 
}

// export const uniSwapAddr = () => {
//     return `0x2a1530C4C41db0B0b2bB646CB5Eb1A67b7158667`
// }

// export const uniSwapAbi = () => {
// 	return UNISWAP.abi
// }

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