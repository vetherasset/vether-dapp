import React, { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'

import Web3 from 'web3';
import { vetherAddr, vetherAbi, uniSwapAddr, uniSwapAbi, getUniswapPriceEth, getUniswapBalances } from '../../client/web3.js'
import { getETHPrice, getVETHPriceInEth } from '../../client/market.js'

import { Modal, Row, Col, Input } from 'antd'
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Text, LabelGrey, Label, Click, Button, Sublabel, Gap, Colour, Center, HR } from '../components'

export const PoolTable = () => {

	const [marketData, setMarketData] = useState(
		{ priceUSD: '', priceETH: '', ethPrice: '' })
	const [uniswapBalance, setUniswapBalance] = useState(
		{ "eth": "", "veth": '' }
	)

	useEffect(() => {
		loadBlockchainData()
		// eslint-disable-next-line
	}, [])

	const loadBlockchainData = async () => {
		const priceVetherEth = await getUniswapPriceEth()
		const priceEtherUSD = await getETHPrice()
		const priceVetherUSD = priceEtherUSD * priceVetherEth
		setMarketData({ priceUSD: priceVetherUSD, priceETH: priceVetherEth, ethPrice: priceEtherUSD })
		const uniswapBal = await getUniswapBalances()
		setUniswapBalance(uniswapBal)
		console.log(priceEtherUSD * uniswapBal.eth)
	}

	function prettify(amount) {
		const number = Number(amount)
		var parts = number.toPrecision(4).replace(/\.?0+$/, '').split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parts.join(".");
	}

	const poolStyles = {
		borderWidth: '1px',
		borderStyle: 'dashed',
		borderRadius: 5,
		borderColor: Colour().grey,
		paddingLeft: 5,
		paddingRight: 5
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
							<Center><Text size={30} color={Colour().white} margin={"5px 0px"}>{prettify(uniswapBalance.eth)}</Text></Center>
							<Center><Text margin={"5px 0px"}>${prettify(marketData.ethPrice * uniswapBalance.eth)}</Text></Center>
						</Col>
						<Col xs={12} style={lineStyle}>
							<Text size={12} bold={true} color={Colour().white}>VETHER</Text>
							<Center><Text size={30} color={Colour().white} margin={"5px 0px"}>{prettify(uniswapBalance.veth)}</Text></Center>
							<Center><Text margin={"5px 0px 20px"}>${prettify(marketData.ethPrice * uniswapBalance.eth)}</Text></Center>
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

	const [account, setAccount] = useState(
		{ address: '', vethBalance: '', ethBalance: '' })
	const [addEthFlag, setAddUniswapFlag] = useState(null)
	const [ethTx, setEthTx] = useState(null)
	const [ethAmount, setEthAmount] = useState(null)
	const [contract, setContract] = useState(null)
	const [loaded, setLoaded] = useState(null)
	const [walletFlag, setWalletFlag] = useState(null)
	const [loaded2, setLoaded2] = useState(null)
	const [approved, setApproved] = useState(null)
	const [approveFlag, setApproveFlag] = useState(null)
	const [customAmount, setCustomAmount] = useState(null)
	const [approvalAmount, setApprovalAmount] = useState(null)

	useEffect(() => {
		connect()
		// eslint-disable-next-line
	}, [])

	const connect = () => {
		setWalletFlag('TRUE')
		ethEnabled()
		loadBlockchainData()
		if (!ethEnabled()) {
			alert("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp");
		} else {
			setEthAmount(account.ethBalance - 0.1)
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

	const loadBlockchainData = async () => {
		var accounts = await window.web3.eth.getAccounts()
		const account_ = await accounts[0]
		const contract_ = await new window.web3.eth.Contract(vetherAbi(), vetherAddr())
		refreshAccount(contract_, account_)
		setContract(contract_)
		checkApproval(account_)
	}

	const getVethPriceUSD = async () => {
		const ETH = await getETHPrice()
		const VETH = await getVETHPriceInEth()
		return ETH * VETH
	}

	function convertFromWei(number) {
		var num = number / 1000000000000000000
		return num.toFixed(2)
	}

	function convertToWei(number) {
		var num = number * 1000000000000000000
		return new BigNumber(num).toFixed(0)
	}

	const refreshAccount = async (contract_, account_) => {
		var ethBalance_ = convertFromWei(await window.web3.eth.getBalance(account_))
		const vethBalance_ = await contract_.methods.balanceOf(account_).call()
		setAccount({
			address: account_,
			vethBalance: vethBalance_,
			ethBalance: ethBalance_
		})
	}

	const checkApproval = async (address) => {
		const totalSupply = 1000000 * 10 * 18
		const tokenContract = new window.web3.eth.Contract(uniSwapAbi(), uniSwapAddr())
		const fromAcc = address
		const spender = uniSwapAddr()
		const approval = await tokenContract.methods.allowance(fromAcc, spender).call()
		setApprovalAmount(approval)
		if (approval > totalSupply) {
			setApproved(true)
		}
	}

	const unlockToken = async () => {
		//setApproveFlag(true)
		const totalSupply = 1000000 * 10 * 18
		const tokenContract = new window.web3.eth.Contract(uniSwapAbi(), uniSwapAddr)
		const fromAcc = account.address
		const spender = uniSwapAddr()
		const value = convertToWei(totalSupply)
		//console.log(spender_, val_)
		await tokenContract.methods.approve(spender, value).send({ from: fromAcc })
		//console.log(fromAcc_, spender_)
		checkApproval()
	}

	const maxEther = async () => {
		setEthAmount(account.ethBalance - 0.1)
		console.log("maxEther", ethAmount)
	}

	const onEthAmountChange = e => {
		setEthAmount(e.target.value)
	}

	const onAmountChange = e => {
		setCustomAmount(e.target.value)
		setApprovalAmount(convertToWei(e.target.value))
		console.log('custom amount', e.target.value)
	}

	const getLink = (tx) => {
		const link = "https://etherscan.io/tx/"
		return link.concat(tx)
	}

	const addUniswap = async () => {
		const fromAcc = account.address
		const toAcc = uniSwapAddr() //getAccounts(1)
		const amount = ethAmount * 1*10**18
		//console.log(fromAcc_, toAcc_, amount_)
		setAddUniswapFlag('TRUE')
		const tokenContract = new window.web3.eth.Contract(uniSwapAbi(), uniSwapAddr)
		const tx = await tokenContract.methods.addLiquidity(toAcc, amount).send({ from: fromAcc })
		//console.log(tx.transactionHash)
		setEthTx(tx.transactionHash)
		setLoaded(true)
		refreshAccount(contract, fromAcc)
	}

	const { confirm } = Modal

	const handleShowModal = (type) => {
		if (type === "token") {
			confirm({
				title: 'Please enter a token address',
				icon: <ExclamationCircleOutlined />,
				content: <p>Please input the desired token to burn. You can find this address on Etherscan.</p>,
				onOk() { },
				onCancel() { },
			});
		} else if (type === "amount") {
			confirm({
				title: 'Please enter an amount',
				icon: <ExclamationCircleOutlined />,
				content: <p>Please input your balance of the token you wish to burn.</p>,
				onOk() { },
				onCancel() { },
			});
		}

	}

	return (
		<div>
			{/* {!walletFlag &&
				<div>
					<Button onClick={connect}> > GET VETHER NOW  &lt;</Button>
					<Gap />
				</div>
			} */}
			{/* {!approved &&
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
			<br></br>
			<Row>
				<Col xs={6}>
					<Input style={{ marginBottom: 10 }} allowClear onChange={onEthAmountChange} placeholder={account.ethBalance - 0.01} />
					<br></br>
					<Button onClick={maxEther}>{(account.ethBalance - 0.01).toFixed(4)}</Button>
					<br></br>
					<LabelGrey>Spendable ETH Balance</LabelGrey>
				</Col>
				<Col xs={6} style={{ marginLeft: 10, marginRight: 20 }}>
					<Input allowClear onChange={onAmountChange} placeholder={"Enter amount"} />
					<br></br>
					<br></br>
				</Col>
				<Col xs={10} style={{ marginLeft: 20 }}>
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
			</Row>
			<br></br>
			<br></br> */}

		</div>

	)
}

export const RemoveLiquidityTable = () => {
	const [burnTknFlag, setBurnTknFlag] = useState(null)
	const [tknTx, setTknTx] = useState(null)
	const [loaded2, setLoaded2] = useState(null)
	const [approved, setApproved] = useState(true)


	const getLink = (tx) => {
		const link = "https://etherscan.io/tx/"
		return link.concat(tx)
	}

	const burnToken = async () => {
		setBurnTknFlag(true)
		// console.log(customToken, customAmount, account.address)
		// const contract_ = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
		// const tx = await contract_.methods.burnTokens(customToken, approvalAmount).send({ from: account.address })
		// setTknTx(tx.transactionHash)
		setLoaded2(true)
	}

	return (
		<div>
			<Row>

				{approved &&
					<div>
						<Col xs={12} sm={7} style={{ paddingLeft: 20 }}>
							<Button onClick={burnToken}> BURN >></Button>
							<br></br>
							<Sublabel>Burn Tokens to acquire VETHER</Sublabel>
							<br></br>
							<Text>Note: Some tokens are not compatible with Vether.</Text>
							<br></br>
							<Text>If there are any errors in your metamask do not proceed.</Text>

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
				}

			</Row>
		</div>
	)
}