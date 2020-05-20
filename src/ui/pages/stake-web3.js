import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import BigNumber from 'bignumber.js'

import Web3 from 'web3';
import { vetherAddr, vetherAbi, uniSwapAddr, uniSwapAbi, getUniswapPriceEth, getUniswapBalances, getEtherscanURL } from '../../client/web3.js'
import { getETHPrice, getVETHPriceInEth } from '../../client/market.js'
import {convertFromWei, convertToWei, prettify} from '../utils'

import { Row, Col, Input } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { H2, Text, LabelGrey, Label, Click, Button, Sublabel, Colour, Center } from '../components'

export const PoolTable = () => {

	const context = useContext(Context)

	const [marketData, setMarketData] = useState(
		{ priceUSD: '', priceETH: '', ethPrice: '' })
	const [uniswapData, setUniswapData] = useState(
		{ "eth": "", "veth": '' })

	useEffect(() => {
		context.uniswapData ? getUniswapData() : loadUniswapData()
		context.marketData ? getMarketData() : loadMarketData()
		// eslint-disable-next-line
	}, [])

	const getUniswapData = () => {
        setUniswapData(context.uniswapData)
    }

	const loadUniswapData = async () => {
		const uniswapBal = await getUniswapBalances()
		setUniswapData(uniswapBal)
		context.setContext({
			"uniswapData" : uniswapBal
		})
	}

	const getMarketData = () => {
        setMarketData(context.marketData)
    }

    const loadMarketData = async () => {
        const priceEtherUSD = await getETHPrice()
        const priceVetherEth = await getVETHPriceInEth()
        const priceVetherUSD = priceEtherUSD * priceVetherEth

        setMarketData({
            priceUSD: priceVetherUSD,
            priceETH: priceVetherEth,
            ethPrice: priceEtherUSD
        })
        context.setContext({
            "marketData": {
                'priceUSD': priceVetherUSD,
                'priceETH': priceVetherEth,
                "ethPrice": priceEtherUSD
            }
        })
    }

	const poolStyles = {
		borderWidth: '1px',
		borderStyle: 'dashed',
		borderRadius: 5,
		borderColor: Colour().grey,
		paddingLeft: 5,
		paddingRight: 5,
        backgroundColor: '#5C4F2C'
	}
	const lineStyle = {
		borderLeft: '1px dashed',
		borderColor: Colour().grey,
		paddingLeft: 5
	}

	return (
		<div>
			<Center><Text size={30} margin={"20px 0px 0px"}>{prettify(marketData.priceETH)} ETH | ${prettify(marketData.priceUSD)}</Text></Center>
			<Center><LabelGrey margin={"0px 0px 20px"}>VALUE OF 1 VETH</LabelGrey></Center>
			<Row style={{ marginBottom: 50 }}>
				<Col xs={3}>
				</Col>
				<Col xs={18} style={poolStyles}>
					<Row>
						<Col xs={12}>
							<Text size={12} bold={true} color={Colour().white}>ETHER</Text>
							<Center><Text size={30} color={Colour().white} margin={"5px 0px"}>{prettify(uniswapData.eth)}</Text></Center>
							<Center><Text margin={"5px 0px"}>${prettify(marketData.ethPrice * uniswapData.eth)}</Text></Center>
						</Col>
						<Col xs={12} style={lineStyle}>
							<Text size={12} bold={true} color={Colour().white}>VETHER</Text>
							<Center><Text size={30} color={Colour().white} margin={"5px 0px"}>{prettify(uniswapData.veth)}</Text></Center>
							<Center><Text margin={"5px 0px 20px"}>${prettify(marketData.ethPrice * uniswapData.eth)}</Text></Center>
						</Col>
					</Row>
				</Col>
				<Col xs={3}>
				</Col>
			</Row>
		</div>
	)
}

export const AddLiquidityTable = () => {

	const context = useContext(Context)

	const totalSupply = (new BigNumber(1000000*10**18)).toFixed(0)

	const [account, setAccount] = useState(
		{ address: '', vethBalance: '', ethBalance: '', uniBalance:'' })
	const [uniswapData, setUniswapData] = useState(
		{ "eth": "", "veth": '' })

	const [addEthFlag, setAddUniswapFlag] = useState(null)
	const [ethTx, setEthTx] = useState(null)
	const [ethAmount, setEthAmount] = useState(null)
	// const [uniSupply, setUniSupply] = useState(null)
	const [vetherPrice, setVetherPrice] = useState(null)
	// const [contract, setContract] = useState(null)
	const [loaded, setLoaded] = useState(null)
	// const [walletFlag, setWalletFlag] = useState(null)
	const [approved, setApproved] = useState(null)
	const [approveFlag, setApproveFlag] = useState(null)
	const [customAmount, setCustomAmount] = useState(null)
	const [approvalAmount, setApprovalAmount] = useState(null)


	useEffect(() => {
		connect()
		// eslint-disable-next-line
	}, [])

	const connect = async () => {
		// setWalletFlag('TRUE')
		ethEnabled()
		if (!ethEnabled()) {
			alert("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp");
		} else {
			var accounts = await window.web3.eth.getAccounts()
			const account = await accounts[0]
			context.accountData ? getAccountData() : loadAccountData(account)
			context.uniswapData ? getUniswapData() : loadUniswapData()
			setVetherPrice(await getUniswapPriceEth())
			checkApproval(account)
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

	const getAccountData = () => {
		setAccount(context.accountData)
		setCustomAmount(+context.accountData.vethBalance)
		setEthAmount(+context.accountData.ethBalance - 0.01)
    }

	const loadAccountData = async (account) => {
		const contract = await new window.web3.eth.Contract(vetherAbi(), vetherAddr())
		const ethBalance = convertFromWei(await window.web3.eth.getBalance(account))
		const vethBalance = convertFromWei(await contract.methods.balanceOf(account).call())
		const exchangeContract = new window.web3.eth.Contract(uniSwapAbi(), uniSwapAddr())
		const uniBalance = convertFromWei(await exchangeContract.methods.balanceOf(account).call())
		const uniSupply = convertFromWei(await exchangeContract.methods.totalSupply().call())
		setAccount({
			address: account,
			vethBalance: vethBalance,
			ethBalance: ethBalance,
			uniBalance: uniBalance,
			uniSupply:uniSupply
		})
		context.setContext({
			"accountData": {
				"address": account,
				'vethBalance': vethBalance,
				'ethBalance': ethBalance,
				'uniBalance': uniBalance,
				'uniSupply':uniSupply
			}})
		setCustomAmount(vethBalance)
		setEthAmount(ethBalance - 0.01)
	}

	const getUniswapData = () => {
        setUniswapData(context.uniswapData)
    }

	const loadUniswapData = async () => {
		const uniswapBal = await getUniswapBalances()
		setUniswapData(uniswapBal)
		context.setContext({
			"uniswapData" : uniswapBal
		})
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
		const deadline = (Math.round(((new Date())/1000) + 1000)).toString()
		const min_liquidity = (1).toString()
		const amountVeth = (convertToWei(customAmount)).toString()
		const amountEth = (convertToWei(ethAmount)).toString()
		setAddUniswapFlag('TRUE')
		const exchangeContract = new window.web3.eth.Contract(uniSwapAbi(), uniSwapAddr())
		const tx = await exchangeContract.methods.addLiquidity(min_liquidity, amountVeth, deadline).send({ value: amountEth, from: fromAcc })
		setEthTx(tx.transactionHash)
		setLoaded(true)
		loadAccountData(fromAcc)
	}

	const getUniShare = () => {
		const share = +account.uniBalance / +account.uniSupply
		// console.log(account.uniBalance, account.uniSupply, share )
		if(share > 0){
			return share
		} else{
			return 0
		}
	}

	const onEthAmountChange = e => {
		setEthAmount(e.target.value)
		setCustomAmount(e.target.value * (1/vetherPrice))
	}

	const getLink = (tx) => {
		return getEtherscanURL().concat('tx/').concat(tx)
	}

	return (
		<div>
			{!approved &&
				<Row>
					<Col xs={24}>
						<Button onClick={unlockToken}> UNLOCK ></Button>
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
			<Row>
				<Col xs={4}>
					<Input size={'large'} style={{ marginBottom: 10 }} allowClear onChange={onEthAmountChange} placeholder={prettify(account.ethBalance - 0.01)} />
					<br></br>
					<Label>{prettify(account.ethBalance)}</Label>
					<br></br>
					<LabelGrey>Spendable ETH Balance</LabelGrey>
					<br></br>
					<Label>{prettify(account.vethBalance)}</Label>
					<br></br>
					<LabelGrey>Available VETH Balance</LabelGrey>
				</Col>
				<Col xs={8} style={{ marginLeft: 20 }}>
					<Button onClick={addUniswap}> ADD >></Button>
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
				<Col xs={10} style={{ marginLeft: 10, marginRight: 20 }}>
					<H2>Your Uniswap Share:</H2>
					<br></br>
					<Text size={20}>{prettify(getUniShare() * 100)}%</Text>&nbsp;<Text>of the pool</Text>
					<br></br>
					<Row style={{ marginTop: 10}}>
						<Col xs={4}>
							<Label>{prettify(+uniswapData.eth * getUniShare())}</Label>
							<br></br>
							<LabelGrey>ETH</LabelGrey>
						</Col>
						<Col xs={20}>
							<Label>{prettify(+uniswapData.veth * getUniShare())}</Label>
							<br></br>
							<LabelGrey>VETH</LabelGrey>
						</Col>
					</Row>
				</Col>
			</Row>
			}
		</div>

	)
}

export const RemoveLiquidityTable = () => {

	const context = useContext(Context)

	const [account, setAccount] = useState(
		{ address: '', vethBalance: '', uniBalance: '' })
	const [burnTknFlag, setBurnTknFlag] = useState(null)
	const [tknTx, setTknTx] = useState(null)
	const [loaded2, setLoaded2] = useState(null)
	const [customAmount, setCustomAmount] = useState(100)

	useEffect(() => {
		context.accountData ? getAccountData() : loadAccountData()
		// eslint-disable-next-line
	}, [])

	const getAccountData = () => {
		setAccount(context.accountData)
    }

	const loadAccountData = async () => {
		var accounts = await window.web3.eth.getAccounts()
		const account = await accounts[0]
		const exchangeContract = new window.web3.eth.Contract(uniSwapAbi(), uniSwapAddr())
		const uniBalance = await exchangeContract.methods.balanceOf(account).call()
		setAccount({
			address: account,
			uniBalance: uniBalance,
		})
		context.setContext({
			"accountData": {
				"address": account,
				'uniBalance': uniBalance,
			}})
	}

	const getLink = (tx) => {
		return getEtherscanURL().concat('tx/').concat(tx)
	}

	const onAmountChange = e => {
		setCustomAmount(e.target.value)
	}

	const getUniSupply = (part) => {
		return ((account.uniBalance * part) / 100)
	}

	const removeLiquidity = async () => {
		setBurnTknFlag(true)
		console.log(account.uniBalance, customAmount)
		const amount = (getUniSupply(customAmount)).toString()
		const min_eth = (1).toString()
		const min_tokens = (1).toString()
		const deadline = (Math.round(((new Date())/1000) + 1000)).toString()
		// console.log(amount, min_eth, min_tokens, deadline)
		const exchangeContract = new window.web3.eth.Contract(uniSwapAbi(), uniSwapAddr())
		const tx = await exchangeContract.methods.removeLiquidity(amount, min_eth, min_tokens, deadline).send({ from: account.address })
		setTknTx(tx.transactionHash)
		setLoaded2(true)
	}

	return (
		<div>
			<Row>
					<div>
						<Col xs={4}>
							<Input size={'large'} style={{ marginBottom: 10 }} allowClear onChange={onAmountChange} placeholder={100} />
							<br></br>
							<Sublabel>Proportion to remove (%)</Sublabel>
						</Col>
						<Col xs={12} sm={7} style={{ paddingLeft: 20 }}>
							<Button onClick={removeLiquidity}> REMOVE >></Button>
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
		</div>
	)
}