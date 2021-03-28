import { BigNumber, ethers } from 'ethers'
import defaults from './defaults'
import vetherTokenAbi from '../artifacts/vetherTokenAbi'
import uniswapPairAbi from '../artifacts/uniswapPairAbi'

const getEmissionEra = async (provider) => {
	const contract = new ethers.Contract(
		defaults.network.address.vether,
		vetherTokenAbi,
		provider,
	)
	return await contract.currentEra()
}

const getEmissionDay = async (provider) => {
	const contract = new ethers.Contract(
		defaults.network.address.vether,
		vetherTokenAbi,
		provider,
	)
	return await contract.currentDay()
}

const getEmission = async (provider) => {
	const contract = new ethers.Contract(
		defaults.network.address.vether,
		vetherTokenAbi,
		provider,
	)
	return await contract.getDayEmission()
}

const getNextEraDayTime = async (provider) => {
	const contract = new ethers.Contract(
		defaults.network.address.vether,
		vetherTokenAbi,
		provider,
	)
	return await contract.nextEraTime()
}

const getNextDayTime = async (provider) => {
	const contract = new ethers.Contract(
		defaults.network.address.vether,
		vetherTokenAbi,
		provider,
	)
	return await contract.nextDayTime()
}

const getNextEmission = async (provider) => {
	const contract = new ethers.Contract(
		defaults.network.address.vether,
		vetherTokenAbi,
		provider,
	)
	return await contract.getNextEraEmission()
}

const getCurrentBurn = async (provider) => {
	const contract = new ethers.Contract(
		defaults.network.address.vether,
		vetherTokenAbi,
		provider,
	)
	return await contract.mapEraDay_UnitsRemaining(
		getEmissionEra(provider), getEmissionDay(provider),
	)
}

const getEmitted = async (provider) => {
	const contract = new ethers.Contract(
		defaults.network.address.vether,
		vetherTokenAbi,
		provider,
	)
	return (+ethers.utils.formatEther(BigNumber.from('1000000000000000000000000'))
	- +ethers.utils.formatEther(await contract.balanceOf(defaults.network.address.vether))
	+ +ethers.utils.formatEther(await contract.totalFees()))
}

const getUniswapAssetPrice = async (poolAddress, decimals0, decimals1, flip, provider) => {
	const contract = new ethers.Contract(
		poolAddress,
		uniswapPairAbi,
		provider,
	)
	const reserves = await contract.getReserves()
	const i = 1
	if (flip) {
		return (Number(reserves._reserve0) / Number(i.toFixed(decimals0).replace('.', ''))) / (Number(reserves._reserve1) / Number(i.toFixed(decimals1).replace('.', '')))
	}
	else {
		return (Number(reserves._reserve1) / Number(i.toFixed(decimals1).replace('.', ''))) / (Number(reserves._reserve0) / Number(i.toFixed(decimals0).replace('.', '')))
	}
}

export {
	getEmissionEra, getEmissionDay, getEmission, getNextEraDayTime, getNextDayTime, getNextEmission, getCurrentBurn,
	getEmitted, getUniswapAssetPrice,
}