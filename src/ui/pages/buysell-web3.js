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

    const ethBalanceSpendable = (account.ethBalance - 0.1).toFixed(4) < 0 ?
        0 : (account.ethBalance - 0.1).toFixed(4)

    useEffect(() => {
        connect()
        // eslint-disable-next-line
    }, [])

    const connect = async () => {
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
        const tx = await exchangeContract.methods.tokenToEthSwapInput(tokens_sold, min_eth, deadline).send({ from: fromAcc_ })
        setVethTx(tx.transactionHash)
        loadAccountData(contract, fromAcc_)
        // loadUniswapData()
        setLoadedSell(true)
    }

    const getLink = (tx) => {
        return getEtherscanURL().concat('tx/').concat(tx)
    }

    return (
        <div>
            <Row style={{ marginTop: 40, marginBottom: 50 }}>
                <Col xs={24} sm={24} xl={6}>
                </Col>
                <Col xs={24} sm={24} xl={6} style={{ marginLeft: 0, marginRight: 0, marginBottom: 30 }}>
                    <Label>{prettify(account.ethBalance)}</Label>
                    <br></br>
                    <LabelGrey>Spendable ETH Balance</LabelGrey>
                    <Input size={'large'} style={{ marginBottom: 10, paddingRight: 50 }} allowClear onChange={onEthAmountChange} placeholder={ethBalanceSpendable} />
                    <br></br>
                    <Button
                        backgroundColor="transparent"
                        onClick={buyVether}
                    >
                        BUY VETH >>
                    </Button>
                    <Tooltip placement="right" title="This will buy Vether with your Ether">
                        &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey }} />
                    </Tooltip>
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

                <Col xs={24} sm={24} xl={6} style={{ marginLeft:0, marginRight: 0, textAlign:"right" }}>
                    {!approved &&
                        <Row>
                            <Col xs={24}>
                                <Button
                                    backgroundColor="transparent"
                                    onClick={unlockToken}
                                >
                                    UNLOCK >
                                </Button>
                                <Tooltip placement="right" title="This will unlock your Vether">
                                    &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey }} />
                                </Tooltip>
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
                                <Input size={'large'} style={{ marginBottom: 10, paddingLeft: 50 }} allowClear onChange={onVethAmountChange} placeholder={prettify(account.vethBalance)} />
                                <br></br>
                                <Button
                                    backgroundColor="transparent"
                                    onClick={sellVether}
                                >
                                    &lt;&lt;SELL VETH
                                </Button>
                                <Tooltip placement="right" title="This will sell your Vether for Ether">
                                    &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey }} />
                                </Tooltip>
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
                <Col xs={24} sm={24} xl={6}>
                </Col>
            </Row>
        </div>
    )
}
