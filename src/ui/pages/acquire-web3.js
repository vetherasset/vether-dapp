import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import Web3 from 'web3';
import { vetherAddr, vetherAbi, uniSwapAddr, uniSwapAbi, getEtherscanURL } from '../../client/web3.js'
import {convertFromWei} from '../utils'

import { Row, Col, Input } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { LabelGrey, Label, Click, Button, Sublabel, Gap, Colour } from '../components'
import { EraTable } from './era-web3'

export const AcquireTable = () => {

	const context = useContext(Context)
	const [account, setAccount] = useState(
		{ address: '', vethBalance: '', ethBalance: '', uniBalance:'', uniSupply:'' })
	// const [eraData, setEraData] = useState(
	// 	{ era: '', day: '', emission: '', currentBurn: '', nextDay: '', nextEra: '', nextEmission: '', secondsToGo: 82400 })
	const [loaded, setLoaded] = useState(null)
	const [burnEthFlag, setBurnEthFlag] = useState(null)
	const [ethTx, setEthTx] = useState(null)
	const [walletFlag, setWalletFlag] = useState(null)
	const [ethAmount, setEthAmount] = useState(null)

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
			const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
			context.accountData ? getAccountData() : loadAccountData(contract, address)
			// context.eraData ? await getEraData() : await loadEraData()
			// context.marketData ? await getMarketData() : await loadMarketData()
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
			uniSupply:uniSupply
		}
        setAccount(accountData)
		context.setContext({'accountData':accountData})
		setEthAmount(ethBalance - 0.1)
	}
	
	// const getEraData = async () => {
    //     setEraData(context.eraData)
    // }

    // const loadEraData = async () => {
    //     // console.log('clicked')
    //     const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
    //     const contract = new web3.eth.Contract(vetherAbi(), vetherAddr())
    //     const emission = convertFromWei(await contract.methods.emission().call())
    //     const day = await contract.methods.currentDay().call()
    //     const era = await contract.methods.currentEra().call()
    //     const nextDay = await contract.methods.nextDayTime().call()
    //     const nextEra = await contract.methods.nextEraTime().call()
    //     const nextEmission = convertFromWei(await contract.methods.getNextEraEmission().call())
    //     const currentBurn = convertFromWei(await contract.methods.mapEraDay_UnitsRemaining(era, day).call())
    //     const secondsToGo = getSecondsToGo(nextDay)
    //     const eraData = {era: era, day: day,
    //         nextEra: nextEra, nextDay: nextDay,
    //         emission: emission, nextEmission: nextEmission,
    //         currentBurn: currentBurn,
    //         secondsToGo: secondsToGo}
            
    //     setEraData(eraData)
    //     context.setContext({"eraData": eraData})
    // }

    // const getMarketData = async () => {
    //     setMarketData(context.marketData)
    // }
    // const loadMarketData = async () => {
    //     const priceEtherUSD = await getETHPrice()
    //     const priceVetherEth = await getVETHPriceInEth()
    //     const priceVetherUSD = priceEtherUSD * priceVetherEth
    //     const marketData = {priceUSD: priceVetherUSD,
    //         priceETH: priceVetherEth,
    //         ethPrice: priceEtherUSD
    //     }
    //     setMarketData(marketData)
    //     context.setContext({"marketData": marketData})
    // }

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
					<Row>
                        {/* <Col xs={24} sm={8}>
                        </Col> */}
                        {/* <BurnCard marketData={marketData} eraData={eraData}/> */}
							<EraTable size={'small'}/>
                        {/* <Col xs={24} sm={8}>
                        </Col> */}
                    </Row>
					
					<Label>BURN ETHER</Label>
					<br/>
					<Row>
						<Col xs={6} sm={4}>
							<Input size={'large'} style={{ marginBottom: 10 }} allowClear onChange={onEthAmountChange} placeholder={account.ethBalance - 0.1} />
							<br></br>
							<Button onClick={maxEther}>{(account.ethBalance - 0.1).toFixed(4)}</Button>
							<br></br>
							<LabelGrey>Spendable ETH</LabelGrey>
						</Col>
						<Col xs={15} sm={16} style={{ marginLeft: 20 }}>
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