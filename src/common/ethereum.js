import { ethers } from 'ethers'
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

const getUniswapAssetPrice = async (poolAddress, provider) => {
	const contract = new ethers.Contract(
		poolAddress,
		uniswapPairAbi,
		provider,
	)
	const reserves = await contract.getReserves()
	return Number(ethers.utils.formatEther(reserves._reserve1)) / Number(ethers.utils.formatEther(reserves._reserve0))
}

export {
	getEmissionEra, getEmissionDay, getEmission, getNextEraDayTime, getNextDayTime, getNextEmission, getCurrentBurn,
	getUniswapAssetPrice,
}