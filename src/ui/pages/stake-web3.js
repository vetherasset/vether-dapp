import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import {
	ETH, vetherAddr, vetherAbi, vetherPools2Addr, vetherPools2Abi, vetherPoolsAddr, vetherPoolsAbi,
	getUniswapPriceEth, getEtherscanURL, infuraAPI,
} from '../../client/web3.js'
import { getETHPrice } from '../../client/market.js'
import { convertFromWei, prettify, oneBN, BN2Str, getBN } from '../utils'
import { calcShare } from '../math'

import { Row, Col, Select, Input, Tooltip } from 'antd'
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Text, LabelGrey, Button, Sublabel, Colour, Center, Label } from '../components'

import Web3 from "web3"

export const PoolTable = () => {

	const context = useContext(Context)

	const [marketData, setMarketData] = useState(
		{ priceUSD: '', priceETH: '', ethPrice: '' })
	const [poolData, setPoolData] = useState(
		{ "eth": "", "veth": '', 'price': "", "fees": "", "volume": "", "poolUnits": "", "txCount": "", 'age':"", 'roi': "", 'apy': "" })

	useEffect(() => {
		loadPoolData()
		loadMarketData()
		// eslint-disable-next-line
	}, [])

	const loadPoolData = async () => {
		const web3_ = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
		const poolContract = new web3_.eth.Contract(vetherPools2Abi(), vetherPools2Addr())
		let poolData = await poolContract.methods.poolData(ETH).call()
		let price = await poolContract.methods.calcValueInAsset(BN2Str(oneBN), ETH).call()
		let age = await poolContract.methods.getPoolAge(ETH).call()
		let roi = await poolContract.methods.getPoolROI(ETH).call()
		let apy = await poolContract.methods.getPoolAPY(ETH).call()
		const poolData_ = {
			"eth": convertFromWei(poolData.asset),
			"veth": convertFromWei(poolData.vether),
			"price": convertFromWei(price),
			"volume": convertFromWei(poolData.volume),
			"poolUnits": poolData.poolUnits,
			"fees": convertFromWei(poolData.fees),
			"txCount": poolData.txCount,
			"age": age,
			"roi": roi,
			"apy": apy
		}
		setPoolData(poolData_)
		context.setContext({
			"poolData": poolData_
		})
	}

	const loadMarketData = async () => {
		const priceEtherUSD = await getETHPrice()

		const marketData = {
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
				<Col lg={16} xs={24}>
					<div style={poolStyles}>
						<Row>
							<Col xs={12}>
								<Text size={20} style={{ textAlign: 'left', display: 'block', margin: '0' }}>$VETH</Text>
								<Center><Text size={'1.9rem'} color={Colour().white} margin={"20px 0px 5px 0px"}>{prettify(poolData.veth)}</Text></Center>
								<Center><span style={{ color: '#97948e', margin: 0 }}>${prettify(poolData.veth * (poolData.price * marketData.ethPrice))}</span></Center>
							</Col>
							<Col xs={12} style={lineStyle}>
								<Text size={20} style={{ textAlign: 'left', display: 'block', margin: '0 0 0 15px' }}>ETH Ξ</Text>
								<Center><Text size={'1.9rem'} color={Colour().white} margin={"20px 0px 5px 0px"}>{prettify(poolData.eth)}</Text></Center>
								<Center><span style={{ color: '#97948e', margin: 0 }}>${prettify(marketData.ethPrice * poolData.eth)}</span></Center>
							</Col>
						</Row>
						<Row>
							<Col>
								<Center><Text size={'0.8rem'} style={{ textAlign: 'center', display: 'block', margin: '0' }}>PRICE</Text></Center>
								<Center>
									<Text size={'1.9rem'} color={Colour().white} margin={"5px 0px 5px 0px"}>${prettify(poolData.price * marketData.ethPrice)}
										<Tooltip placement="right" title="Current market rate you get.">
										&nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, margin: 0 }} />
										</Tooltip>
									</Text>
								</Center>
								<Center><span style={{ color: '#97948e', margin: 0 }}>{prettify(poolData.price, 5)}&nbsp;Ξ</span></Center>
							</Col>
						</Row>
						<Row style={topLineStyle}>
							<Col xs={6}>
								<Center><Text size={'0.8rem'} style={{ textAlign: 'center', display: 'block', margin: '0' }}>VOL&nbsp;<span style={{ fontSize: '0.7rem', fontStyle: 'italic', color: '#97948e', margin: 0 }}>$VETH</span></Text></Center>
								<Center><Text size={'1.1rem'} color={Colour().white} margin={"5px 0px 5px 0px"}>{prettify(poolData.volume)}</Text></Center>
							</Col>
							<Col xs={6}>
								<Center><Text size={'0.8rem'} style={{ textAlign: 'center', display: 'block', margin: '0' }}>FEES&nbsp;<span style={{ fontSize: '0.7rem', fontStyle: 'italic', color: '#97948e', margin: 0 }}>$VETH</span></Text></Center>
								<Center><Text size={'1.1rem'} color={Colour().white} margin={"5px 0px 5px 0px"}>{prettify(poolData.fees)}</Text></Center>
							</Col>
							<Col xs={6}>
								<Center><Text size={'0.8rem'} style={{ textAlign: 'center', display: 'block', margin: '0' }}>TRADES</Text></Center>
								<Center><Text size={'1.1rem'} color={Colour().white} margin={"5px 0px 5px 0px"}>{prettify(poolData.txCount)}</Text></Center>
							</Col>
							<Col xs={6}>
								<Center><Text size={'0.8rem'} style={{ textAlign: 'center', display: 'block', margin: '0' }}>ROI</Text></Center>
								<Center><Text size={'1.1rem'} color={Colour().white} margin={"5px 0px 5px 0px"}>{poolData.roi/100}%</Text></Center>
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

	const [connected, setConnected ] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		connect()
		// eslint-disable-next-line
	}, [])

	const connect = async () => {
		const accountConnected = (await window.web3.eth.getAccounts())[0]
		if(accountConnected) {
			window.web3 = new Web3(window.ethereum);
			var accounts = await window.web3.eth.getAccounts()
			const address = await accounts[0]
			await loadAccountData(address)
			setConnected(true)
			setLoading(false)
		}
	}

	const loadAccountData = async (account) => {
		const accountConnected = (await window.web3.eth.getAccounts())[0];
		if (accountConnected) {
			const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
			const contract = await new web3.eth.Contract(vetherAbi(), vetherAddr())
			const ethBalance = convertFromWei(await web3.eth.getBalance(account))
			const vethBalance = convertFromWei(await contract.methods.balanceOf(account).call())

			const poolContract = new web3.eth.Contract(vetherPools2Abi(), vetherPools2Addr())
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
				'stakeUnits': (stakeData.stakeUnits / poolData.poolUnits) * 100,
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
		<>
			<h2>ADD LIQUIDITY</h2>
			{loading &&
				<LoadingOutlined style={{ mnarginBottom: 0 }} />
			}
			{connected && !loading &&
				<AddLiquidityTable accountData={account}/>
			}
			{connected && !loading &&
				<>
					{account.stakeUnits > "0" &&
					<>
						<hr />
						<RemoveLiquidityTable accountData={account} />
					</>
					}
				</>
			}
		</>
	)
}

export const AddLiquidityTable = (props) => {

	const account = props.accountData

	const totalSupply = getBN(1000000 * 10 ** 18)

	const assets = [
		{
			name: 'Vether',
			symbol: '$VETH'
		},
		{
			name: 'Ether',
			symbol: 'Ξ'
		}
	]

	const [asset0, setAsset0] = useState(null)
	const [amount0, setAmount0] = useState(0)

	const [asset1, setAsset1] = useState(null)
	const [amount1, setAmount1] = useState(0)

	const [stakeFlag, setStakeFlag] = useState(null)
	const [ethTx, setEthTx] = useState(null)
	const [vetherPrice, setVetherPrice] = useState(null)
	const [loading, setLoading] = useState(true)
	const [approved, setApproved] = useState(true)
	const [approveFlag, setApproveFlag] = useState(null)

	// const ethBalanceSpendable = (account.ethBalance - 0.1).toFixed(4) < 0 ?
	// 	0 : (account.ethBalance - 0.1).toFixed(4)

	const { Option } = Select

	useEffect(() => {
		connect()
		console.log(vetherPrice)
		// eslint-disable-next-line
	}, [])

	const connect = async () => {
		const vethPrice = await getUniswapPriceEth()
		setVetherPrice(vethPrice)
		const accountConnected = (await window.web3.eth.getAccounts())[0]
		if (accountConnected) {
			const accounts = await window.web3.eth.getAccounts()
			const address = accounts[0]
			checkApproval(address)
			setLoading(false)
		}
	}

	const checkApproval = async (address) => {
		const accountConnected = (await window.web3.eth.getAccounts())[0];
		if (accountConnected){
			const vetherContract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
			const from = address
			const spender = vetherPools2Addr()
			const approval = await vetherContract.methods.allowance(from, spender).call()
			const vethBalance = await vetherContract.methods.balanceOf(address).call()
			if (+approval >= +vethBalance && +vethBalance >= 0) {
				setApproved(true)
			} else {
				setApproved(false)
			}
		}
	}

	const unlockToken = async () => {
		setApproveFlag(true)
		const tokenContract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
		const fromAcc = account.address
		const spender = vetherPools2Addr()
		const value = totalSupply.toString()
		await tokenContract.methods.approve(spender, value).send({ from: fromAcc })
		checkApproval(account.address)
	}

	const stake = async () => {
		const fromAcc = account.address
		let amountVeth
		let amountEth
		if (asset0.name === 'Vether') {
			amountVeth = Web3.utils.toWei(amount0.toString())
			amountEth = Web3.utils.toWei(amount1.toString())
		} else {
			amountVeth = Web3.utils.toWei(amount1.toString())
			amountEth = Web3.utils.toWei(amount0.toString())
		}
		setStakeFlag(true)
		console.log(stakeFlag)
		const poolContract = new window.web3.eth.Contract(vetherPools2Abi(), vetherPools2Addr())
		const tx = await poolContract.methods.stake(amountVeth, amountEth, ETH).send({
			value: amountEth,
			from: fromAcc,
			gasPrice: '',
			gas: ''
		})
		setEthTx(tx.transactionHash)
		console.log(ethTx)
	}

	const onAssetChange = (value) => {
		setAsset0(assets[value])
		addAnotherAsset(value)
	}

	const addAnotherAsset = (value) => {
		if(value === 0) {
			setAsset1(assets[1])
		} else {
			setAsset1(assets[0])
		}
	}

	const onAsset0amountChange = e => {
		setAmount0(e.target.value)
		console.log(amount0)
	}

	const onAsset1amountChange = e => {
		setAmount1(e.target.value)
		console.log(amount1)
	}

	return (
		<>
			<h2 style={{ fontStyle: 'italic' }}>Select asset to provide.</h2>
			<LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>Select an asset you would like to provide. Vether pool is non-proportional. Unlike Uniswap, where you need to provide<br/>
			an equal proportion of both assets, Vether pools allow you to provide liquidity in unequal proportions.</LabelGrey>

			<Row style={{ marginBottom: '1.33rem' }}>
				<Col lg={4} xs={10}>
					<Label display="block" style={{marginBottom: '0.55rem'}}>Asset</Label>
					<Select size={'large'} placeholder="Select" onChange={onAssetChange} style={{ width: 135 }}>
						{assets.map((asset, index) => {
							return(
								<Option value={index} key={index}>{asset.name}</Option>
							)
						})}
					</Select>
				</Col>
				<Col lg={5} xs={9}>
					<Label display="block" style={{marginBottom: '0.55rem'}}>Amount</Label>
					{asset0
						? <Input size={'large'} style={{ marginBottom: 10 }} onChange={onAsset0amountChange} value={amount0} suffix={asset0.symbol}/>
						: <Input size={'large'} style={{ marginBottom: 10 }} disabled/>
					}
				</Col>
			</Row>

			{asset1 &&
				<>
					<h2 style={{ fontStyle: 'italic' }}>Would you like to stake {asset1.name} as well?</h2>
					<LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>You may provide both assets in just one transaction, whilst this is not required.<br/>
					If you don't want to add {asset1.name} just leave following amount at zero.</LabelGrey>
					<Row style={{ marginBottom: '1.33rem' }}>
						<Col lg={6} xs={9}>
							<Label display="block" style={{marginBottom: '0.55rem'}}>Amount</Label>
							<Input size={'large'} style={{ marginBottom: 10 }} onChange={onAsset1amountChange} value={amount1} suffix={asset1.symbol}/>
						</Col>
					</Row>

					{amount0 > 0
						? <Button backgroundColor="transparent" onClick={stake}>ADD >></Button>
						: <Button backgroundColor="transparent" disabled>ADD >></Button>
					}
					<Sublabel>ADD LIQUIDITY TO THE POOL</Sublabel>
				</>
			}

			{!loading &&
				<>
					{!approved &&
						<Row>
							<Col xs={24}>
								<Label display="block" style={{marginBottom: '0.55rem'}}>Token Approval</Label>
								<Button backgroundColor="transparent" onClick={unlockToken}>APPROVE >></Button>
								<Sublabel>ALLOW VETHER FOR STAKING</Sublabel>
								{approveFlag &&
									<>
										{!approved &&
											<LoadingOutlined style={{ marginBottom: 0 }} />
										}
									</>
								}
							</Col>
						</Row>
					}

					{approved && account.stakeUnits > 0 &&
						<>
							<hr/>
							<h2>POOLED LIQUIDITY</h2>
							<p>Assets you have pooled.</p>
							<Row type="flex" justify="center" style={{ textAlign: "center", marginBottom: '2.66rem' }}>
								<Col xs={8}>
									<span style={{ fontSize: '0.8rem', display: 'block', margin: '0 0 0.5rem 0', color: '#97948e' }}>ASSET SHARE</span>
									<span style={{ fontSize: '1.2rem', display: 'block', margin: '0' }}>{prettify(account.vetherShare)} $VETH</span>
								</Col>
								<Col xs={8}>
									<span style={{ fontSize: '0.8rem', display: 'block', margin: '0 0 0.5rem 0', color: '#97948e' }}>ASSET SHARE</span>
									<span style={{ fontSize: '1.2rem', display: 'block', margin: '0' }}>{prettify(account.assetShare, 5)} Ξ</span>
								</Col>
								<Col xs={8}>
									<span style={{ fontSize: '0.8rem', display: 'block', margin: '0 0 0.5rem 0', color: '#97948e' }}>POOL SHARE</span>
									<span style={{ fontSize: '1.2rem', display: 'block', margin: '0' }}>{prettify(account.stakeUnits)} %</span>
								</Col>
							</Row>
							<Row type="flex" justify="center" style={{ textAlign: "center" }}>
								<Col xs={8}>
									<span style={{ fontSize: '0.8rem', display: 'block', margin: '0 0 0.5rem 0', color: '#97948e' }}>STAKED</span>
									<span style={{ fontSize: '1.2rem', display: 'block', margin: '0' }}>{prettify(account.vetherStaked)} $VETH</span>
								</Col>
								<Col xs={8}>
									<span style={{ fontSize: '0.8rem', display: 'block', margin: '0 0 0.5rem 0', color: '#97948e' }}>STAKED</span>
									<span style={{ fontSize: '1.2rem', display: 'block', margin: '0' }}>{prettify(account.assetStaked, 5)} Ξ</span>
								</Col>
								<Col xs={8}>
									<span style={{ fontSize: '0.8rem', display: 'block', margin: '0 0 0.5rem 0', color: '#97948e' }}>ROI</span>
									<span style={{ fontSize: '1.2rem', display: 'block', margin: '0' }}>{prettify((account.roi/100) - 100)}%</span>
								</Col>
							</Row>
						</>
					}
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
	const [unstakeAmount, setUnstakeAmount] = useState('10000')

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
		const poolContract = new window.web3.eth.Contract(vetherPools2Abi(), vetherPools2Addr())
		console.log(unstakeAmount, ETH)
		const tx = await poolContract.methods.unstake(unstakeAmount, ETH).send({ from: account.address })
		setTknTx(tx.transactionHash)
		setLoaded2(true)
	}

	// const unstakeExact = async () => {
	// 	setBurnTknFlag(true)
	// 	const poolContract = new window.web3.eth.Contract(vetherPools2Abi(), vetherPools2Addr())
	// 	console.log(unstakeUnits, ETH)
	// 	const tx = await poolContract.methods.unstakeExact(unstakeUnits, ETH).send({ from: account.address })
	// 	setTknTx(tx.transactionHash)
	// 	setLoaded2(true)
	// }

	return (
		<>
			<h2>REMOVE LIQUIDITY</h2>
			<p>Remove your pooled assets.</p>
			{(account.stakeUnits > 0) &&
				<>
					<Row>
						<Col xs={2}>
							<Label display="block" style={{marginBottom: '0.55rem'}}>Proportion</Label>
							<Input size={'large'} style={{ marginBottom: 10 }} onChange={onAmountChange} placeholder={100} suffix={'%'}/>
						</Col>
						<Col xs={12} sm={7} style={{ paddingLeft: 20, paddingTop: 30 }}>
							{unstakeAmount > 0
								? <Button backgroundColor="transparent" onClick={unstake}>REMOVE >></Button>
								: <Button backgroundColor="transparent" disabled>REMOVE >></Button>
							}
							<Sublabel margin={0}>REMOVE LIQUIDITY FROM THE POOL</Sublabel>
							{burnTknFlag &&
								<>
									{!loaded2 &&
										<LoadingOutlined style={{ marginLeft: 20, fontSize: 15 }} />
									}
									{loaded2 &&
										<>
											<a href={getLink(tknTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>VIEW TRANSACTION -></a>
										</>
									}
								</>
							}
						</Col>
					</Row>
				</>
			}
		</>
	)
}

export const UpgradeTable = () => {

	const context = useContext(Context)

	const [account, setAccount] = useState(
		{
			address: '', vethBalance: '', ethBalance: '',
			stakeUnits: '', vetherStaked: '', assetStaked: '',
			vetherShare: '', assetShare: '', roi: ''
		})

	const [connected, setConnected ] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		connect()
		console.log(account)
		// eslint-disable-next-line
	}, [])

	const connect = async () => {
		const accountConnected = (await window.web3.eth.getAccounts())[0]
		if(accountConnected) {
			window.web3 = new Web3(window.ethereum);
			var accounts = await window.web3.eth.getAccounts()
			const address = await accounts[0]
			await loadAccountData(address)
			setConnected(true)
			setLoading(false)
		}
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
				'stakeUnits': (stakeData.stakeUnits / poolData.poolUnits) * 100,
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

	const upgrade = async () => {
		const poolContract = new window.web3.eth.Contract(vetherPoolsAbi(), vetherPoolsAddr())
		await poolContract.methods.upgrade(vetherPools2Addr()).send({ from: account.address })
	}

	return (
		<>
			<h2>UPGRADE TO BETA 2</h2>
			<p>Move your liquidity from the beta V1 pool.</p>
			{loading &&
				<LoadingOutlined style={{ mnarginBottom: 0 }} />
			}

			{connected && !loading &&
				<>
					{account.stakeUnits > "0" &&
					<>
						<p>Upgrade from VetherPools1 to VetherPools2</p>
						<Button backgroundColor="transparent" onClick={upgrade}>UPGRADE >></Button>

					</>
					}
					{account.stakeUnits === "0" &&
					<>
						<h3>NOTHING TO UPGRADE</h3>
					</>
					}
				</>
			}
		</>
	)
}
