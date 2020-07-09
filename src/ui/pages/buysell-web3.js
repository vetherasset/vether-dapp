import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import Web3 from 'web3';

import { Row, Col, Input, Tooltip } from 'antd'
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Label, LabelGrey, Sublabel, Button, Click, Colour } from '../components'

import { vetherAddr, vetherAbi, uniSwapAddr, uniSwapAbi, getEtherscanURL, infuraAPI } from '../../client/web3.js'
// import { getETHPrice } from '../../client/market.js'
import { convertFromWei, prettify, totalSupply } from '../utils'

export const PoolTable = () => {

    const context = useContext(Context)

    const [connected, setConnected] = useState(false)
    const [account, setAccount] = useState(
        { address: '', vethBalance: '', ethBalance: '' })

    const [contract, setContract] = useState(null)
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

    const ethBalanceSpendable = (account.ethBalance - 0.1).toFixed(4) < 0 ?
        0 : (account.ethBalance - 0.1).toFixed(4)

    useEffect(() => {
        connect()
        // eslint-disable-next-line
    }, [])

    const connect = async () => {
        window.web3 = new Web3(window.ethereum);
        const accountConnected = (await window.web3.eth.getAccounts())[0];
        if(accountConnected) {
            const accounts = await window.web3.eth.getAccounts()
            const address = accounts[0]
            const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
            const contract = new web3.eth.Contract(vetherAbi(), vetherAddr())
            context.accountData ? getAccountData() : loadAccountData(contract, address)
            setContract(contract)
            checkApproval(address)
            //setWalletFlag(true)
            // ethEnabled()
            // if (!ethEnabled()) {
            //     // alert("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp");
            // } else {

            //     // loadBlockchainData()
            // }
            setConnected(true)
        } else {
            setConnected(false)
        }
    }

    // const ethEnabled = () => {
    //     if (window.ethereum) {
    //         window.web3 = new Web3(window.ethereum);
    //         window.ethereum.enable();
    //         return true;
    //     }
    //     return false;
    // }

    const getAccountData = async () => {
        setAccount(context.accountData)
    }

    const loadAccountData = async (contract_, address) => {
        const accountConnected = (await window.web3.eth.getAccounts())[0];
        if(accountConnected) {
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
    }

    const checkApproval = async (address) => {
        const accountConnected = (await window.web3.eth.getAccounts())[0];
        if(accountConnected){
            const tokenContract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
            const fromAcc = address
            const spender = uniSwapAddr()
            const approval = await tokenContract.methods.allowance(fromAcc, spender).call()
            const vethBalance = await tokenContract.methods.balanceOf(address).call()
            console.log(approval, vethBalance)
            if (+approval >= +vethBalance && +vethBalance > 0) {
                setApproved(true)
            }
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
        // loadUniswapData()
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
        const tx = await exchangeContract.methods.swap(tokens_sold, min_eth, deadline).send({ from: fromAcc_ })
        setVethTx(tx.transactionHash)
        loadAccountData(contract, fromAcc_)
        // loadUniswapData()
        setLoadedSell(true)
    }

    const getLink = (tx) => {
        return getEtherscanURL().concat('tx/').concat(tx)
    }

    return (
        <>
            <Row style={{ marginTop: 40, marginBottom: 50 }}>
                <Col xs={24} sm={24} xl={6}>
                </Col>
                {connected &&
                    <Col xs={24} sm={24} xl={6} style={{ marginLeft: 0, marginRight: 0, marginBottom: 30 }}>
                        <Label>{prettify(account.ethBalance)}</Label>
                        <br/>
                        <LabelGrey>Spendable ETH Balance</LabelGrey>
                        <Input size={'large'} style={{ marginBottom: 10, paddingRight: 50 }} allowClear onChange={onEthAmountChange} placeholder={ethBalanceSpendable} />
                        <br/>
                        <Tooltip placement="left" title="This will buy Vether with your Ether">
                            <QuestionCircleOutlined style={{ color: Colour().grey,  margin: 0 }} />&nbsp;
                        </Tooltip>
                        <Button
                            backgroundColor="transparent"
                            onClick={buyVether}
                        >
                            BUY VETH >>
                        </Button>
                        <Sublabel>BUY VETHER WITH ETH</Sublabel>
                        {buyFlag &&
                        <>
                            {!loadedBuy &&
                            <LoadingOutlined style={{ marginLeft: 20, fontSize: 15 }} />
                            }
                            {loadedBuy &&
                            <>
                                <Click><a href={getLink(ethTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> VIEW TRANSACTION -> </a></Click>
                            </>
                            }
                        </>
                        }
                    </Col>
                }

                <Col xs={24} sm={24} xl={6} style={{ marginLeft:0, marginRight: 0, textAlign:"right" }}>
                    {approved &&
                        <Row>
                            <Col xs={24}>
                                {!approveFlag &&
                                <>
                                    {!approved &&
                                        <div style={{ paddingTop: '102px' }}>
                                            <Button
                                                backgroundColor="transparent"
                                                onClick={unlockToken}
                                            >
                                                UNLOCK >>
                                            </Button>
                                            <Tooltip placement="right" title="This will unlock your Vether">
                                                &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, margin: 0 }} />
                                            </Tooltip>
                                            <Sublabel>UNLOCK VETHER FIRST</Sublabel>
                                        </div>
                                    }
                                </>
                                }
                                {approveFlag &&
                                    <div style={{ paddingTop: '102px' }}>>
                                        {!approved &&
                                            <LoadingOutlined />
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
                                <br/>
                                <LabelGrey>Available VETH Balance</LabelGrey>
                                <Input size={'large'} style={{ marginBottom: 10, paddingLeft: 50 }} allowClear onChange={onVethAmountChange} placeholder={prettify(account.vethBalance)} />
                                <br/>
                                <Button
                                    backgroundColor="transparent"
                                    onClick={sellVether}
                                >
                                    &lt;&lt;SELL VETH
                                </Button>
                                <Tooltip placement="right" title="This will sell your Vether for Ether">
                                    &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, margin: 0 }} />
                                </Tooltip>
                                <Sublabel>SELL VETHER FOR ETH</Sublabel>
                                {sellFlag &&
                                    <>
                                        {!loadedSell &&
                                            <LoadingOutlined />
                                        }
                                        {loadedSell &&
                                            <>
                                                <Click><a href={getLink(vethTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> VIEW TRANSACTION -> </a></Click>
                                            </>
                                        }
                                    </>
                                }
                            </Col>
                        </Row>
                    }
                </Col>
                <Col xs={24} sm={24} xl={6}>
                </Col>
            </Row>
        </>
    )
}
