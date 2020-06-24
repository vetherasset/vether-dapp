import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

// import Web3 from 'web3'
import { vetherAddr, vetherAbi, vetherOldAddr, vetherOldAbi, uniSwapAbi, uniSwapAddr, getEtherscanURL } from '../../client/web3.js'
import { convertFromWei, getSecondsToGo } from '../utils'

import { LabelGrey, Button, Colour, Click } from '../components'
import { LoadingOutlined } from '@ant-design/icons';

import '../../App.less';

const Upgrade = () => {

	const [safari, setSafari] = useState(null)
	const [unlocked, setUnlocked] = useState(null)
	const [enable] = useState(false)

	const context = useContext(Context)

	const [account, setAccount] = useState(
		{ address: '', vethBalance: '', ethBalance: '', uniBalance: '', uniSupply: '' })
	const [eraData, setEraData] = useState(
		{ era: '', day: '', emission: '', currentBurn: '', nextDay: '', nextEra: '', nextEmission: '' })

	const [upgradeFlag, setUpgradeFlag] = useState(false)
	const [txHash, setTxHash] = useState(null)

	useEffect(() => {
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		setSafari(isSafari)
		connect()
		console.log(unlocked, upgradeFlag)
		// eslint-disable-next-line
	}, [])

	const connect = async () => {
		const accounts = await window.web3.eth.getAccounts()
		const address = accounts[0]
		const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
		context.accountData ? getAccountData(contract, address) : loadAccountData(contract, address)
		await context.eraData ? await getEraData() : await loadEraData(contract)
		console.log(eraData)
	}

	const getAccountData = async (contract, address) => {
		setAccount(context.accountData)
		const contractOld = new window.web3.eth.Contract(vetherOldAbi(), vetherOldAddr())
		const allowance = convertFromWei(await contractOld.methods.allowance(address, vetherAddr()).call())
		const balance = convertFromWei(await contractOld.methods.balanceOf(address).call())
		const ownership = convertFromWei(await contract.methods.mapPreviousOwnership(address).call())
		console.log(+allowance, +balance, +ownership)
		if(+allowance >= +balance && +ownership > 0){
			setUnlocked(true)
		}
	}

	const loadAccountData = async (contract, address) => {
		const ethBalance = convertFromWei(await window.web3.eth.getBalance(address))
		const vethBalance = convertFromWei(await contract.methods.balanceOf(address).call())
		const exchangeContract = new window.web3.eth.Contract(uniSwapAbi(), uniSwapAddr())
		const uniBalance = convertFromWei(await exchangeContract.methods.balanceOf(address).call())
		const uniSupply = convertFromWei(await exchangeContract.methods.totalSupply().call())
		const accountData = {
			address: address,
			vethBalance: vethBalance,
			ethBalance: ethBalance,
			uniBalance: uniBalance,
			uniSupply: uniSupply
		}
		setAccount(accountData)
		context.setContext({ 'accountData': accountData })
		const contractOld = new window.web3.eth.Contract(vetherOldAbi(), vetherOldAddr())
		const allowance = convertFromWei(await contractOld.methods.allowance(address, vetherAddr()).call())
		const balance = convertFromWei(await contractOld.methods.balanceOf(address).call())
		const ownership = convertFromWei(await contract.methods.mapPreviousOwnership(address).call())
		console.log(+allowance, +balance, +ownership)
		if(+allowance >= +balance && +ownership > 0){
			setUnlocked(true)
		}
	}

	const getEraData = async () => {
		setEraData(context.eraData)
		return context.eraData
	}

	const loadEraData = async (contract_) => {
		const emission = convertFromWei(await contract_.methods.emission().call())
		const day = await contract_.methods.currentDay().call()
		const era = await contract_.methods.currentEra().call()
		const nextDay = await contract_.methods.nextDayTime().call()
		const nextEra = await contract_.methods.nextEraTime().call()
		const nextEmission = convertFromWei(await contract_.methods.getNextEraEmission().call())
		const currentBurn = convertFromWei(await contract_.methods.mapEraDay_UnitsRemaining(era, day).call())
		const secondsToGo = getSecondsToGo(nextDay)

		const eraData = {
			'era': era, 'day': day,
			'nextEra': nextEra, 'nextDay': nextDay,
			'emission': emission, 'nextEmission': nextEmission,
			"currentBurn": currentBurn,
			'secondsToGo': secondsToGo
		}
		setEraData({
			eraData
		})
		context.setContext(eraData)
		return eraData
	}

	const unlock = async () => {
		const contract = new window.web3.eth.Contract(vetherOldAbi(), vetherOldAddr())
		const totalSupply = await contract.methods.totalSupply().call()
		await contract.methods.approve(vetherAddr(), totalSupply).send({ from: account.address })
		setUnlocked(true)
	}

	const upgrade = async() => {
		setUpgradeFlag(true)
		const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
		const contractOld = new window.web3.eth.Contract(vetherOldAbi(), vetherOldAddr())
		const balance = await contractOld.methods.balanceOf(account.address ).call()
		const tx = await contract.methods.upgrade(balance).send({ from: account.address })
		// const tx = {transactionHash:"this"}
		setTxHash(tx.transactionHash)
	}

	const getLink = () => {
		return getEtherscanURL().concat('tx/').concat(txHash)
	}

	return (
		<>
			<h1>Upgrade Vether</h1>
			<span>Upgrade your old Vether to the new Vether.</span>
			<br/><br/>
			<span>Hold tight - Upgrading will be made available soon.</span>
			{safari &&
				<>
					<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
					<a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a>
				</>
			}
			{(!safari && enable)  && 
				<div>
					<br /><br />
					<h2>Step 1 - Unlock Old Vether</h2>
					<Button
						backgroundColor="transparent"
						onClick={unlock}
					>
						UNLOCK &gt;&gt;
							</Button>
					<br /><br /><br />

					<h2>Step 2 - Upgrade</h2>
					{unlocked &&
						<div>
							<Button
								backgroundColor="transparent"
								onClick={upgrade}
							>UPGRADE &gt;&gt; </Button><br/>

							{upgradeFlag &&
								<div>
									{!txHash &&
										<LoadingOutlined style={{ marginLeft: 20, fontSize: 15 }} />
									}
									{txHash &&
										<div>
											<Click><a href={getLink()} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> VIEW TRANSACTION -> </a></Click>
										</div>
									}
								</div>
							}
						</div>
					}

					<br /><br /><br />

				</div>
			}
		</>
	)
}
export default Upgrade
