import React, { useState, useCallback, useEffect, useContext } from 'react'
import { Context } from '../../context'


import Web3 from 'web3'
import { vetherAddr, vetherAbi, infuraAPI, getEtherscanURL } from '../../client/web3.js'
import {convertFromWei, getSecondsToGo, getBN, prettify} from '../utils'

import { Row, Col, Input } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { Sublabel, Click, Button, Text, Label, Gap, LabelGrey, Colour } from '../components'

export const ClaimTable = () => {

	const context = useContext(Context)

	const [account, setAccount] = useState(
		{ address: '', vethBalance: '', ethBalance: '' })
	const [eraData, setEraData] = useState(
		{ era: '', day: '', emission: '', currentBurn: '', nextDay: '', nextEra: '', nextEmission: '' })
	const [arrayDays, setArrayDays] = useState(null)
	const [userData, setUserData] = useState(
		{ era: '1', day: '1' })

	const [contract, setContract] = useState(null)
	const [claimAmt, setClaimAmt] = useState(null)
	const [txHash, setTxHash] = useState(null)

	const [loaded, setLoaded] = useState(null)
	const [walletFlag, setWalletFlag] = useState(true)

	const [checkFlag, setCheckFlag] = useState(null)
	const [claimFlag, setClaimFlag] = useState(null)
	const [zeroFlag, setZeroFlag] = useState(true)

	useEffect(() => {
		connect()
		// eslint-disable-next-line
	}, [])

	const connect = async () => {
		ethEnabled()
		if (!ethEnabled()) {
			alert("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp");
		} else {
			setWalletFlag(true)
			const accounts = await window.web3.eth.getAccounts()
			const address = accounts[0]
			const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
			const contract = new web3.eth.Contract(vetherAbi(), vetherAddr())
			context.accountData ? getAccountData() : loadAccountData(contract, address)
			const eraDay_ = await context.eraData ? await getEraData() : await loadEraData(contract)
			console.log(eraDay_)
			await context.arrayDays ? getDays() : await loadDays(eraDay_, contract, address)
			console.log(arrayDays)
			// getDays(eraDay_, contract, address)
			setContract(contract)
		}
	}

	const ethEnabled = () => {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			window.ethereum.enable();
			return true;
		}
		return false;
	}

	const getAccountData = async () => {
        setAccount(context.accountData)
    }

    const loadAccountData = async (contract_, address) => {
        var ethBalance = convertFromWei(await window.web3.eth.getBalance(address))
        const vethBalance = convertFromWei(await contract_.methods.balanceOf(address).call())
        setAccount({
            address: address,
            vethBalance: vethBalance,
            ethBalance: ethBalance
        })
        context.setContext({
            "accountData": {
                'address': address,
                'vethBalance': vethBalance,
                'ethBalance': ethBalance
            }
        })
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
        context.setContext({
			eraData: eraData
		})
		return eraData
	}
	
	const getDays = ()  => {
		setArrayDays(context.arrayDays)
		setUserData({era:1, day:context.arrayDays[context.arrayDays.length-1]})
	}

	const loadDays = async (eraData, contract_, account) => {

		let era = 1
		let arrayDays = []
		let daysContributed = await contract_.methods.getDaysContributedForEra(account, era).call()
		for (var j = 0; j < daysContributed; j++) {
			let day = await contract_.methods.mapMemberEra_Days(account, era, j).call()
			console.log({era}, {eraData}, {day}, {daysContributed})
			if (era < eraData.era || (era >= eraData.era && day <= eraData.day)) {
				const share = getBN(await contract_.methods.getEmissionShare(era, day, account).call())
				if (share > 0) {
					arrayDays.push(day)
				}
			}
		}
		context.setContext({arrayDays:arrayDays})
		setArrayDays(arrayDays)
		setUserData({era:1, day:arrayDays[arrayDays.length-1]})
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
		if (share > 0 && eraData.day > userData.day) {
			setZeroFlag(false)
		} else if (share > 0 && currentTime > +eraData.nextDay) {
			setZeroFlag(false)
		} else {
			setZeroFlag(true)
		}
	}

	const claimShare = async () => {
		setClaimFlag(true)
		const tx = await contract.methods.withdrawShare(userData.era, userData.day).send({ from: account.address })
		//console.log(tx.transactionHash)
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
			console.log(item, i, userData.era, item)
			setUserData({ era: userData.era, day: item })
			//checkShare()
		}, [])

		return (<>
			{arrayDays.map((day, i) => (
				<li style={styles} key={i}>
					{/* <Label>{day}</Label><Text>,</Text> */}
					<Button onClick={() => handleDayClick(day, i)}>{day}</Button>
				</li>
			))}
		</>)
	}

	return (
		<div>
			{!walletFlag &&
				<div>
					<Button onClick={connect}> > CHECK CLAIMS &lt;</Button>
					<Gap />
				</div>
			}

			{walletFlag &&
				<div>
					<Label>{account.address}</Label>
					<br></br>
					<LabelGrey>ACCOUNT</LabelGrey>
					<br></br><br></br>
					<Label margin={"20px 0px 0px"}>{prettify(account.vethBalance)} VETH</Label>
					<br></br>
					<LabelGrey>VETH Balance</LabelGrey>
					<br></br>
					<Gap />
					<Row>
						<Col style={{ marginBottom: 20 }}>
							<LabelGrey>CLAIMS FOUND IN THESE DAYS: </LabelGrey>
							<br></br>
							{!arrayDays &&
								<LoadingOutlined style={{ marginLeft: 20, fontSize: 15 }} />
							}
							{arrayDays &&
								<DayItems />
							}
							<br></br>
							<Sublabel>(ERA 1)</Sublabel>
							<br></br>
						</Col>
					</Row>
					<Row>
						<Col xs={6} sm={3}>
							<Input size={'large'} allowClear onChange={onEraChange} placeholder={userData.era} />
							<br></br>
							<Sublabel>Set Era</Sublabel>
							<br></br>
						</Col>
						<Col xs={6} sm={3} style={{ marginLeft: 10, marginRight: 20 }}>
							<Input size={'large'} allowClear onChange={onDayChange} placeholder={userData.day} />
							<br></br>
							<Sublabel>Set Day</Sublabel>
							<br></br>
						</Col>
						<Col xs={8} sm={6}>
							<Button onClick={checkShare}> CHECK ></Button>
							<br></br>
							<Sublabel>Check for claim</Sublabel>
							<br></br>
						</Col>
					</Row>
					<br></br>

					{checkFlag &&
						<div>
							<Gap />
							<Gap />
							<Row>
								<Col xs={12} sm={6} style={{ marginLeft: 0, marginRight: 30 }}>
									<Label>{prettify(claimAmt)} VETH</Label>
									<br></br>
									<Text size={14}>Your unclaimed Vether on this day.</Text><br />
									<Text size={14}>(Please wait for the day to finish first before claiming) </Text><br />
								</Col>

								{!zeroFlag &&
									<Col xs={8} sm={6}>
										<Button onClick={claimShare}> CLAIM >></Button>
										<br></br>
										<Text size={14}>Claim VETHER</Text>

										{claimFlag &&
											<div>
												{!loaded &&
													<LoadingOutlined style={{ marginLeft: 20, fontSize: 15 }} />
												}
												{loaded &&
													<div>
														<Click><a href={getLink()} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> VIEW TRANSACTION -> </a></Click>
													</div>
												}
											</div>
										}
									</Col>
								}
							</Row>
						</div>
					}
				</div>
			}
		</div>
	)
}
