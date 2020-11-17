import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import defaults from "../../common/defaults"
import Web3 from 'web3'
import '@metamask/legacy-web3'

import { Row, Col, InputNumber, Tooltip, Select } from 'antd'
import { SwapOutlined, QuestionCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import animate from '../less/animate.less'
import { Label, Button, Colour, LabelGrey } from '../components'

import { getVetherPrice } from '../../client/web3.js'
import { BN2Str, currency, getBN, getTxLink } from '../../common/utils'
import { calcSwapOutput, calcSwapInput } from '../../common/clpLogic'
import { getETHPrice } from "../../client/market"

export const SwapInterface = () => {

    const context = useContext(Context)
    const {Option} = Select

    const assets = [
        {
            id: 0,
            name: 'Vether',
            ticker: 'VETH',
            symbol: 'VETH',
            address: '0x4Ba6dDd7b89ed838FEd25d208D4f644106E34279',
            pool: null
        },
        {
            id: 1,
            name: 'Ether',
            ticker: 'ETH',
            symbol: 'Ξ',
            address: '0x0000000000000000000000000000000000000000',
            pool: '0x0000000000000000000000000000000000000000'
        }
    ]

    const [account, setAccount] = useState({ address: '', vethBalance: '', ethBalance: '' })

    const [base, setBase] = useState(assets[1])
    const [baseAmount, setBaseAmount] = useState(0)

    const [token, setToken] = useState(assets[0])
    const [tokenAmount, setTokenAmount] = useState(0)

    const [approved, setApproved] = useState(true)

    const [trade, setTrade] = useState({ price: 0, slippage: 0, slippagePercent: 0, slippageColor: '', slippageWarning: false })

    const inCurrency = 'ETH'
    const [directionSwaped, setDirectionSwaped] = useState(false)

    const [swapFlag, setSwapFlag] = useState(false)
    const [transaction, setTransaction] = useState(null)

    const [poolData, setPoolData] = useState({ "tokenAmt": "", "baseAmt": '' })
    const [marketData, setMarketData] = useState(
        { priceUSD: '', priceETH: '', ethPrice: '' })

    useEffect(() => {
        loadAccountData()
        checkApproval()
        loadPoolData()
        loadMarketData()
        // eslint-disable-next-line
    }, [])

    const loadAccountData = async () => {
        try {
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
        } catch (err) {
            console.log(err)
        }
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

	const loadPoolData = async () => {
		const web3_ = new Web3(new Web3.providers.HttpProvider(defaults.infura.api))
        const utils = new web3_.eth.Contract(defaults.vader.utils.abi, defaults.vader.utils.address)

        const addr = String(assets.filter(asset => {
                return ((asset.pool !== null) && (asset.name === base.name || token.name))
        }).map(asset => asset.pool))

        const pool = await utils.methods.getPoolData(addr).call()
		const data = {
			"tokenAmt": Web3.utils.fromWei(pool.tokenAmt),
			"baseAmt": Web3.utils.fromWei(pool.baseAmt)
		}
		setPoolData(data)
		context.setContext({
			"poolData": data
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

    const approveToken = async () => {
        try {
            const account = (await window.web3.eth.getAccounts())[0]
            if (account) {
                const vether = new window.web3.eth.Contract(defaults.vether.abi, defaults.vether.address)
                const value = getBN(defaults.vether.supply * 10 ** 18).toString()
                await vether.methods.approve(defaults.vader.router.address, value).send({ from: account })
                checkApproval()
            }
        } catch (err) {
            console.log(err)
        }
    }

    const onTokenAmountChange = (value, toBase = base.name === 'Vether') => {
        if(typeof (value) === 'number') {
            loadPoolData()
            let inputAmt = calcSwapInput(
                toBase,
                Web3.utils.toWei(poolData.baseAmt),
                Web3.utils.toWei(poolData.tokenAmt),
                Web3.utils.toWei(String(value))
            )
            if(!isFinite(inputAmt) || inputAmt < 0) inputAmt = 0
            setTokenAmount(Number(value))
            setBaseAmount(Number(currency(
                Web3.utils.fromWei(String(inputAmt)),
                0,
                5, 'VETH')
                .replace('VETH', '')
            ))
            calcTrade(
                toBase ? value : Web3.utils.fromWei(String(inputAmt)),
                toBase ? Web3.utils.fromWei(String(inputAmt)) : value
            )
        } else {
            setTokenAmount(0)
        }
    }

    const onBaseAmountChange = (value, toBase = false) => {
        if(typeof (value) === 'number') {
            loadPoolData()
            if (base.name !== 'Vether') toBase = true
            let tokenAmount = calcSwapOutput(
                Web3.utils.toWei(String(value)),
                Web3.utils.toWei(toBase ? poolData.tokenAmt : poolData.baseAmt),
                Web3.utils.toWei(toBase ? poolData.baseAmt : poolData.tokenAmt)
            )
            if(!isFinite(+tokenAmount) || tokenAmount < 0) tokenAmount = 0
            setBaseAmount(Number(value))
            setTokenAmount(Number(currency(
                Web3.utils.fromWei(BN2Str(tokenAmount)),
                0,
                5,
                'ETH')
                .replace('Ξ','')
            ))
            calcTrade(
                !toBase ? Web3.utils.fromWei(BN2Str(tokenAmount)) : value,
                !toBase ? value : Web3.utils.fromWei(BN2Str(tokenAmount))
            )
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

    const buy = async () => {
        const vaderRouter = new window.web3.eth.Contract(defaults.vader.router.abi, defaults.vader.router.address)
        const amount = Web3.utils.toWei(String(baseAmount))
        const tx = await vaderRouter.methods.sell(amount, defaults.vader.pools.eth)
            .send({
                from: account.address,
                gasPrice: '',
                gas: '240085',
                value: amount
            })
        setTransaction(tx.transactionHash)
        setSwapFlag(true)
    }

    const sell = async () => {
        const vaderRouter = new window.web3.eth.Contract(defaults.vader.router.abi, defaults.vader.router.address)
        const amount = Web3.utils.toWei(String(baseAmount))
        const tx = await vaderRouter.methods.buy(amount, defaults.vader.pools.eth)
            .send({
                from: account.address,
                gasPrice: '',
                gas: '240085',
                value: ''
            })
        setTransaction(tx.transactionHash)
        setSwapFlag(true)
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
                                        <Select style={{ width: '100%' }}
                                                bordered={false}
                                                size={'large'}
                                                value={base.id}
                                                onChange={value => {
                                                    setBase(assets[value])
                                                    loadPoolData()
                                                }}>
                                            {assets.filter(asset => asset.name !== token.name).map((asset, n) => {
                                                return (
                                                    <Option key={n} value={asset.id}>{asset.ticker}</Option>
                                                )
                                            })}
                                        </Select>
                                    </Col>
                                </Row>
                            </Col>

                            <Col span={24} style={{ textAlign: 'center' }}>
                                <SwapOutlined className={`${animate.wiggle} ${animate.easeinout}`}
                                              style={{ margin: 0,
                                                  '--initial-deg': '90deg',
                                                  '--final-deg': '90deg',
                                                  fontSize: '1.1rem',
                                                  animation: 'wiggle 2.7s infinite'
                                              }}
                                              onClick={() => {
                                                  setToken(base)
                                                  setBase(token)
                                                  if (!directionSwaped) {
                                                      setTokenAmount(Number(baseAmount))
                                                      onTokenAmountChange(Number(baseAmount), true)
                                                      setDirectionSwaped(true)
                                                  } else {
                                                      onBaseAmountChange(Number(tokenAmount), true)
                                                      setDirectionSwaped(false)
                                                  }
                                              }}
                                />
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
                                        <Select style={{ width: '100%' }}
                                                bordered={false}
                                                size={'large'}
                                                value={token.id}
                                                onChange={value => {
                                                    setToken(assets[value])
                                                    loadPoolData()
                                                }}
                                        >
                                            {assets.filter(asset => asset.name !== base.name).map((asset, n) => {
                                                return (
                                                    <Option key={n} value={asset.id}>{asset.ticker}</Option>
                                                )
                                            })}
                                        </Select>
                                    </Col>
                                </Row>
                            </Col>
                    </Row>

                    <Row type="flex" justify="center" align="middle" style={{ marginBottom: '1.33rem', fontSize: 14 }}>
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
                                <Button type="primary"
                                        shape="round"
                                        size={'large'}
                                        style={{ width: '100%', minHeight: "43px" }}
                                        {...(!approved && base.id === 0 ? { onClick: approveToken}
                                        : { onClick: base.id === 0 ? sell : buy  })}
                                >
                                    { !approved && base.id === 0 ? 'Approve Token' : 'Swap' }
                                </Button>
                        </Col>
                    </Row>
                    { trade.slippageWarning &&
                        <>
                            <LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>
                                <ExclamationCircleOutlined style={{ marginBottom: '0', marginRight: 5 }}/><b>High slippage warning:</b> Price will be affected due to your trade size.
                            </LabelGrey>
                        </>
                    }
                </Col>
            </Row>

            { swapFlag && transaction &&
                <>
                    <Row type="flex" justify="center" >
                        <Col span={9} style={{ textAlign: 'left' }}>
                            <>
                                <a href={getTxLink(transaction)} rel="noopener noreferrer" title="Transaction Link"
                                   target="_blank">VIEW TRANSACTION -></a>
                            </>
                        </Col>
                    </Row>
                </>
            }
        </>
    )
}
