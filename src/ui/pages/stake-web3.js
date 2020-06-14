import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import axios from 'axios'

import { vetherAddr, vetherAbi, uniSwapAddr, uniSwapAbi, getUniswapPriceEth, getUniswapDetails, getEtherscanURL } from '../../client/web3.js'
import { getETHPrice } from '../../client/market.js'
import { convertFromWei, convertToWei, prettify, getBN, getBig } from '../utils'

import { Row, Col, Input, Tooltip } from 'antd'
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
	H2,
	Text,
	LabelGrey,
	Label,
	Click,
	Button,
	Sublabel,
	Colour,
	Center,
	HR,
	Gap,
	Subtitle
} from '../components'
import { PoolCard, UniswapCard } from '../ui'

export const PoolTable = () => {

	const context = useContext(Context)

	const [marketData, setMarketData] = useState(
		{ priceUSD: '', priceETH: '', ethPrice: '' })
	const [uniswapData, setUniswapData] = useState(
		{ "eth": "", "veth": '' })

	const [returns, setReturns] = useState(null)

	useEffect(() => {
		context.uniswapData ? getUniswapData() : loadUniswapData()
		context.marketData ? getMarketData() : loadMarketData()
		context.returnData ? getReturnData() : loadReturnData()
		// eslint-disable-next-line
	}, [])

	const getUniswapData = () => {
		setUniswapData(context.uniswapData)
	}

	const loadUniswapData = async () => {
		const uniswapBal = await getUniswapDetails()
		setUniswapData(uniswapBal)
		context.setContext({
			"uniswapData": uniswapBal
		})
	}

	const getMarketData = async () => {
		setMarketData(context.marketData)
	}
	const loadMarketData = async () => {
		const priceEtherUSD = await getETHPrice()
		const priceVetherEth = await getUniswapPriceEth()
		const priceVetherUSD = priceEtherUSD * priceVetherEth

		const marketData = {
			priceUSD: priceVetherUSD,
			priceETH: priceVetherEth,
			ethPrice: priceEtherUSD
		}

		setMarketData(marketData)
		context.setContext({
			"marketData": marketData
		})
	}

	const getReturnData = () => {
		setReturns(context.returnData)
	}

	const loadReturnData = async () => {
		const baseURL3 = 'https://api.blocklytics.org/uniswap/v1/returns/0x506D07722744E4A390CD7506a2Ba1A8157E63745?key='
        const response4 = await axios.get(baseURL3 + process.env.REACT_APP_BLOCKLYTICS_API + '&period=14&daysBack=7')
		let returnData = response4.data
		console.log(returnData)
		let returns = returnData.reduce((acc, item) => ((+acc + +item.D7_annualized)/2), 0)
		console.log(returnData)
		setReturns(returns)
		context.setContext({'returnData':returns})
	}

	return (
		<div>
			<Center><Text size={30} margin={"10px 0px 0px"}>${prettify(marketData.priceUSD)}</Text></Center>
			<Center><LabelGrey margin={"0px 0px 10px"}>VALUE OF 1 VETH</LabelGrey></Center>
			<Center><Text size={30} margin={"0px 0px 0px"}>{prettify(returns)}%</Text></Center>
			<Center><LabelGrey margin={"0px 0px 10px"}>CURRENT POOL ROI (ANNUALISED)</LabelGrey></Center>
			<Row style={{ marginBottom: 50 }}>
				<Col xs={24} sm={6}>
				</Col>
				<PoolCard uniswapData={uniswapData} marketData={marketData}/>
				<Col xs={24} sm={6}>
				</Col>
			</Row>
		</div>
	)
}

export const StakeTable = () => {

	const context = useContext(Context)

	const [account, setAccount] = useState(
		{ address: '', vethBalance: '', ethBalance: '', uniBalance: '', uniSupply: '' })
	const [uniswapData, setUniswapData] = useState(
		{ "eth": "", "veth": '' })

	const [loading, setLoading] = useState(true)


	useEffect(() => {
		connect()
		// eslint-disable-next-line
	}, [])

	const connect = async () => {
		// setWalletFlag('TRUE')
		var accounts = await window.web3.eth.getAccounts()
		const address = await accounts[0]
		context.accountData ? await getAccountData() : await loadAccountData(address)
		context.uniswapData ? await getUniswapData() : await loadUniswapData()
		setLoading(false)
	}

	const getAccountData = () => {
		setAccount(context.accountData)
	}

	const loadAccountData = async (account) => {
		const contract = await new window.web3.eth.Contract(vetherAbi(), vetherAddr())
		const ethBalance = convertFromWei(await window.web3.eth.getBalance(account))
		const vethBalance = convertFromWei(await contract.methods.balanceOf(account).call())
		const exchangeContract = new window.web3.eth.Contract(uniSwapAbi(), uniSwapAddr())
		const uniBalance = convertFromWei(await exchangeContract.methods.balanceOf(account).call())
		const uniSupply = convertFromWei(await exchangeContract.methods.totalSupply().call())

		const accountData = {
			address: account,
			vethBalance: vethBalance,
			ethBalance: ethBalance,
			uniBalance: uniBalance,
			uniSupply: uniSupply
		}
		setAccount(accountData)
		context.setContext({ "accountData": accountData })
	}

	const getUniswapData = () => {
		setUniswapData(context.uniswapData)
	}

	const loadUniswapData = async () => {
		const uniswapDetails = await getUniswapDetails()
		setUniswapData(uniswapDetails)
		context.setContext({
			"uniswapData": uniswapDetails
		})
	}

	return (
		<div>
			<Gap />
			<Row>
				{/* <Col xs={24} sm={12}>
					{!loading &&
						<WalletCard accountData={account} />
					}
				</Col> */}
				<Col xs={24} sm={12}>
					{!loading &&
						<UniswapCard accountData={account} uniswapData={uniswapData} />
					}
				</Col>
			</Row>

			<H2>MANAGE LIQUIDITY</H2><br />
			<Subtitle>Add liquidity to the pool (ETH and VETH) to earn on trade fees</Subtitle><br />
			<br />
			{!loading &&
				<AddLiquidityTable accountData={account} />
			}
			<HR />
			<Gap />
			<H2>REMOVE LIQUIDITY</H2><br />
			<Subtitle>Remove liquidity from the pool</Subtitle><br />
			<br /><br />
			{!loading &&
				<RemoveLiquidityTable accountData={account} />
			}
		</div>

	)
}

export const AddLiquidityTable = (props) => {

	const account = props.accountData

	const totalSupply = getBN(1000000 * 10 ** 18)

	const [addEthFlag, setAddUniswapFlag] = useState(null)
	const [ethTx, setEthTx] = useState(null)
	const [ethAmount, setEthAmount] = useState(null)
	const [vetherPrice, setVetherPrice] = useState(null)
	const [loaded, setLoaded] = useState(null)
	const [loading, setLoading] = useState(true)
	const [approved, setApproved] = useState(null)
	const [approveFlag, setApproveFlag] = useState(null)
	const [customAmount, setCustomAmount] = useState(null)
	const [approvalAmount, setApprovalAmount] = useState(null)

	const ethBalanceSpendable = (account.ethBalance - 0.1).toFixed(4) < 0 ?
		0 : (account.ethBalance - 0.1).toFixed(4)

	useEffect(() => {
		connect()
		// eslint-disable-next-line
	}, [])

	const connect = async () => {
		// setWalletFlag('TRUE')
		const vethPrice = await getUniswapPriceEth()
		setVetherPrice(vethPrice)
		if (account) {
			setCustomAmount(account.vethBalance)
			setEthAmount(account.ethBalance - 0.01)
			setCustomAmount(account.ethBalance * (1 / (vethPrice)))
			checkApproval(account.address)
			setLoading(false)
		}
	}

	const checkApproval = async (address) => {
		const tokenContract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
		const fromAcc = address
		const spender = uniSwapAddr()
		const approval = await tokenContract.methods.allowance(fromAcc, spender).call()
		const vethBalance = await tokenContract.methods.balanceOf(address).call()
		setApprovalAmount(approval)
		if (+approval >= +vethBalance && +vethBalance > 0) {
			setApproved(true)
		}
	}

	const unlockToken = async () => {
		setApproveFlag(true)
		const tokenContract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
		const fromAcc = account.address
		const spender = uniSwapAddr()
		const value = totalSupply.toString()
		await tokenContract.methods.approve(spender, value).send({ from: fromAcc })
		checkApproval(account.address)
	}

	const addUniswap = async () => {
		const fromAcc = account.address
		const deadline = (Math.round(((new Date()) / 1000) + 1000)).toString()
		const min_liquidity = (1).toString()
		const amountVeth = (convertToWei(customAmount)).toString()
		const amountEth = (convertToWei(ethAmount)).toString()
		setAddUniswapFlag('TRUE')
		const exchangeContract = new window.web3.eth.Contract(uniSwapAbi(), uniSwapAddr())
		const tx = await exchangeContract.methods.addLiquidity(min_liquidity, amountVeth, deadline).send({ value: amountEth, from: fromAcc })
		setEthTx(tx.transactionHash)
		setLoaded(true)
	}

	const onEthAmountChange = e => {
		setEthAmount(e.target.value)
		setCustomAmount(e.target.value * (1 / vetherPrice))
	}

	const getLink = (tx) => {
		return getEtherscanURL().concat('tx/').concat(tx)
	}

	return (
		<div>
			{!loading &&
				<div>
					{(account.vethBalance === "0") &&
						<Row>
							<Col xs={12}>
								<Sublabel>You need Vether to stake.</Sublabel>
							</Col>
						</Row>
					}
					{(!approved && (account.vethBalance > 0)) &&
						<Row>
							<Col xs={24}>
								<Button
									backgroundColor="transparent"
									onClick={unlockToken}
								>
									UNLOCK >
								</Button>
								<Tooltip placement="right" title="This will unlock your Vether">
									&nbsp;<QuestionCircleOutlined style={{ color: Colour().grey }} />
								</Tooltip>
								<br></br>
								<Sublabel>Unlock Vether first</Sublabel>
								<br></br>
								{approveFlag &&
									<div>
										{!approved &&
											<LoadingOutlined style={{ marginLeft: 20, fontSize: 15 }} />
										}
										{approved &&
											<div>
												<Sublabel>Approval</Sublabel>
												<br></br>
												<LabelGrey>{convertFromWei(approvalAmount)}</LabelGrey>
											</div>
										}
									</div>
								}
							</Col>
						</Row>
					}
					<br></br>
					{approved &&
						<>
							<Row>
								{(account.vethBalance > 0) &&
									<div>
										<Col xs={4}>
											<Input size={'large'} style={{ marginBottom: 10 }} allowClear onChange={onEthAmountChange} placeholder={ethBalanceSpendable} />
											<br></br>
											<Label>{prettify(customAmount)}</Label>
											<br></br>
											<LabelGrey>VETH required to stake</LabelGrey>
										</Col>
										<Col xs={8} style={{ marginLeft: 20 }}>
											<Button
												backgroundColor="transparent"
												onClick={addUniswap}
											> ADD >>
											</Button>
											<Tooltip placement="right" title="This will add Ether and Vether to the pool. You can claim it back later.">
												&nbsp;<QuestionCircleOutlined style={{ color: Colour().grey }} />
											</Tooltip>
											<br></br>
											<Sublabel>ADD LIQUIDITY TO UNISWAP</Sublabel>

											{addEthFlag &&
												<div>
													{!loaded &&
														<LoadingOutlined style={{ marginLeft: 20, fontSize: 15 }} />
													}
													{loaded &&
														<div>
															<Click><a href={getLink(ethTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> VIEW TRANSACTION -> </a></Click>
															<br></br>
															<Sublabel>Refresh to update</Sublabel>
														</div>
													}
												</div>
											}
										</Col>
									</div>
								}
							</Row>
						</>
					}
				</div>
			}
		</div>
	)
}

export const RemoveLiquidityTable = (props) => {

	const account = props.accountData

	const [burnTknFlag, setBurnTknFlag] = useState(null)
	const [tknTx, setTknTx] = useState(null)
	const [loaded2, setLoaded2] = useState(null)
	const [customAmount, setCustomAmount] = useState(100)

	useEffect(() => {
		// eslint-disable-next-line
	}, [])

	const getLink = (tx) => {
		return getEtherscanURL().concat('tx/').concat(tx)
	}

	const onAmountChange = e => {
		setCustomAmount(e.target.value)
	}

	const getUniSupply = (part) => {
		const numerator = (getBig(convertToWei(account.uniBalance))).multipliedBy(part)
		const final = numerator.div(100)
		return final.integerValue(1)
	}

	const removeLiquidity = async () => {
		setBurnTknFlag(true)
		console.log(account.uniBalance, customAmount)
		const amount = (getUniSupply(customAmount)).toString()
		const min_eth = (1).toString()
		const min_tokens = (1).toString()
		const deadline = (Math.round(((new Date()) / 1000) + 1000)).toString()
		console.log(amount, min_eth, min_tokens, deadline)
		const exchangeContract = new window.web3.eth.Contract(uniSwapAbi(), uniSwapAddr())
		const tx = await exchangeContract.methods.removeLiquidity(amount, min_eth, min_tokens, deadline).send({ from: account.address })
		setTknTx(tx.transactionHash)
		setLoaded2(true)
	}

	return (
		<div>
			{(account.uniBalance === "0") &&
				<Row>
					<Col xs={12}>
						<Sublabel>You don't have a share of the pool.</Sublabel>
					</Col>
				</Row>
			}
			{(account.uniBalance > 0) &&
				<Row>
					<div>
						<Col xs={4}>
							<Input size={'large'} style={{ marginBottom: 10 }} allowClear onChange={onAmountChange} placeholder={100} />
							<br></br>
							<Sublabel>Proportion to remove (%)</Sublabel>
						</Col>
						<Col xs={12} sm={7} style={{ paddingLeft: 20 }}>
							<Button
								backgroundColor="transparent"
								onClick={removeLiquidity}
							> REMOVE >>
							</Button>
							<Tooltip placement="right" title="This will claim back your assets.">
								&nbsp;<QuestionCircleOutlined style={{ color: Colour().grey }} />
							</Tooltip>
							<br></br>
							<Sublabel>Remove liquidity from the pool.</Sublabel>
							{burnTknFlag &&
								<div>
									{!loaded2 &&
										<LoadingOutlined style={{ marginLeft: 20, fontSize: 15 }} />
									}
									{loaded2 &&
										<div>
											<Click><a href={getLink(tknTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}> VIEW TRANSACTION -> </a></Click>
											<br></br>
											<Sublabel>Refresh to update</Sublabel>
										</div>
									}
								</div>
							}
						</Col>
					</div>
				</Row>
			}
		</div>
	)
}
