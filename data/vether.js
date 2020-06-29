const VETHER = require('../src/artifacts/Vether.json')

const addr = () => {
	return '0x31Bb711de2e457066c6281f231fb473FC5c2afd3'
}

const addr2 = () => {
	return '0x75572098dc462F976127f59F8c97dFa291f81d8b'
}

const abi = () => {
	return VETHER.abi
}

module.exports = {  
    abi, addr, addr2
}