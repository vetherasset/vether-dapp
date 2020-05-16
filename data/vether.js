const VETHER = require('../src/artifacts/DeployedVether.json')

const addr = () => {
	return '0x31Bb711de2e457066c6281f231fb473FC5c2afd3'
}

const abi = () => {
	return VETHER.abi
}

module.exports = {  
    abi, addr
}