import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import Web3 from 'web3';
import { vetherAddr, vetherAbi, infuraAPI } from '../../client/web3.js'
import { getETHPrice, getVETHPriceInEth } from '../../client/market.js'

import { Row, Col } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { LabelGrey, Label, Center, Text } from '../components'


export const EraTable = () => {

    const context = useContext(Context)

    const [loaded, setLoaded] = useState(null)
    const [counter, setCounter] = React.useState(null);
    const [timer, setTimer] = React.useState(null);
    const [eraData, setEraData] = useState(
        { era: '', day: '', emission: '', currentBurn: '', nextDay: '', nextEra: '', nextEmission: '' })

    const [marketData, setMarketData] = useState(
        { priceUSD: '', priceETH: '', ethPrice: '' })

    useEffect(() => {

        context.eraData ? getEraData() : loadEraData()
        context.marketData ? getMarketData() : loadMarketData()
        setLoaded(true)
        // eslint-disable-next-line
    }, [])

    const getEraData = async () => {
        setEraData(context.eraData)
        setCounter(context.eraData.secondsToGo)
    }

    const loadEraData = async () => {
        const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
        const contract = new web3.eth.Contract(vetherAbi(), vetherAddr())
        const emission = convertToNumber(await contract.methods.emission().call())
        const day = await contract.methods.currentDay().call()
        const era = await contract.methods.currentEra().call()
        const nextDay = await contract.methods.nextDayTime().call()
        const nextEra = await contract.methods.nextEraTime().call()
        const nextEmission = convertToNumber(await contract.methods.getNextEraEmission().call())
        const currentBurn = convertToNumber(await contract.methods.mapEraDay_UnitsRemaining(era, day).call())
        const secondsToGo = getSecondsToGo(nextDay)
        setCounter(secondsToGo)
        setEraData({
            era: era, day: day,
            nextEra: nextEra, nextDay: nextDay, 
            emission: emission, nextEmission: nextEmission,
            currentBurn: currentBurn,
            secondsToGo:secondsToGo
        })
        context.setContext({
            "eraData": {
                'era': era, 'day':day,
                'nextEra':nextEra, 'nextDay':nextDay, 
                'emission': emission, 'nextEmission':nextEmission,
                "currentBurn": currentBurn,  
                'secondsToGo':secondsToGo
            }
        })
    }

    const getMarketData = async () => {
        setMarketData(context.marketData)
    }
    const loadMarketData = async () => {
        const priceEtherUSD = await getETHPrice()
        const priceVetherEth = await getVETHPriceInEth()
        const priceVetherUSD = priceEtherUSD * priceVetherEth

        setMarketData({
            priceUSD: priceVetherUSD,
            priceETH: priceVetherEth,
            ethPrice: priceEtherUSD
        })
        context.setContext({
            "marketData": {
                'priceUSD': priceVetherUSD,
                'priceETH': priceVetherEth,
                "ethPrice": priceEtherUSD
            }
        })
    }

    function convertToNumber(number) {
        return number / 1000000000000000000
    }

    function convertToTime(date) {
        return new Date(1000 * date).toLocaleTimeString("en-gb")
    }

    function convertToMonth(date_) {
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const date = new Date(1000 * date_)
        let formatted_date = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()
        return formatted_date
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

    function convertEthtoUSD(ether) {
        return (ether * marketData.ethPrice).toFixed(3)
    }

    return (
        <div>
            {!loaded &&
                <div>
                    <Row style={{ paddingTop: 100, paddingBottom: 100 }}>
                        <LoadingOutlined style={{ marginLeft: 20, fontSize: 30 }} />
                    </Row>
                </div>
            }
            {loaded &&
                <div>
                    <Center><Text size={30} margin={"20px 0px 0px"}>{prettify(eraData.emission)} VETH</Text></Center>
                    <Center><LabelGrey margin={"0px 0px 20px"}>TO BE EMITTED TODAY</LabelGrey></Center>

                    <Center><Text size={40} margin={"0px 0px"}>{timer}</Text></Center>
                    <Center><LabelGrey margin={"0px 0px 20px"}>{dayFinish()}</LabelGrey></Center>

                    <Center><Label margin={"0px 0px"}>{prettify(eraData.currentBurn)} ETH | ${prettify(convertEthtoUSD(eraData.currentBurn))}</Label></Center>
                    <Center><LabelGrey margin={"0px 0px 20px"}>TOTAL VALUE BURNT TODAY</LabelGrey></Center>
                    <br></br>

                    <Center><Label margin={"0px 0px"}>{prettify((eraData.currentBurn / eraData.emission).toFixed(5))} ETH | ${prettify(convertEthtoUSD(eraData.currentBurn / eraData.emission))}</Label></Center>
                    <Center><LabelGrey margin={"0px 0px 20px"}>IMPLIED VALUE OF VETHER TODAY</LabelGrey></Center>
                    <br></br>
                    <Row>
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
                    </Row>
                </div>
            }
        </div>
    )
}