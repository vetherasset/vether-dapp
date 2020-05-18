import React, { useState, useCallback, useEffect } from 'react'
import BigNumber from 'bignumber.js'

import Web3 from 'web3'
import { vetherAddr, vetherAbi, getEtherscanURL } from '../../client/web3.js'

import { Row, Col, Input } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { Sublabel, Click, Button, Text, Label, Gap, LabelGrey, Colour } from '../components'

export const ClaimTable = () => {

	//const  window.web3 = new Web3(Web3.givenProvider)

	const [account, setAccount] = useState(
		{ address: '', tokenBalance: '', ethBalance: '' })
	const [contract, setContract] = useState(null)
	const [currentDay, setCurrentDay] = useState(null)
	const [nextDay, setNextDay] = useState(null)
	const [arrayDays, setArrayDays] = useState(null)
	const [claimAmt, setClaimAmt] = useState(null)
	const [txHash, setTxHash] = useState(null)
	const [userData, setUserData] = useState(
		{ era: '1', day: '1' })

	const [loaded, setLoaded] = useState(null)
	const [walletFlag, setWalletFlag] = useState(true)

	const [checkFlag, setCheckFlag] = useState(null)
	const [claimFlag, setClaimFlag] = useState(null)
	const [zeroFlag, setZeroFlag] = useState(true)

	useEffect(() => {
		connect()
		// eslint-disable-next-line
	}, [])

	const connect = () => {
		setWalletFlag(true)
		ethEnabled()
		if (!ethEnabled()) {
			alert("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp");
		}
	}

	const ethEnabled = () => {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			window.ethereum.enable();
			loadBlockchainData()
			return true;
		}
		return false;
	}

	const loadBlockchainData = async () => {
		const contract_ = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
		const accounts = await window.web3.eth.getAccounts()
		setCurrentDay(await contract_.methods.currentDay().call())
		setNextDay(await contract_.methods.nextDayTime().call())
		setContract(contract_)
		refreshAccount(contract_, accounts[0])
		getDays(contract_, accounts[0])
		//console.log("accounts", accounts[0])
	}


	const refreshAccount = async (contract_, account_) => {
		var ethbalance_ = convertFromWei(await window.web3.eth.getBalance(account_))
		const vethBalance_ = convertFromWei(await contract_.methods.balanceOf(account_).call())

		setAccount({
			address: account_,
			tokenBalance: vethBalance_,
			ethBalance: ethbalance_
		})
	}

	const getDays = async (contract_, account_) => {
		let era = 1
		let acc = account_
		let arrayDays = []
		let daysContributed = await contract_.methods.getDaysContributedForEra(acc, era).call()
		let currentDay = await contract_.methods.currentDay().call()
		let currentEra = await contract_.methods.currentEra().call()
		//console.log("Acc:%s - daysContributed:%s - era:%s", acc, daysContributed, era)

		for (var j = 0; j < daysContributed; j++) {
			let day = await contract_.methods.mapMemberEra_Days(acc, era, j).call()
			if (era < currentEra || (era >= currentEra && day <= currentDay)) {
				const share_ = (new BigNumber(await contract_.methods.getEmissionShare(era, day, account_).call())).toFixed()
				if (share_ > 0) {
					arrayDays.push(day)
				}
			}
		}
		setArrayDays(arrayDays)
	}

	function convertFromWei(number) {
		var num = number / 1000000000000000000
		return num.toFixed(2)
	}

	function prettify(amount) {
		const number = Number(amount)
		var parts = number.toPrecision(8).replace(/\.?0+$/, '').split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parts.join(".");
	}

	const onEraChange = e => {
		const day = userData.day
		setUserData({ era: e.target.value, day: day })
	}

	const onDayChange = e => {
		setUserData({ era: userData.era, day: e.target.value })
	}

	const checkShare = async () => {
		const share_ = (new BigNumber(await contract.methods.getEmissionShare(userData.era, userData.day, account.address).call())).toFixed()
		setClaimAmt(convertFromWei(share_))
		setCheckFlag(true)
		const currentTime = Math.round((new Date()) / 1000)
		if (share_ > 0 && currentDay > userData.day) {
			setZeroFlag(false)
		} else if (share_ > 0 && currentTime > +nextDay) {
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
					<Label margin={"20px 0px 0px"}>{prettify(account.tokenBalance)} VETH</Label>
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
