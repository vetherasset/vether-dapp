const VETHER = require('../src/artifacts/Vether.json')

const addr = () => {
	return '0x31Bb711de2e457066c6281f231fb473FC5c2afd3'
}

const addr2 = () => {
	return '0x4ba6ddd7b89ed838fed25d208d4f644106e34279'
}

const abi = () => {
	return VETHER.abi
}

module.exports = {  
    abi, addr, addr2
}