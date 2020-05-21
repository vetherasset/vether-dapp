import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import Web3 from 'web3';
import { vetherAddr, vetherAbi, getEtherscanURL } from '../../client/web3.js'
import {convertFromWei} from '../utils'

import { Row, Col, Input } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { LabelGrey, Label, Click, Button, Sublabel, Gap, Colour } from '../components'

export const AcquireTable = () => {

	const context = useContext(Context)

	const [account, setAccount] = useState(
		{ address: '', vethBalance: '', ethBalance: '' })
	// const [contract, setContract] = useState(null)

	const [loaded, setLoaded] = useState(null)
	const [burnEthFlag, setBurnEthFlag] = useState(null)
	const [ethTx, setEthTx] = useState(null)

	// const [customToken, setCustomToken] = useState(null)
	// const [customAmount, setCustomAmount] = useState(null)

	const [walletFlag, setWalletFlag] = useState(null)
	//const [ethPlaceholder, setEthPlaceholder] = useState(null)
	const [ethAmount, setEthAmount] = useState(null)
	// const [approvalAmount, setApprovalAmount] = useState(null)

	useEffect(() => {
		connect()
		// eslint-disable-next-line
	}, [])

	const connect = async () => {
		setWalletFlag('TRUE')
		ethEnabled()
		// loadBlockchainData()
		if (!ethEnabled()) {
			alert("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp");
		  } else {
			var accounts = await window.web3.eth.getAccounts()
			const address = accounts[0]
			context.accountData ? getAccountData() : loadAccountData(address)
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

	  const getAccountData = async () => {
		setAccount(context.accountData)
		setEthAmount(context.accountData.ethBalance - 0.1)
	}
	
	const loadAccountData = async (address) => {
        var ethBalance = convertFromWei(await window.web3.eth.getBalance(address))
        const contract = await new window.web3.eth.Contract(vetherAbi(), vetherAddr())
        const vethBalance = await contract.methods.balanceOf(address).call()
        setAccount({
            address: address,
            vethBalance: vethBalance,
            ethBalance: ethBalance
        })
        context.setContext({
            "accountData": {
                'address': address,
                'vethBalance': vethBalance,
                'ethBalance': ethBalance
            }
		})
		setEthAmount(ethBalance - 0.1)
    }

	const maxEther = async () => {
		setEthAmount(account.ethBalance - 0.1)
		console.log("maxEther", ethAmount)
	}

	const onEthAmountChange = e => {
		setEthAmount(e.target.value)
	}

	const burnEther = async () => {
		const amount = ethAmount * 1000000000000000000
		setBurnEthFlag('TRUE')
		const tx = await window.web3.eth.sendTransaction({ from: account.address, to: vetherAddr(), value: amount })
		setEthTx(tx.transactionHash)
		setLoaded(true)
		loadAccountData(account.address)
	}

	const getLink = (tx) => {
		console.log(getEtherscanURL().concat('tx/').concat(tx))
		return getEtherscanURL().concat('tx/').concat(tx)
	}

	// const unlockToken = async () => {
	// 	if (!customToken){
	// 		handleShowModal("token")
	// 	} else if (!customAmount) {
	// 		handleShowModal("amount")
	// 	} else {
	// 		setApproveFlag(true)
	// 	const tokenContract_ = new window.web3.eth.Contract(vetherAbi(), customToken)
	// 	const fromAcc_ = account.address
	// 	const spender_ = vetherAddr()
	// 	const val_ = convertToWei(customAmount)
	// 	//console.log(spender_, val_)
	// 	await tokenContract_.methods.approve(spender_, val_).send({ from: fromAcc_ })
	// 	//console.log(fromAcc_, spender_)
	// 	const approval_ = await tokenContract_.methods.allowance(fromAcc_, spender_).call()
	// 	//console.log(approval_)
	// 	setApprovalAmount(approval_)
	// 	setApproved(true)
	// 	}	
	// }

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
							<Input size={'large'} style={{ marginBottom: 10 }} allowClear onChange={onEthAmountChange} placeholder={account.ethBalance - 0.1} />
							<br></br>
							<Button onClick={maxEther}>{(account.ethBalance - 0.1).toFixed(4)}</Button>
							<br></br>
							<LabelGrey>Spendable ETH Balance</LabelGrey>
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
											<Click><a href={getLink(ethTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> VIEW TRANSACTION -> </a></Click>
											<br></br>
											<Sublabel>Refresh to update</Sublabel>
										</div>
									}
								</div>
							}

						</Col>
					</Row>

					{/* <Gap />
					<Label>BURN TOKENS</Label>
					<Row>
						<Col xs={16} sm={8}>
							<Input size={'large'} allowClear onChange={onTokenChange} placeholder={'Enter token address'} />
							<br></br>
							<br></br>
						</Col>
						<Col xs={6} sm={3} style={{ marginLeft: 10, marginRight: 20 }}>
							<Input size={'large'} allowClear onChange={onAmountChange} placeholder={"Enter amount"} />
							<br></br>
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

					</Row> */}
				</div>
			}
		</div>
	)
}