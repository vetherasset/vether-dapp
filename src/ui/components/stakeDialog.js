import React, {useContext, useEffect, useState} from "react"
import { Context } from "../../context"
import Web3 from "web3"
import {
    ETH, getEtherscanURL, infuraAPI, vetherAbi, vetherAddr, vetherPools2Addr, vaderRouterAddr,
    vaderRouterAbi, vaderUtilsAbi, vaderUtilsAddr, getVetherPrice
} from "../../client/web3"
import { convertFromWei, currency, getBN } from "../../common/utils"
import { Col, Slider, InputNumber, Row, Select, Tooltip } from "antd"
import { LoadingOutlined, CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Colour, Label, LabelGrey, Sublabel } from "../components"

export const StakeDialog = () => {

    const context = useContext(Context)

    const [poolData, setPoolData] = useState(
        { "eth": "", "veth": '', 'price': "", "fees": "", "volume": "",
            "poolUnits": "", "txCount": "", 'age':"", 'roi': "", 'apy': "" })
    const [account, setAccount] = useState(
        {
            address: '', vethBalance: 0, ethBalance: 0,
            isMember: false, baseAmt: 0, tokenAmt: 0
        })

    const [connected, setConnected ] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadPoolData()
        connect()
        // eslint-disable-next-line
    }, [])

    const loadPoolData = async () => {
        const web3_ = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
        const utils = new web3_.eth.Contract(vaderUtilsAbi(), vaderUtilsAddr())
        const poolData = await utils.methods.getPoolData(ETH).call()
        const price = await getVetherPrice()
        const age = await utils.methods.getPoolAge(ETH).call()
        const roi = await utils.methods.getPoolROI(ETH).call()
        const apy = await utils.methods.getPoolAPY(ETH).call()
        const poolData_ = {
            "eth": convertFromWei(poolData.tokenAmt),
            "veth": convertFromWei(poolData.baseAmt),
            "price": convertFromWei(price),
            "volume": convertFromWei(poolData.volume),
            "poolUnits": poolData.poolUnits,
            "fees": convertFromWei(poolData.fees),
            "txCount": poolData.txCount,
            "age": age,
            "roi": roi,
            "apy": apy
        }
        setPoolData(poolData_)
        context.setContext({
            "poolData": poolData_
        })
    }

    const connect = async () => {
        const accountConnected = (await window.web3.eth.getAccounts())[0]
        if(accountConnected) {
            window.web3 = new Web3(window.ethereum)
            var accounts = await window.web3.eth.getAccounts()
            const address = await accounts[0]
            await loadAccountData(address)
            setConnected(true)
            setLoading(false)
        }
    }

    const loadAccountData = async (account) => {
        const accountConnected = (await window.web3.eth.getAccounts())[0]
        if (accountConnected) {
            const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
            const utils = await new web3.eth.Contract(vaderUtilsAbi(), vaderUtilsAddr())
            const vether = await new web3.eth.Contract(vetherAbi(), vetherAddr())
            const ethBalance = convertFromWei(await web3.eth.getBalance(account))
            const vethBalance = convertFromWei(await vether.methods.balanceOf(account).call())

            let isMember = await utils.methods.isMember(ETH, account).call()
            let memberShare = await utils.methods.getMemberShare(ETH, account).call()
            let memberPoolShare = ((memberShare.baseAmt + memberShare.tokenAmt)/(poolData.veth + poolData.eth)*100)

            const accountData = {
                'address': account,
                'vethBalance': vethBalance,
                'ethBalance': ethBalance,
                'isMember': isMember,
                'baseAmt': memberShare.baseAmt,
                'tokenAmt': memberShare.tokenAmt,
                'memberPoolShare': memberPoolShare
            }
            setAccount(accountData)
            context.setContext({ "accountData": accountData })
        }
    }

    return (
        <>
            <h2>ADD LIQUIDITY</h2>
            {loading &&
                <LoadingOutlined style={{ mnarginBottom: 0 }} />
            }
            {connected && !loading &&
                <AddLiquidityTable accountData={account}/>
            }
            {connected && !loading &&
            <>
                {account.isMember &&
                <>
                    <hr />
                    <RemoveLiquidityTable accountData={account} />
                </>
                }
            </>
            }
        </>
    )
}

const AddLiquidityTable = (props) => {

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

    const [ethTx, setEthTx] = useState(null)
    const [loading, setLoading] = useState(true)
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
            setLoading(false)
        }
    }

    const checkApproval = async (address) => {
        const accountConnected = (await window.web3.eth.getAccounts())[0]
        if (accountConnected){
            const vether = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
            const from = address
            const spender = vaderRouterAddr()
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
        const vether = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
        const fromAcc = account.address
        const spender = vaderRouterAddr()
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
        const vaderRouter = new window.web3.eth.Contract(vaderRouterAbi(), vaderRouterAddr())
        const tx = await vaderRouter.methods.stake(amountVeth, amountEth, ETH).send({
            value: amountEth,
            from: fromAcc,
            gasPrice: '',
            gas: ''
        })
        setEthTx(tx.transactionHash)
        console.log(ethTx)
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

    const onAsset0amountChange = value => {
        if (isNaN(value)) {
            return
        }
        setAmount0(value)
    }

    const onAsset1amountChange = value => {
        if (isNaN(value)) {
            return
        }
        setAmount1(value)
    }

    return (
        <>
            <h2 style={{ fontStyle: 'italic' }}>Select asset to pool.</h2>
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
                                       formatter={value => `${value} ${asset0.symbol}`}
                                       parser={value => value.replace(` ${asset0.symbol}`, '')}
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
                                         formatter={value => `${value} ${asset1.symbol}`}
                                         parser={value => value.replace(` ${asset1.symbol}`, '')}
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

            {!loading &&
                <>
                    { account.isMember &&
                        <>
                            <hr/>
                            <h2>POOLED LIQUIDITY</h2>
                            <p>Assets you have pooled.</p>
                            <Row type="flex" justify="center" style={{ textAlign: "center", marginBottom: '2.66rem' }}>
                                <Col xs={8}>
                                    <span style={{ fontSize: '0.8rem', display: 'block', margin: '0 0 0.5rem 0', color: '#97948e' }}>ASSET SHARE</span>
                                    <span style={{ fontSize: '1.2rem', display: 'block', margin: '0' }}>{currency(account.baseAmt, 0, 5, 'VETH')}
                                        <Tooltip placement="right" title="The amount of asset in pool you own at this moment.">
                                            &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, marginBottom: 0 }} />
                                        </Tooltip>
                                    </span>
                                </Col>
                                <Col xs={8}>
                                    <span style={{ fontSize: '0.8rem', display: 'block', margin: '0 0 0.5rem 0', color: '#97948e' }}>ASSET SHARE</span>
                                    <span style={{ fontSize: '1.2rem', display: 'block', margin: '0' }}>{currency(account.tokenAmt, 0, 5, 'ETH')}
                                        <Tooltip placement="right" title="The amount of asset in pool you own at this moment.">
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
                            <Row type="flex" justify="center" style={{ textAlign: "center" }}>
                                <Col xs={8}>
                                    <span style={{ fontSize: '0.8rem', display: 'block', margin: '0 0 0.5rem 0', color: '#97948e' }}>INITIAL STAKE</span>
                                    <span style={{ fontSize: '1.2rem', display: 'block', margin: '0' }}>{currency(account.vetherStaked, 0, 2, 'VETH')}
                                        <Tooltip placement="bottom" title="How many of asset you already provided to pool in total.">
                                                &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, marginBottom: 0 }} />
                                        </Tooltip>
                                    </span>
                                </Col>
                                <Col xs={8}>
                                    <span style={{ fontSize: '0.8rem', display: 'block', margin: '0 0 0.5rem 0', color: '#97948e' }}>INITIAL STAKE</span>
                                    <span style={{ fontSize: '1.2rem', display: 'block', margin: '0' }}>{currency(account.assetStaked, 0, 5, 'ETH')}
                                        <Tooltip placement="bottom" title="How many of asset you already provided to pool in total.">
                                                &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, marginBottom: 0 }} />
                                        </Tooltip>
                                    </span>
                                </Col>
                                <Col xs={8}>
                                    <span style={{ fontSize: '0.8rem', display: 'block', margin: '0 0 0.5rem 0', color: '#97948e' }}>ROI</span>
                                    <span style={{ fontSize: '1.2rem', display: 'block', margin: '0' }}>
                                        n/a
                                        <Tooltip placement="bottom" title="Member ROI isn't available yet, but will be in next pool version.">
                                                &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, marginBottom: 0 }} />
                                        </Tooltip>
                                    </span>
                                </Col>
                            </Row>
                        </>
                    }
                </>
            }
        </>
    )
}

const RemoveLiquidityTable = (props) => {

    const account = props.accountData

    const [burnTknFlag, setBurnTknFlag] = useState(null)
    const [tknTx, setTknTx] = useState(null)
    const [loaded2, setLoaded2] = useState(null)
    const [unstakeAmount, setUnstakeAmount] = useState(0)

    const getLink = (tx) => {
        return getEtherscanURL().concat('tx/').concat(tx)
    }

    const unstake = async () => {
        setBurnTknFlag(true)
        const vaderRouter = new window.web3.eth.Contract(vaderRouterAbi(), vaderRouterAddr())
        const tx = await vaderRouter.methods.unstake((unstakeAmount*100), ETH).send({ from: account.address })
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
            <p>Remove your pooled assets.</p>
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
                        <LoadingOutlined style={{ marginLeft: 20, fontSize: 15 }} />
                        }
                        {loaded2 &&
                        <>
                            <a href={getLink(tknTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>VIEW TRANSACTION -></a>
                        </>
                        }
                    </>
                    }
                </Col>
            </Row>
        </>
    )
}

export const UpgradeDialog = () => {

    const context = useContext(Context)

    const [account, setAccount] = useState(
        {
            address: '', vethBalance: 0, ethBalance: 0,
            isMember: false, baseAmt: 0, tokenAmt: 0
        })

    const [connected, setConnected ] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        connect()
        // eslint-disable-next-line
    }, [])

    const connect = async () => {
        const accountConnected = (await window.web3.eth.getAccounts())[0]
        if(accountConnected) {
            window.web3 = new Web3(window.ethereum)
            const accounts = await window.web3.eth.getAccounts()
            const address = await accounts[0]
            await loadAccountData(address)
            setConnected(true)
            setLoading(false)
        }
    }

    const loadAccountData = async (account) => {
        const accountConnected = (await window.web3.eth.getAccounts())[0]
        if (accountConnected) {
            const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
            const utils = await new web3.eth.Contract(vaderUtilsAbi(), vaderUtilsAddr())
            const vether = await new web3.eth.Contract(vetherAbi(), vetherAddr())
            const ethBalance = convertFromWei(await web3.eth.getBalance(account))
            const vethBalance = convertFromWei(await vether.methods.balanceOf(account).call())

            let isMember = await utils.methods.isMember(ETH, account).call()
            let memberShare = await utils.methods.getMemberShare(ETH, account).call()

            const accountData = {
                'address': account,
                'vethBalance': vethBalance,
                'ethBalance': ethBalance,
                'isMember': isMember,
                'baseAmt': memberShare.baseAmt,
                'tokenAmt': memberShare.tokenAmt
            }
            setAccount(accountData)
            context.setContext({ "accountData": accountData })
        }
    }

    const upgrade = async () => {
        const vaderRouter = new window.web3.eth.Contract(vaderRouterAbi(), vaderRouterAddr())
        await vaderRouter.methods.upgrade(vetherPools2Addr()).send({ from: account.address })
    }

    return (
        <>
            <h2>UPGRADE TO BETA 3</h2>
            <p>Move your liquidity from beta V2 pool.</p>
            {loading &&
                <LoadingOutlined style={{ mnarginBottom: 0 }} />
            }
            {connected && !loading &&
                <>
                    {account.isMember &&
                        <>
                            <Button backgroundColor="transparent" onClick={upgrade}>UPGRADE >></Button>
                            <Sublabel>MOVE ALL YOUR LIQUIDITY</Sublabel>
                        </>
                    }
                    {!account.isMember &&
                        <>
                            <LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>
                                <CheckCircleOutlined style={{ marginBottom: '0' }}/>&nbsp;You've got nothing to upgrade.
                            </LabelGrey>
                        </>
                    }
                </>
            }
        </>
    )
}