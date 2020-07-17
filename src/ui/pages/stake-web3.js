import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import axios from 'axios'

import { vetherAddr, vetherAbi, uniSwapAddr, uniSwapAbi, getUniswapPriceEth, getUniswapDetails, getEtherscanURL } from '../../client/web3.js'
import { convertFromWei, convertToWei, prettify, getBN, getBig } from '../utils'

import { Row, Col, Input, Tooltip } from 'antd'
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
	LabelGrey,
	Label,
	Click,
	Button,
	Sublabel,
	Colour,
} from '../components'
import { UniswapCard } from '../ui'
import Web3 from "web3";

export const StakingStats = () => {

	const context = useContext(Context)

	const [returns, setReturns] = useState(null)

	useEffect(() => {
		loadReturnData()
		// eslint-disable-next-line
	}, [])

	const loadReturnData = async () => {
		const baseURL3 = 'https://api.blocklytics.org/pools/v1/returns/' + uniSwapAddr() + '?key='
		const response4 = await axios.get(baseURL3 + process.env.REACT_APP_BLOCKLYTICS_API + '&periods=1')
		const returnData = response4.data
		const roi = (returnData.results[0].roi)
		const roiAnn = (((Math.pow((1+roi), (1))-1))*100)
		setReturns(roiAnn)
		context.setContext({'returnData':roiAnn})
	}

	return (
		<>
			<div style={{ textAlign: 'center' }}><span style={{ fontSize: 30 }}>{returns}%</span>
				<Tooltip placement="right" title="Represents actual value.">
					&nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, margin: 0 }} />
				</Tooltip>
			</div>
			<LabelGrey style={{ display: 'block', marginBottom: 0, textAlign: 'center' }}>ROI&nbsp;annualized</LabelGrey>
		</>
	)
}

export const StakeTable = () => {

	const context = useContext(Context)

	const [account, setAccount] = useState(
		{ address: '', vethBalance: '', ethBalance: '', uniBalance: '', uniSupply: '' })
	const [uniswapData, setUniswapData] = useState(
		{ "eth": "", "veth": '' })



	useEffect(() => {
		connect()
		// eslint-disable-next-line
	}, [])

	const connect = async () => {
		// setWalletFlag('TRUE')
		window.web3 = new Web3(window.ethereum);
		var accounts = await window.web3.eth.getAccounts()
		const address = await accounts[0]
		context.accountData ? await getAccountData() : await loadAccountData(address)
		context.uniswapData ? await getUniswapData() : await loadUniswapData()
	}

	const getAccountData = () => {
		setAccount(context.accountData)
	}

	const loadAccountData = async (account) => {
		const accountConnected = (await window.web3.eth.getAccounts())[0];
		if(accountConnected) {
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
			context.setContext({"accountData": accountData})
		}
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
		<>
			<Row>
				<Col xs={24} sm={13}>
					<UniswapCard accountData={account} uniswapData={uniswapData} />
				</Col>
			</Row>
			<h2>ADD LIQUIDITY</h2>
			Add liquidity to the pool to earn on trade fees.<br />
			<AddLiquidityTable accountData={account} />
			<h2>REMOVE LIQUIDITY</h2>
			Remove liquidity from the pool.<br />
			<RemoveLiquidityTable accountData={account} />
		</>

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
		}
	}

	const checkApproval = async (address) => {
		const accountConnected = (await window.web3.eth.getAccounts())[0];
		if(accountConnected){
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
			<>
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
			</>
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
		<>
			{(account.uniBalance === "0") &&
			<Row>
				<Col xs={12}>
					<Sublabel>You don't have a share of the pool.</Sublabel>
				</Col>
			</Row>
			}
			{(account.uniBalance > 0) &&
			<Row>
				<>
					<Col xs={4}>
						<Input size={'large'} style={{ marginBottom: 10 }} allowClear onChange={onAmountChange} placeholder={100} />
						<br/>
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
						<Sublabel>Remove liquidity from the pool.</Sublabel>
						{burnTknFlag &&
						<>
							{!loaded2 &&
							<LoadingOutlined style={{ marginLeft: 20, fontSize: 15 }} />
							}
							{loaded2 &&
							<>
								<Click><a href={getLink(tknTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}> VIEW TRANSACTION -> </a></Click>
								<br/>
								<Sublabel>Refresh to update</Sublabel>
							</>
							}
						</>
						}
					</Col>
				</>
			</Row>
			}
		</>
	)
}
