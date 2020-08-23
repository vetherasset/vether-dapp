import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import { Row, Col, Radio, Input, Select } from 'antd'
import { Button, Label, LabelGrey, Sublabel } from "../components"
import { convertFromWei } from '../../common/utils'

export const Donations = () => {

    const [ connected, setConnected ] = useState(null)
    const [ accountData, setAccountData ] = useState(null)
    const [ currency ] = useState('Eth')
    const [ devData, setDevData ] = useState(null)

    const { Option } = Select

    useEffect(() => {
        connect()
        // eslint-disable-next-line
    })

    const connect = async () => {
        const accountConnected = (await window.web3.eth.getAccounts())[0]
        if(accountConnected) {
            const accounts = await window.web3.eth.getAccounts()
            const address = accounts[0]
            loadAccountData(address)
            setConnected(true)
        } else {
            setConnected(false)
        }
    }

    const loadAccountData = async (address) => {
        const accountConnected = (await window.web3.eth.getAccounts())[0]
        if(accountConnected) {
            const ethBalance = convertFromWei(await window.web3.eth.getBalance(address))
            const accountData = {
                address: address,
                ethBalance: ethBalance
            }
            setAccountData(accountData)
        }
    }

    const devs = [
        {
            name: 'strictly_scarce',
            address: '0x109ab1440fCEEAdbb1c49fbD29f0d3eF653eD0ec',
            about: 'Author, contract developer and deployer, dapp developer'
        },
        {
            name: 'ylwghst',
            address: '0x05c111014A6FAFca2714CeE52e7f3a6c1c246073',
            about: 'Dapp developer, front-end dev, infrastructure maintainer'
        }
    ]

    const onDevDataInputChange = (value) => {
        setDevData(devs[value])
    }

    const sums = [ 0.2, 0.5, 1, 3 ]
    const [sumValue, setSumValue] = useState(sums[1])
    const [sumRadioValue, setSumRadioValue] = useState(sums[1])
    const [sumInputValue, setSumInputValue] = useState("")

    const onSumRadioChange = e => {
        setSumInputValue("")
        setSumValue(e.target.value)
        setSumRadioValue(e.target.value)
    }

    const onSumInputChange = e => {
        setSumRadioValue(null)
        setSumValue(e.target.value)
        setSumInputValue(e.target.value)
    }

    const donate = async () => {
        const accountConnected = (await window.web3.eth.getAccounts())[0]
        if(accountConnected) {
            const value = sumValue.toFixed(5)
            await window.web3.eth.sendTransaction({
                from: accountData.address,
                to: devData.address,
                value: Web3.utils.toWei(value, 'ether')
            })
        }
    }

    return (
        <>
            <h1>DONATE NOW</h1>
            <p>Support ongoing development by donating to developers.</p>
            <Row span={24}>
                <Col xl={12}>
                    <Label display="block" style={{ marginBottom: '0' }}>Amount</Label>
                    <LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>Select your desired amount.</LabelGrey>
                    <Col xs={24} xl={24} style={{ marginBottom: '1.33rem' }}>
                        <Radio.Group value={sumRadioValue} onChange={onSumRadioChange} style={{ marginBottom: '1.33rem' }}>
                            {sums.map((sum) => {
                                return(
                                        <Radio.Button value={sum} size="large">{sum}&nbsp;{ currency === 'Eth' ? 'Ξ' : currency }</Radio.Button>
                                )
                            })}
                        </Radio.Group>
                        <span style={{ fontSize: '1rem', display: 'block', paddingLeft: '55px' }}>or enter any amount</span>
                        <Input size={'medium'} style={{ marginBottom: 10, maxWidth: '247px' }} value={sumInputValue} placeholder={'Your custom amount'} onChange={onSumInputChange} suffix={ currency === 'Eth' ? 'Ξ' : currency } />
                    </Col>
                    <Label display="block" style={{ marginBottom: '0' }}>Developer</Label>
                    <LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>Choose a developer you wish to donate to.</LabelGrey>
                    <Row>
                        <Col xl={12} style={{paddingRight: '21px'}}>
                            <Select size={'large'} style={{ width: '100%', marginBottom: '1.33rem' }} placeholder="Select a developer" onChange={onDevDataInputChange}>
                                {devs.map((dev, index) => {
                                    return(
                                        <Option value={index}>{dev.name}</Option>
                                    )
                                })}
                            </Select>
                        </Col>
                        <Col xl={12} style={{ marginTop: '-3px' }}>
                            {connected && sumValue > 0 && devData
                                ? <Button backgroundColor="transparent" onClick={donate}>DONATE >></Button>
                                : <Button backgroundColor="transparent" disabled>DONATE >></Button>
                            }
                            <Sublabel>DONATE TO THIS DEV</Sublabel>
                        </Col>
                    </Row>
                    <Row>
                        <Col xl={24}>
                            {devData &&
                            <>
                                <h3>{devData.name}</h3>
                                <p>{devData.about}</p>
                            </>
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}

export default Donations
