import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import { CSSTransitionGroup } from 'react-transition-group'
import defaults from "../../common/defaults"
import Web3 from "web3"
import '@metamask/legacy-web3'

import { vetherAddr, vetherAbi } from '../../client/web3.js'
import { convertFromWei, currency, getTxLink } from '../../common/utils'

import { Row, Col, Slider, InputNumber, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { LabelGrey, Button, Sublabel, Colour, Text, Label} from '../components'

export const AcquireDialog = () => {

    const context = useContext(Context)
    const [account, setAccount] = useState(
        { address: '', vethBalance: '', ethBalance: '', uniBalance: '', uniSupply: '' })
    const [connected, setConnected] = useState(false)

    const [loaded, setLoaded] = useState(null)
    const [burnEthFlag, setBurnEthFlag] = useState(null)
    const [ethTx, setEthTx] = useState(null)
    const [currentBurn, setCurrentBurn] = useState(0)

    const notSpendAmount = 0.06
    const spendable = (account.ethBalance - notSpendAmount).toPrecision(4) < 0 ?
        0 : (account.ethBalance - notSpendAmount).toPrecision(4)

    const [amount, setAmount] = useState({ toSpend: 0 })
    const [contributionAmt, setContributionAmt] = useState(0)

    useEffect(() => {
        connect()
    })

    useEffect(() => {
        loadBurnData()
        // eslint-disable-next-line
    }, [])

    const connect = async () => {
        const accountConnected = (await window.web3.eth.getAccounts())[0]
        if (accountConnected && !connected) {
            const accounts = await window.web3.eth.getAccounts()
            const address = accounts[0]
            context.accountData ? getAccountData() : loadAccountData(address)
            setConnected(true)
        }
    }

    const loadBurnData = async () => {
        const web3 = new Web3(new Web3.providers.HttpProvider(defaults.api.url))
        const vether = new web3.eth.Contract(vetherAbi(), vetherAddr())
        const day = await vether.methods.currentDay().call()
        const era = 2
        const currentBurn = convertFromWei(await vether.methods.mapEraDay_UnitsRemaining(era, day).call())
        setCurrentBurn(currentBurn)
    }

    const getAccountData = async () => {
        setAccount(context.accountData)
    }

    const loadAccountData = async (address) => {
        const web3 = new Web3(new Web3.providers.HttpProvider(defaults.api.url))
        const vether = new web3.eth.Contract(vetherAbi(), vetherAddr())
        const ethBalance = convertFromWei(await window.web3.eth.getBalance(address))
        const vethBalance = convertFromWei(await vether.methods.balanceOf(address).call())
        const accountData = {
            address: address,
            vethBalance: vethBalance,
            ethBalance: ethBalance
        }

        let spendable = ethBalance - notSpendAmount
        spendable = spendable < 0 ? 0 : spendable.toPrecision(4)

        setAccount(accountData)
        context.setContext({ 'accountData': accountData })
        setAmount({toSpend: spendable})
    }

    const setMaxAmount = async () => {
        let spendable = account.ethBalance - notSpendAmount
        spendable = spendable < 0 ? 0 : spendable.toPrecision(4)
        setAmount({ toSpend: spendable })
    }

    const onInputAmountChange = value => {
        if (isNaN(value)) {
            return
        }
        setAmount({toSpend: value})
    }

    const getVethValue = () => {
        let ethAmount = amount.toSpend < 0 ? 0 : amount.toSpend
        let value = (+ethAmount / (+ethAmount + +currentBurn)) * 1024
        value = value < 0 || isNaN(value) ? 0 : value
        return value
    }

    const burnEther = async () => {
        const burnAmount = Web3.utils.toWei(String(amount.toSpend), 'ether')
        setContributionAmt(Number(Web3.utils.fromWei(String((burnAmount/100)*5))))
        setBurnEthFlag('TRUE')
        const tx = await window.web3.eth.sendTransaction({
            from: account.address,
            to: vetherAddr(),
            value: String(burnAmount)
        })
        setEthTx(tx.transactionHash)
        setLoaded(true)
        const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
        loadAccountData(contract, account.address)
    }

    const contribute = async () => {
        if(account) {
            await window.web3.eth.sendTransaction({
                from: account.address,
                to: defaults.treasury.address,
                value: Web3.utils.toWei(String(contributionAmt))
            })
        }
    }

    return (
        <>
            <Row>
                <Col xs={11} sm={4}>
                    <InputNumber min={0}
                                 step={0.1}
                                 size={'large'}
                                 formatter={value => `${value}Ξ`}
                                 parser={value => value.replace('Ξ', '')}
                                 defaultValue={spendable}
                                 style={{ marginBottom: 10, width: '100%' }}
                                 onChange={onInputAmountChange}
                                 value={amount.toSpend}
                                 placeholder={amount.toSpend}
                    />
                    <br/>
                    <Button height={'25px'}
                            padding={'0 8px'}
                            backgroundColor={defaults.color.highlight}
                            style={{
                                color: defaults.color.dark,
                                fontSize: '13px',
                                transform: 'scale(0.8)',
                                marginLeft: '-4px',
                                marginBottom: '1.33rem'
                            }}
                            size={'small'}
                            onClick={setMaxAmount}
                    >
                        MAX
                    </Button>
                    <Tooltip placement="right" title="Set to the max spendable amount.">
                        &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, marginBottom: 0 }} />
                    </Tooltip>
                </Col>

                <Col xs={11} sm={5} style={{ marginLeft: '27px', marginTop: '-3px' }}>
                    {amount.toSpend > 0 && connected
                        ? <Button backgroundColor="transparent" onClick={burnEther}>BURN >></Button>
                        : <Button backgroundColor="transparent" disabled>BURN >></Button>
                    }
                    <Sublabel>BURN ETH TO ACQUIRE VETH</Sublabel>

                    {burnEthFlag &&
                        <>
                            {loaded &&
                            <>
                                <a href={getTxLink(ethTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: Colour().gold }}> VIEW TRANSACTION -> </a>
                            </>
                            }
                        </>
                    }
                </Col>

                <Col xs={24} sm={6} style={{ marginTop: '-3px' }}>
                    <Text size={32}>{currency(getVethValue(), 0, 2, 'VETH')}
                        <Tooltip placement="right" title="The amount of VETH you get is&nbsp;dependent on how much you burn, compared to how much everyone else burns.">
                            &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, marginBottom: 0 }} />
                        </Tooltip>
                    </Text>
                    <LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>Potential VETH value</LabelGrey>
                </Col>
            </Row>

            {burnEthFlag &&
                <CSSTransitionGroup
                    transitionName="easeIn"
                    transitionAppear={true}
                    transitionAppearTimeout={300}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <Row>
                        <Col xl={24} style={{ transition: 'display 0.6s cubic-bezier(0.85, 0, 0.15, 1)' }}>
                            <h2 style={{ marginBottom: 0, marginTop: '2.33rem' }}>Consider contribution to project treasury ...</h2>
                            <LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>Help us to develop new features and raise project awareness.</LabelGrey>
                            <Label display="block" style={{ marginBottom: '0' }}>Your Contribution</Label>
                            <Col>
                                <Col xs={24} sm={16} xl={10}>
                                    <Col span={15} style={{ paddingLeft: 6, marginRight: 23 }}>
                                        <Slider
                                            min={0}
                                            max={contributionAmt > 3 ? contributionAmt : 3}
                                            onChange={value => setContributionAmt(Number(value))}
                                            value={typeof contributionAmt === 'number' ? contributionAmt : 0}
                                            step={0.01}
                                        />
                                    </Col>
                                    <Col span={3}>
                                        <InputNumber
                                            min={0}
                                            formatter={value => `${value}Ξ`}
                                            parser={value => value.replace('Ξ', '')}
                                            style={{ margin: '0 16px' }}
                                            step={0.01}
                                            size={'large'}
                                            value={contributionAmt}
                                            onChange={value => setContributionAmt(value)}
                                        />
                                    </Col>
                                </Col>
                            </Col>
                            <Col>
                                <Col xs={24} xl={4} style={{
                                    marginTop: '-6px' }}>
                                    {contributionAmt > 0 && connected
                                        ? <Button backgroundColor="transparent" onClick={contribute}>CONTRIBUTE >></Button>
                                        : <Button backgroundColor="transparent" disabled>CONTRIBUTE >></Button>
                                    }
                                    <Sublabel style={{ marginBottom: '0' }}>SUBMIT CONTRIBUTION</Sublabel>
                                </Col>
                            </Col>
                        </Col>
                    </Row>
                </CSSTransitionGroup>
            }
        </>
    )
}
