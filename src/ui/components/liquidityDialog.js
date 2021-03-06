import React, { useEffect, useState } from "react"
import defaults from "../../common/defaults"
import Web3 from "web3"
import '@metamask/legacy-web3'

import { currency, getBN, percent } from "../../common/utils"
import { Col, Slider, Switch, InputNumber, Row, Select, Tooltip } from "antd"
import {
    LoadingOutlined, QuestionCircleOutlined, CheckCircleOutlined, PlusOutlined,
    ExclamationCircleOutlined, InfoCircleOutlined
} from '@ant-design/icons'
import { Button, Colour, Label, LabelGrey, Sublabel } from "../components"
import { getETHPrice } from "../../client/market"
import { getVetherPrice, getUtilsContract } from "../../client/web3"

export const AddLiquidityTable = () => {

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

    const [poolData, setPoolData] = useState({ baseAmt: 0, tokenAmt: 0 })
    const [price, setPrice] = useState({
        eth: { usd: 0 },
        veth: {
            eth: 0,
            usd: 0
        }
    })

    const [asset0, setAsset0] = useState(base.name)
    const [amount0, setAmount0] = useState(0)

    const [asset1, setAsset1] = useState('Ether')
    const [amount1, setAmount1] = useState(0)

    const [customPriceImpactEnabled, setCustomPriceImpactEnabled] = useState(false)
    const [priceImpact, setPriceImpact] = useState(0)
    const orderPrice = isFinite((amount1 + poolData.tokenAmt) / (amount0 + poolData.baseAmt))
        ? (amount1 + poolData.tokenAmt) / (amount0 + poolData.baseAmt) : price.veth.eth
    let orderPriceImpact = isFinite((((orderPrice - price.veth.eth) / price.veth.eth)))
        ? percent((orderPrice - price.veth.eth) / price.veth.eth) : 0
    orderPriceImpact = orderPriceImpact === '-0.00%' ? '0.00%' : orderPriceImpact

    const [approved, setApproved] = useState(false)
    const [approveFlag, setApproveFlag] = useState(false)

    // const ethBalanceSpendable = (account.ethBalance - 0.1).toFixed(4) < 0 ?
    // 	0 : (account.ethBalance - 0.1).toFixed(4)

    const { Option } = Select

    const loadData = async () => {
        const web3 = new Web3(new Web3.providers.HttpProvider(defaults.api.url))
        const utils = new web3.eth.Contract(defaults.vader.utils.abi, defaults.vader.utils.address)
        const poolData = await utils.methods.getPoolData(defaults.vader.pools.eth).call()
        setPoolData({
            baseAmt: Number(Web3.utils.fromWei(poolData.baseAmt)),
            tokenAmt: Number(Web3.utils.fromWei(poolData.tokenAmt))
        })
        const ethUsd = await getETHPrice()
        const vethEth = await getVetherPrice()
        const vethUsd = vethEth * ethUsd
        const priceData = {
            eth: { usd: ethUsd },
            veth: {
                eth: vethEth,
                usd: vethUsd
            }
        }
        setPrice(priceData)
    }

    const isApproved = async () => {
        try {
            const account = (await window.web3.eth.getAccounts())[0]
            if (account) {
                const vether = new window.web3.eth.Contract(defaults.vether.abi, defaults.vether.address)
                const approval = await vether.methods.allowance(account, defaults.vader.router.address).call()
                if (+approval > 0) {
                    setApproved(true)
                } else {
                    setApproved(false)
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    const approve = async () => {
        try {
            const account = (await window.web3.eth.getAccounts())[0]
            if (account) {
                setApproveFlag(true)
                const vether = new window.web3.eth.Contract(defaults.vether.abi, defaults.vether.address)
                const value = getBN(defaults.vether.supply * 10 ** 18).toString()
                await vether.methods.approve(defaults.vader.router.address, value).send({ from: account })
            }
        } catch (err) {
            if (approveFlag) setApproveFlag(false)
            console.log(err)
        }
    }

    const stake = async () => {
        try {
            const account = (await window.web3.eth.getAccounts())[0]
            if (account) {
                const amountVeth = Web3.utils.toWei(amount0.toString())
                const amountEth = Web3.utils.toWei(amount1.toString())
                const vaderRouter = new window.web3.eth.Contract(defaults.vader.router.abi, defaults.vader.router.address)
                await vaderRouter.methods.stake(amountVeth, amountEth, defaults.vader.pools.eth).send({
                    value: amountEth,
                    from: account,
                    gasPrice: '',
                    gas: ''
                })
            }
        } catch (err) {
            console.log(err)
        }
    }

    const onAsset0amountChange = (value) => {
        if (isNaN(value)) return
        if (!customPriceImpactEnabled) {
            if (asset0 === 'Vether') {
                setAmount1(value * price.veth.eth)
            } else {
                setAmount1(value / price.veth.eth)
            }
        }
        setAmount0(value)
    }

    const onAsset1amountChange = (value) => {
        if (isNaN(value)) {
            return
        }
        if (!customPriceImpactEnabled) {
            if (asset1 === 'Vether') {
                setAmount0(value * price.veth.eth)
            } else {
                setAmount0(value / price.veth.eth)
            }
        }
        setAmount1(value)
    }

    const onPriceImpactChange = (value) => {
        if (isNaN(value)) {
            return
        }
        loadData()
        setPriceImpact(value)
        let p = price.veth.eth
        p = (p * value) / 100
        if (asset0 === 'Vether') {
            if (p > 0) {
                p = Number(price.veth.eth) + Number(p)
                setAmount1((p * (poolData.baseAmt + amount0)) - poolData.tokenAmt)
            } else if (p < 0) {
                p = Number(price.veth.eth) + Number(p)
                setAmount0(((poolData.tokenAmt + amount1) / p) - poolData.baseAmt)
            }
        }
    }

    const rail = {
        '-99': {
            style: {
                color: '#fff',
                borderRadius: '50%',
                marginTop: 8,
                width: 24,
                height: 24
            },
            label: <strong>-</strong>
        },
        '0': {},
        '100': {
            style: {
                color: '#fff',
                borderRadius: '50%',
                marginTop: 8,
                width: 24,
                height: 24
            },
            label: <strong>+</strong>
        }
    }

    useEffect(() => {
        loadData()
        isApproved()
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>Vether pool gives you different options to provide liquidity. Unlike traditional AMM pools, Vether pool optionally allows you<br />to provide liquidity in unequal proportions. The default and recommended method is to provide both assets proportionally.</LabelGrey>

            <Row style={{ marginBottom: '0.7rem' }}>
                <Col lg={3} md={4} xs={7}>
                    <Label display="block" style={{ marginBottom: '0.55rem' }}>Base Asset</Label>
                    <Select size={'large'}
                        placeholder="Select"
                        defaultValue={base.name}
                        onChange={(value) => setAsset0(value)}
                        style={{ width: '100%' }}>
                        <Option value={base.name} key={1}>{base.name}</Option>
                    </Select>
                </Col>
                <Col lg={6} md={7} xs={12} style={{ paddingLeft: '31px' }}>
                    <Label display="block" style={{ marginBottom: '0.55rem' }}>Amount</Label>
                    {asset0
                        ? <InputNumber min={0}
                            step={0.1}
                            defaultValue="0"
                            size={'large'}
                            style={{ marginBottom: 10, width: '100%' }}
                            onChange={onAsset0amountChange}
                            value={amount0} />
                        : <InputNumber size={'large'} style={{ marginBottom: 10, width: '100%' }} disabled />
                    }
                </Col>
            </Row>

            <Row>
                <Col lg={3} md={4} xs={7} style={{ textAlign: 'right', marginLeft: '22.5px' }}>
                    <PlusOutlined style={{ margin: 0, fontSize: '0.8rem' }} />
                </Col>
            </Row>

            <Row style={{ marginBottom: '1.33rem' }}>
                <Col lg={3} md={4} xs={7}>
                    <Label display="block" style={{ marginBottom: '0.55rem' }}>Asset</Label>
                    <Select size={'large'} placeholder="Select" defaultValue={'Ether'} onChange={(value) => setAsset1(value)} style={{ width: '100%' }}>
                        {assets.filter((asset) => {
                            if (asset0) {
                                return (asset.name !== asset0)
                            } else {
                                return (asset)
                            }
                        }).map((asset, index) => {
                            return (
                                <Option value={asset.name} key={index}>{asset.name}</Option>
                            )
                        })}
                    </Select>
                </Col>
                <Col lg={6} md={7} xs={12} style={{ paddingLeft: '31px' }}>
                    <Label display="block" style={{ marginBottom: '0.55rem' }}>Amount</Label>
                    {asset1
                        ? <InputNumber min={0}
                            step={0.1}
                            defaultValue="0"
                            size={'large'}
                            style={{ marginBottom: 10, width: '100%' }}
                            onChange={onAsset1amountChange}
                            value={amount1} />
                        : <InputNumber size={'large'} style={{ marginBottom: 10, width: '100%' }} disabled />
                    }
                </Col>
            </Row>

            <Row style={{ paddingLeft: '5px', marginBottom: '1.66rem' }}>
                <Switch checkedChildren={'I'}
                    unCheckedChildren={'O'}
                    defaultChecked={false}
                    style={{ marginBottom: '5px', marginRight: '7px' }}
                    onChange={() => {
                        if (customPriceImpactEnabled) {
                            setCustomPriceImpactEnabled(false)
                        } else {
                            setCustomPriceImpactEnabled(true)
                        }
                    }
                    } />
                <span className={'antd-switch-desc'}>Asymmetric pooling</span>
            </Row>

            {customPriceImpactEnabled &&
                <>
                    <Row style={{ marginBottom: '1.66rem' }}>
                        <Col lg={24}>
                            <LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>You're now able to enter custom size on each side. Your input can be adjusted by desired price impact.</LabelGrey>
                        </Col>
                        <Col lg={9}>
                            <Label display="block" style={{ marginBottom: '0.55rem' }}>Price Impact</Label>
                            <Col style={{ padding: '0 17px' }}>
                                <Slider marks={rail}
                                    included={false}
                                    min={-99}
                                    max={100}
                                    tipFormatter={value => value + '%'}
                                    step={0.1}
                                    value={priceImpact}
                                    onChange={onPriceImpactChange}
                                    {...(customPriceImpactEnabled === false && { disabled: true })} />
                            </Col>
                        </Col>
                    </Row>
                </>
            }

            <Row style={{ marginBottom: '1.66rem', padding: '0 3px' }}>
                <Col lg={9}>
                    <Label display="block" style={{ marginBottom: '0.55rem' }}>Summary</Label>
                    <Row>
                        <Col span={12}>
                            Final Price&nbsp;<Tooltip placement="right" title="By providing such liquidity size, the price will change to this ratio.">
                                <QuestionCircleOutlined style={{ color: Colour().grey, margin: 0 }} />
                            </Tooltip>
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            {currency(orderPrice, 0, 5, 'ETH')}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            Price Impact&nbsp;<Tooltip placement="right" title="How much will the price change by providing entered size of liquidity.">
                                <QuestionCircleOutlined style={{ color: Colour().grey, margin: 0 }} />
                            </Tooltip>
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            {orderPriceImpact}
                        </Col>
                    </Row>
                </Col>
            </Row>
            {(Number(orderPrice)).toFixed(5) !== (Number(isFinite(price.veth.eth) &&
                price.veth.eth !== 0 ? price.veth.eth : Number(orderPrice))).toFixed(5) &&
                <>
                    <LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>
                        <ExclamationCircleOutlined style={{ marginBottom: '0' }} />&nbsp; You've set a custom ratio. Double check your final impact.
                    </LabelGrey>
                </>
            }

            {!approved && amount0 > 0 &&
                <>
                    <Row style={{ marginBottom: '1.33rem' }}>
                        <Col xs={24}>
                            <Label display="block" style={{ marginBottom: '0.55rem' }}>Token Approval</Label>
                            <Button backgroundColor="transparent" onClick={approve}>APPROVE >></Button>
                            <Sublabel>ALLOW VETHER FOR STAKING</Sublabel>
                            {approveFlag &&
                                <>
                                    {!approved &&
                                        <LoadingOutlined style={{ marginBottom: 0 }} />
                                    }
                                </>
                            }
                        </Col>
                    </Row>
                </>
            }

            {((approved) || (!approved && amount0 === 0)) &&
                <>
                    {amount0 > 0 || amount1 > 0
                        ? <Button backgroundColor="transparent" onClick={stake}>ADD >></Button>
                        : <Button backgroundColor="transparent" disabled>ADD >></Button>
                    }
                    <Sublabel>ADD LIQUIDITY TO THE POOL</Sublabel>
                </>
            }
        </>
    )
}

export const ProvidedLiquidityTable = (props) => {

    const account = props.accountData

    return (
        <>
            <Row type="flex" justify="center" style={{ textAlign: "center", marginBottom: '1.66rem' }}>
                <Col xs={8}>
                    <span style={{ fontSize: '0.8rem', display: 'block', margin: '0 0 0.5rem 0', color: '#97948e' }}>ASSET SHARE</span>
                    <span style={{ fontSize: '1.2rem', display: 'block', margin: '0' }}>{currency(account.baseAmt, 0, 3, 'VETH')}
                        <Tooltip placement="right" title="The amount of asset in pool you own at this moment. Based on liqudity you have provided.">
                            &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, marginBottom: 0 }} />
                        </Tooltip>
                    </span>
                </Col>
                <Col xs={8}>
                    <span style={{ fontSize: '0.8rem', display: 'block', margin: '0 0 0.5rem 0', color: '#97948e' }}>ASSET SHARE</span>
                    <span style={{ fontSize: '1.2rem', display: 'block', margin: '0' }}>{currency(account.tokenAmt, 0, 3, 'ETH')}
                        <Tooltip placement="right" title="The amount of asset in pool you own at this moment. Based on liqudity you have provided.">
                            &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, marginBottom: 0 }} />
                        </Tooltip>
                    </span>
                </Col>
                <Col xs={8}>
                    <span style={{ fontSize: '0.8rem', display: 'block', margin: '0 0 0.5rem 0', color: '#97948e' }}>POOL SHARE</span>
                    <span style={{ fontSize: '1.2rem', display: 'block', margin: '0' }}>{percent(account.memberPoolShare)}
                        <Tooltip placement="right" title="A percentage of pool you own.">
                            &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, marginBottom: 0 }} />
                        </Tooltip>
                    </span>
                </Col>
            </Row>
            {!account.isMember &&
                <>
                    <Row>
                        <LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>
                            <InfoCircleOutlined />&nbsp; You currently don't provide any liquidity.
                        </LabelGrey>
                    </Row>
                </>
            }
        </>
    )
}

export const RemoveLiquidityTable = (props) => {

    const account = props.accountData

    const [burnTknFlag, setBurnTknFlag] = useState(null)
    const [tknTx, setTknTx] = useState(null)
    const [loaded2, setLoaded2] = useState(null)
    const [unstakeAmount, setUnstakeAmount] = useState(0)

    const [approvedLP, setApprovedLP] = useState(false)
    const [approveLPFlag, setApproveLPFlag] = useState(false)

    const getLink = (tx) => {
        return defaults.etherscan.url.concat('tx/').concat(tx)
    }

    useEffect(() => {
        isApprovedLP()
        // eslint-disable-next-line
    }, [])

    const isApprovedLP = async () => {
        try {
            const account = (await window.web3.eth.getAccounts())[0]
            if (account) {
                const util = getUtilsContract()
                const poolAddress = await util.methods.getPool(defaults.vader.pools.eth).call()
                const pool = new window.web3.eth.Contract(defaults.vether.abi, poolAddress)
                const approval = await pool.methods.allowance(account, defaults.vader.router.address).call()
                const poolBalance = await pool.methods.balanceOf(account).call()
                if (+approval >= +poolBalance && +poolBalance > 0) {
                    setApprovedLP(true)
                } else {
                    setApprovedLP(false)
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    const approveLP = async () => {
        try {
            const account = (await window.web3.eth.getAccounts())[0]
            if (account) {
                setApproveLPFlag(true)
                const util = getUtilsContract()
                const poolAddress = await util.methods.getPool(defaults.vader.pools.eth).call()
                const pool = new window.web3.eth.Contract(defaults.vether.abi, poolAddress)
                const value = getBN(defaults.vether.supply * 10 ** 18).toString()
                await pool.methods.approve(defaults.vader.router.address, value).send({ from: account })
                setApprovedLP(true)
            }
        } catch (err) {
            if (approveLPFlag) setApproveLPFlag(false)
            setApprovedLP(false)
            console.log(err)
        }
    }

    const unstake = async () => {
        setBurnTknFlag(true)
        const account = (await window.web3.eth.getAccounts())[0]
        const vaderRouter = new window.web3.eth.Contract(defaults.vader.router.abi, defaults.vader.router.address)
        const tx = await vaderRouter.methods.unstake((unstakeAmount * 100), defaults.vader.pools.eth).send({ from: account })
        setTknTx(tx.transactionHash)
        setLoaded2(true)
    }

    const onProportionAmountChange = (value) => {
        if (isNaN(value)) {
            return
        }
        setUnstakeAmount(value)
    }

    return (
        <> {!approvedLP && account.isMember &&
                <Row>
                    <Col xs={24} sm={16} xl={9}>
                        <Button backgroundColor="transparent" onClick={approveLP}>APPROVE TOKEN >></Button>
                        <Sublabel margin={0}>APPROVE POOL TOKEN FOR TRANSFERS</Sublabel>
                    </Col>
                </Row>
            }

            {approvedLP &&
                <Row>
                    <Col xs={24} sm={16} xl={9}>
                        <Label display="block" style={{ marginBottom: '0.55rem' }}>Proportion</Label>
                        <Col span={15} style={{ paddingLeft: 6, marginRight: 23 }}>
                            <Slider
                                min={0}
                                max={100}
                                onChange={onProportionAmountChange}
                                value={typeof unstakeAmount === 'number' ? unstakeAmount : 0}
                                step={1}
                            />
                        </Col>
                        <Col span={3}>
                            <InputNumber
                                min={0}
                                max={100}
                                onChange={onProportionAmountChange}
                                style={{ marginBottom: 10 }}
                                step={0.1}
                                formatter={value => `${value}%`}
                                parser={value => value.replace('%', '')}
                                defaultValue="0"
                                value={unstakeAmount}
                            />
                        </Col>
                    </Col>
                    <Col xs={24} sm={7} style={{ paddingTop: 30 }}>
                    {(unstakeAmount > 0)
                            ? <Button backgroundColor="transparent" onClick={unstake}>REMOVE >></Button>
                            : <Button backgroundColor="transparent" disabled>REMOVE >></Button>
                        }
                        <Sublabel margin={0}>REMOVE LIQUIDITY FROM THE POOL</Sublabel>
                        {burnTknFlag &&
                            <>
                                {!loaded2 &&
                                    <LoadingOutlined style={{ fontSize: 15 }} />
                                }
                                {loaded2 &&
                                    <>
                                        <CheckCircleOutlined style={{ fontSize: 15, marginRight: 7, color: defaults.color.gray, display: 'inline-block' }} />
                                        <a href={getLink(tknTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: defaults.color.accent, fontSize: 12 }}>VIEW TRANSACTION -></a>
                                    </>
                                }
                            </>
                        }
                    </Col>
                </Row>
            }

            {!account.isMember &&
                <>
                    <Row>
                        <LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>
                            <InfoCircleOutlined />&nbsp; You currently don't provide any liquidity.
                        </LabelGrey>
                    </Row>
                </>
            }
        </>
    )
}
