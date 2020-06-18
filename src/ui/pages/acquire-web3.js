import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

// import Web3 from 'web3';
import { vetherAddr, vetherAbi, gasMineAddr, gasMineAbi, uniSwapAddr, uniSwapAbi, getEtherscanURL } from '../../client/web3.js'
import { getBN, getBig, convertFromWei, prettify } from '../utils'

import { Row, Col, Input, Tooltip } from 'antd'
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { LabelGrey, Label, Click, Button, Sublabel, Colour, Text } from '../components'
import Web3 from "web3";
// import { EraTable } from './era-web3'

export const AcquireTable = () => {

	const context = useContext(Context)
	const [account, setAccount] = useState(
		{ address: '', vethBalance: '', ethBalance: '', uniBalance: '', uniSupply: '' })
	const [loaded, setLoaded] = useState(null)
	const [burnEthFlag, setBurnEthFlag] = useState(null)
	const [ethTx, setEthTx] = useState(null)
	// const [walletFlag, setWalletFlag] = useState(null)
	const [ethAmount, setEthAmount] = useState(0)
	const [currentBurn, setCurrentBurn] = useState(1)

	const ethBalanceSpendable = (account.ethBalance - 0.1).toFixed(4) < 0 ?
		0 : (account.ethBalance - 0.1).toFixed(4)

	useEffect(() => {
		connect()
		// eslint-disable-next-line
	}, [])

	const connect = async () => {
		window.web3 = new Web3(window.ethereum);
		const accountConnected = (await window.web3.eth.getAccounts())[0];
		if(accountConnected){
			const accounts = await window.web3.eth.getAccounts()
			const address = accounts[0]
			const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
			context.accountData ? getAccountData() : loadAccountData(contract, address)
			const day = await contract.methods.currentDay().call()
			const era = 1
			const currentBurn = convertFromWei(await contract.methods.mapEraDay_UnitsRemaining(era, day).call())
			// console.log(currentBurn)
			// setVethPrice(currentBurn / 2048 )
			setCurrentBurn(currentBurn)
		}

		// setWalletFlag('TRUE')
		// ethEnabled()
		// if (!ethEnabled()) {
		// 	// alert("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp");
		// } else {

		// }
	}

	// const ethEnabled = () => {
	// 	if (window.ethereum) {
	// 		window.web3 = new Web3(window.ethereum);
	// 		window.ethereum.enable();
	// 		return true;
	// 	}
	// 	return false;
	// }

	const getAccountData = async () => {
		setAccount(context.accountData)
		setEthAmount(context.accountData.ethBalance - 0.1)
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
			uniSupply: uniSupply
		}
		setAccount(accountData)
		context.setContext({ 'accountData': accountData })
		setEthAmount(ethBalance - 0.1)
	}

	const maxEther = async () => {
		setEthAmount(account.ethBalance - 0.1)
		console.log("maxEther", ethAmount)
	}

	const onEthAmountChange = e => {
		setEthAmount(e.target.value)
	}

	const getVethValue = () => {
		const value = (+ethAmount / (+ethAmount + +currentBurn)) * 2048
		return value
	}

	const burnEther = async () => {
		const amount = ethAmount * 1000000000000000000
		setBurnEthFlag('TRUE')
		const tx = await window.web3.eth.sendTransaction({ from: account.address, to: vetherAddr(), value: amount })
		setEthTx(tx.transactionHash)
		setLoaded(true)
		const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
		loadAccountData(contract, account.address)
	}

	const getLink = (tx) => {
		console.log(getEtherscanURL().concat('tx/').concat(tx))
		return getEtherscanURL().concat('tx/').concat(tx)
	}

	return (
		<div>
			<div>

				<Label>BURN ETHER</Label>
				<br />
				<Row>
					<Col xs={11} sm={4}>
						<Input size={'large'} style={{ marginBottom: 10 }} allowClear onChange={onEthAmountChange} placeholder={ethBalanceSpendable} />
						<br></br>
						<Button
							backgroundColor="transparent"
							onClick={maxEther}
						>
							{ethBalanceSpendable}
						</Button>
						<Tooltip placement="right" title="Your balance minus 0.1 is spendable to keep Ether later for gas.">
							&nbsp;<QuestionCircleOutlined style={{ color: Colour().grey }} />
						</Tooltip>
						<br></br>
						<LabelGrey>Spendable ETH</LabelGrey>
					</Col>
					<Col xs={11} sm={6} style={{ marginLeft: 20 }}>
						<Button
							backgroundColor="transparent"
							onClick={burnEther}
						>
							BURN >>
						</Button>
						<Tooltip placement="right" title="This burns your Ether into the contract.">
							&nbsp;<QuestionCircleOutlined style={{ color: Colour().grey }} />
						</Tooltip>
						<br></br>
						<Sublabel>Burn ETH to acquire VETHER</Sublabel>

						{burnEthFlag &&
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
					<Col xs={24} sm={4}>
						<Text size={32}>{prettify(getVethValue())}</Text>
						<Tooltip placement="right" title="The amount of VETH you get is dependent on how much you burn, compared to how much everyone else burns.">
							&nbsp;<QuestionCircleOutlined style={{ color: Colour().grey }} /><br />
						</Tooltip>
						<LabelGrey>Potential VETH Value</LabelGrey>
					</Col>
				</Row>
			</div>
		</div>
	)
}

export const GasMineTable = () => {

	const context = useContext(Context)
	const [account, setAccount] = useState(
		{ address: '', vethBalance: '', ethBalance: '', uniBalance: '', uniSupply: '' })
	const [loaded, setLoaded] = useState(null)
	const [burnEthFlag, setBurnEthFlag] = useState(null)
	const [ethTx, setEthTx] = useState(null)
	// const [walletFlag, setWalletFlag] = useState(null)
	const [ethAmount, setEthAmount] = useState(0)
	const [currentBurn, setCurrentBurn] = useState(1)

	const ethBalanceSpendable = (account.ethBalance - 0.1).toFixed(4) < 0 ?
		0 : (account.ethBalance - 0.1).toFixed(4)

	useEffect(() => {
		connect()
		// eslint-disable-next-line
	}, [])

	const connect = async () => {
		window.web3 = new Web3(window.ethereum);
		const accountConnected = (await window.web3.eth.getAccounts())[0];
		if(accountConnected){
			const accounts = await window.web3.eth.getAccounts()
			const address = accounts[0]
			const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
			context.accountData ? getAccountData() : loadAccountData(contract, address)
			const day = await contract.methods.currentDay().call()
			const era = 1
			const currentBurn = convertFromWei(await contract.methods.mapEraDay_UnitsRemaining(era, day).call())
			setCurrentBurn(currentBurn)
		}

	}


	const getAccountData = async () => {
		setAccount(context.accountData)
		setEthAmount(context.accountData.ethBalance - 0.1)
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
			uniSupply: uniSupply
		}
		setAccount(accountData)
		context.setContext({ 'accountData': accountData })
		setEthAmount(ethBalance - 0.1)
	}

	const maxEther = async () => {
		setEthAmount(account.ethBalance - 0.1)
		console.log("maxEther", ethAmount)
	}

	const onEthAmountChange = e => {
		setEthAmount(e.target.value)
	}

	const getVethValue = () => {
		const value = (+ethAmount / (+ethAmount + +currentBurn)) * 2048
		return value
	}

	const burnEther = async () => {
		const ethBN = getBig(ethAmount)
		const gas = getBig(1000*10**9)
		const gasAmount = getBN((ethBN.multipliedBy(gas)).integerValue())
		console.log(await window.web3.eth.getGasPrice())
		setBurnEthFlag('TRUE')
		const gasMineContract = new window.web3.eth.Contract(gasMineAbi(), gasMineAddr())
		const tx = await gasMineContract.methods.mine().send({ from: account.address, gasPrice:gasAmount, gasLimit:1000000 })
		setEthTx(tx.transactionHash)
		setLoaded(true)
		const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
		loadAccountData(contract, account.address)
	}

	const getLink = (tx) => {
		console.log(getEtherscanURL().concat('tx/').concat(tx))
		return getEtherscanURL().concat('tx/').concat(tx)
	}

	return (
		<div>
			<div>

				<Label>BURN ETHER</Label>
				<br />
				<Row>
					<Col xs={11} sm={4}>
						<Input size={'large'} style={{ marginBottom: 10 }} allowClear onChange={onEthAmountChange} placeholder={ethBalanceSpendable} />
						<br></br>
						<Button
							backgroundColor="transparent"
							onClick={maxEther}
						>
							{ethBalanceSpendable}
						</Button>
						<Tooltip placement="right" title="Your balance minus 0.1 is spendable to keep Ether later for gas.">
							&nbsp;<QuestionCircleOutlined style={{ color: Colour().grey }} />
						</Tooltip>
						<br></br>
						<LabelGrey>Spendable ETH</LabelGrey>
					</Col>
					<Col xs={11} sm={6} style={{ marginLeft: 20 }}>
						<Button
							backgroundColor="transparent"
							onClick={burnEther}
						>
							BURN >>
						</Button>
						<Tooltip placement="right" title="This burns your Ether into the contract.">
							&nbsp;<QuestionCircleOutlined style={{ color: Colour().grey }} />
						</Tooltip>
						<br></br>
						<Sublabel>Burn ETH to acquire VETHER</Sublabel>

						{burnEthFlag &&
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
					<Col xs={24} sm={4}>
						<Text size={32}>{prettify(getVethValue())}</Text>
						<Tooltip placement="right" title="The amount of VETH you get is dependent on how much you burn, compared to how much everyone else burns.">
							&nbsp;<QuestionCircleOutlined style={{ color: Colour().grey }} /><br />
						</Tooltip>
						<LabelGrey>Potential VETH Value</LabelGrey>
					</Col>
				</Row>
			</div>
		</div>
	)
}

