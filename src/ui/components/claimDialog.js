import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import '@metamask/legacy-web3'
import { vetherAddr, vetherAbi, getEtherscanURL } from '../../client/web3.js'
import { convertFromWei, getSecondsToGo, getBN, currency } from '../../common/utils'

import { Row, Col, ConfigProvider, Select, Tooltip } from 'antd'
import { QuestionCircleOutlined, InfoCircleOutlined, CheckCircleOutlined, LoadingOutlined, FireFilled } from '@ant-design/icons'
import { Sublabel, Button, Colour, LabelGrey } from '../components'

export const ClaimDialog = () => {

    const { Option } = Select

    const context = useContext(Context)

    const [account, setAccount] = useState(
        { address: '', vethBalance: '', ethBalance: '', uniBalance:'', uniSupply:'' })
    const [eraData, setEraData] = useState(
        { era: '', day: '', emission: '', currentBurn: '', nextDay: '', nextEra: '', nextEmission: '' })
    const [daysAsOptions, setDaysAsOptions] = useState(null)
    const [daysLoaded, setDaysLoaded] = useState(false)
    const [userData, setUserData] = useState(
        { era: 1, day: undefined })

    const [claimAmt, setClaimAmt] = useState(null)
    const [txHash, setTxHash] = useState(null)

    const [loaded, setLoaded] = useState(null)

    const [checkFlag, setCheckFlag] = useState(null)
    const [claimFlag, setClaimFlag] = useState(null)

    useEffect(() => {
        connect()
        // eslint-disable-next-line
    }, [])

    const connect = async () => {
        const accountConnected = (await window.web3.eth.getAccounts())[0];
        if(accountConnected){
            const accounts = await window.web3.eth.getAccounts()
            const address = accounts[0]
            const vether = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
            context.accountData ? getAccountData() : loadAccountData(vether, address)
            const eraData = await context.eraData ? await getEraData() : await loadEraData(vether)
            getDays(eraData, vether, address)
            setDaysLoaded(true)
        }
    }

    const getAccountData = async () => {
        setAccount(context.accountData)
    }

    const loadAccountData = async (contract, address) => {
        const ethBalance = convertFromWei(await window.web3.eth.getBalance(address))
        const vethBalance = convertFromWei(await contract.methods.balanceOf(address).call())
        const accountData = {
            address: address,
            vethBalance: vethBalance,
            ethBalance: ethBalance
        }
        setAccount(accountData)
        context.setContext({'accountData':accountData})
    }

    const getEraData = async () => {
        setEraData(context.eraData)
        return context.eraData
    }

    const loadEraData = async (contract) => {
        const emission = convertFromWei(await contract.methods.emission().call())
        const day = await contract.methods.currentDay().call()
        const era = await contract.methods.currentEra().call()
        const nextDay = await contract.methods.nextDayTime().call()
        const nextEra = await contract.methods.nextEraTime().call()
        const nextEmission = convertFromWei(await contract.methods.getNextEraEmission().call())
        const currentBurn = convertFromWei(await contract.methods.mapEraDay_UnitsRemaining(era, day).call())
        const secondsToGo = getSecondsToGo(nextDay)

        const eraData = {
            'era': era, 'day':day,
            'nextEra':nextEra, 'nextDay':nextDay,
            'emission': emission, 'nextEmission':nextEmission,
            "currentBurn": currentBurn,
            'secondsToGo':secondsToGo
        }
        setEraData({
            eraData
        })
        context.setContext(eraData)
        return eraData
    }

    const getDays = async (eraData_, contract_, account_) => {
        let era = userData.era
        let days = []
        let options = []
        let daysContributed = await contract_.methods.getDaysContributedForEra(account_, userData.era).call()
        for (let j = daysContributed-1; j >= 0; j--) {
            let day = +(await contract_.methods.mapMemberEra_Days(account_, userData.era, j).call())
            if (era < +eraData_.era || (era >= +eraData_.era && day <= +eraData_.day)) {
                const share = getBN(await contract_.methods.getEmissionShare(era, day, account_).call())
                if (share > 0) {
                    days.push(day)
                    options.push(<Option key={j} value={day}>{day}</Option>)
                    setDaysAsOptions(options)
                }
            }
        }
        context.setContext({arrayDays:days})
    }

    const reloadDays = async () => {
        const accountConnected = (await window.web3.eth.getAccounts())[0];
        if(accountConnected) {
            if (!daysLoaded) {
                const accounts = await window.web3.eth.getAccounts()
                const address = accounts[0]
                const vether = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
                context.accountData ? getAccountData() : loadAccountData(vether, address)
                const eraData = await context.eraData ? await getEraData() : await loadEraData(vether)
                getDays(eraData, vether, context.accountData.address)
                setDaysLoaded(true)
            }
        }
    }

    const onEraChange = era => {
        setUserData({ era: era, day: undefined })
        setDaysLoaded(false)
        setDaysAsOptions(null)
        setCheckFlag(false)
    }

    const onDayChange = day => {
        setUserData({ era: userData.era, day: day })
        setCheckFlag(false)
    }

    const checkShare = async () => {
        const vether = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
        const share = getBN(await vether.methods.getEmissionShare(userData.era, userData.day, account.address).call())
        setClaimAmt(convertFromWei(share))
        setCheckFlag(true)
    }

    const claimShare = async () => {
        setClaimFlag(true)
        const vether = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
        const tx = await vether.methods.withdrawShare(userData.era, userData.day).send({ from: account.address })
        setLoaded(true)
        setTxHash(tx.transactionHash)
        setClaimAmt(0)
    }

    const getLink = () => {
        return getEtherscanURL().concat('tx/').concat(txHash)
    }

    const customizeRenderEmpty = () => (
        <>
            <div className="ant-empty ant-empty-normal ant-empty-small">
                <div className="ant-empty-image">
                    <FireFilled style={{ fontSize: 32, color: '#fff' }} />
                </div>
                <p className="ant-empty-description">No Shares</p></div>
        </>
    )

    return (
        <>
            <Row>
                <Col xs={6} sm={4}>
                    <Select size={'large'} style={{ width: '100%' }} placeholder="Select era" onChange={onEraChange} value={userData.era} suffix={'Era'}>
                        <Option value='1'>1</Option>
                        <Option value='2'>2</Option>
                    </Select>
                </Col>
                <Col xs={6} sm={4} style={{ marginLeft: 10, marginRight: 20 }}>
                    <ConfigProvider renderEmpty={customizeRenderEmpty}>
                            <Select onDropdownVisibleChange={reloadDays}
                                      size={'large'}
                                      style={{ width: '100%' }}
                                      placeholder="Select a day"
                                      onChange={onDayChange}
                                      value={userData.day}
                            >{daysAsOptions}</Select>
                    </ConfigProvider>
                </Col>

                <Col xs={8} sm={8} style={{ marginTop: '-3px' }}>
                    {daysLoaded && userData.day > 0
                        ? <Button backgroundColor="transparent" onClick={checkShare}>CHECK >></Button>
                        : <Button backgroundColor="transparent" disabled>CHECK >></Button>
                    }
                    <Sublabel>CHECK FOR CLAIM</Sublabel>
                </Col>
            </Row>

            {checkFlag &&
            <>
                <Row>
                    {claimAmt > 0 &&
                    <>
                        <Col xs={8} sm={8} style={{ marginLeft: 0, marginRight: 30 }}>
									<span style={{
                                        display: 'block',
                                        fontSize: '32px',
                                        marginTop: '7px'
                                    }}>
										{currency(claimAmt, 0, 2, 'VETH')}
                                        <Tooltip placement="right" title="Your total share in the Era and Day to claim.">
										&nbsp;<QuestionCircleOutlined style={{color:Colour().grey, marginBottom: '0'}}/>
									</Tooltip>
									</span>
                            <LabelGrey style={{ fontStyle: 'italic' }}>Your unclaimed Vether on this day.</LabelGrey>
                            {String(userData.day) === String(eraData.day) && !claimFlag && !loaded &&
                            <>
                                <p>Please wait for the day to finish first before claiming.</p>
                            </>
                            }
                        </Col>
                    </>
                    }

                    {claimAmt > 0 && String(userData.day) !== String(eraData.day) &&
                    <>
                        <Col xs={8} sm={6}>
                            <Button
                                backgroundColor="transparent"
                                onClick={claimShare}>
                                CLAIM >>
                            </Button>
                            <Sublabel>CLAIM VETHER</Sublabel>

                            {claimFlag && !loaded &&
                            <>
                                <LoadingOutlined/>
                            </>
                            }
                        </Col>
                    </>
                    }

                    {claimAmt <= 0 &&
                    <>
                        {!claimFlag && !loaded &&
                        <>
                            <LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>
                                <InfoCircleOutlined />&nbsp; Sorry, there's&nbsp;nothing to claim.
                            </LabelGrey>
                        </>
                        }
                        {claimFlag && loaded &&
                        <>
                            <Col xs={8} sm={8} style={{ marginLeft: 0, marginRight: 30 }}>
                                <>
                                    <LabelGrey display={'block'} style={{ fontStyle: 'italic' }}>
                                        <CheckCircleOutlined style={{ marginBottom: '0' }}/>&nbsp;Your share on this day has been successfully claimed.
                                    </LabelGrey>
                                    <a href={getLink()} rel="noopener noreferrer" title="Transaction Link"
                                       target="_blank" style={{
                                        color: Colour().gold
                                    }}
                                    >
                                        VIEW TRANSACTION ->
                                    </a>
                                </>
                            </Col>
                        </>
                        }
                    </>
                    }

                </Row>
            </>
            }
        </>
    )
}
