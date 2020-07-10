import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import Web3 from 'web3';

import { Row, Col, Input } from 'antd'
import { SwapOutlined, LoadingOutlined } from '@ant-design/icons';
import { Label, Sublabel, Button, Colour } from '../components'

import { vetherAddr, vetherAbi, wetherAddr, uniSwapAddr, uniSwapAbi, uniSwapRouterAbi, uniSwapRouterAddr, getEtherscanURL,
    infuraAPI } from '../../client/web3.js'
import { prettify, totalSupply } from '../utils'

export const SwapInterface = () => {

    const context = useContext(Context)

    const [connected, setConnected] = useState(false)
    const [account, setAccount] = useState(
        { address: '', vethBalance: '', ethBalance: '' })
    const [contract, setContract] = useState(null)

    const [approved, setApproved] = useState(null)
    const [approveFlag, setApproveFlag] = useState(null)

    const [ethTx, setEthTx] = useState(null)
    const [ethAmount, setEthAmount] = useState(0)

    const [vethTx, setVethTx] = useState(null)
    const [vethAmount, setVethAmount] = useState(0)

    const [buyFlag, setBuyFlag] = useState(false)
    const [loadedBuy, setLoadedBuy] = useState(null)
    const [sellFlag, setSellFlag] = useState(false)
    const [loadedSell, setLoadedSell] = useState(null)

    const ethBalanceSpendable = (account.ethBalance - 0).toFixed(4) < 0 ?
        0 : (account.ethBalance - 0).toFixed(4)

    useEffect(() => {
        connect()
        // eslint-disable-next-line
    })

    const connect = async () => {
        const accountConnected = (await window.web3.eth.getAccounts())[0]
        if(accountConnected) {
            const accounts = await window.web3.eth.getAccounts()
            const address = accounts[0]
            const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
            const contract = new web3.eth.Contract(vetherAbi(), vetherAddr())
            context.accountData ? getAccountData() : loadAccountData(contract, address)
            setContract(contract)
            checkApproval(address)
            setConnected(true)
        } else {
            setConnected(false)
        }
    }

    const getAccountData = async () => {
        setAccount(context.accountData)
    }

    const loadAccountData = async (contract_, address) => {
        const accountConnected = (await window.web3.eth.getAccounts())[0];
        if(accountConnected) {
            let ethBalance = Web3.utils.fromWei(await window.web3.eth.getBalance(address), 'ether')
            const vethBalance = Web3.utils.fromWei(await contract_.methods.balanceOf(address).call(), 'ether')
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
        setEthAmount(e.target.value.toString())
    }
    const onVethAmountChange = e => {
        setVethAmount(e.target.value.toString())
    }

    const buyVether = async () => {
        setLoadedBuy(false)
        setBuyFlag(true)
        const contract = new window.web3.eth.Contract(uniSwapRouterAbi(), uniSwapRouterAddr())
        const amountIn = Web3.utils.toWei(ethAmount, 'ether')
        const amountOutMin = 1
        const path = [ vetherAddr(), wetherAddr() ]
        const sender = account.address
        const deadline = (((new Date())/1000)+1000).toFixed(0)
        const tx = await contract.methods.swapExactTokensForETH(amountIn, amountOutMin, path, sender, deadline).send({ from:sender }) // 2do add block.timestamp
        setEthTx(tx.transactionHash)
        loadAccountData(contract, sender)
        setLoadedBuy(true)
    }

    const sellVether = async () => {
        setLoadedSell(false)
        setSellFlag(true)
        const exchangeContract = new window.web3.eth.Contract(uniSwapAbi(), uniSwapAddr())
        const fromAcc_ = account.address
        const tokens_sold = Web3.utils.toWei(vethAmount, 'ether').toString()
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
            <Row type="flex" justify="center" align="middle">
                {connected &&
                    <Col span={5}>
                        <Label display="block" style={{ marginBottom: '0.55rem' }}>Buy</Label>
                        {/*<Label>{prettify(account.ethBalance)}</Label>*/}
                        <Input size={'large'} style={{ marginBottom: "1.3rem" }} onChange={onEthAmountChange} defaultValue="0" placeholder={ethBalanceSpendable} suffix="ETH Ξ" />
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
                                <a href={getLink(ethTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> VIEW TRANSACTION -> </a>
                            </>
                            }
                        </>
                        }
                    </Col>
                }

                <Col span={2} style={{ textAlign: 'center' }}>
                    <SwapOutlined style={{ fontSize: '19px' }}/>
                </Col>

                <Col span={5} style={{ textAlign:"right" }}>
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
                                <Label display="block" style={{ marginBottom: '0.55rem' }}>Sell</Label>
                                {/*<Label>{prettify(account.vethBalance)}</Label>*/}
                                <Input size={'large'} style={{ marginBottom: '1.3rem' }} onChange={onVethAmountChange} defaultValue={prettify(account.vethBalance)} placeholder={prettify(account.vethBalance)} suffix="$VETH" />
                                <Button
                                    backgroundColor="transparent"
                                    onClick={sellVether}
                                >
                                    SELL VETH >>
                                </Button>
                                <Sublabel>SELL VETHER FOR ETH</Sublabel>
                                {sellFlag &&
                                    <>
                                        {!loadedSell &&
                                            <LoadingOutlined />
                                        }
                                        {loadedSell &&
                                            <>
                                                <a href={getLink(vethTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> VIEW TRANSACTION -> </a>
                                            </>
                                        }
                                    </>
                                }
                            </Col>
                        </Row>
                    }
                </Col>
            </Row>
        </>
    )
}
