import React, { useEffect, useState} from "react"
import defaults from "../../common/defaults"
import Web3 from "web3"

import { currency, getBN } from "../../common/utils"
import { Col, Slider, InputNumber, Row, Select, Tooltip } from "antd"
import { LoadingOutlined, QuestionCircleOutlined, CheckCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Colour, Label, LabelGrey, Sublabel } from "../components"

export const AddLiquidityTable = (props) => {

    const account = props.accountData

    const assets = [
        {
            name: 'Vether',
            symbol: 'VETH'
        },
        {
            name: 'Ether',
            symbol: 'Ξ'
        }
    ]

    const [asset0, setAsset0] = useState(null)
    const [amount0, setAmount0] = useState(0)

    const [asset1, setAsset1] = useState(null)
    const [amount1, setAmount1] = useState(0)

    const [approved, setApproved] = useState(true)
    const [approveFlag, setApproveFlag] = useState(null)

    // const ethBalanceSpendable = (account.ethBalance - 0.1).toFixed(4) < 0 ?
    // 	0 : (account.ethBalance - 0.1).toFixed(4)

    const { Option } = Select

    useEffect(() => {
        approve()
        // eslint-disable-next-line
    }, [])

    const approve = async () => {
        try {
            if (account.address) {
                const vether = new window.web3.eth.Contract(defaults.vether.abi, defaults.vether.address)
                const spender = defaults.vader.router.address
                const approval = await vether.methods.allowance(account.address, spender).call()
                const vethBalance = await vether.methods.balanceOf(account.address).call()
                if (+approval >= +vethBalance && +vethBalance >= 0) {
                    setApproved(true)
                    if(approveFlag) setApproveFlag(false)
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
            setApproveFlag(true)
            const vether = new window.web3.eth.Contract(defaults.vether.abi, defaults.vether.address)
            const value = getBN(defaults.vether.supply * 10 ** 18).toString()
            await vether.methods.approve(defaults.vader.router.address, value).send({ from: account.address })
            approve(account.address)
        } catch (err) {
            if(approveFlag) setApproveFlag(false)
            console.log(err)
        }
    }

    const stake = async () => {
        try {
            const fromAcc = account.address
            let amountVeth
            let amountEth
            if (asset0.name === 'Vether') {
                amountVeth = Web3.utils.toWei(amount0.toString())
                amountEth = Web3.utils.toWei(amount1.toString())
            } else {
                amountVeth = Web3.utils.toWei(amount1.toString())
                amountEth = Web3.utils.toWei(amount0.toString())
            }
            const vaderRouter = new window.web3.eth.Contract(defaults.vader.router.abi, defaults.vader.router.address)
            await vaderRouter.methods.stake(amountVeth, amountEth, defaults.vader.pools.eth).send({
                value: amountEth,
                from: fromAcc,
                gasPrice: '',
                gas: ''
            })
        } catch (err) {
            console.log(err)
        }
    }


    const onAsset0amountChange = (value) => {
        if (isNaN(value)) {
            return
        }
        setAmount0(value)
    }

    const onAsset1amountChange = (value) => {
        if (isNaN(value)) {
            return
        }
        setAmount1(value)
    }

    console.log(asset0)
    console.log(asset1)

    return (
        <>
            <LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>Select an asset you would like to provide. Vether pool gives you different options to do so. Unlike traditional AMM pools,<br/>where you can provide only
                an equal proportion of both assets, Vether pool optionally allows you to provide liquidity<br/> in unequal proportions. The default and recommended method is to provide both assets proportionally.</LabelGrey>

            <Row style={{ marginBottom: '1.33rem' }}>
                <Col lg={3} md={4} xs={7}>
                    <Label display="block" style={{marginBottom: '0.55rem'}}>Asset</Label>
                    <Select size={'large'} placeholder="Select" onChange={(value => setAsset0(value))} style={{ width: '100%' }}>
                        {assets.map((asset, index) => {
                            return(
                                <Option value={asset.name} key={index}>{asset.name}</Option>
                            )
                        })}
                    </Select>
                </Col>
                <Col lg={6} md={7} xs={12} style={{ paddingLeft: '31px'}}>
                    <Label display="block" style={{marginBottom: '0.55rem'}}>Amount</Label>
                    {asset0
                        ? <InputNumber min={0}
                                       step={0.1}
                                       defaultValue="0"
                                       size={'large'}
                                       style={{ marginBottom: 10, width: '100%' }}
                                       onChange={onAsset0amountChange}
                                       value={amount0}/>
                        : <InputNumber size={'large'} style={{ marginBottom: 10 ,width: '100%' }} disabled/>
                    }
                </Col>
            </Row>

            <Row style={{ marginBottom: '1.33rem' }}>
                <Col lg={3} md={4} xs={7} style={{ textAlign: 'right', marginLeft: '22.5px' }}>
                    <PlusOutlined style={{ margin: 0, fontSize: '0.8rem' }}/>
                </Col>
            </Row>

            <Row style={{ marginBottom: '1.33rem' }}>
                <Col lg={3} md={4} xs={7}>
                    <Label display="block" style={{marginBottom: '0.55rem'}}>Asset</Label>
                    <Select size={'large'} placeholder="Select" onChange={(value => setAsset1(value))} style={{ width: '100%' }}>
                        {assets.map((asset, index) => {
                            return(
                                <Option value={asset.name} key={index}>{asset.name}</Option>
                            )
                        })}
                    </Select>
                </Col>
                <Col lg={6} md={7} xs={12} style={{ paddingLeft: '31px'}}>
                    <Label display="block" style={{marginBottom: '0.55rem'}}>Amount</Label>
                    {asset1
                        ? <InputNumber min={0}
                                       step={0.1}
                                       defaultValue="0"
                                       size={'large'}
                                       style={{ marginBottom: 10, width: '100%' }}
                                       onChange={onAsset1amountChange}
                                       value={amount1}/>
                        : <InputNumber size={'large'} style={{ marginBottom: 10 ,width: '100%' }} disabled/>
                    }
                </Col>
            </Row>



            {asset1 &&
                <>
                    { !approved && asset0.name !== 'Ether' && amount0 > 0  &&
                        <>
                            <Row>
                                <Col xs={24}>
                                    <Label display="block" style={{marginBottom: '0.55rem'}}>Token Approval</Label>
                                    <Button backgroundColor="transparent" onClick={unlockToken}>APPROVE >></Button>
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

                    { !approved && asset1.name !== 'Ether' && amount1 > 0  &&
                        <>
                            <Row>
                                <Col xs={24}>
                                    <Label display="block" style={{marginBottom: '0.55rem'}}>Token Approval</Label>
                                    <Button backgroundColor="transparent" onClick={unlockToken}>APPROVE >></Button>
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

                    { !approved && asset0.name === 'Vether' && amount0 === 0 &&
                        <>
                            {amount0 > 0 || amount1 > 0
                                ? <Button backgroundColor="transparent" onClick={stake}>ADD >></Button>
                                : <Button backgroundColor="transparent" disabled>ADD >></Button>
                            }
                            <Sublabel>ADD LIQUIDITY TO THE POOL</Sublabel>
                        </>
                    }

                    { !approved && asset1.name === 'Vether' && amount1 === 0 &&
                        <>
                            {amount0 > 0 || amount1 > 0
                                ? <Button backgroundColor="transparent" onClick={stake}>ADD >></Button>
                                : <Button backgroundColor="transparent" disabled>ADD >></Button>
                            }
                            <Sublabel>ADD LIQUIDITY TO THE POOL</Sublabel>
                        </>
                    }

                    { approved &&
                        <>
                            {amount0 > 0 || amount1 > 0
                                ? <Button backgroundColor="transparent" onClick={stake}>ADD >></Button>
                                : <Button backgroundColor="transparent" disabled>ADD >></Button>
                            }
                            <Sublabel>ADD LIQUIDITY TO THE POOL</Sublabel>
                        </>
                    }
                </>
            }
        </>
    )
}

export const ProvidedLiquidityTable = (props)  => {

    const account = props.accountData

    return (
        <>
            <h2>LIQUIDITY SHARES</h2>
            <p>Assets in pool you own.</p>
            <Row type="flex" justify="center" style={{ textAlign: "center", marginBottom: '2.66rem' }}>
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
                    <span style={{ fontSize: '1.2rem', display: 'block', margin: '0' }}>{account.memberPoolShare.toFixed(2)}%
                        <Tooltip placement="right" title="A percentage of pool you own.">
                            &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, marginBottom: 0 }} />
                        </Tooltip>
                    </span>
                </Col>
            </Row>
        </>
    )
}

export const RemoveLiquidityTable = (props) => {

    const account = props.accountData

    const [burnTknFlag, setBurnTknFlag] = useState(null)
    const [tknTx, setTknTx] = useState(null)
    const [loaded2, setLoaded2] = useState(null)
    const [unstakeAmount, setUnstakeAmount] = useState(0)

    const getLink = (tx) => {
        return defaults.etherscan.url.concat('tx/').concat(tx)
    }

    const unstake = async () => {
        setBurnTknFlag(true)
        const vaderRouter = new window.web3.eth.Contract(defaults.vader.router.abi, defaults.vader.router.address)
        const tx = await vaderRouter.methods.unstake((unstakeAmount*100), defaults.vader.pools.eth).send({ from: account.address })
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
        <>
            <h2>REMOVE LIQUIDITY</h2>
            <p>Remove your asset shares.</p>
            <Row>
                <Col xs={24} sm={16} xl={9}>
                    <Label display="block" style={{marginBottom: '0.55rem'}}>Proportion</Label>
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
                    {unstakeAmount > 0
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
        </>
    )
}