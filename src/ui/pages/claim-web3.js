import React, { useState, useCallback, useEffect, useContext } from 'react'
import { Context } from '../../context'

import Web3 from 'web3'
import { vetherAddr, vetherAbi, uniSwapAbi, uniSwapAddr, getEtherscanURL } from '../../client/web3.js'
import {convertFromWei, convertToWei, getSecondsToGo, getBN, prettify} from '../utils'

import { Row, Col, Input, Tooltip } from 'antd'
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Sublabel, Click, Button, Text, Label, LabelGrey, Colour } from '../components'
// import { WalletCard } from '../ui'

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
	const [walletFlag, setWalletFlag] = useState(true)

	const [checkFlag, setCheckFlag] = useState(null)
	const [claimFlag, setClaimFlag] = useState(null)
	const [zeroFlag, setZeroFlag] = useState(false)

	useEffect(() => {
		connect()
		// eslint-disable-next-line
	}, [])

	const connect = async () => {
		setWalletFlag(true)
		const accounts = await window.web3.eth.getAccounts()
		const address = accounts[0]
		const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
		setContract(contract)
		context.accountData ? getAccountData() : loadAccountData(contract, address)
		const eraData_ = await context.eraData ? await getEraData() : await loadEraData(contract)
		context.arrayDays ? await getDays() : await loadDays(eraData_, contract, address, false)
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
			uniSupply:uniSupply
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
		for (var j = daysContributed-1; j >= startDay; j--) {
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
		// console.log(currentTime, +eraData.nextDay, eraData)
		if (share > 0 && +userData.day < +eraData.day) {
			// Has a share, day requested is less than current day (so yesterday)
			setZeroFlag(false)
		} else if (share > 0 && currentTime > +eraData.nextDay) {
			// Has a share, current time is greater than next day time (so gone past day)
			setZeroFlag(false)
		} else {
			// Don't show
			setZeroFlag(true)
		}
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
		<div>
			{walletFlag &&
				<div>
					{/* <Row>
						<Col xs={12}>
							<WalletCard accountData={account}/>
						</Col>
					</Row> */}

					<Row>
						<Col style={{ marginBottom: 20 }}>
							<LabelGrey>CLAIMS FOUND IN THESE DAYS: </LabelGrey>
							<br></br>
							{!scanned &&
								<LoadingOutlined style={{ marginLeft: 20, fontSize: 15 }} />
							}
							{(scanned && arrayDays) &&
								<DayItems />
							}
							{(scanned && !arrayDays) &&
							<div>
								<Text>No claims found. </Text>
								<Button
									backgroundColor="transparent"
									size={12}
									onClick={scanOlder}
								>
									SCAN OLDER >
								</Button>
							</div>
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
							<Button
								backgroundColor="transparent"
								onClick={checkShare}
							>
								CHECK >
							</Button>
							<Tooltip placement="right" title="This will check your share in the Era and Day set">
								&nbsp;<QuestionCircleOutlined style={{color:Colour().grey}}/>
							</Tooltip>
							<br></br>
							<Sublabel>Check for claim</Sublabel>
						</Col>
					</Row>

					{checkFlag &&
						<div>
							<Row>
								<Col xs={12} sm={6} style={{ marginLeft: 0, marginRight: 30 }}>
									<Label>{prettify(claimAmt)} VETH</Label>
									<br></br>
									<Text size={14}>Your unclaimed Vether on this day.</Text><br />
									<Text size={14}>(Please wait for the day to finish first before claiming) </Text><br />
									{/* <Button size={12} onClick={continueAnyway}> continue anyway ></Button> */}
								</Col>

								{!zeroFlag &&
									<Col xs={8} sm={6}>
										<Button onClick={claimShare}> CLAIM >></Button>
										<Tooltip placement="right" title="This will claim your share in the Era and Day set">
											&nbsp;<QuestionCircleOutlined style={{color:Colour().grey}}/>
										</Tooltip>
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

export const SendTable = () => {

	const context = useContext(Context)

	const [account, setAccount] = useState(
		{ address: '', vethBalance: '', ethBalance: '' })

	const [contract, setContract] = useState(null)
	const [sendAmt, setSendAmt] = useState(null)
	const [sendAddress, setSendAddress] = useState(null)
	const [txHash, setTxHash] = useState(null)
	const [sendFlag, setSendFlag] = useState(false)
	const [loaded, setLoaded] = useState(null)
	const [walletFlag, setWalletFlag] = useState(true)

	useEffect(() => {
		connect()
		// eslint-disable-next-line
	}, [])

	const connect = async () => {
			window.web3 = new Web3(window.ethereum);
			setWalletFlag(true)
			const accounts = await window.web3.eth.getAccounts()
			const address = accounts[0]
			const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
			context.accountData ? getAccountData() : loadAccountData(contract, address)
			setContract(contract)
	}
	
	const getAccountData = async () => {
		setAccount(context.accountData)
		setSendAmt(context.accountData.vethBalance)
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
		setSendAmt(vethBalance)
	}


	const onAmountChange = e => {
		setSendAmt(e.target.value)
	}

	const onAddressChange = e => {
		setSendAddress(e.target.value)
	}

	const sendVether = async () => {
		setSendFlag(true)
		console.log(contract)
		console.log(convertToWei(sendAmt), account.address)
		const tx = await contract.methods.transfer(sendAddress, convertToWei(sendAmt)).send({ from: account.address })
		//console.log(tx.transactionHash)
		setLoaded(true)
		setTxHash(tx.transactionHash)
		setSendAmt(0)
	}

	const getLink = () => {
		return getEtherscanURL().concat('tx/').concat(txHash)
	}

	return (
		<div>
			{walletFlag &&
				<div>
					<Row>
						<Col xs={12} sm={3}>
							<Input size={'large'} allowClear onChange={onAmountChange} placeholder={account.vethBalance} />
							<br></br>
							<Sublabel>Set Amount</Sublabel>
							<br></br>
						</Col>
						<Col xs={12} sm={10} style={{ marginLeft: 10, marginRight: 20 }}>
							<Input size={'large'} allowClear onChange={onAddressChange} placeholder="Enter Address" />
							<br></br>
							<Sublabel>Set Destination Address</Sublabel>
							<br></br>
						</Col>
						<Col xs={24} sm={6}>
							<Button onClick={sendVether}> SEND >></Button>
							<br></br>
							<Sublabel>Send Vether</Sublabel>
							<br></br>
						</Col>
					</Row>
					<br></br>
						{sendFlag &&
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
				</div>
			}
		</div>
	)
}
