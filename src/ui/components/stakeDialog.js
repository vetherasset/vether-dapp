import React, {useContext, useEffect, useState} from "react"
import { Context } from "../../context"
import Web3 from "web3"
import { ETH, getEtherscanURL, getUniswapPriceEth, infuraAPI, vetherAbi, vetherAddr, vetherPools2Abi,
    vetherPools2Addr, vetherPoolsAbi, vetherPoolsAddr } from "../../client/web3"
import { convertFromWei, currency, getBN } from "../../common/utils"
import { calcShare } from "../../common/clpLogic"
import { Col, Slider, InputNumber, Input, Row, Select, Tooltip } from "antd"
import { LoadingOutlined, CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import {Button, Colour, Label, LabelGrey, Sublabel} from "../components"

export const StakeDialog = () => {

    const context = useContext(Context)

    const [account, setAccount] = useState(
        {
            address: '', vethBalance: '', ethBalance: '',
            stakeUnits: '', vetherStaked: '', assetStaked: '',
            vetherShare: '', assetShare: '', roi: ''
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
            const contract = await new web3.eth.Contract(vetherAbi(), vetherAddr())
            const ethBalance = convertFromWei(await web3.eth.getBalance(account))
            const vethBalance = convertFromWei(await contract.methods.balanceOf(account).call())

            const poolContract = new web3.eth.Contract(vetherPools2Abi(), vetherPools2Addr())
            let stakeData = await poolContract.methods.getMemberStakeData(account, ETH).call()

            let poolData = await poolContract.methods.poolData(ETH).call()
            let poolShare = calcShare(getBN(stakeData.stakeUnits), getBN(poolData.poolUnits), getBN(poolData.asset), getBN(poolData.vether))

            let memberROI = await poolContract.methods.getMemberROI(account, ETH).call()

            const accountData = {
                'address': account,
                'vethBalance': vethBalance,
                'ethBalance': ethBalance,
                'stakeUnits': (stakeData.stakeUnits / poolData.poolUnits) * 100,
                'vetherStaked': convertFromWei(stakeData.vether),
                'assetStaked': convertFromWei(stakeData.asset),
                'vetherShare': convertFromWei(poolShare.vether),
                'assetShare': convertFromWei(poolShare.asset),
                "roi": (+memberROI)
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
                {account.stakeUnits > "0" &&
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

    const totalSupply = getBN(1000000 * 10 ** 18)

    const assets = [
        {
            name: 'Vether',
            symbol: '$VETH'
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

    const [stakeFlag, setStakeFlag] = useState(null)
    const [ethTx, setEthTx] = useState(null)
    const [vetherPrice, setVetherPrice] = useState(null)
    const [loading, setLoading] = useState(true)
    const [approved, setApproved] = useState(true)
    const [approveFlag, setApproveFlag] = useState(null)

    // const ethBalanceSpendable = (account.ethBalance - 0.1).toFixed(4) < 0 ?
    // 	0 : (account.ethBalance - 0.1).toFixed(4)

    const { Option } = Select

    useEffect(() => {
        connect()
        console.log(vetherPrice)
        // eslint-disable-next-line
    }, [])

    const connect = async () => {
        const vethPrice = await getUniswapPriceEth()
        setVetherPrice(vethPrice)
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
            const vetherContract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
            const from = address
            const spender = vetherPools2Addr()
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
        setApproveFlag(true)
        const tokenContract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
        const fromAcc = account.address
        const spender = vetherPools2Addr()
        const value = totalSupply.toString()
        await tokenContract.methods.approve(spender, value).send({ from: fromAcc })
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
        setStakeFlag(true)
        console.log(stakeFlag)
        const poolContract = new window.web3.eth.Contract(vetherPools2Abi(), vetherPools2Addr())
        const tx = await poolContract.methods.stake(amountVeth, amountEth, ETH).send({
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

    const onAsset0amountChange = e => {
        setAmount0(e.target.value)
        console.log(amount0)
    }

    const onAsset1amountChange = e => {
        setAmount1(e.target.value)
        console.log(amount1)
    }

    return (
        <>
            <h2 style={{ fontStyle: 'italic' }}>Select asset to stake.</h2>
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
                        ? <Input size={'large'} style={{ marginBottom: 10 }} onChange={onAsset0amountChange} value={amount0} suffix={asset0.symbol}/>
                        : <Input size={'large'} style={{ marginBottom: 10 }} disabled/>
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
                        <Input size={'large'} style={{ marginBottom: 10 }} onChange={onAsset1amountChange} value={amount1} suffix={asset1.symbol}/>
                    </Col>
                </Row>

                {amount0 > 0
                    ? <Button backgroundColor="transparent" onClick={stake}>ADD >></Button>
                    : <Button backgroundColor="transparent" disabled>ADD >></Button>
                }
                <Sublabel>ADD LIQUIDITY TO POOL</Sublabel>
            </>
            }

            {!loading &&
            <>
                {!approved &&
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
                }

                {approved && account.stakeUnits > 0 &&
                <>
                    <hr/>
                    <h2>POOLED LIQUIDITY</h2>
                    <p>Assets you have pooled.</p>
                    <Row type="flex" justify="center" style={{ textAlign: "center", marginBottom: '2.66rem' }}>
                        <Col xs={8}>
                            <span style={{ fontSize: '0.8rem', display: 'block', margin: '0 0 0.5rem 0', color: '#97948e' }}>ASSET SHARE</span>
                            <span style={{ fontSize: '1.2rem', display: 'block', margin: '0' }}>{currency(account.vetherShare, 0, 5, 'VETH')}
                                <Tooltip placement="right" title="The amount of asset in pool you own at this moment.">
                                    &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, marginBottom: 0 }} />
                                </Tooltip>
                            </span>
                        </Col>
                        <Col xs={8}>
                            <span style={{ fontSize: '0.8rem', display: 'block', margin: '0 0 0.5rem 0', color: '#97948e' }}>ASSET SHARE</span>
                            <span style={{ fontSize: '1.2rem', display: 'block', margin: '0' }}>{currency(account.assetShare, 0, 5, 'ETH')}
                                <Tooltip placement="right" title="The amount of asset in pool you own at this moment.">
                                    &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, marginBottom: 0 }} />
                                </Tooltip>
                            </span>
                        </Col>
                        <Col xs={8}>
                            <span style={{ fontSize: '0.8rem', display: 'block', margin: '0 0 0.5rem 0', color: '#97948e' }}>POOL SHARE</span>
                            <span style={{ fontSize: '1.2rem', display: 'block', margin: '0' }}>{account.stakeUnits.toFixed(2)}%
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
    const poolContract = new window.web3.eth.Contract(vetherPools2Abi(), vetherPools2Addr())

    const assets = [
        {
            name: 'Vether',
            symbol: '$VETH'
        },
        {
            name: 'Ether',
            symbol: 'Ξ'
        }
    ]

    const [unstakeAssetSet, setUnstakeAssetSet] = useState(assets[0])
    const [unstakeAssetAmount, setUnstakeAssetAmount] = useState(0)
    const [unstakeAssetTx, setUnstakeAssetTx] = useState(undefined)
    const [unstakeAssetFlag, setUnstakeAssetFlag] = useState(false)
    const [unstakeAssetDone, setUnstakeAssetDone] = useState(false)

    const [unstakeProportionAmount, setUnstakeProportionAmount] = useState(0)
    const [unstakeProportionTx, setUnstakeProportionTx] = useState(undefined)
    const [unstakeProportionFlag, setUnstakeProportionFlag] = useState(false)
    const [unstakeProportionDone, setUnstakeProportionDone] = useState(false)


    const { Option } = Select

    const getLink = (tx) => {
        return getEtherscanURL().concat('tx/').concat(tx)
    }

    const unstakeAsset = async () => {
        const toVether = unstakeAssetSet.name === 'Vether'
        setUnstakeAssetFlag(true)
        const tx = await poolContract.methods.unstakeExactAsymmetric(
            Web3.utils.toWei(unstakeAssetAmount.toString()),
            ETH, toVether).send({ from: account.address })
        setUnstakeAssetTx(tx.transactionHash)
        setUnstakeAssetDone(true)
    }

    const unstakeProportion = async () => {
        setUnstakeProportionFlag(true)
        const tx = await poolContract.methods.unstake(
            unstakeProportionAmount,
            ETH).send({ from: account.address })
        setUnstakeProportionTx(tx.transactionHash)
        setUnstakeProportionDone(true)
    }

    const onUnstakeAssetChange = (value) => {
        setUnstakeAssetSet(value)
    }

    const onAssetAmountChange = (value) => {
        if (isNaN(value)) {
            return
        }
        setUnstakeAssetAmount(value)
    }

    const onProportionAmountChange = (value) => {
        if (isNaN(value)) {
            return
        }
        setUnstakeProportionAmount(value)
    }

    return (
        <>
            <h2>REMOVE LIQUIDITY</h2>
            <h2 style={{ fontStyle: 'italic' }}>Choose asset to unstake.</h2>
            {(account.stakeUnits > 0) &&
            <>
                <Row style={{ marginBottom: '2.66rem' }}>
                    <Col span={24}>
                        <LabelGrey display={'block'} style={{ marginBottom: '2.2rem', fontStyle: 'italic' }}>Choose an asset you wish to remove. Remove either just desired amount of single one or both assets at once in equal proportion.</LabelGrey>
                        <Label display="block" style={{marginBottom: '0.55rem'}}>Asset Amount</Label>

                        <Row>
                            <Col xs={13} sm={13} lg={7}>
                                <InputNumber
                                    size="large"
                                    className="forceHandleWrap"
                                    min={0}
                                    autoFocus="true"
                                    onChange={onAssetAmountChange}
                                    style={{ width: "calc(100% - 116px)", borderRight: 'none', borderRadius: '4px 0 0 4px' }}
                                    step={0.1}
                                    defaultValue="0"
                                />
                                <Select
                                    size={'large'}
                                    defaultValue={unstakeAssetSet.name}
                                    className="borderLessLeft"
                                    onChange={onUnstakeAssetChange}
                                    style={{ minWidth: '83px' }}
                                >
                                    {assets.map((asset, index) => {
                                        return(
                                            <Option value={index} key={asset.name}>{asset.name}</Option>
                                        )
                                    })}
                                </Select>
                            </Col>

                            <Col xs={11} sm={11} lg={17} style={{ marginTop: '-3px' }}>
                                {unstakeAssetAmount > 0
                                    ? <Button backgroundColor="transparent" onClick={unstakeAsset}>REMOVE >></Button>
                                    : <Button backgroundColor="transparent" disabled>REMOVE >></Button>
                                }
                                <Sublabel margin={0}>REMOVE SINGLE ASSET</Sublabel>
                                {unstakeAssetFlag &&
                                    <>
                                        {!unstakeAssetDone &&
                                        <LoadingOutlined style={{ marginLeft: 20, fontSize: 15 }} />
                                        }
                                        {unstakeAssetDone &&
                                        <>
                                            <a href={getLink(unstakeAssetTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>VIEW TRANSACTION -></a>
                                        </>
                                        }
                                    </>
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row>
                    <Col xs={24} sm={13} xl={7}>
                        <Label display="block" style={{ marginBottom: '0.55rem' }}>Equal Proportion</Label>
                            <Col span={13} style={{ paddingLeft: 6, marginRight: 23 }}>
                                <Slider
                                    min={0}
                                    max={100}
                                    onChange={onProportionAmountChange}
                                    value={typeof unstakeProportionAmount === 'number' ? unstakeProportionAmount : 0}
                                    step={1}
                                />
                            </Col>
                            <Col span={2}>
                                <InputNumber
                                    min={0}
                                    max={100}
                                    size="large"
                                    onChange={onProportionAmountChange}
                                    style={{ marginBottom: 10 }}
                                    step={0.1}
                                    formatter={value => `${value}%`}
                                    parser={value => value.replace('%', '')}
                                    defaultValue="0"
                                    value={unstakeProportionAmount}
                                />
                            </Col>
                    </Col>
                    <Col xs={24} sm={11} xl={17} style={{ paddingTop: 30 }}>
                        {unstakeProportionAmount > 0
                            ? <Button backgroundColor="transparent" onClick={unstakeProportion}>REMOVE >></Button>
                            : <Button backgroundColor="transparent" disabled>REMOVE >></Button>
                        }
                        <Sublabel margin={0}>REMOVE PROPORTION</Sublabel>
                        {unstakeProportionFlag &&
                        <>
                            {!unstakeProportionDone &&
                            <LoadingOutlined style={{ marginLeft: 20, fontSize: 15 }} />
                            }
                            {unstakeProportionDone &&
                            <>
                                <a href={getLink(unstakeProportionTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>VIEW TRANSACTION -></a>
                            </>
                            }
                        </>
                        }
                    </Col>
                </Row>
            </>
            }
        </>
    )
}

export const UpgradeDialog = () => {

    const context = useContext(Context)

    const [account, setAccount] = useState(
        {
            address: '', vethBalance: '', ethBalance: '',
            stakeUnits: '', vetherStaked: '', assetStaked: '',
            vetherShare: '', assetShare: '', roi: ''
        })

    const [connected, setConnected ] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        connect()
        console.log(account)
        // eslint-disable-next-line
    }, [])

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
            const contract = await new web3.eth.Contract(vetherAbi(), vetherAddr())
            const ethBalance = convertFromWei(await web3.eth.getBalance(account))
            const vethBalance = convertFromWei(await contract.methods.balanceOf(account).call())

            const poolContract = new web3.eth.Contract(vetherPoolsAbi(), vetherPoolsAddr())
            let stakeData = await poolContract.methods.getMemberStakeData(account, ETH).call()

            let poolData = await poolContract.methods.poolData(ETH).call()
            let poolShare = calcShare(getBN(stakeData.stakeUnits), getBN(poolData.poolUnits), getBN(poolData.asset), getBN(poolData.vether))

            let memberROI = await poolContract.methods.getMemberROI(account, ETH).call()

            const accountData = {
                'address': account,
                'vethBalance': vethBalance,
                'ethBalance': ethBalance,
                'stakeUnits': (stakeData.stakeUnits / poolData.poolUnits) * 100,
                'vetherStaked': convertFromWei(stakeData.vether),
                'assetStaked': convertFromWei(stakeData.asset),
                'vetherShare': convertFromWei(poolShare.vether),
                'assetShare': convertFromWei(poolShare.asset),
                "roi": (+memberROI)
            }
            setAccount(accountData)
            context.setContext({ "accountData": accountData })
        }
    }

    const upgrade = async () => {
        const poolContract = new window.web3.eth.Contract(vetherPoolsAbi(), vetherPoolsAddr())
        await poolContract.methods.upgrade(vetherPools2Addr()).send({ from: account.address })
    }

    return (
        <>
            <h2>UPGRADE TO BETA 2</h2>
            <p>Move your liquidity from the beta V1 pool.</p>
            {loading &&
                <LoadingOutlined style={{ mnarginBottom: 0 }} />
            }
            {connected && !loading &&
                <>
                    {account.stakeUnits > "0" &&
                        <>
                            <Button backgroundColor="transparent" onClick={upgrade}>UPGRADE >></Button>
                            <Sublabel>MOVE ALL YOUR LIQUIDITY</Sublabel>
                        </>
                    }
                    {!account.stakeUnits > "0" &&
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