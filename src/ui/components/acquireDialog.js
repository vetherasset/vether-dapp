import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import Web3 from "web3"

import { vetherAddr, vetherAbi, uniSwapAddr, uniSwapAbi, getEtherscanURL } from '../../client/web3.js'
import { convertFromWei, currency } from '../../common/utils'

import { Row, Col, Input, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { LabelGrey, Button, Sublabel, Colour, Text } from '../components'

export const AcquireDialog = () => {

    const context = useContext(Context)
    const [account, setAccount] = useState(
        { address: '', vethBalance: '', ethBalance: '', uniBalance: '', uniSupply: '' })
    const [connected, setConnected] = useState(false)

    const [loaded, setLoaded] = useState(null)
    const [burnEthFlag, setBurnEthFlag] = useState(null)
    const [ethTx, setEthTx] = useState(null)
    const [currentBurn, setCurrentBurn] = useState(1)

    const notSpendAmount = 0
    const spendable = (account.ethBalance - notSpendAmount).toPrecision(4) < 0 ?
        0 : (account.ethBalance - notSpendAmount).toPrecision(4)

    const [amount, setAmount] = useState({ toSpend: 0 })

    useEffect(() => {
        connect()
    })

    const connect = async () => {
        const accountConnected = (await window.web3.eth.getAccounts())[0]
        if(accountConnected){
            const accounts = await window.web3.eth.getAccounts()
            const address = accounts[0]
            const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
            context.accountData ? getAccountData() : loadAccountData(contract, address)
            const day = await contract.methods.currentDay().call()
            const era = 1
            const currentBurn = convertFromWei(await contract.methods.mapEraDay_UnitsRemaining(era, day).call())
            setCurrentBurn(currentBurn)
            setConnected(true)
        }
    }

    const getAccountData = async () => {
        setAccount(context.accountData)
    }

    const loadAccountData = async (contract_, address) => {
        const ethBalance = convertFromWei(await window.web3.eth.getBalance(address))
        const vethBalance = convertFromWei(await contract_.methods.balanceOf(address).call())
        const exchangeContract = new window.web3.eth.Contract(uniSwapAbi(), uniSwapAddr())
        const uniBalance = convertFromWei(await exchangeContract.methods.balanceOf(address).call())
        const uniSupply = convertFromWei(await exchangeContract.methods.totalSupply().call())
        const accountData = {
            address: address,
            vethBalance: vethBalance,
            ethBalance: ethBalance,
            uniBalance: uniBalance,
            uniSupply: uniSupply
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

    const onInputAmountChange = e => {
        setAmount({ toSpend: e.target.value })
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
                    <Input size={'large'} style={{ marginBottom: 10 }} onChange={onInputAmountChange} value={amount.toSpend} placeholder={amount.toSpend} suffix={'Ξ'}/>
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