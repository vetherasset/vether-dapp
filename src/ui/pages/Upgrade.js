import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import Web3 from 'web3'
import { vetherAddr1, vetherAddr2, vetherAddr, vetherAbi, getEtherscanURL } from '../../client/web3.js'
import { convertFromWei, getSecondsToGo } from '../utils'

import { Row, Col, Input, Tooltip } from 'antd'
import { LabelGrey, Button, Colour, Click, Text } from '../components'
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import '../../App.less';

const Upgrade = () => {

	const context = useContext(Context)

	const [account, setAccount] = useState(
		{ address: '', vethBalance: '', ethBalance: '', uniBalance: '', uniSupply: '' })
	const [eraData, setEraData] = useState(
		{ era: '', day: '', emission: '', currentBurn: '', nextDay: '', nextEra: '', nextEmission: '' })

	const [safari, setSafari] = useState(null)
	const [enable, setEnable] = useState(false)
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
			{!enable &&
				<LoadingOutlined />
			}
			{enable &&
				<div>
					{!upgradeValid &&
						<div>
							<h2>No Vether to Upgrade</h2>
							<span>You don't have any Vether to upgrade.</span>
						</div>
					}

					{upgradeValid &&
						<div>
							<span>Upgrade Vether1 or Vether2 to the new Vether</span>
							<br /><br />
							{safari &&
								<>
									<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
									<a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a>
								</>
							}

							{!safari &&
								<div>
									<Row>
										<Col xs={12}>
											{vether1 &&
												<div>
													<h2>Vether 1</h2>
													<span>1. Unlock Vether1</span>
													{!unlocked &&
														<p>
															<Button
																backgroundColor="transparent"
																onClick={unlock}
															>
																UNLOCK &gt;&gt;
											</Button>
														</p>
													}
													<br /><br />
													<span>2. Perform Upgrade</span>
													{unlocked &&
														<p>
															<Button
																backgroundColor="transparent"
																onClick={upgradeV1}
															>UPGRADE &gt;&gt; </Button><br />

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
														</p>
													}
												</div>
											}
										</Col>

										<Col xs={12}>
											{vether2 &&
												<div>
													<h2>Vether 2</h2>
													<span>1. Perform Upgrade</span>
													<p>
														<Button
															backgroundColor="transparent"
															onClick={upgradeV2}
														>UPGRADE &gt;&gt; </Button><br />

														{upgradeFlag2 &&
															<div>
																{!txHash2 &&
																	<LoadingOutlined style={{ marginLeft: 20, fontSize: 15 }} />
																}
																{txHash2 &&
																	<div>
																		<Click><a href={getLink2()} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> VIEW TRANSACTION -> </a></Click>
																	</div>
																}
															</div>
														}
													</p>
												</div>
											}
										</Col>
									</Row>
									<br /><br />
								</div>
							}
						</div>
					}
					
				</div>
			}
			<hr/>
			<span>You can search for Vether3 ownership below.</span>
					<br /><br />
					<Row>
						<Col xs={13}>
							<Input size={'large'} style={{ marginBottom: 10 }} allowClear onChange={onAddressChange} placeholder={'enter address to check'} />
							<br></br>
						</Col>
						<Col xs={11} sm={6} style={{ marginLeft: 20 }}>
							<Button
								backgroundColor="transparent"
								onClick={checkOwnership}
							>
								CHECK >>
						</Button>
						</Col>
						<Col xs={24} sm={4}>
							<Text size={32}>{ownership}</Text>
							<Tooltip placement="right" title="The amount of Veth this owner has in Vether3 to upgrade to.">
								&nbsp;<QuestionCircleOutlined style={{ color: Colour().grey }} /><br />
							</Tooltip>
							<LabelGrey>Ownership</LabelGrey>
						</Col>
					</Row>

		</>
	)
}
export default Upgrade
