import React, { useState, useEffect } from 'react'
import Web3 from 'web3';
import BigNumber from 'bignumber.js'

import { Row, Col, Input } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { Label, LabelGrey, Sublabel, Button, Click, Center, Text, Colour } from '../components'

import { vetherAddr, vetherAbi, uniSwapAddr, uniSwapAbi, getEtherscanURL, infuraAPI, getUniswapBalances } from '../../client/web3.js'
import { getETHPrice } from '../../client/market.js'

export const PoolTable = () => {
    const totalSupply = (new BigNumber(1000000*10**18)).toFixed(0)

    const [marketData, setMarketData] = useState({
        priceToday: "",
        priceHistorical: "",
        priceUniswap: "",
        ethPrice: ""
    })
    const [uniswapBalance, setUniswapBalance] = useState(
        { "eth": "", "veth": '' })
    const [account, setAccount] = useState(
        { address: '', vethBalance: '', ethBalance: '' })
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

    const connect = () => {
        //setWalletFlag(true)
        ethEnabled()
        if (!ethEnabled()) {
            alert("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp");
        }
    }

    const ethEnabled = () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
            loadBlockchainData()
            return true;
        }
        return false;
    }

    const loadBlockchainData = async () => {
        const web3_ = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
        const contract_ = new web3_.eth.Contract(vetherAbi(), vetherAddr())
        const accounts = await window.web3.eth.getAccounts()

        // // const day_ = await contract_.methods.currentDay().call()
        // const era_ = await contract_.methods.currentEra().call()
        // const emission_ = await contract_.methods.emission().call()
        // const currentBurn_ = await contract_.methods.mapEraDay_UnitsRemaining(era_, day_).call()
        // const currentPrice = (currentBurn_ / emission_)

        // const totalSupply_ = await contract_.methods.totalSupply().call()
        // const balance_ = await contract_.methods.balanceOf(vetherAddr()).call()
        // const totalBurnt_ = await contract_.methods.totalBurnt().call()
        // const totalFees_ = await contract_.methods.totalFees().call()
        // const totalEmitted_ = +totalSupply_ - +balance_ + +totalFees_
        // const historicalPrice = (totalBurnt_ / totalEmitted_)

        // const priceVetherEth = await getUniswapPriceEth()
        const priceEtherUSD = await getETHPrice()

        //console.log(currentPrice, historicalPrice, priceVetherEth, priceEtherUSD)

        setMarketData({
            priceToday: 0, //(currentPrice).toFixed(4),
            priceHistorical: 0, //(historicalPrice).toFixed(3),
            priceUniswap: 0, //(priceVetherEth).toFixed(3),
            ethPrice: (priceEtherUSD).toFixed(2)
        })
        await refreshAccount(contract_, accounts[0])
        setContract(contract_)
    }

    const refreshAccount = async (contract_, account_) => {
        // console.log('accounts', account_)
        const ethBalance_ = convertFromWei(await window.web3.eth.getBalance(account_))
        const vethBalance_ = convertFromWei(await contract_.methods.balanceOf(account_).call())
        setAccount({
            address: account_,
            vethBalance: vethBalance_,
            ethBalance: ethBalance_
        })

        setEthAmount(ethBalance_)
        setVethAmount(vethBalance_)
        checkApproval(account_)
        const uniswapBal = await getUniswapBalances()
        setUniswapBalance(uniswapBal)
    }

    const checkApproval = async (address) => {
        const tokenContract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
        const fromAcc = address
        const spender = uniSwapAddr()
        const approval = await tokenContract.methods.allowance(fromAcc, spender).call()
        const vethBalance = await tokenContract.methods.balanceOf(address).call()
        setApprovalAmount(approval)
        // console.log(approval, vethBalance)
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
        refreshAccount(contract, fromAcc_)
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
        refreshAccount(contract, fromAcc_)
        setLoadedSell(true)
    }

    const getLink = (tx) => {
        return getEtherscanURL().concat('tx/').concat(tx)
    }

    function convertFromWei(number) {
        var num = (number / (1 * 10 ** 18))
        return num.toFixed(2)
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

    function prettify(amount) {
        const number = Number(amount)
        var parts = number.toPrecision(8).replace(/\.?0+$/, '').split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
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
                <Col xs={11} style={poolStyles}>
                    <Row>
                        <Col xs={12}>
                            <Text size={12} bold={true} color={Colour().white}>ETHER</Text>
                            <Center><Text size={30} color={Colour().white} margin={"20px 0px 5px 0px"}>{prettify(uniswapBalance.eth)}</Text></Center>
                            <Center><Text margin={"5px 0px 30px"}>${prettify(marketData.ethPrice * uniswapBalance.eth)}</Text></Center>
                        </Col>
                        <Col xs={12} style={lineStyle}>
                            <Text size={12} bold={true} color={Colour().white}>VETHER</Text>
                            <Center><Text size={30} color={Colour().white} margin={"20px 0px 5px 0px"}>{prettify(uniswapBalance.veth)}</Text></Center>
                            <Center><Text margin={"5px 0px 30px"}>${prettify(marketData.ethPrice * uniswapBalance.eth)}</Text></Center>
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
                                <Sublabel>SEL VETHER FOR ETH</Sublabel>
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