import React, { useState, useCallback, useEffect, useContext } from 'react'
import { Context } from '../../context'

import { vetherAddr, vetherAbi, uniSwapAbi, uniSwapAddr, getEtherscanURL } from '../../client/web3.js'
import { convertFromWei, getSecondsToGo, getBN, prettify } from '../utils'

import { Row, Col, Input, Tooltip } from 'antd'
import { LoadingOutlined, QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {Sublabel, Click, Button, Text, Colour, LabelGrey} from '../components'

export const ClaimTable = () => {

	const context = useContext(Context)

	const [account, setAccount] = useState(
		{ address: '', vethBalance: '', ethBalance: '', uniBalance:'', uniSupply:'' })
	const [eraData, setEraData] = useState(
		{ era: '', day: '', emission: '', currentBurn: '', nextDay: '', nextEra: '', nextEmission: '' })
	const [arrayDays, setArrayDays] = useState(null)
	const [userData, setUserData] = useState(
		{ era: '1', day: '1' })

	const [contract, setContract] = useState(null)
	const [claimAmt, setClaimAmt] = useState(null)
	const [txHash, setTxHash] = useState(null)

	const [loaded, setLoaded] = useState(null)
	const [scanned, setScanned] = useState(false)
	const [connected, setConnected] = useState(false)

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
			const eraData_ = await context.eraData ? await getEraData() : await loadEraData(contract)
			context.arrayDays ? await getDays() : await loadDays(eraData_, contract, address, false)
			setConnected(true)
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
		setConnected(true)
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

	const getDays = ()  => {
		// console.log(context.arrayDays)
		setArrayDays(context.arrayDays)
		setUserData({era:1, day:context.arrayDays[context.arrayDays.length-1]})
		setScanned(true)
	}

	const loadDays = async (eraData_, contract_, account_, older) => {
		setScanned(false)
		let era = 1
		let arrayDays_ = []
		let daysContributed = await contract_.methods.getDaysContributedForEra(account_, era).call()
		let startDay = (daysContributed > 5) ? daysContributed - 5 : 0
		startDay = older ? 0 : startDay
		// console.log({startDay})
		for (let j = daysContributed-1; j >= startDay; j--) {
			let day = +(await contract_.methods.mapMemberEra_Days(account_, era, j).call())
			// console.log({era}, {day}, {daysContributed}, {eraData_})
			if (era < +eraData_.era || (era >= +eraData_.era && day <= +eraData_.day)) {
				const share = getBN(await contract_.methods.getEmissionShare(era, day, account_).call())
				// console.log(share, era, day, account_)
				if (share > 0) {
					arrayDays_.push(day)
					setArrayDays(arrayDays_)
				}
			}
		}
		context.setContext({arrayDays:arrayDays_})
		setUserData({era:1, day:arrayDays_[arrayDays_.length-1]})
		// console.log(arrayDays_)
		setScanned(true)
	}

	const scanOlder = async () => {
		loadDays(eraData, contract, account.address, true)
	}

	const onEraChange = e => {
		const day = userData.day
		setUserData({ era: e.target.value, day: day })
	}

	const onDayChange = e => {
		setUserData({ era: userData.era, day: e.target.value })
	}

	const checkShare = async () => {
		const share = getBN(await contract.methods.getEmissionShare(userData.era, userData.day, account.address).call())
		setClaimAmt(convertFromWei(share))
		setCheckFlag(true)
		const currentTime = Math.round((new Date()) / 1000)
		// console.log(contract)
		console.log(currentTime, +eraData.nextDay, eraData)
		console.log(userData)
	}

	const claimShare = async () => {
		setClaimFlag(true)
		// console.log(contract)
		// console.log(userData.era, userData.day, account.address)
		const tx = await contract.methods.withdrawShare(userData.era, userData.day).send({ from: account.address })
		setLoaded(true)
		setTxHash(tx.transactionHash)
		setClaimAmt(0)
	}

	const getLink = () => {
		return getEtherscanURL().concat('tx/').concat(txHash)
	}

	function DayItems() {
		let styles = {}
		styles.display = "inline"
		styles.marginLeft = 10

		const handleDayClick = useCallback((item, i) => {
			// console.log(item, i, userData.era, item)
			setUserData({ era: userData.era, day: item })
		}, [])

		return (<>
			{arrayDays.map((day, i) => (
				<li style={styles} key={i}>
					<Button
						backgroundColor="transparent"
						onClick={() => handleDayClick(day, i)}
					>
						{day}
					</Button>
				</li>
			))}
		</>)
	}

	return (
		<>
			<Row>
				<Col xs={6} sm={4}>
					<Input size={'large'} disabled={true} onChange={onEraChange} value={userData.era} placeholder={'1'} suffix={'Era'}/>
				</Col>
				<Col xs={6} sm={4} style={{ marginLeft: 10, marginRight: 20 }}>
					{connected
						? <Input size={'large'} onChange={onDayChange} value={userData.day} placeholder={userData.day} suffix={'Day'}/>
						: <Input size={'large'} disabled placeholder={userData.day} suffix={'Day'}/>
					}
				</Col>

				<Col xs={8} sm={8} style={{ marginTop: '-3px' }}>
					{userData.day > 0 && connected
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
									<p>Please wait for the day to finish first before claiming.</p>
								</Col>
							</>
						}

						{claimAmt > 0 &&
							<>
								<Col xs={8} sm={6}>
									<Button
										backgroundColor="transparent"
										onClick={claimShare}>
										CLAIM >>
									</Button>
									<Sublabel>CLAIM VETHER</Sublabel>

									{claimFlag &&
									<>
										{loaded &&
										<>
											<Click>
												<a href={getLink()}rel="noopener noreferrer" title="Transaction Link"
												   target="_blank" style={{
													color: Colour().gold,
													fontSize: 12 }}>
													VIEW TRANSACTION ->
												</a>
											</Click>
										</>
										}
									</>
									}
								</Col>
							</>
						}

						{claimAmt <= 0 &&
							<>
								<LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>
									<InfoCircleOutlined />&nbsp; Sorry, there's&nbsp;nothing to claim.
								</LabelGrey>
							</>
						}
					</Row>
				</>
			}

			{connected &&
				<Row>
					<Col>
						{!scanned &&
						<LoadingOutlined style={{ marginLeft: 11, marginBottom: 0 }} />
						}
						{(scanned && arrayDays) &&
						<DayItems />
						}
						{(scanned && !arrayDays) &&
						<>
							<Text>No claims found. </Text>
							<Button
								backgroundColor="transparent"
								size={12}
								onClick={scanOlder}
							>
								SCAN OLDER >
							</Button>
						</>
						}
						<Sublabel>ERA 1</Sublabel>
					</Col>
				</Row>
			}
		</>
	)
}
