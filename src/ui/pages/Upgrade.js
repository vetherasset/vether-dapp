import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import Web3 from 'web3'
import { vetherAddr1, vetherAddr2, vetherAddr, vetherAbi, getEtherscanURL } from '../../client/web3.js'
import { convertFromWei, prettify, getSecondsToGo } from '../utils'

import { Row, Col, Input, Tooltip } from 'antd'
import { LabelGrey, Button, Colour, Click, Text } from '../components'
import { LoadingOutlined, QuestionCircleOutlined, CheckCircleFilled, CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';

import '../../App.less';

const Upgrade = () => {

	const context = useContext(Context)

	const [account, setAccount] = useState(
		{ address: '', vethBalance: '', ethBalance: '', uniBalance: '', uniSupply: '' })
	const [eraData, setEraData] = useState(
		{ era: '', day: '', emission: '', currentBurn: '', nextDay: '', nextEra: '', nextEmission: '' })

	const [safari, setSafari] = useState(null)
	const [enable, setEnable] = useState(false)
	const [nowallet, setNowallet] = useState(true)

	const [upgradeValid, setUpgradeValid] = useState(false)

	const [vether1, setVether1] = useState(false)
	const [unlocked, setUnlocked] = useState(null)
	const [upgradeFlag, setUpgradeFlag] = useState(false)
	const [txHash, setTxHash] = useState(null)

	const [vether2, setVether2] = useState(false)
	const [upgradeFlag2, setUpgradeFlag2] = useState(false)
	const [txHash2, setTxHash2] = useState(null)

	const [addressChoice, setAddressChoice] = useState(null)
	const [ownership, setOwnership] = useState(null)

	useEffect(() => {
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		setSafari(isSafari)
		connect()
		console.log(unlocked, upgradeFlag)
		// eslint-disable-next-line
	}, [])

	const connect = async () => {
		window.web3 = new Web3(window.ethereum);
		const accountConnected = (await window.web3.eth.getAccounts())[0];
		if(accountConnected){
			setNowallet(false)
			const accounts = await window.web3.eth.getAccounts()
			const address = accounts[0]
			const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
			context.accountData ? getAccountData(contract, address) : loadAccountData(contract, address)
			// await loadAccountData(contract, address) 
			console.log('address', address)
			await context.eraData ? await getEraData() : await loadEraData(contract)
			console.log(eraData)
			await checkUpgradeValid(contract, address)
			setEnable(true)
		}
	}

	const checkUpgradeValid = async (contractNew, address) => {
		const contract1 = new window.web3.eth.Contract(vetherAbi(), vetherAddr1())
		const balance1 = convertFromWei(await contract1.methods.balanceOf(address).call())
		const contract2 = new window.web3.eth.Contract(vetherAbi(), vetherAddr2())
		const balance2 = convertFromWei(await contract2.methods.balanceOf(address).call())
		const ownership = convertFromWei(await contractNew.methods.mapPreviousOwnership(address).call())
		if ((balance1 > 0 || balance2 > 0) && ownership > 0) {
			setUpgradeValid(true)
		}
		if (balance1 > 0) {
			setVether1(true)
		}
		if (balance2 > 0) {
			setVether2(true)
		}
		console.log('balance1, balance2, ownership', balance1, balance2, ownership)
	}

	const getAccountData = async (contract, address) => {
		setAccount(context.accountData)
		const contractOld = new window.web3.eth.Contract(vetherAbi(), vetherAddr1())
		const allowance = convertFromWei(await contractOld.methods.allowance(address, vetherAddr()).call())
		const balance = convertFromWei(await contractOld.methods.balanceOf(address).call())
		const ownership = convertFromWei(await contract.methods.mapPreviousOwnership(address).call())
		console.log(+allowance, +balance, +ownership)
		if (+allowance >= +balance && +ownership > 0) {
			setUnlocked(true)
		}
	}

	const loadAccountData = async (contract, address) => {
		const ethBalance = convertFromWei(await window.web3.eth.getBalance(address))
		const vethBalance = convertFromWei(await contract.methods.balanceOf(address).call())
		// const exchangeContract = new window.web3.eth.Contract(uniSwapAbi(), uniSwapAddr())
		// const uniBalance = convertFromWei(await exchangeContract.methods.balanceOf(address).call())
		// const uniSupply = convertFromWei(await exchangeContract.methods.totalSupply().call())
		const accountData = {
			address: address,
			vethBalance: vethBalance,
			ethBalance: ethBalance,
			// uniBalance: uniBalance,
			// uniSupply: uniSupply
		}
		console.log('accountData', accountData)
		setAccount(accountData)
		context.setContext({ 'accountData': accountData })
		const contractOld = new window.web3.eth.Contract(vetherAbi(), vetherAddr1())
		const allowance = convertFromWei(await contractOld.methods.allowance(address, vetherAddr()).call())
		const balance = convertFromWei(await contractOld.methods.balanceOf(address).call())
		const ownership = convertFromWei(await contract.methods.mapPreviousOwnership(address).call())
		console.log(+allowance, +balance, +ownership)
		if (+allowance >= +balance && +ownership > 0) {
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

	const onAddressChange = e => {
		setAddressChoice(e.target.value)
	}

	const checkOwnership = async () => {
		const contractNew = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
		const ownership = convertFromWei(await contractNew.methods.mapPreviousOwnership(addressChoice).call())
		setOwnership(ownership)
	}

	const unlock = async () => {
		const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr1())
		const totalSupply = await contract.methods.totalSupply().call()
		await contract.methods.approve(vetherAddr(), totalSupply).send({ from: account.address })
		setUnlocked(true)
	}

	const upgradeV1 = async () => {
		setUpgradeFlag(true)
		const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
		const tx = await contract.methods.upgradeV1().send({ from: account.address })
		// const tx = { transactionHash: "this" }
		setTxHash(tx.transactionHash)
	}

	const upgradeV2 = async () => {
		setUpgradeFlag2(true)
		const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
		const tx = await contract.methods.upgradeV2().send({ from: account.address })
		// const tx = { transactionHash: "this" }
		setTxHash2(tx.transactionHash)
	}

	const getLink = () => {
		return getEtherscanURL().concat('tx/').concat(txHash)
	}
	const getLink2 = () => {
		return getEtherscanURL().concat('tx/').concat(txHash2)
	}

	return (
		<>
			<h1>UPGRADE VETHER</h1>
			{nowallet &&
			<>
				<span><InfoCircleOutlined /> In order to interact, open the app with wallet connected.</span>
			</>
			}
			{!enable && !nowallet &&
				<span><LoadingOutlined /></span>
			}
			{enable &&
				<div>
					{!upgradeValid &&
						<>
							<span><CheckCircleFilled/> You don't have any Vether to upgrade.</span>
						</>
					}

					{upgradeValid &&
						<>
							<span>Swap your asset for the new Vether</span>
							{safari &&
								<>
									<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
									<p>
										<a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ fontSize: 13 }}>Download Metamask</a>
									</p>
								</>
							}

							{!safari &&
								<>
									<Row>
										<Col xs={12}>
											{vether1 &&
												<>
													<br/>
													<h3>Vether 1</h3>
													<p>
														<i>
															You need to approve Vether for transfers first.<br/>
															Once the approval is confirmed perform upgrade.
														</i>
													</p>
													{!unlocked &&
														<>
															<Button
																backgroundColor="transparent"
																onClick={unlock}
															>
																UNLOCK &gt;&gt;
															</Button>
														</>
													}
													{unlocked &&
														<>
															<Button
																backgroundColor="transparent"
																onClick={upgradeV1}
															>UPGRADE &gt;&gt; </Button><br />

															{upgradeFlag &&
																<>
																	{!txHash &&
																	<LoadingOutlined/>
																	}
																	{txHash &&
																		<>
																			<Click>
																				<CheckOutlined/> <a href={getLink()} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}>VIEW TRANSACTION -></a>
																			</Click>
																		</>
																	}
																</>
															}
														</>
													}
												</>
											}
										</Col>

										<Col xs={12}>
											{vether2 &&
												<>
													<br/>
													<h3>Vether 2</h3>
													<p>
														<i>
															You are all set to perform the upgrade.<br/>
															Hit the button and watch for confirmation.
														</i>
													</p>
													<>
														<Button
															backgroundColor="transparent"
															onClick={upgradeV2}
														>UPGRADE &gt;&gt; </Button><br />

														{upgradeFlag2 &&
															<>
																{!txHash2 &&
																	<LoadingOutlined/>
																}
																{txHash2 &&
																	<>
																		<Click>
																			<CheckOutlined/> <a href={getLink2()} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}>VIEW TRANSACTION -></a>
																		</Click>
																	</>
																}
															</>
														}
													</>
												</>
											}
										</Col>
									</Row>
									<br /><br />
								</>
							}
						</>
					}
					
				</div>
			}
			<hr/>
			<h3>Vether eligible for upgrade</h3>
			<p>Search for Vether (<i>total of V1 & V2</i>) eligible for upgrade.</p>
					<br />
					<Row>
						<Col xs={13}>
							<Input size={'large'} style={{ marginBottom: 10 }} allowClear onChange={onAddressChange} placeholder={'Check by address'} />
							<br></br>
						</Col>
						<Col xs={11} sm={3} style={{ marginLeft: 20 }}>
							<Button
								backgroundColor="transparent"
								onClick={checkOwnership}
							>
								CHECK >>
						</Button>
						</Col>
						<Col xs={24} sm={4}>
							<Text size={32}>{prettify(ownership)}</Text>
							<Tooltip placement="right" title="The amount of Vether this owner has in Vether V3 to upgrade to.">
								&nbsp;<QuestionCircleOutlined style={{ color: Colour().grey }} /><br />
							</Tooltip>
							<LabelGrey>Total</LabelGrey>
						</Col>
					</Row>

		</>
	)
}
export default Upgrade
