import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import defaults from "../../common/defaults"
import Web3 from 'web3'

import { Row, Col, InputNumber, Tooltip, Select } from 'antd'
import { SwapOutlined, QuestionCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Label, Button, Colour, LabelGrey } from '../components'

import { getVetherPrice } from '../../client/web3.js'
import { BN2Str, currency, getBN } from '../../common/utils'
import { calcSwapOutput, calcSwapInput } from '../../common/clpLogic'
import { getETHPrice } from "../../client/market"

export const SwapInterface = () => {

    const context = useContext(Context)
    const {Option} = Select

    const [account, setAccount] = useState(
        { address: '', vethBalance: '', ethBalance: '' })

    const [approved, setApproved] = useState(true)
    const [approveFlag, setApproveFlag] = useState(false)

    const [vethTx, setVethTx] = useState(null)
    const [baseAmount, setBaseAmount] = useState(0)

    const [ethTx, setEthTx] = useState(null)
    const [tokenAmount, setTokenAmount] = useState(0)

    const [trade, setTrade] = useState({ price: 0, slippage: 0, slippagePercent: 0, slippageColor: '', slippageWarning: false })
    const inCurrency = 'ETH'

    const [buyFlag, setBuyFlag] = useState(false)
    const [loadedBuy, setLoadedBuy] = useState(null)
    const [sellFlag, setSellFlag] = useState(false)
    const [loadedSell, setLoadedSell] = useState(null)

    const [poolData, setPoolData] = useState(
        { "tokenAmt": "", "baseAmt": '', 'price': "", "fees": "", "volume": "", "txCount": "", 'roi': "", 'apy': "" })
    const [marketData, setMarketData] = useState(
        { priceUSD: '', priceETH: '', ethPrice: '' })

    const base = {
        name: 'Vether',
        symbol: 'VETH'
    }

    const assets = [
        {
            name: 'Ether',
            symbol: 'Ξ'
        }
    ]

    useEffect(() => {
        loadAccountData()
        checkApproval()
        loadPoolData()
        loadMarketData()
        // eslint-disable-next-line
    }, [])

    const loadAccountData = async () => {
        const account = (await window.web3.eth.getAccounts())[0]
        if(account) {
            const web3 = new Web3(new Web3.providers.HttpProvider(defaults.infura.api))
            const vether = new web3.eth.Contract(defaults.vether.abi, defaults.vether.address)
            const ethBalance = Web3.utils.fromWei(await window.web3.eth.getBalance(account), 'ether')
            const vethBalance = Web3.utils.fromWei(await vether.methods.balanceOf(account).call(), 'ether')
            setAccount({
                address: account,
                vethBalance: vethBalance,
                ethBalance: ethBalance
            })
            context.setContext({
                "accountData": {
                    'address': account,
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
			"tokenAmt": Web3.utils.fromWei(poolData.tokenAmt),
			"baseAmt": Web3.utils.fromWei(poolData.baseAmt),
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

    const onTokenAmountChange = (value) => {
        if(Number.isInteger(value) && isFinite(value) && value >= 0) {
            loadPoolData()
            let baseAmount = calcSwapInput(
                true,
                Web3.utils.toWei(poolData.baseAmt),
                Web3.utils.toWei(poolData.tokenAmt),
                Web3.utils.toWei(String(value))
            )
            if(!isFinite(baseAmount) || baseAmount < 0) baseAmount = 0
            setTokenAmount(value)
            setBaseAmount(currency(
                Web3.utils.fromWei(String(baseAmount)),
                0,
                5, 'VETH')
                .replace('VETH', '')
            )
            calcTrade(value, Web3.utils.fromWei(String(baseAmount)))
        } else {
            setTokenAmount(0)
        }
    }

    const onBaseAmountChange = (value) => {
        if(Number.isInteger(value) && isFinite(value) && value >= 0) {
            loadPoolData()
            let tokenAmount = calcSwapOutput(
                Web3.utils.toWei(String(value)),
                Web3.utils.toWei(poolData.baseAmt),
                Web3.utils.toWei(poolData.tokenAmt)
            )
            if(!isFinite(+tokenAmount) || tokenAmount < 0) tokenAmount = 0
            setBaseAmount(value)
            setTokenAmount(currency(
                Web3.utils.fromWei(BN2Str(tokenAmount)),
                0,
                5,
                'ETH')
                .replace('Ξ','')
            )
            calcTrade(Web3.utils.fromWei(BN2Str(tokenAmount)), value)
        } else {
            setBaseAmount(0)
        }
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
        const amount = Web3.utils.toWei(String(tokenAmount))
        const tx = await vaderRouter.methods.sell(amount, defaults.vader.pools.eth)
            .send({
                from: account.address,
                gasPrice: '',
                gas: '240085',
                value: amount
            })
        setEthTx(tx.transactionHash)
        loadAccountData()
        setLoadedBuy(true)
    }

    const sellVether = async () => {
        setSellFlag(true)
        setLoadedSell(false)
        const vaderRouter = new window.web3.eth.Contract(defaults.vader.router.abi, defaults.vader.router.address)
        const amount = Web3.utils.toWei(String(baseAmount))
        const tx = await vaderRouter.methods.buy(amount, defaults.vader.pools.eth)
            .send({
                from: account.address,
                gasPrice: '',
                gas: '240085'
            })
        setVethTx(tx.transactionHash)
        loadAccountData()
        setLoadedSell(true)
    }

    const getLink = (tx) => {
        return defaults.etherscan.url.concat('tx/').concat(tx)
    }

    return (
        <>
            <Row type="flex" justify="center">
                <Col lg={9} xs={24}>
                    <Row type="flex" justify="center" align="middle">
                            <Col span={24}>
                                <Label display="block" style={{marginBottom: '0.55rem'}}>From</Label>
                                <Row>
                                    <Col span={16} style={{ paddingRight: '21px' }}>
                                        <InputNumber size={'large'}
                                                     style={{ marginBottom: "1.3rem", width: '100%' }}
                                                     value={baseAmount}
                                                     onChange={onBaseAmountChange}
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <Select defaultValue="Veth" style={{ width: '100%' }} bordered={false} size={'large'}>
                                            <Option value="veth">Veth</Option>
                                        </Select>
                                    </Col>
                                </Row>
                            </Col>

                            <Col span={24} style={{ textAlign: 'center' }}>
                                <SwapOutlined style={{ margin: 0, transform: 'rotate(90deg)', fontSize: '1.1rem' }} />
                            </Col>

                            <Col span={24}>
                                <Label display="block" style={{marginBottom: '0.55rem'}}>To</Label>
                                <Row>
                                    <Col span={16} style={{ paddingRight: '21px' }}>
                                        <InputNumber size={'large'}
                                                     style={{ marginBottom: "1.3rem", width: '100%' }}
                                                     value={tokenAmount}
                                                     onChange={onTokenAmountChange}
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <Select defaultValue="Eth" style={{ width: '100%' }} bordered={false} size={'large'}>
                                            <Option value="eth">Eth</Option>
                                        </Select>
                                    </Col>
                                </Row>
                            </Col>
                    </Row>

                    <Row type="flex" justify="center" align="middle" style={{ marginBottom: '1.33rem' }}>
                        <Col lg={18} xs={24}>
                            <Row>
                                <Col span={12}>
                                        Trade Price&nbsp;<Tooltip placement="right" title="The price you will get when the trade gets executed.">
                                            <QuestionCircleOutlined style={{ color: Colour().grey, margin: 0 }} />
                                        </Tooltip>
                                </Col>
                                <Col span={12} style={{ textAlign: 'right' }}>
                                    {currency(trade.price, 0, 5, inCurrency)}
                                </Col>
                            </Row>
                            <Row>
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
                    <Row type="flex" justify="center" align="middle" style={{ marginBottom: '1.33rem' }}>
                        <Col span={24}>
                            <Button type="primary" shape="round" size={'large'} style={{ width: '100%', minHeight: "43px" }}>
                                Swap
                            </Button>
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
