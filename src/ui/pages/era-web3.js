import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import Breakpoint from 'react-socks';

import Web3 from 'web3';
import { vetherAddr, vetherAbi, infuraAPI, getUniswapPriceEth } from '../../client/web3.js'
import { getETHPrice } from '../../client/market.js'
import { convertFromWei, getSecondsToGo, prettify } from '../utils'

import { Row, Col, Button, Progress } from 'antd'
import { ReloadOutlined } from '@ant-design/icons';
import { LabelGrey, Center, Text, Colour } from '../components'
import { BurnCard } from '../ui'

export const EraTable = (props) => {

    const context = useContext(Context)

    const small = (props.size === 'small') ? true : false

    const [loaded, setLoaded] = useState(false)
    const [counter, setCounter] = useState(null);
    const [timer, setTimer] = useState(null);
    const [eraData, setEraData] = useState(
        { era: '', day: '', emission: '', currentBurn: '', nextDay: '', nextEra: '', nextEmission: '', secondsToGo: 82400 })
    const [marketData, setMarketData] = useState(
        { priceUSD: '', priceETH: '', ethPrice: '' })

    useEffect(() => {
        if (!loaded) {
            loadBlockchainData()
            setLoaded(true)
            // console.log('starting')
        }
        // console.log('rendering again')
        // eslint-disable-next-line
    }, [loaded])

    const loadBlockchainData = async () => {
        context.eraData ? await getEraData() : await loadEraData()
        context.marketData ? await getMarketData() : await loadMarketData()
    }

    const getEraData = async () => {
        setEraData(context.eraData)
        setCounter(context.eraData.secondsToGo)
    }

    const loadEraData = async () => {
        // console.log('clicked')
        const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
        const contract = new web3.eth.Contract(vetherAbi(), vetherAddr())
        const emission = 2048
        const day = await contract.methods.currentDay().call()
        const era = 1
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

    const getMarketData = async () => {
        setMarketData(context.marketData)
    }
    const loadMarketData = async () => {
        const priceEtherUSD = await getETHPrice()
        const priceVetherEth = await getUniswapPriceEth()
        const priceVetherUSD = priceEtherUSD * priceVetherEth
        const marketData = {
            priceUSD: priceVetherUSD,
            priceETH: priceVetherEth,
            ethPrice: priceEtherUSD
        }
        setMarketData(marketData)
        context.setContext({ "marketData": marketData })
    }

    const dayFinish = () => {
        if (counter === 0) {
            return "WAITING TO CHANGE DAYS"
        } else {
            return "END OF DAY"
        }
    }

    const refresh = async () => {
        setEraData({
            era: 1, day: eraData.day,
            nextEra: eraData.nextEra, nextDay: eraData.nextDay,
            emission: eraData.emission, nextEmission: eraData.nextEmission,
            currentBurn: 0,
            secondsToGo: 0
        })
        await loadEraData()
    }

    useEffect(() => {
        counter >= 0 && setTimeout(() => updateTimer(), 1000);
        // eslint-disable-next-line
    }, [counter]);

    const updateTimer = () => {
        var measuredTime = new Date(null);
        measuredTime.setSeconds(counter);
        var MHSTime = measuredTime.toISOString().substr(11, 8);
        setCounter(counter - 1)
        setTimer(MHSTime)
    }

    const poolStyles = {
        borderWidth: '1px',
        // borderStyle: 'dashed',
        borderRadius: '100px',
        paddingLeft: 50,
        paddingRight: 50,
        backgroundColor: '#cc9300'
    }

    const buttonStyles = {
        color: Colour().gold,
        backgroundColor: Colour().dgrey,
        borderColor: Colour().dgrey,
    }

    return (
        <div>
            {/* {!loaded &&
                <div>
                    <Row style={{ paddingTop: 100, paddingBottom: 100 }}>
                        <LoadingOutlined style={{ marginLeft: 20, fontSize: 30 }} />
                    </Row>
                </div>
            } */}
            {loaded &&
                <div>
                    <Row>
                        <Col xs={24} sm={8}>
                            {/* <Center> */}
                            <Button id="emissionTimerRefreshBtn" nClick={refresh} style={buttonStyles}>
                                <ReloadOutlined style={{ color: Colour().gold}} />
                                REFRESH
                            </Button>
                            {/* </Center> */}
                        </Col>

                        <Col xs={24} sm={8}>
                            <div id="vetherEraTimer">
                                <Text size={40} margin={"0px 0px"}>{timer}</Text>
                            </div>
                            {!small &&
                                <>
                                    <Progress percent={(((82400 - eraData.secondsToGo) / 82400) * 100).toFixed(0)} strokeColor={Colour().gold} status="active" />
                                    <Center i>
                                        <LabelGrey margin={"10px 0px 20px"}>{dayFinish()}</LabelGrey>
                                    </Center>
                                </>
                            }
                        </Col>

                        <Col xs={24} sm={8}>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '3rem' }}>
                        <Col xs={24} sm={6}>
                        </Col>
                        {small &&
                            <Col xs={24} sm={12}>
                                <Center>
                                    <span style={{
                                        margin: '0 0 0',
                                        fontWeight: 'bold'
                                    }}>
                                        ERA 1, DAY {eraData.day}
                                    </span>
                                </Center>
                            </Col>
                        }
                        {!small &&
                            <Col xs={24} sm={12} style={poolStyles}>
                                <Center>
                                    <span style={{
                                        margin: '20px 0px 0px',
                                        color: '#000',
                                        fontWeight: 'bold'
                                    }}>
                                        ERA 1, DAY {eraData.day}
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
                                            {prettify(eraData.emission)} VETH
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
                                            {prettify(eraData.emission)} VETH
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
                        <Col xs={24} sm={6}>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 20 }}>
                        <Col xs={24} sm={8}>
                        </Col>
                        {!small &&
                            <BurnCard marketData={marketData} eraData={eraData} />
                        }
                        <Col xs={24} sm={8}>
                        </Col>
                    </Row>

                    {/* <Row>
                        <Col xs={21} sm={11}>
                            <Row>
                                <Col xs={24}>
                                    <LabelGrey>CURRENT ERA: </LabelGrey><br />
                                    <Label>{eraData.era}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={24}>
                                    <LabelGrey>CURRENT DAY: </LabelGrey><br />
                                    <Label>{eraData.day}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={24}>
                                    <LabelGrey>CURRENT EMISSION: </LabelGrey><br />
                                    <Label>{eraData.emission}</Label><Text size={14}> VETH (per day)</Text>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={21} sm={13}>
                            <Row>
                                <Col xs={24}>
                                    <LabelGrey>NEW DAY: </LabelGrey><br />
                                    <Label>{convertToTime(eraData.nextDay)} (local time)</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={24}>
                                    <LabelGrey>HALVING DATE: </LabelGrey><br />
                                    <Label>{convertToMonth(eraData.nextEra)}</Label>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={24}>
                                    <LabelGrey>NEXT EMISSION: </LabelGrey><br />
                                    <Label>{prettify(eraData.nextEmission)}</Label><Text size={14}> VETH (per day)</Text>
                                </Col>
                            </Row>
                        </Col>
                    </Row> */}
                </div>
            }
        </div>
    )
}
