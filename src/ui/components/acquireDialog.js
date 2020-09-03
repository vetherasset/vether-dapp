import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import Web3 from "web3"

import { vetherAddr, vetherAbi, getEtherscanURL } from '../../client/web3.js'
import {convertFromWei, currency } from '../../common/utils'

import { Row, Col, InputNumber, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { LabelGrey, Button, Sublabel, Colour, Text } from '../components'
import {infuraAPI} from "../../client/web3";

export const AcquireDialog = () => {

    const context = useContext(Context)
    const [account, setAccount] = useState(
        { address: '', vethBalance: '', ethBalance: '', uniBalance: '', uniSupply: '' })
    const [connected, setConnected] = useState(false)

    const [loaded, setLoaded] = useState(null)
    const [burnEthFlag, setBurnEthFlag] = useState(null)
    const [ethTx, setEthTx] = useState(null)
    const [currentBurn, setCurrentBurn] = useState(0)

    const notSpendAmount = 0
    const spendable = (account.ethBalance - notSpendAmount).toPrecision(4) < 0 ?
        0 : (account.ethBalance - notSpendAmount).toPrecision(4)

    const [amount, setAmount] = useState({ toSpend: 0 })

    useEffect(() => {
        connect()
    })

    useEffect(() => {
        loadBurnData()
        // eslint-disable-next-line
    }, [])

    const connect = async () => {
        const accountConnected = (await window.web3.eth.getAccounts())[0]
        if(accountConnected){
            const accounts = await window.web3.eth.getAccounts()
            const address = accounts[0]
            context.accountData ? getAccountData() : loadAccountData(address)
            setConnected(true)
        }
    }

    const loadBurnData = async () => {
        const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
        const vether = new web3.eth.Contract(vetherAbi(), vetherAddr())
        const day = await vether.methods.currentDay().call()
        const era = 1
        const currentBurn = convertFromWei(await vether.methods.mapEraDay_UnitsRemaining(era, day).call())
        setCurrentBurn(currentBurn)
    }

    const getAccountData = async () => {
        setAccount(context.accountData)
    }

    const loadAccountData = async (address) => {
        const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
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
        let value = (+ethAmount / (+ethAmount + +currentBurn)) * 2048
        value = value < 0 || isNaN(value) ? 0 : value
        return value
    }

    const burnEther = async () => {
        const burnAmount = Web3.utils.toWei(amount.toSpend, 'ether')
        setBurnEthFlag('TRUE')
        const tx = await window.web3.eth.sendTransaction({ from: account.address, to: vetherAddr(), value: burnAmount })
        setEthTx(tx.transactionHash)
        setLoaded(true)
        const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
        loadAccountData(contract, account.address)
    }

    const getLink = (tx) => {
        console.log(getEtherscanURL().concat('tx/').concat(tx))
        return getEtherscanURL().concat('tx/').concat(tx)
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
                    <Button
                        backgroundColor="transparent"
                        onClick={setMaxAmount}
                    >
                        {currency(spendable, 0, 5, 'ETH')}
                    </Button>
                    <Tooltip placement="right" title="This is your maximum spendable Ether.
					Hit the number to set it as amount to spend.">
                        &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, marginBottom: 0 }} />
                    </Tooltip>
                    <LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>Spendable ETH</LabelGrey>
                </Col>

                <Col xs={11} sm={6} style={{ marginLeft: '20px', marginTop: '-3px' }}>
                    {amount.toSpend > 0 && connected
                        ? <Button backgroundColor="transparent" onClick={burnEther}>BURN >></Button>
                        : <Button backgroundColor="transparent" disabled>BURN >></Button>
                    }
                    <Sublabel>BURN ETH TO ACQUIRE VETH</Sublabel>

                    {burnEthFlag &&
                    <>
                        {loaded &&
                        <>
                            <a href={getLink(ethTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{ color: Colour().gold }}> VIEW TRANSACTION -> </a>
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
        </>
    )
}