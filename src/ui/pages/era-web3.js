import React, { useState, useEffect } from 'react'
import axios from 'axios'

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

    const [marketData, setMarketData] = useState(
            { priceUSD: '', priceETH: '', ethPrice: '' })

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
            const totalSupply_ = await contract_.methods.totalSupply().call()

            var currentBurn_
            currentBurn_ = await contract_.methods.mapEraDay_UnitsRemaining(era_, day_).call()
            setCounter(secondsToGo)

            setEraData({
                era: era_, day: day_,
                emission: convertToNumber(emission_),
                currentBurn: convertToNumber(currentBurn_),
                nextDay: nextDay_, nextEra: nextEra_,
                nextEmission: convertToNumber(nextEmission_)
            })

            const balance_ = await contract_.methods.balanceOf(vetherAddr()).call()
            const totalBurnt_ = await contract_.methods.totalBurnt().call()
            const totalFees_ = await contract_.methods.totalFees().call()
            const totalEmitted_ = +totalSupply_ - +balance_ + +totalFees_

            const ethPrice_ = await getETHPrice()
            var priceETH_ = 0
            var priceUSD_ = 0

            if (totalEmitted_ === 0) {
                priceETH_ = (totalBurnt_ / emission_)
                priceUSD_ = priceETH_ * ethPrice_
            } else {
                priceETH_ = (totalBurnt_ / (totalEmitted_))
                priceUSD_ = priceETH_ * ethPrice_
            }

            setMarketData({
                priceUSD: priceUSD_,
                priceETH: priceETH_,
                ethPrice: ethPrice_
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
        return new Date(1000 * date).toLocaleDateString()
    }

    function convertToTime(date) {
        return new Date(1000 * date).toLocaleTimeString("en-gb")
    }  

    function convertToMonth(date_){
        const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
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

    const getETHPrice = async () => {
        // console.log(uniSwapAbi(), uniSwapAddr())
        // const exchangeContract = new web3_.eth.Contract(uniSwapAbi(), uniSwapAddr())
        // const ethBought = await exchangeContract.methods.getTokenToEthInputPrice('1000000000000000000').call()
        // console.log('ethBought', ethBought)
        // return 1/ethBought

        const ethPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        //console.log(ethPrice.data.ethereum.usd)
        return ethPrice.data.ethereum.usd
    }

    function convertToUSD(vether) {
        return (vether * marketData.priceUSD).toFixed(3)
    }

    function convertEthtoUSD(ether) {
        //console.log(ether, marketData.ethPrice, ether * marketData.ethPrice)
        return (ether * marketData.ethPrice).toFixed(3)
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

            <Center><Label margin={"0px 0px"}>{prettify(eraData.currentBurn)} ETH | ${prettify(convertEthtoUSD(eraData.currentBurn))}</Label></Center>
            <Center><LabelGrey margin={"0px 0px 20px"}>TOTAL VALUE BURNT TODAY</LabelGrey></Center>
                <br></br>

            <Center><Label margin={"0px 0px"}>{prettify((eraData.currentBurn/eraData.emission).toFixed(5))} ETH | ${prettify(convertEthtoUSD(eraData.currentBurn/eraData.emission))}</Label></Center>
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