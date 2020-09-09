import React, { useEffect, useState} from "react"
import defaults from "../../common/defaults"
import Web3 from "web3"
import { currency, getBN } from "../../common/utils"
import { Col, Slider, InputNumber, Row, Select, Tooltip } from "antd"
import { LoadingOutlined, QuestionCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
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
        connect()
        // eslint-disable-next-line
    }, [])

    const connect = async () => {
        const accountConnected = (await window.web3.eth.getAccounts())[0]
        if (accountConnected) {
            const accounts = await window.web3.eth.getAccounts()
            const address = accounts[0]
            checkApproval(address)
        }
    }

    const checkApproval = async (address) => {
        const accountConnected = (await window.web3.eth.getAccounts())[0]
        if (accountConnected){
            const vether = new window.web3.eth.Contract(defaults.vether.abi, defaults.vether.address)
            const from = address
            const spender = defaults.vader.router.address
            const approval = await vether.methods.allowance(from, spender).call()
            const vethBalance = await vether.methods.balanceOf(address).call()
            if (+approval >= +vethBalance && +vethBalance >= 0) {
                setApproved(true)
                if(approveFlag) setApproveFlag(false)
            } else {
                setApproved(false)
            }
        }
    }

    const unlockToken = async () => {
        setApproveFlag(true)
        const vether = new window.web3.eth.Contract(defaults.vether.abi, defaults.vether.address)
        const fromAcc = account.address
        const spender = defaults.vader.router.address
        const value = getBN(1000000 * 10 ** 18).toString()
        await vether.methods.approve(spender, value).send({ from: fromAcc })
        checkApproval(account.address)
    }

    const stake = async () => {
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
    }

    const onAssetChange = (value) => {
        setAsset0(assets[value])
        addAnotherAsset(value)
    }

    const addAnotherAsset = (value) => {
        if(value === 0) {
            setAsset1(assets[1])
        } else {
            setAsset1(assets[0])
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

    return (
        <>
            <h2 style={{ fontStyle: 'italic' }}>Select asset to provide.</h2>
            <LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>Select an asset you would like to provide. Vether pool is non-proportional. Unlike Uniswap, where you need to provide<br/>
                an equal proportion of both assets, Vether pools allow you to provide liquidity in unequal proportions.</LabelGrey>

            <Row style={{ marginBottom: '1.33rem' }}>
                <Col lg={4} xs={10}>
                    <Label display="block" style={{marginBottom: '0.55rem'}}>Asset</Label>
                    <Select size={'large'} placeholder="Select" onChange={onAssetChange} style={{ width: 135 }}>
                        {assets.map((asset, index) => {
                            return(
                                <Option value={index} key={index}>{asset.name}</Option>
                            )
                        })}
                    </Select>
                </Col>
                <Col lg={5} xs={9}>
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



            {asset1 &&
                <>
                    <h2 style={{ fontStyle: 'italic' }}>Would you like to stake {asset1.name} as well?</h2>
                    <LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>You may provide both assets in just one transaction, whilst this is not required.<br/>
                        If you don't want to add {asset1.name} just leave following amount at zero.</LabelGrey>
                    <Row style={{ marginBottom: '1.33rem' }}>
                        <Col lg={4} xs={9}>
                            <Label display="block" style={{marginBottom: '0.55rem'}}>Amount</Label>
                            <InputNumber min={0}
                                         step={0.1}
                                         defaultValue="0"
                                         size={'large'}
                                         style={{ marginBottom: 10, width: '100%' }}
                                         onChange={onAsset1amountChange}
                                         value={amount1}
                            />
                        </Col>
                    </Row>

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