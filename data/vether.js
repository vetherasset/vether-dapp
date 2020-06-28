const VETHER = require('../src/artifacts/Vether.json')

const addr = () => {
	return '0x31Bb711de2e457066c6281f231fb473FC5c2afd3'
}

const addr2 = () => {
	return '0x01217729940055011F17BeFE6270e6E59B7d0337'
}

const abi = () => {
	return VETHER.abi
}

module.exports = {  
    abi, addr, addr2
}