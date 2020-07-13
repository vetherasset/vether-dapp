import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import { vetherAddr, vetherAbi, uniSwapAbi, uniSwapAddr, getEtherscanURL } from '../../client/web3.js'
import { convertFromWei, getSecondsToGo, getBN, prettify } from '../utils'

import { Row, Col, Input, Select, Tooltip } from 'antd'
import { QuestionCircleOutlined, InfoCircleOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { Sublabel, Button, Colour, LabelGrey } from '../components'

export const ClaimTable = () => {

	const { Option } = Select

	const context = useContext(Context)

	const [account, setAccount] = useState(
		{ address: '', vethBalance: '', ethBalance: '', uniBalance:'', uniSupply:'' })
	const [eraData, setEraData] = useState(
		{ era: '', day: '', emission: '', currentBurn: '', nextDay: '', nextEra: '', nextEmission: '' })
	const [daysAsOptions, setDaysAsOptions] = useState(null)
	const [daysLoaded, setDaysLoaded] = useState(false)
	const [userData, setUserData] = useState(
		{ era: 1, day: 0 })

	const [contract, setContract] = useState(null)
	const [claimAmt, setClaimAmt] = useState(null)
	const [txHash, setTxHash] = useState(null)

	const [loaded, setLoaded] = useState(null)

	const [checkFlag, setCheckFlag] = useState(null)
	const [claimFlag, setClaimFlag] = useState(null)

	useEffect(() => {
		connect()
		// eslint-disable-next-line
	}, [])

	const connect = async () => {
		const accountConnected = (await window.web3.eth.getAccounts())[0];
		if(accountConnected){
			const accounts = await window.web3.eth.getAccounts()
			const address = accounts[0]
			const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
			setContract(contract)
			context.accountData ? getAccountData() : loadAccountData(contract, address)
			const eraData = await context.eraData ? await getEraData() : await loadEraData(contract)
			getDays(eraData, contract, address)
			setDaysLoaded(true)
		}
	}

	const getAccountData = async () => {
		setAccount(context.accountData)
	}

	const loadAccountData = async (contract_, address) => {
		const ethBalance = convertFromWei(await window.web3.eth.getBalance(address))
		const vethBalance = convertFromWei(await contract_.methods.balanceOf(address).call())
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
		context.setContext({'accountData':accountData})
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
			'era': era, 'day':day,
			'nextEra':nextEra, 'nextDay':nextDay,
			'emission': emission, 'nextEmission':nextEmission,
			"currentBurn": currentBurn,
			'secondsToGo':secondsToGo
		}
		setEraData({
			eraData
		})
		context.setContext(eraData)
		return eraData
	}

	const getDays = async (eraData_, contract_, account_) => {
		let era = 1
		let days = []
		let options = []
		let daysContributed = await contract_.methods.getDaysContributedForEra(account_, era).call()

		for (let j = daysContributed-1; j >= 0; j--) {
			let day = +(await contract_.methods.mapMemberEra_Days(account_, era, j).call())
			if (era < +eraData_.era || (era >= +eraData_.era && day <= +eraData_.day)) {
				const share = getBN(await contract_.methods.getEmissionShare(era, day, account_).call())
				if (share > 0) {
					days.push(day)
					options.push(<Option value={day}>{day}</Option>)
					setDaysAsOptions(options)
				}
			}
		}
		context.setContext({arrayDays:days})
	}

	const reloadDays = async () => {
		const accountConnected = (await window.web3.eth.getAccounts())[0];
		if(accountConnected) {
			const accounts = await window.web3.eth.getAccounts()
			const address = accounts[0]
			const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
			setContract(contract)
			context.accountData ? getAccountData() : loadAccountData(contract, address)
			const eraData = await context.eraData ? await getEraData() : await loadEraData(contract)
			getDays(eraData, contract, context.accountData.address)
			setDaysLoaded(true)
		}
	}

	const onEraChange = e => {
		setUserData({ era: e.target.value, day: userData.day })
	}

	const onDayChange = day => {
		setUserData({ era: userData.era, day: day })
		setCheckFlag(false)
	}

	const checkShare = async () => {
		const share = getBN(await contract.methods.getEmissionShare(userData.era, userData.day, account.address).call())
		setClaimAmt(convertFromWei(share))
		setCheckFlag(true)
		const currentTime = Math.round((new Date()) / 1000)
		console.log(currentTime, +eraData.nextDay, eraData)
		console.log(userData)
	}

	const claimShare = async () => {
		setClaimFlag(true)
		const tx = await contract.methods.withdrawShare(userData.era, userData.day).send({ from: account.address })
		setLoaded(true)
		setTxHash(tx.transactionHash)
		setClaimAmt(0)
	}

	const getLink = () => {
		return getEtherscanURL().concat('tx/').concat(txHash)
	}

	return (
		<>
			<Row>
				<Col xs={6} sm={4}>
					<Input size={'large'} disabled={true} onChange={onEraChange} value={userData.era} placeholder={'1'} suffix={'Era'}/>
				</Col>
				<Col xs={6} sm={4} style={{ marginLeft: 10, marginRight: 20 }}>
					{daysLoaded
						? <Select size={'large'} style={{ width: '100%' }} placeholder="Select a day" onChange={onDayChange}>{daysAsOptions}</Select>
						: <Select onDropdownVisibleChange={reloadDays} size={'large'} style={{ width: '100%' }} placeholder="Select a day" onChange={onDayChange}>{daysAsOptions}</Select>
					}
				</Col>

				<Col xs={8} sm={8} style={{ marginTop: '-3px' }}>
					{daysLoaded && userData.day > 0
						? <Button backgroundColor="transparent" onClick={checkShare}>CHECK >></Button>
						: <Button backgroundColor="transparent" disabled>CHECK >></Button>
					}
					<Sublabel>CHECK FOR CLAIM</Sublabel>
				</Col>
			</Row>

			{checkFlag &&
				<>
					<Row>
						{claimAmt > 0 &&
							<>
								<Col xs={8} sm={8} style={{ marginLeft: 0, marginRight: 30 }}>
									<span style={{
										display: 'block',
										fontSize: '32px',
										marginTop: '7px'
									}}>
										{prettify(claimAmt)} $VETH
										<Tooltip placement="right" title="Your total share in the Era and Day to claim.">
										&nbsp;<QuestionCircleOutlined style={{color:Colour().grey, marginBottom: '0'}}/>
									</Tooltip>
									</span>
									<LabelGrey style={{ fontStyle: 'italic' }}>Your unclaimed Vether on this day.</LabelGrey>
									{String(userData.day) === String(eraData.day) && !claimFlag && !loaded &&
									<>
										<p>Please wait for the day to finish first before claiming.</p>
									</>
									}
								</Col>
							</>
						}

						{claimAmt > 0 && String(userData.day) !== String(eraData.day) &&
							<>
								<Col xs={8} sm={6}>
									<Button
										backgroundColor="transparent"
										onClick={claimShare}>
										CLAIM >>
									</Button>
									<Sublabel>CLAIM VETHER</Sublabel>

									{claimFlag && !loaded &&
										<>
											<LoadingOutlined/>
										</>
									}
								</Col>
							</>
						}

						{claimAmt <= 0 &&
							<>
								{!claimFlag && !loaded &&
									<>
										<LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>
											<InfoCircleOutlined />&nbsp; Sorry, there's&nbsp;nothing to claim.
										</LabelGrey>
									</>
								}
								{claimFlag && loaded &&
								<>
									<Col xs={8} sm={8} style={{ marginLeft: 0, marginRight: 30 }}>
										<>
											<LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>
												<CheckCircleOutlined style={{ marginBottom: '0' }}/>&nbsp;Your share on this day has been successfully claimed.
											</LabelGrey>
											<a href={getLink()} rel="noopener noreferrer" title="Transaction Link"
											   target="_blank" style={{
												color: Colour().gold
											}}
											>
												VIEW TRANSACTION ->
											</a>
										</>
									</Col>
								</>
								}
							</>
						}

					</Row>
				</>
			}
		</>
	)
}
