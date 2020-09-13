import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import defaults from "../../common/defaults"
import Web3 from 'web3'

import { Row, Col, Input, Tooltip } from 'antd'
import { SwapOutlined, QuestionCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Label, Sublabel, Button, Colour, LabelGrey } from '../components'

import { getVetherPrice } from '../../client/web3.js'
import { BN2Str, currency, getBN } from '../../common/utils'
import { calcSwapOutput } from '../../common/clpLogic'
import { getETHPrice } from "../../client/market"

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

    const [trade, setTrade] = useState({ price: 0, slippage: 0, slippagePercent: 0, slippageColor: '', slippageWarning: false })
    const inCurrency = 'ETH'

    const [vetherContract, setVetherContract] = useState(null)
    const [vethTx, setVethTx] = useState(null)
    const [vethAmount, setVethAmount] = useState(0)
    const [vethAmountCalculated, setVethAmountCalculated] = useState(0)

    const [buyFlag, setBuyFlag] = useState(false)
    const [loadedBuy, setLoadedBuy] = useState(null)
    const [sellFlag, setSellFlag] = useState(false)
    const [loadedSell, setLoadedSell] = useState(null)

    const [poolData, setPoolData] = useState(
        { "eth": "", "veth": '', 'price': "", "fees": "", "volume": "", "txCount": "", 'roi': "", 'apy': "" })
    const [marketData, setMarketData] = useState(
        { priceUSD: '', priceETH: '', ethPrice: '' })

    useEffect(() => {
        connect()
        loadPoolData()
        loadMarketData()
        // eslint-disable-next-line
    }, [])

    const connect = async () => {
        const account = (await window.web3.eth.getAccounts())[0]
        if(account) {
            const web3 = new Web3(new Web3.providers.HttpProvider(defaults.infura.api))
            const vether = new web3.eth.Contract(defaults.vether.abi, defaults.vether.address)
            loadAccountData(vether, account)
            setVetherContract(vether)
            checkApproval(account)
            setConnected(true)
        } else {
            setConnected(false)
        }
    }

    const loadAccountData = async (contract, address) => {
        const accountConnected = (await window.web3.eth.getAccounts())[0]
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

	const loadPoolData = async () => {
		const web3_ = new Web3(new Web3.providers.HttpProvider(defaults.infura.api))
        const utils = new web3_.eth.Contract(defaults.vader.utils.abi, defaults.vader.utils.address)
        const poolData = await utils.methods.getPoolData(defaults.vader.pools.eth).call()
        const price = await getVetherPrice()
        const roi = await utils.methods.getPoolROI(defaults.vader.pools.eth).call()
        const apy = await utils.methods.getPoolAPY(defaults.vader.pools.eth).call()
		const poolData_ = {
			"eth": Web3.utils.fromWei(poolData.tokenAmt),
			"veth": Web3.utils.fromWei(poolData.baseAmt),
			"price": price,
			"volume": Web3.utils.fromWei(poolData.volume),
			"fees": Web3.utils.fromWei(poolData.fees),
			"txCount": poolData.txCount,
			"roi": roi,
            "apy": apy
		}
		setPoolData(poolData_)
		context.setContext({
			"poolData": poolData_
		})
	}

    const loadMarketData = async () => {
        const priceEtherUSD = await getETHPrice()
        const priceVetherEth = await getVetherPrice()

        const priceVetherUSD = priceVetherEth * priceEtherUSD

        const marketData = {
            priceUSD: priceVetherUSD,
            priceETH: priceVetherEth,
            ethPrice: priceEtherUSD
        }

        setMarketData(marketData)
        context.setContext({
            "marketData": marketData
        })
    }

    const checkApproval = async () => {
        try {
            const account = (await window.web3.eth.getAccounts())[0]
            if (account){
                const vether = new window.web3.eth.Contract(defaults.vether.abi, defaults.vether.address)
                const approval = await vether.methods.allowance(account, defaults.vader.router.address).call()
                const vethBalance = await vether.methods.balanceOf(account).call()
                if (+approval >= +vethBalance && +vethBalance > 0) {
                    setApproved(true)
                } else {
                    setApproved(false)
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    const unlockToken = async () => {
        try {
            const account = (await window.web3.eth.getAccounts())[0]
            if (account) {
                setApproveFlag(true)
                const vether = new window.web3.eth.Contract(defaults.vether.abi, defaults.vether.address)
                const value = getBN(defaults.vether.supply * 10 ** 18).toString()
                await vether.methods.approve(defaults.vader.router.address, value).send({ from: account })
                checkApproval()
            }
        } catch (err) {
            if(approveFlag) setApproveFlag(false)
            console.log(err)
        }
    }

    const onEthAmountChange = e => {
        loadPoolData()
        const value = e.target.value
        let valueInVeth = calcSwapOutput(Web3.utils.toWei(value), Web3.utils.toWei(poolData.eth), Web3.utils.toWei(poolData.veth))
            valueInVeth = isFinite(+valueInVeth) ? Web3.utils.fromWei(BN2Str(valueInVeth)) : 0
        setEthAmount(value)
        setVethAmount("")
        setVethAmountCalculated(currency(valueInVeth, 0, 5, 'VETH').replace('VETH',''))
        calcTrade(value, valueInVeth)
    }

    const onVethAmountChange = e => {
        loadPoolData()
        const value = e.target.value
        let valueInEth = calcSwapOutput(Web3.utils.toWei(value), Web3.utils.toWei(poolData.veth), Web3.utils.toWei(poolData.eth))
            valueInEth = isFinite(+valueInEth) ? Web3.utils.fromWei(BN2Str(valueInEth)) : 0
        setVethAmount(value)
        setEthAmount("")
        setEthAmountCalculated(currency(valueInEth, 0, 5, 'ETH').replace('Ξ',''))
        calcTrade(valueInEth, value)
    }

    const calcTrade = (size0, size1) => {
        const marketRate = marketData.priceETH
        const tradeRate = size0/size1 === Infinity || isNaN(size0/size1) ? 0 : size0/size1
        let slippage = tradeRate - marketRate === Infinity || isNaN(tradeRate - marketRate) ? 0 : tradeRate - marketRate
        slippage = slippage < 0 ? slippage * (-1) : slippage
        const slippagePercent = (slippage/marketRate)*(100) < 0 || (slippage/marketRate)*(100) === 100 ? 0 : (slippage/marketRate)*(100)

        let color
        let slippageWarning
        switch(true) {
            case (slippagePercent === 0):
                color = 'inherit'
                break;
            case (slippagePercent <= 1):
                color = '#7cb305'
                break;
            case (slippagePercent < 3):
                color = 'inherit'
                break;
            case (slippagePercent > 5):
                color = '#cf1322'
                slippageWarning = true
                break;
            case (slippagePercent >= 3):
                color = '#fa541c'
                break;
            default:
                color = 'inherit'
        }

        setTrade({
            price: tradeRate,
            slippage: slippage,
            slippagePercent: slippagePercent,
            slippageColor: color,
            slippageWarning: slippageWarning
        })
    }

    const buyVether = async () => {
        setLoadedBuy(false)
        setBuyFlag(true)
        const vaderRouter = new window.web3.eth.Contract(defaults.vader.router.abi, defaults.vader.router.address)
        const amount = Web3.utils.toWei(String(ethAmount))
        const tx = await vaderRouter.methods.sell(amount, defaults.vader.pools.eth)
            .send({
                from: account.address,
                gasPrice: '',
                gas: '240085',
                value: amount
            })
        setEthTx(tx.transactionHash)
        loadAccountData(vetherContract, account.address)
        setLoadedBuy(true)
    }

    const sellVether = async () => {
        setSellFlag(true)
        setLoadedSell(false)
        const vaderRouter = new window.web3.eth.Contract(defaults.vader.router.abi, defaults.vader.router.address)
        const amount = Web3.utils.toWei(String(vethAmount))
        const tx = await vaderRouter.methods.buy(amount, defaults.vader.pools.eth)
            .send({
                from: account.address,
                gasPrice: '',
                gas: '240085'
            })
        setVethTx(tx.transactionHash)
        loadAccountData(vetherContract, account.address)
        setLoadedSell(true)
    }

    const getLink = (tx) => {
        return defaults.etherscan.url.concat('tx/').concat(tx)
    }

    return (
        <>
            <Row type="flex" justify="center">
                <Col lg={12} xs={24}>
                    <Label display="block" style={{ marginBottom: '1.33rem' }}>Actual Price</Label>
                    <div style={{ textAlign: 'center' }}><span style={{ fontSize: 30 }}>{currency(marketData.priceUSD)}</span>
                        <Tooltip placement="right" title="Current market rate">
                            &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, margin: 0 }} />
                        </Tooltip>
                    </div>
                    <LabelGrey style={{ display: 'block', marginBottom: 0, textAlign: 'center' }}>{currency(marketData.priceETH, 0, 6, inCurrency)}</LabelGrey>
                </Col>
            </Row>
            <Row type="flex" justify="center">
                <Col lg={12} xs={24}>
                    <Row type="flex" justify="center" align="middle">
                        <Col span={10}>
                            <Label display="block" style={{marginBottom: '0.55rem'}}>Buy</Label>
                            <Input size={'large'} style={{marginBottom: "1.3rem"}} onChange={onEthAmountChange} value={ethAmount}
                                   placeholder={ethAmountCalculated} suffix="ETH Ξ"/>
                            { connected && ethAmount > 0
                                ? <Button backgroundColor="transparent" onClick={buyVether}>BUY VETH >></Button>
                                : <Button backgroundColor="transparent" disabled>BUY VETH >></Button>
                            }
                            <Sublabel>BUY VETHER WITH ETH</Sublabel>
                        </Col>

                        <Col span={4} style={{textAlign: 'center'}}>
                            <SwapOutlined style={{fontSize: '19px'}}/>
                        </Col>

                        <Col span={10} style={{textAlign: "right"}}>
                            <Row>
                                <Col xs={24}>
                                    <Label display="block" style={{marginBottom: '0.55rem'}}>Sell</Label>
                                    <Input size={'large'} style={{marginBottom: '1.3rem'}} onChange={onVethAmountChange} value={vethAmount}
                                           placeholder={vethAmountCalculated} suffix="VETH"/>


                                    { !approved && Number(vethAmount) === 0 &&
                                        <>
                                            <Button backgroundColor="transparent" disabled>SELL&nbsp;VETH&nbsp;>></Button>
                                        </>
                                    }

                                    { approved &&
                                        <>
                                            { vethAmount > 0
                                                ? <Button backgroundColor="transparent" onClick={sellVether}>SELL&nbsp;VETH&nbsp;>></Button>
                                                : <Button backgroundColor="transparent" disabled>SELL&nbsp;VETH&nbsp;>></Button>
                                            }
                                        </>
                                    }

                                    { connected && !approved && vethAmount > 0 &&
                                        <>
                                            <Button backgroundColor="transparent" onClick={unlockToken}>APPROVE VETHER >></Button>
                                        </>
                                    }

                                    {connected && !approved && vethAmount > 0
                                        ? <Sublabel>ALLOW VETHER FOR TRADES</Sublabel>
                                        : <Sublabel>SELL VETHER FOR ETH</Sublabel>
                                    }
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center" align="middle" style={{ marginBottom: '1.33rem' }}>
                        <Col xs={24} xl={12}>
                            <Row>
                                <Col span={12}>
                                        Trade Price&nbsp;<Tooltip placement="right" title="The price you will get when the trade gets executed.">
                                            <QuestionCircleOutlined style={{ color: Colour().grey, margin: 0 }} />
                                        </Tooltip>
                                </Col>
                                <Col span={12} style={{ textAlign: 'right' }}>
                                    {currency(trade.price, 0, 6, inCurrency)}
                                </Col>
                                <Col span={12}>
                                    Slippage&nbsp;<Tooltip placement="right" title="The difference between market price and trade price due to trade size.">
                                        <QuestionCircleOutlined style={{ color: Colour().grey, margin: 0 }} />
                                    </Tooltip>
                                </Col>
                                <Col span={12} style={{ textAlign: 'right', color: trade.slippageColor }}>
                                    {trade.slippagePercent.toFixed(2)}%
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    { trade.slippageWarning &&
                        <>
                            <LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>
                                <ExclamationCircleOutlined style={{ marginBottom: '0' }}/>&nbsp;Due to trade size your price's affected by high slippage.
                            </LabelGrey>
                        </>
                    }
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
    )
}
