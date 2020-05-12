import React, { useState, useEffect } from 'react'

import Web3 from 'web3';
import { vetherAddr, vetherAbi, infuraAPI } from '../../client/web3.js'

import { Row, Col } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { LabelGrey, Label, Center, Text } from '../components'


export const EraTable = () => {
    const [loaded, setLoaded] = useState(null)
    const [counter, setCounter] = React.useState(null);
    const [timer, setTimer] = React.useState(null);
    const [eraData, setEraData] = useState(
        { era: '', day: '', emission: '', currentBurn: '', nextDay: '', nextEra: '', nextEmission: '' })

    useEffect(() => {

        const loadBlockchainData = async () => {
            const web3_ = new Web3(new Web3.providers.HttpProvider(infuraAPI()))            
            const contract_ = new web3_.eth.Contract(vetherAbi(), vetherAddr())
            const emission_ = await contract_.methods.emission().call()
            const day_ = await contract_.methods.currentDay().call()
            const era_ = await contract_.methods.currentEra().call()
            const nextDay_ = await contract_.methods.nextDayTime().call()
            const nextEra_ = await contract_.methods.nextEraTime().call()
            const nextEmission_ = await contract_.methods.getNextEraEmission().call()
            const secondsToGo = getSecondsToGo(nextDay_)

            var currentBurn_
            currentBurn_ = await contract_.methods.mapEraDay_UnitsRemaining(era_, day_).call()
            setCounter(secondsToGo)

            setEraData({
                era: era_, day: day_,
                emission: convertToNumber(emission_),
                currentBurn: convertToNumber(currentBurn_),
                nextDay: nextDay_, nextEra: convertToDate(nextEra_),
                nextEmission: convertToNumber(nextEmission_)
            })
            setLoaded(true)
        }
        loadBlockchainData()
        // eslint-disable-next-line
    }, [])

    function convertToNumber(number) {
        return number / 1000000000000000000
    }

    function convertToDate(date) {
        return new Date(1000 * date).toLocaleDateString("en-gb")
    }

    function convertToTime(date) {
        return new Date(1000 * date).toLocaleTimeString("en-gb")
    }  

    function getSecondsToGo(date) {
        const time = (Date.now() / 1000).toFixed()
        const seconds = (date - time)
        return seconds
    }

    const dayFinish = () => {
        if (counter === 0) {
            return "WAITING TO CHANGE DAYS"
        } else {
            return "END OF DAY"
        }
    }

    React.useEffect(() => {
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

    function prettify(amount) {
        const number = Number(amount)
        var parts = number.toPrecision(8).replace(/\.?0+$/, '').split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    return (
        <div>
            {!loaded && 
            <div>
                <Row style={{ paddingTop: 100, paddingBottom: 100 }}>
                    <LoadingOutlined style={{marginLeft:20, fontSize:30}}/>
                </Row>
            </div>
            }
            {loaded && 
            <div>
            <Center><Text size={30} margin={"20px 0px 0px"}>{prettify(eraData.emission)} VETH</Text></Center>
            <Center><LabelGrey margin={"0px 0px 20px"}>TO BE EMITTED TODAY</LabelGrey></Center>

            <Center><Text size={40} margin={"0px 0px"}>{timer}</Text></Center>
            <Center><LabelGrey margin={"0px 0px 20px"}>{dayFinish()}</LabelGrey></Center>

            <Center><Label margin={"0px 0px"}>{prettify(eraData.currentBurn)} ETH</Label></Center>
            <Center><LabelGrey margin={"0px 0px 20px"}>TOTAL VALUE BURNT TODAY</LabelGrey></Center>
                <br></br>
            <Row>
                <Col xs={21} sm={11}>
                    <Row>
                        <Col xs={10}>
                            <LabelGrey>CURRENT ERA: </LabelGrey>
                        </Col>
                        <Col xs={14}>
                            <Label>{eraData.era}</Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={10}>
                            <LabelGrey>CURRENT DAY: </LabelGrey>
                        </Col>
                        <Col xs={14}>
                            <Label>{eraData.day}</Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={10}>
                            <LabelGrey>CURRENT EMISSION: </LabelGrey>
                        </Col>
                        <Col xs={14}>
                            <Label>{eraData.emission}</Label><Text size={14}> VETH (per day)</Text>
                        </Col>
                    </Row>

                </Col>
                <Col xs={21} sm={13}>
                    <Row>
                        <Col xs={10}>
                            <LabelGrey>NEW DAY: </LabelGrey>
                        </Col>
                        <Col xs={14}>
                            <Label>{convertToTime(eraData.nextDay)}</Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={10}>
                            <LabelGrey>HALVING DATE: </LabelGrey>
                        </Col>
                        <Col xs={14}>
                            <Label>{eraData.nextEra}</Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={10}>
                            <LabelGrey>NEXT EMISSION: </LabelGrey>
                        </Col>
                        <Col xs={14}>
                            <Label>{prettify(eraData.nextEmission)}</Label><Text size={14}> VETH (per day)</Text>
                        </Col>
                    </Row>
                </Col>
            </Row>
            </div>
            }
        </div>
    )
}