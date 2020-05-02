import React, { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'

import Web3 from 'web3';
import { vetherAddr, vetherAbi, tokenAddr } from '../client/web3.js'

import { Row, Col, Input } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { LabelGrey, Label, Click, Button, Sublabel, Gap } from './components'

export const AcquireTable = () => {

	const [account, setAccount] = useState(
		{ address: '', vethBalance: '', ethBalance: '' })
	const [contract, setContract] = useState(null)

	const [loaded, setLoaded] = useState(null)
	const [loaded2, setLoaded2] = useState(null)
	const [burnEthFlag, setBurnEthFlag] = useState(null)
	const [ethTx, setEthTx] = useState(null)
	const [approveFlag, setApproveFlag] = useState(null)
	const [approved, setApproved] = useState(null)
	const [burnTknFlag, setBurnTknFlag] = useState(null)
	const [tknTx, setTknTx] = useState(null)

	const [customToken, setCustomToken] = useState(tokenAddr(0))
	const [customAmount, setCustomAmount] = useState(1000)

	const [walletFlag, setWalletFlag] = useState(null)
	//const [ethPlaceholder, setEthPlaceholder] = useState(null)
	const [ethAmount, setEthAmount] = useState(null)
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

	const maxEther = async () => {
		setEthAmount(account.ethBalance - 0.1)
		console.log("maxEther", ethAmount)
	}

	const onEthAmountChange = e => {
		setEthAmount(e.target.value)
	}

	const burnEther = async () => {
		const fromAcc_ = account.address
		const toAcc_ = vetherAddr() //getAccounts(1)
		const amount_ = ethAmount * 1000000000000000000
		//console.log(fromAcc_, toAcc_, amount_)
		setBurnEthFlag('TRUE')
		const tx = await window.web3.eth.sendTransaction({ from: fromAcc_, to: toAcc_, value: amount_ })
		//console.log(tx.transactionHash)
		setEthTx(tx.transactionHash)
		setLoaded(true)
		refreshAccount(contract, fromAcc_)
	}

	const getLink = (tx) => {
		const link = "https://rinkeby.etherscan.io/tx/"
		return link.concat(tx)
	}

	const onTokenChange = e => {
		setCustomToken(e.target.value)
		console.log('custom token:', e.target.value)
	}

	const onAmountChange = e => {
		setCustomAmount(e.target.value)
		setApprovalAmount(convertToWei(e.target.value))
		console.log('custom amount', e.target.value)
	}

	const unlockToken = async () => {
		setApproveFlag(true)
		const tokenContract_ = new window.web3.eth.Contract(vetherAbi(), customToken)
		const fromAcc_ = account.address
		const spender_ = vetherAddr()
		const val_ = convertToWei(customAmount)
		//console.log(spender_, val_)
		await tokenContract_.methods.approve(spender_, val_).send({ from: fromAcc_ })
		//console.log(fromAcc_, spender_)
		const approval_ = await tokenContract_.methods.allowance(fromAcc_, spender_).call()
		//console.log(approval_)
		setApprovalAmount(approval_)
		setApproved(true)
	}

	const burnToken = async () => {
		setBurnTknFlag(true)
		console.log(customToken, customAmount, account.address)
		const contract_ = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
		const tx = await contract_.methods.burnTokens(customToken, approvalAmount).send({ from: account.address })
		setTknTx(tx.transactionHash)
		setLoaded2(true)
	}

	function convertFromWei(number) {
		var num = number / 1000000000000000000
		return num.toFixed(2)
	}

	function convertToWei(number) {
		var num = number * 1000000000000000000
		return new BigNumber(num).toFixed(0)
	}

	return (
		<div>
			{!walletFlag &&
				<div>
					<Button onClick={connect}> > GET VETHER NOW  &lt;</Button>
					<Gap />
				</div>
			}


			{walletFlag &&
				<div>
					<Label>BURN ETHER</Label>
					<Row>
						<Col xs={6} sm={3}>
							<Input style={{ marginBottom: 10 }} allowClear onChange={onEthAmountChange} placeholder={account.ethBalance - 0.1} />
							<br></br>
							<Button onClick={maxEther}>{(account.ethBalance - 0.1).toFixed(4)}</Button>
							<br></br>
							<LabelGrey>ETH Balance</LabelGrey>
						</Col>
						<Col xs={15} sm={18} style={{ marginLeft: 20 }}>
							<Button onClick={burnEther}> BURN >></Button>
							<br></br>
							<Sublabel>Burn ETH to acquire VETHER</Sublabel>

							{burnEthFlag &&
								<div>
									{!loaded &&
										<LoadingOutlined style={{ marginLeft: 20, fontSize: 15 }} />
									}
									{loaded &&
										<div>
											<Click><a href={getLink(ethTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}> VIEW TRANSACTION -> </a></Click>
											<br></br>
											<Sublabel>Refresh to update</Sublabel>
										</div>
									}
								</div>
							}

						</Col>
					</Row>

					<Gap />
					<Label>BURN TOKENS</Label>
					<Row>
						<Col xs={16} sm={8}>
							<Input allowClear onChange={onTokenChange} placeholder={tokenAddr(0)} />
							<br></br>
							<Sublabel>Set custom token address to burn</Sublabel>
							<br></br>
							{/* <LabelGrey>{tokenAddr(0)}</LabelGrey>
                        <br></br>
                        <LabelGrey>{tokenAddr(1)}</LabelGrey>
                        <br></br>
                        <LabelGrey>{tokenAddr(2)}</LabelGrey>
                        <br></br>
                        <LabelGrey>{tokenAddr(3)}</LabelGrey> */}
						</Col>
						<Col xs={6} sm={3} style={{ marginLeft: 10, marginRight: 20 }}>
							<Input allowClear onChange={onAmountChange} placeholder={customAmount} />
							<br></br>
							<Sublabel>Set token amount</Sublabel>
							<br></br>
						</Col>
						<Col xs={8} sm={3}>
							<Button onClick={unlockToken}> UNLOCK ></Button>
							<br></br>
							<Sublabel>Unlock token</Sublabel>
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

						{approved &&
							<div>
								<Col xs={12} sm={7} style={{ paddingLeft: 20 }}>
									<Button onClick={burnToken}> BURN >></Button>
									<br></br>
									<Sublabel>Burn Tokens to acquire VETHER</Sublabel>

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
			}
		</div>
	)
}