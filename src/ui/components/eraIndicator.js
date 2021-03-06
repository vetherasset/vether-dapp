import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import defaults from "../../common/defaults"
import Breakpoint from 'react-socks'

import Web3 from 'web3'
import {vetherAddr, vetherAbi } from '../../client/web3.js'
import { convertFromWei, getSecondsToGo, currency } from '../../common/utils'

import { Row, Col, Progress } from 'antd'
import { LabelGrey, Center, Text, Colour } from '../components'

export const EraIndicator = (props) => {

    const context = useContext(Context)

    const small = (props.size === 'small')

    const [loaded, setLoaded] = useState(false)
    const [counter, setCounter] = useState(null)
    const [timer, setTimer] = useState(null)
    const [eraData, setEraData] = useState(
        { era: '', day: '', emission: '', currentBurn: '', nextDay: '', nextEra: '', nextEmission: '', secondsToGo: 82400 })

    useEffect(() => {
        if (!loaded) {
            loadBlockchainData()
            setLoaded(true)
        }
        // eslint-disable-next-line
    }, [loaded])

    const loadBlockchainData = async () => {
        loadEraData()
    }

    const loadEraData = async () => {
        const web3 = new Web3(new Web3.providers.HttpProvider(defaults.api.url))
        const contract = new web3.eth.Contract(vetherAbi(), vetherAddr())
        const emission = Web3.utils.fromWei(await contract.methods.emission().call())
        const day = await contract.methods.currentDay().call()
        const era = await contract.methods.currentEra().call()
        const nextDay = await contract.methods.nextDayTime().call()
        const nextEra = await contract.methods.nextEraTime().call()
        const nextEmission = convertFromWei(await contract.methods.getNextEraEmission().call())
        const currentBurn = convertFromWei(await contract.methods.mapEraDay_UnitsRemaining(era, day).call())
        const secondsToGo = getSecondsToGo(nextDay)
        setCounter(secondsToGo)
        const eraData = {
            era: era, day: day,
            nextEra: nextEra, nextDay: nextDay,
            emission: emission, nextEmission: nextEmission,
            currentBurn: currentBurn,
            secondsToGo: secondsToGo
        }

        setEraData(eraData)
        context.setContext({ "eraData": eraData })
    }

    const dayFinish = () => {
        if (counter === 0) {
            return "WAITING TO CHANGE DAYS"
        } else {
            return "END OF DAY"
        }
    }

    useEffect(() => {
        if (counter >= 0) {
            setTimeout(() => updateTimer(), 1000)
        }
        // eslint-disable-next-line
    }, [counter])

    const updateTimer = () => {
        let measuredTime = new Date(null)
        measuredTime.setSeconds(counter)
        let MHSTime = measuredTime.toISOString().substr(11, 8)
        setCounter(counter - 1)
        setTimer(MHSTime)
    }

    const poolStyles = {
        borderWidth: '1px',
        borderRadius: '100px',
        paddingLeft: 50,
        paddingRight: 50,
        backgroundColor: '#cc9300'
    }

    return (
        <>
            {loaded &&
            <>
                <Row type="flex" justify="center">
                    <Col xs={24} sm={8}>
                        <div id="vetherEraTimer">
                            <Text size={40} margin={"0px 0px"}>{timer}</Text>
                        </div>
                        {!small &&
                        <>
                            <Progress percent={Number((((82400 - eraData.secondsToGo) / 82400) * 100).toFixed(0))} strokeColor={Colour().gold} status="active" />
                            <Center i>
                                <LabelGrey margin={"10px 0px 20px"}>{dayFinish()}</LabelGrey>
                            </Center>
                        </>
                        }
                    </Col>
                </Row>
                <Row type="flex" justify="center" style={{ marginBottom: '3rem' }}>
                    {small &&
                    <Col xs={24} sm={12}>
                        <Center>
                                    <span style={{
                                        margin: '0 0 0',
                                        fontWeight: 'bold'
                                    }}>
                                        ERA {eraData.era}, DAY {eraData.day}
                                    </span>
                        </Center>
                    </Col>
                    }
                    {!small &&
                    <Col xs={24} sm={12} style={poolStyles}>
                        <Center>
                                    <span style={{
                                        margin: '20px 0px 0px',
                                        color: '#402f00',
                                        fontWeight: 'bold'
                                    }}>
                                        ERA {eraData.era}, DAY {eraData.day}
                                    </span>
                        </Center>
                        <Breakpoint medium up>
                            <Center>
                                <Text
                                    size={48}
                                    margin={"1.3rem 0"}
                                    style={{
                                        lineHeight: '3rem',
                                        textAlign: 'center'
                                    }}
                                >
                                    {currency(eraData.emission, 0, 2, 'VETH')}
                                </Text>
                            </Center>
                        </Breakpoint>
                        <Breakpoint small down>
                            <Center>
                                <p style={{
                                    fontSize: '32px',
                                    margin: '10px 0 10px',
                                    lineHeight: '2.3rem',
                                    textAlign: 'center',
                                    fontWeight: 'bold'
                                }}>
                                    {currency(eraData.emission, 0, 2, 'VETH')}
                                </p>
                            </Center>
                        </Breakpoint>
                        <Center>
                                    <span
                                        style={{
                                            margin: '0 0 20px',
                                            color: '#402f00',
                                            textAlign: 'center',
                                            fontWeight: 'bold'
                                        }}>TO BE EMITTED TODAY</span>
                        </Center>
                    </Col>
                    }
                </Row>
            </>
            }
        </>
    )
}
