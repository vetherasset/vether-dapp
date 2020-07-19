import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import {
	ETH, vetherAddr, vetherAbi, vetherPoolsAddr, vetherPoolsAbi,
	getUniswapPriceEth, getEtherscanURL, infuraAPI,
} from '../../client/web3.js'
import { getETHPrice } from '../../client/market.js'
import { convertFromWei, convertToWei, prettify, oneBN, BN2Str, getBN } from '../utils'
import { calcShare } from '../math'

import { Row, Col, Input, Tooltip } from 'antd'
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
	H2,
	Text,
	LabelGrey,
	Click,
	Button,
	Sublabel,
	Colour,
	Center
} from '../components'

import Web3 from "web3";

export const PoolTable = () => {

	const context = useContext(Context)

	const [marketData, setMarketData] = useState(
		{ priceUSD: '', priceETH: '', ethPrice: '' })
	const [poolData, setPoolData] = useState(
		{ "eth": "", "veth": '', 'price': "", "fees": "", "volume": "", "txCount": "", 'roi': "" })

	useEffect(() => {
		context.poolData ? getPoolData() : loadPoolData()
		context.marketData ? getMarketData() : loadMarketData()
		// eslint-disable-next-line
	}, [])

	const getPoolData = () => {
		setPoolData(context.poolData)
		console.log('pooldata', context.poolData)
	}

	const loadPoolData = async () => {
		const web3_ = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
		const poolContract = new web3_.eth.Contract(vetherPoolsAbi(), vetherPoolsAddr())
		let poolData = await poolContract.methods.poolData(ETH).call()
		let price = await poolContract.methods.calcValueInAsset(BN2Str(oneBN), ETH).call()
		let roi = await poolContract.methods.getPoolROI(ETH).call()
		const poolData_ = {
			"eth": convertFromWei(poolData.asset),
			"veth": convertFromWei(poolData.vether),
			"price": convertFromWei(price),
			"volume": convertFromWei(poolData.volume),
			"fees": convertFromWei(poolData.fees),
			"txCount": poolData.txCount,
			"roi": (+roi / 100) - 100
		}
		console.log(poolData_)
		setPoolData(poolData_)
		context.setContext({
			"poolData": poolData_
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

	const poolStyles = {
		borderWidth: '1px',
		borderStyle: 'solid',
		borderRadius: 6,
		borderColor: Colour().gold,
		marginBottom: '1.3rem',
		padding: '20px',
		backgroundColor: Colour().black,
	}

	const lineStyle = {
		borderLeft: '1px dashed',
		borderColor: '#97948e47',
		paddingLeft: 5
	}
	const topLineStyle = {
		borderTop: '1px dashed',
		borderColor: '#97948e47',
		paddingLeft: 5,
		marginTop: 10,
		paddingTop: 10
	}

	return (
		<div style={{ marginTop: '2rem' }}>
			<Row type="flex" justify="center">
				<Col span={18}>
					{/* <Label display="block" style={{ marginBottom: '1.33rem' }}>Pooled Tokens</Label> */}
					<div style={poolStyles}>
						<Row>
							<Col xs={12}>
								<Text size={20} style={{ textAlign: 'left', display: 'block', margin: '0' }}>$VETH</Text>
								<Center><Text size={30} color={Colour().white} margin={"20px 0px 5px 0px"}>{prettify(poolData.veth)}</Text></Center>
								{/* <Center><Text margin={"5px 0px 30px"}>${prettify(priceData.ethPrice * poolData.eth)}</Text></Center> */}
							</Col>
							<Col xs={12} style={lineStyle}>
								<Text size={20} style={{ textAlign: 'left', display: 'block', margin: '0 0 0 15px' }}>ETH Ξ</Text>
								<Center><Text size={30} color={Colour().white} margin={"20px 0px 20px 0px"}>{prettify(poolData.eth)}</Text></Center>
								{/* <Center><Text margin={"5px 0px 30px"}>${prettify(priceData.ethPrice * poolData.eth)}</Text></Center> */}
							</Col>
						</Row>
						<Row>
							<Col>
								<Center><Text size={12} style={{ textAlign: 'center', display: 'block', margin: '10px 0px 0px 0px' }}>PRICE</Text></Center>
								<Center><Text size={18} color={Colour().white} margin={"5px 0px 5px 0px"}>${prettify(poolData.price * marketData.ethPrice)}</Text></Center>
							</Col>
						</Row>
						<Row style={topLineStyle}>
							<Col xs={6}>
								<Center><Text size={12} style={{ textAlign: 'center', display: 'block', margin: '0' }}>VOL (VETH)</Text></Center>
								<Center><Text size={18} color={Colour().white} margin={"5px 0px 5px 0px"}>{prettify(poolData.volume)}</Text></Center>
							</Col>
							<Col xs={6}>
								<Center><Text size={12} style={{ textAlign: 'center', display: 'block', margin: '0' }}>FEES (VETH)</Text></Center>
								<Center><Text size={18} color={Colour().white} margin={"5px 0px 5px 0px"}>{prettify(poolData.fees)}</Text></Center>
							</Col>
							<Col xs={6}>
								<Center><Text size={12} style={{ textAlign: 'center', display: 'block', margin: '0' }}>TX COUNT</Text></Center>
								<Center><Text size={18} color={Colour().white} margin={"5px 0px 5px 0px"}>{prettify(poolData.txCount)}</Text></Center>
							</Col>
							<Col xs={6}>
								<Center><Text size={12} style={{ textAlign: 'center', display: 'block', margin: '0' }}>ROI</Text></Center>
								<Center><Text size={18} color={Colour().white} margin={"5px 0px 5px 0px"}>{prettify(poolData.roi)}%</Text></Center>
							</Col>
						</Row>
					</div>
				</Col>
			</Row>
		</div>
	)
}

export const StakeTable = () => {

	const context = useContext(Context)

	const [account, setAccount] = useState(
		{
			address: '', vethBalance: '', ethBalance: '',
			stakeUnits: '', vetherStaked: '', assetStaked: '',
			vetherShare: '', assetShare: '', roi: ''
		})

	const [loading, setLoading] = useState(true)


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
		setLoading(false)
	}

	const getAccountData = () => {
		setAccount(context.accountData)
	}

	const loadAccountData = async (account) => {
		const accountConnected = (await window.web3.eth.getAccounts())[0];
		if (accountConnected) {
			const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
			const contract = await new web3.eth.Contract(vetherAbi(), vetherAddr())
			const ethBalance = convertFromWei(await web3.eth.getBalance(account))
			const vethBalance = convertFromWei(await contract.methods.balanceOf(account).call())

			const poolContract = new web3.eth.Contract(vetherPoolsAbi(), vetherPoolsAddr())
			let stakeData = await poolContract.methods.getMemberStakeData(account, ETH).call()

			let poolData = await poolContract.methods.poolData(ETH).call()
			let poolShare = calcShare(getBN(stakeData.stakeUnits), getBN(poolData.poolUnits), getBN(poolData.asset), getBN(poolData.vether))

			// let vetherShare = await poolContract.methods.getStakerShareVether(account, ETH).call()
			// let assetShare = await poolContract.methods.getStakerShareAsset(account, ETH).call()
			let memberROI = await poolContract.methods.getMemberROI(account, ETH).call()
			console.log(memberROI)

			const accountData = {
				'address': account,
				'vethBalance': vethBalance,
				'ethBalance': ethBalance,
				'stakeUnits': convertFromWei(stakeData.stakeUnits),
				'vetherStaked': convertFromWei(stakeData.vether),
				'assetStaked': convertFromWei(stakeData.asset),
				'vetherShare': convertFromWei(poolShare.vether),
				'assetShare': convertFromWei(poolShare.asset),
				"roi": (+memberROI)
			}
			setAccount(accountData)
			context.setContext({ "accountData": accountData })
		}
	}

	return (
		<div>
			<Row>
				{/* <Col xs={24} sm={12}>
					{!loading &&
						<WalletCard accountData={account} />
					}
				</Col> */}
				<Col xs={24} sm={13}>
					{/* {!loading &&
						// <UniswapCard accountData={account} uniswapData={uniswapData} />
					} */}
				</Col>
			</Row>

			<H2>MANAGE LIQUIDITY</H2><br />
			Add liquidity to the pool (ETH and VETH) to earn on trade fees<br />
			<br />
			{!loading &&
				<AddLiquidityTable accountData={account} />
			}
			<hr />
			<H2>REMOVE LIQUIDITY</H2><br />
			Remove liquidity from the pool<br />
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

	const [stakeFlag, setStakeFlag] = useState(null)
	const [ethTx, setEthTx] = useState(null)
	const [ethAmount, setEthAmount] = useState(null)
	const [vetherPrice, setVetherPrice] = useState(null)
	const [loaded, setLoaded] = useState(null)
	const [loading, setLoading] = useState(true)
	const [approved, setApproved] = useState(null)
	const [approveFlag, setApproveFlag] = useState(null)
	const [vethAmount, setVethAmount] = useState(null)
	const [approvalAmount, setApprovalAmount] = useState(null)

	const ethBalanceSpendable = (account.ethBalance - 0.1).toFixed(4) < 0 ?
		0 : (account.ethBalance - 0.1).toFixed(4)

	useEffect(() => {
		connect()
		console.log(vetherPrice)
		// eslint-disable-next-line
	}, [])

	const connect = async () => {
		// setWalletFlag('TRUE')
		const vethPrice = await getUniswapPriceEth()
		setVetherPrice(vethPrice)
		if (account) {
			setVethAmount(account.vethBalance)
			setEthAmount(account.ethBalance - 0.01)
			setVethAmount(account.vethBalance)
			checkApproval(account.address)
			setLoading(false)
		}
	}

	const checkApproval = async (address) => {
		const accountConnected = (await window.web3.eth.getAccounts())[0];
		if (accountConnected) {
			const tokenContract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
			const fromAcc = address
			const spender = vetherPoolsAddr()
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
		const spender = vetherPoolsAddr()
		const value = totalSupply.toString()
		await tokenContract.methods.approve(spender, value).send({ from: fromAcc })
		checkApproval(account.address)
	}

	const stake = async () => {
		const fromAcc = account.address
		const amountVeth = (convertToWei(vethAmount)).toString()
		const amountEth = (convertToWei(ethAmount)).toString()
		setStakeFlag('TRUE')
		const poolContract = new window.web3.eth.Contract(vetherPoolsAbi(), vetherPoolsAddr())
		const tx = await poolContract.methods.stake(amountVeth, amountEth, ETH).send({ value: amountEth, from: fromAcc })
		setEthTx(tx.transactionHash)
		setLoaded(true)
	}

	const onEthAmountChange = e => {
		setEthAmount(e.target.value)
	}
	const onVethAmountChange = e => {
		setVethAmount(e.target.value)
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
										<Row>
											<Col xs={12}>
												<Row>
													<Col xs={24}>
														<Input size={'large'} style={{ marginBottom: 10 }} allowClear onChange={onEthAmountChange} placeholder={ethBalanceSpendable} />
														<br></br>
														<Input size={'large'} style={{ marginBottom: 10 }} allowClear onChange={onVethAmountChange} placeholder={account.vethBalance} />
														<br></br>
													</Col>
													<Col xs={24} style={{ paddingLeft: 20 }}>
														<Button
															backgroundColor="transparent"
															onClick={stake}
														> ADD >>
											</Button>
														<Tooltip placement="right" title="This will add Ether and Vether to the pool. You can claim it back later.">
															&nbsp;<QuestionCircleOutlined style={{ color: Colour().grey }} />
														</Tooltip>
														<br></br>
														<Sublabel>Add liquidity to the pool</Sublabel>

														{stakeFlag &&
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

												</Row>
											</Col>
											<Col xs={12}>
												<Row>
													<Col xs={8} style={{ paddingLeft: 20 }}>
														<span><h6>Asset Share</h6><h3>{prettify(account.assetShare)}</h3></span>
													</Col>
													<Col xs={8} style={{ paddingLeft: 20 }}>
														<span><h6>Vether Share</h6><h3>{prettify(account.vetherShare)}</h3></span>
													</Col>
													<Col xs={8} style={{ paddingLeft: 20 }}>
														<span><h6>Units</h6><h3>{prettify(account.stakeUnits)}</h3></span>
													</Col>
												</Row>
												<Row>
													<Col xs={8} style={{ paddingLeft: 20 }}>
														<span><h6>Asset Staked</h6><h3>{prettify(account.assetStaked)}</h3></span>
													</Col>
													<Col xs={8} style={{ paddingLeft: 20 }}>
														<span><h6>Vether Staked</h6><h3>{prettify(account.vetherStaked)}</h3></span>
													</Col>
													<Col xs={8} style={{ paddingLeft: 20 }}>
														<span><h6>ROI</h6><h3>{prettify(account.roi)}</h3></span>
													</Col>
												</Row>
											</Col>
										</Row>
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
	const [unstakeAmount, setUnstakeAmount] = useState('10000')
	// const [unstakeUnits, setUnstakeUnits] = useState('0')

	useEffect(() => {
		console.log(account.stakeUnits)
		// eslint-disable-next-line
	}, [])

	const getLink = (tx) => {
		return getEtherscanURL().concat('tx/').concat(tx)
	}

	const onAmountChange = e => {
		setUnstakeAmount(e.target.value * 100)
	}
	// const onUnitsChange = e => {
	// 	setUnstakeUnits(convertToWei(e.target.value))
	// }

	const unstake = async () => {
		setBurnTknFlag(true)
		const poolContract = new window.web3.eth.Contract(vetherPoolsAbi(), vetherPoolsAddr())
		console.log(unstakeAmount, ETH)
		const tx = await poolContract.methods.unstake(unstakeAmount, ETH).send({ from: account.address })
		setTknTx(tx.transactionHash)
		setLoaded2(true)
	}

	// const unstakeExact = async () => {
	// 	setBurnTknFlag(true)
	// 	const poolContract = new window.web3.eth.Contract(vetherPoolsAbi(), vetherPoolsAddr())
	// 	console.log(unstakeUnits, ETH)
	// 	const tx = await poolContract.methods.unstakeExact(unstakeUnits, ETH).send({ from: account.address })
	// 	setTknTx(tx.transactionHash)
	// 	setLoaded2(true)
	// }

	return (
		<div>
			{(account.stakeUnits === "0") &&
				<Row>
					<Col xs={12}>
						<Sublabel>You don't have a share of the pool.</Sublabel>
					</Col>
				</Row>
			}
			{(account.stakeUnits > 0) &&
				<div>
					<Row>
						<Col xs={12}>
							<Input size={'large'} style={{ marginBottom: 10 }} allowClear onChange={onAmountChange} placeholder={100} />
							<br></br>
							<Sublabel>Proportion to remove (%)</Sublabel>
						</Col>
						<Col xs={12} sm={7} style={{ paddingLeft: 20 }}>
							<Button
								backgroundColor="transparent"
								onClick={unstake}
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
					</Row>
					
				</div>
			}
		</div>
	)
}
