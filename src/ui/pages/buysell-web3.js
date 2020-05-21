import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import Web3 from 'web3';
import BigNumber from 'bignumber.js'

import { Row, Col, Input } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { Label, LabelGrey, Sublabel, Button, Click, Center, Text, Colour } from '../components'

import { vetherAddr, vetherAbi, uniSwapAddr, uniSwapAbi, getEtherscanURL, infuraAPI, getUniswapBalances } from '../../client/web3.js'
import { getETHPrice, getVETHPriceInEth } from '../../client/market.js'
import {convertFromWei, prettify} from '../utils'

export const PoolTable = () => {

    const context = useContext(Context)

    const totalSupply = (new BigNumber(1000000*10**18)).toFixed(0)

    const [marketData, setMarketData] = useState({
        priceToday: "",
        priceHistorical: "",
        priceUniswap: "",
        ethPrice: ""
    })

    const [account, setAccount] = useState(
        { address: '', vethBalance: '', ethBalance: '' })

    const [uniswapData, setUniswapData] = useState(
        { "eth": "", "veth": '' })


    const [contract, setContract] = useState(null)
    // const [customAmount, setCustomAmount] = useState(null)
    const [approvalAmount, setApprovalAmount] = useState(null)
    const [approved, setApproved] = useState(null)
	const [approveFlag, setApproveFlag] = useState(null)
    const [ethTx, setEthTx] = useState(null)
    const [ethAmount, setEthAmount] = useState(null)
    const [vethTx, setVethTx] = useState(null)
    const [vethAmount, setVethAmount] = useState(null)

    const [buyFlag, setBuyFlag] = useState(false)
    const [loadedBuy, setLoadedBuy] = useState(null)
    const [sellFlag, setSellFlag] = useState(false)
    const [loadedSell, setLoadedSell] = useState(null)

    useEffect(() => {
        connect()
        // eslint-disable-next-line
    }, [])

    const connect = async () => {
        //setWalletFlag(true)
        ethEnabled()
        if (!ethEnabled()) {
            alert("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp");
        } else {
            context.uniswapData ? getUniswapData() : loadUniswapData()
            context.marketData ? getMarketData() : loadMarketData()
            const accounts = await window.web3.eth.getAccounts()
			const address = accounts[0]
			const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
			const contract = new web3.eth.Contract(vetherAbi(), vetherAddr())
            context.accountData ? getAccountData() : loadAccountData(contract, address)
            setContract(contract)
            checkApproval(address)
            // loadBlockchainData()
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


	const getAccountData = async () => {
        setAccount(context.accountData)
    }

    const loadAccountData = async (contract_, address) => {
        var ethBalance = convertFromWei(await window.web3.eth.getBalance(address))
        const vethBalance = convertFromWei(await contract_.methods.balanceOf(address).call())
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
	}

    const checkApproval = async (address) => {
        const tokenContract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
        const fromAcc = address
        const spender = uniSwapAddr()
        const approval = await tokenContract.methods.allowance(fromAcc, spender).call()
        const vethBalance = await tokenContract.methods.balanceOf(address).call()
        setApprovalAmount(approval)
        console.log(approval, vethBalance)
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

    const onEthAmountChange = e => {
        setEthAmount(e.target.value)
        // setCustomAmount(e.target.value)
    }
    const onVethAmountChange = e => {
        setVethAmount(e.target.value)
        // setCustomAmount(e.target.value)
    }

    const buyVether = async () => {
        setLoadedBuy(false)
        setBuyFlag(true)
        const fromAcc_ = account.address
        const toAcc_ = uniSwapAddr() //getAccounts(1)
        const amount_ = ethAmount * 1000000000000000000
        const tx = await window.web3.eth.sendTransaction({ from: fromAcc_, to: toAcc_, value: amount_ })
        setEthTx(tx.transactionHash)
        loadAccountData(contract, fromAcc_)
        loadUniswapData()
        setLoadedBuy(true)
    }

    const sellVether = async () => {
        setLoadedSell(false)
        setSellFlag(true)
        const exchangeContract = new window.web3.eth.Contract(uniSwapAbi(), uniSwapAddr())
        const fromAcc_ = account.address
        const tokens_sold = (vethAmount * 1000000000000000000).toString()
        const min_eth = (1).toString()
        const deadline = (Math.round(((new Date()).getTime()) / 1000) + 1000).toString()
        console.log(tokens_sold, min_eth, deadline, fromAcc_, uniSwapAddr())
        // tokenToEthSwapInput(uint256 tokens_sold, uint256 min_eth, uint256 deadline)
        const tx = await exchangeContract.methods.tokenToEthSwapInput(tokens_sold, min_eth, deadline).send({ from: fromAcc_ })
        setVethTx(tx.transactionHash)
        loadAccountData(contract, fromAcc_)
        loadUniswapData()
        setLoadedSell(true)
    }

    const getLink = (tx) => {
        return getEtherscanURL().concat('tx/').concat(tx)
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
            <Row style={{ marginTop: 40, marginBottom: 50 }}>
                <Col xs={5} style={{ marginLeft: 50 }}>
                    <Label>{prettify(account.ethBalance)}</Label>
                    <br></br>
                    <LabelGrey>Spendable ETH Balance</LabelGrey>
                    <Input size={'large'} style={{ marginBottom: 10, paddingRight: 50 }} allowClear onChange={onEthAmountChange} placeholder={prettify(account.ethBalance - 0.01)} />
                    <br></br>
                    <Button onClick={buyVether}> BUY VETH >></Button>
                    <br></br>
                    <Sublabel>BUY VETHER WITH ETH</Sublabel>
                    {buyFlag &&
                        <div>
                            {!loadedBuy &&
                                <LoadingOutlined style={{ marginLeft: 20, fontSize: 15 }} />
                            }
                            {loadedBuy &&
                                <div>
                                    <Click><a href={getLink(ethTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> VIEW TRANSACTION -> </a></Click>
                                </div>
                            }
                        </div>
                    }
                </Col>
                <Col xs={12} style={poolStyles}>
                    <Row>
                        <Col xs={12}>
                            <Text size={12} bold={true} color={Colour().white}>ETHER</Text>
                            <Center><Text size={30} color={Colour().white} margin={"20px 0px 5px 0px"}>{prettify(uniswapData.eth)}</Text></Center>
                            <Center><Text margin={"5px 0px 30px"}>${prettify(marketData.ethPrice * uniswapData.eth)}</Text></Center>
                        </Col>
                        <Col xs={12} style={lineStyle}>
                            <Text size={12} bold={true} color={Colour().white}>VETHER</Text>
                            <Center><Text size={30} color={Colour().white} margin={"20px 0px 5px 0px"}>{prettify(uniswapData.veth)}</Text></Center>
                            <Center><Text margin={"5px 0px 30px"}>${prettify(marketData.ethPrice * uniswapData.eth)}</Text></Center>
                        </Col>
                    </Row>
                </Col>
                <Col xs={5} style={{ marginLeft: 50 }}>

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
                    {approved &&
                        <Row>
                            <Col xs={24}>
                                <Label>{prettify(account.vethBalance)}</Label>
                                <br></br>
                                <LabelGrey>Available VETH Balance</LabelGrey>
                                <Input size={'large'} style={{ marginBottom: 10, paddingRight: 50 }} allowClear onChange={onVethAmountChange} placeholder={prettify(account.vethBalance)} />
                                <br></br>
                                <Button onClick={sellVether}>&lt;&lt; SELL VETH</Button>
                                <br></br>
                                <Sublabel>SELL VETHER FOR ETH</Sublabel>
                                {sellFlag &&
                                    <div>
                                        {!loadedSell &&
                                            <LoadingOutlined style={{ marginLeft: 20, fontSize: 15 }} />
                                        }
                                        {loadedSell &&
                                            <div>
                                                <Click><a href={getLink(vethTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> VIEW TRANSACTION -> </a></Click>
                                            </div>
                                        }
                                    </div>
                                }
                            </Col>
                        </Row>
                    }
                </Col>
            </Row>
        </div>
    )
}