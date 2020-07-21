import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import Web3 from 'web3'

import {Row, Col, Input, Tooltip} from 'antd'
import {SwapOutlined, LoadingOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {Label, Sublabel, Button, Colour, LabelGrey} from '../components'

import { vetherAddr, vetherAbi, wetherAddr, uniSwapRouterAbi, uniSwapRouterAddr, getEtherscanURL,
    infuraAPI, getUniswapPriceEth } from '../../client/web3.js'
import { totalSupply } from '../utils.js'
import { getETHPrice } from "../../client/market.js"

export const SwapInterface = () => {

    const context = useContext(Context)

    const [connected, setConnected] = useState(false)
    const [account, setAccount] = useState(
        { address: '', vethBalance: '', ethBalance: '' })

    const [approved, setApproved] = useState(true)
    const [approveFlag, setApproveFlag] = useState(false)

    const [ethTx, setEthTx] = useState(null)
    const [ethAmount, setEthAmount] = useState(0)
    const [ethAmountCalculated, setEthAmountCalculated] = useState(0)

    const [vetherContract, setVetherContract] = useState(null)
    const [vethTx, setVethTx] = useState(null)
    const [vethAmount, setVethAmount] = useState(0)
    const [vethAmountCalculated, setVethAmountCalculated] = useState(0)

    const [price, setPrice] = useState({
        vethEth: 0,
        ethUsd: 0,
        vethUsd: 0
    })

    const [buyFlag, setBuyFlag] = useState(false)
    const [loadedBuy, setLoadedBuy] = useState(null)
    const [sellFlag, setSellFlag] = useState(false)
    const [loadedSell, setLoadedSell] = useState(null)

    useEffect(() => {
        connect()
        loadPriceData()
        // eslint-disable-next-line
    }, [])

    const connect = async () => {
        const accountConnected = (await window.web3.eth.getAccounts())[0]
        if(accountConnected) {
            const accounts = await window.web3.eth.getAccounts()
            const address = accounts[0]
            const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
            const vetherContract = new web3.eth.Contract(vetherAbi(), vetherAddr())
            context.accountData ? getAccountData() : loadAccountData(vetherContract, address)
            setVetherContract(vetherContract)
            checkApproval(address)
            setConnected(true)
        } else {
            setConnected(false)
        }
    }

    const getAccountData = async () => {
        setAccount(context.accountData)
    }

    const loadAccountData = async (contract, address) => {
        const accountConnected = (await window.web3.eth.getAccounts())[0];
        if(accountConnected) {
            const ethBalance = Web3.utils.fromWei(await window.web3.eth.getBalance(address), 'ether')
            const vethBalance = Web3.utils.fromWei(await contract.methods.balanceOf(address).call(), 'ether')
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

    const loadPriceData = async () => {
        const priceVethEth = await getUniswapPriceEth()
        const priceEthUsd = await getETHPrice()

        setPrice({
            vethEth: priceVethEth,
            ethUsd: priceEthUsd,
            vethUsd: (priceVethEth * priceEthUsd).toFixed(2)
        })
    }

    const checkApproval = async (address) => {
        const accountConnected = (await window.web3.eth.getAccounts())[0];
        if(accountConnected){
            const vetherContract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
            const from = address
            const spender = uniSwapRouterAddr()
            const approval = await vetherContract.methods.allowance(from, spender).call()
            const vethBalance = await vetherContract.methods.balanceOf(address).call()
            if (+approval >= +vethBalance && +vethBalance >= 0) {
                setApproved(true)
            } else {
                setApproved(false)
            }
        }
    }

    const unlockToken = async () => {
        const accountConnected = (await window.web3.eth.getAccounts())[0];
        if(accountConnected){
            setApproveFlag(true)
            const vetherContract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
            const from = account.address
            const spender = uniSwapRouterAddr()
            const value = totalSupply.toString()
            await vetherContract.methods.approve(spender, value)
                .send({
                    from: from
                })
            checkApproval(account.address)
        }
    }

    const onEthAmountChange = e => {
        loadPriceData()
        const value = e.target.value
        let valueInVeth = value / price.vethEth
        valueInVeth = valueInVeth === Infinity || isNaN(valueInVeth) ? 0 : valueInVeth
        setEthAmount(value.toString())
        setVethAmount("")
        setVethAmountCalculated(valueInVeth.toFixed(5))
    }

    const onVethAmountChange = e => {
        loadPriceData()
        const value = e.target.value
        let valueInEth = value * price.vethEth
        valueInEth = valueInEth === Infinity || isNaN(valueInEth) ? 0 : valueInEth
        setVethAmount(value.toString())
        setEthAmount("")
        setEthAmountCalculated(valueInEth.toFixed(5))
    }

    const buyVether = async () => {
        setBuyFlag(true)
        setLoadedBuy(false)
        const uniswapRouter = new window.web3.eth.Contract(uniSwapRouterAbi(), uniSwapRouterAddr())
        const amountOutMin = 0
        const path = [ wetherAddr(), vetherAddr() ]
        const sender = account.address
        const deadline = (((new Date())/1000)+1000).toFixed(0)
        const tx = await uniswapRouter.methods.swapExactETHForTokensSupportingFeeOnTransferTokens(amountOutMin,
            path,sender, deadline)
            .send({
                from: sender,
                gasPrice: '',
                gas: '',
                value: Web3.utils.toWei(ethAmount, 'ether')
            })
        setEthTx(tx.transactionHash)
        loadAccountData(vetherContract, sender)
        setLoadedBuy(true)
    }

    const sellVether = async () => {
        setLoadedSell(false)
        setSellFlag(true)
        const uniswapRouter = new window.web3.eth.Contract(uniSwapRouterAbi(), uniSwapRouterAddr())
        const amountOutMin = 0
        const path = [ vetherAddr(), wetherAddr() ]
        const sender = account.address
        const deadline = (((new Date())/1000)+1000).toFixed(0)
        const tx = await uniswapRouter.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(
            Web3.utils.toWei(vethAmount, 'ether'), amountOutMin, path, sender, deadline)
            .send({
                from: sender,
                gasPrice: '',
                gas: '240085',
                value: ''
            })
        setVethTx(tx.transactionHash)
        loadAccountData(vetherContract, sender)
        setLoadedSell(true)
    }

    const getLink = (tx) => {
        return getEtherscanURL().concat('tx/').concat(tx)
    }

    return (
        <>
            {connected && approved &&
                <>
                    <Row type="flex" justify="center">
                        <Col span={12}>
                            <Label display="block" style={{ marginBottom: '1.33rem' }}>Actual Price</Label>
                            <div style={{ textAlign: 'center' }}><span style={{ fontSize: 30 }}>${price.vethUsd}</span>
                                <Tooltip placement="right" title="Current market rate you get.">
                                    &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, margin: 0 }} />
                                </Tooltip>
                            </div>
                            <LabelGrey style={{ display: 'block', marginBottom: 0, textAlign: 'center' }}>{price.vethEth}&nbsp;Ξ</LabelGrey>
                        </Col>
                    </Row>

                    <Row type="flex" justify="center" align="middle">
                        <Col span={5}>
                            <Label display="block" style={{marginBottom: '0.55rem'}}>Buy</Label>
                            {/*<Label>{prettify(account.ethBalance)}</Label>*/}
                            <Input size={'large'} style={{marginBottom: "1.3rem"}} onChange={onEthAmountChange} value={ethAmount}
                                   placeholder={ethAmountCalculated} suffix="ETH Ξ"/>
                            {ethAmount > 0
                                ? <Button backgroundColor="transparent" onClick={buyVether}>BUY VETH >></Button>
                                : <Button backgroundColor="transparent" disabled>BUY VETH >></Button>
                            }
                            <Sublabel>BUY VETHER WITH ETH</Sublabel>
                        </Col>

                        <Col span={2} style={{textAlign: 'center'}}>
                            <SwapOutlined style={{fontSize: '19px'}}/>
                        </Col>

                        <Col span={5} style={{textAlign: "right"}}>
                            <Row>
                                <Col xs={24}>
                                    <Label display="block" style={{marginBottom: '0.55rem'}}>Sell</Label>
                                    {/*<Label>{prettify(account.vethBalance)}</Label>*/}
                                    <Input size={'large'} style={{marginBottom: '1.3rem'}} onChange={onVethAmountChange} value={vethAmount}
                                           placeholder={vethAmountCalculated} suffix="$VETH"/>
                                    {vethAmount > 0
                                        ? <Button backgroundColor="transparent" onClick={sellVether}>SELL VETH >></Button>
                                        : <Button backgroundColor="transparent" disabled>SELL VETH >></Button>
                                    }
                                    <Sublabel>SELL VETHER FOR ETH</Sublabel>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    { buyFlag &&
                        <>
                            <Row type="flex" justify="center" >
                                <Col span={12} style={{ textAlign: 'left' }}>
                                    {loadedBuy &&
                                    <>
                                        <a href={getLink(ethTx)} rel="noopener noreferrer" title="Transaction Link"
                                           target="_blank">VIEW TRANSACTION -></a>
                                    </>
                                    }
                                </Col>
                            </Row>
                        </>
                    }

                    { sellFlag &&
                    <>
                        <Row type="flex" justify="center" >
                            <Col span={12} style={{ textAlign: 'right' }}>
                                {loadedSell &&
                                <>
                                    <a href={getLink(vethTx)} rel="noopener noreferrer" title="Transaction Link"
                                       target="_blank">VIEW TRANSACTION -></a>
                                </>
                                }
                            </Col>
                        </Row>
                    </>
                    }
                </>
            }

            {connected && !approved &&
                <>
                    <Row type="flex" justify="center">
                        <Col span={12} style={{ textAlign: 'left' }}>
                            <Label display="block" style={{marginBottom: '0.55rem'}}>Token Approval</Label>
                            {!approveFlag &&
                                <>
                                    <Button backgroundColor="transparent" onClick={unlockToken}>APPROVE VETHER >></Button>
                                    <Sublabel>APPROVE VETHER FOR TRADES</Sublabel>
                                </>
                            }
                            {approveFlag &&
                                <>
                                    <LoadingOutlined />
                                </>
                            }
                        </Col>
                    </Row>
                </>
            }
        </>
    )
}
