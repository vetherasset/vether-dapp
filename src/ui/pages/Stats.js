import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../context'
import axios from 'axios'

import Breakpoint from 'react-socks';

import Web3 from 'web3';
import { vetherAddr, vetherAbi, infuraAPI } from '../../client/web3.js'
import { convertFromWei, getSecondsToGo } from '../utils'

import emissionArray from '../../data/emissionArray.json';
// import claimArray from '../../data/claimArray.json';
// import holderArray from '../../data/holderArray.json';

import '../../App.css';
import { Row, Col } from 'antd'
import { H2, Text, Gap, Click, Colour } from '../components'
import { ChartEther, ChartClaim, ChartEmission, ChartData, ChartDistro, ChartPie } from './chart'

const Stats = () => {

    const context = useContext(Context)
    // eslint-disable-next-line
    const [loaded, setLoaded] = useState('false')
    const [chartData, setChartData] = useState({ claimArray: [], holderArray: [] })
    const [eraData, setEraData] = useState(
        { era: '', day: '', emission: '', currentBurn: '', nextDay: '', nextEra: '', nextEmission: '' })
    const [emissionData, setEmissionData] = useState(
        { balance: '', totalBurnt: '', totalEmitted: '', totalFees: '' })

    useEffect(() => {
        if (loaded === 'false') {
            context.chartData ? getChartData() : loadChartData()
            context.eraData ? getEraData() : loadEraData()
            context.emissionData ? getEmissionData() : loadEmissionData()
        }
        // eslint-disable-next-line
    }, [loaded, chartData, context.chartData])

    const getChartData = () => {
        setChartData(context.chartData)
        setLoaded('true')
    }
    const loadChartData = async () => {
        const response = await axios.get('https://raw.githubusercontent.com/vetherasset/vether-dapp/master/src/data/claimArray.json')
        let claimArray = response.data

        const apiKey = process.env.REACT_APP_ETHPLORER_API
        const baseURL = 'https://api.ethplorer.io/getTopTokenHolders/0x31Bb711de2e457066c6281f231fb473FC5c2afd3?apiKey='
        // console.log(baseURL + apiKey + '&limit=1000')
        const response2 = await axios.get(baseURL + apiKey + '&limit=1000')
        let holderArray = response2.data
        // console.log(holderArray)
        // console.log(claimArray)

        setChartData({
            claimArray: claimArray,
            holderArray: holderArray.holders,
        })
        context.setContext({
            'chartData': {
                'claimArray': claimArray,
                'holderArray': holderArray.holders,
            }
        })
        setLoaded('true')
        // console.log(loaded)
    }

    const getEraData = async () => {
        setEraData(context.eraData)
        // setCounter(context.eraData.secondsToGo)
    }

    const loadEraData = async () => {
        const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
        const contract = new web3.eth.Contract(vetherAbi(), vetherAddr())
        const emission = convertFromWei(await contract.methods.emission().call())
        const day = await contract.methods.currentDay().call()
        const era = await contract.methods.currentEra().call()
        const nextDay = await contract.methods.nextDayTime().call()
        const nextEra = await contract.methods.nextEraTime().call()
        const nextEmission = convertFromWei(await contract.methods.getNextEraEmission().call())
        const currentBurn = convertFromWei(await contract.methods.mapEraDay_UnitsRemaining(era, day).call())
        const secondsToGo = getSecondsToGo(nextDay)
        // setCounter(secondsToGo)
        setEraData({
            era: era, day: day,
            nextEra: nextEra, nextDay: nextDay,
            emission: emission, nextEmission: nextEmission,
            currentBurn: currentBurn,
            secondsToGo: secondsToGo
        })
        context.setContext({
            "eraData": {
                'era': era, 'day': day,
                'nextEra': nextEra, 'nextDay': nextDay,
                'emission': emission, 'nextEmission': nextEmission,
                "currentBurn": currentBurn,
                'secondsToGo': secondsToGo
            }
        })
    }

    const getEmissionData = () => {
        setEmissionData(context.emissionData)
    }
    const loadEmissionData = async () => {
        const web3 = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
        const contract = new web3.eth.Contract(vetherAbi(), vetherAddr())
        const totalSupply = 1000000
        const balance = convertFromWei(await contract.methods.balanceOf(vetherAddr()).call())
        const totalBurnt = convertFromWei(await contract.methods.totalBurnt().call())
        const totalFees = convertFromWei(await contract.methods.totalFees().call())
        const totalEmitted = +totalSupply - +balance + +totalFees
        setEmissionData({
            balance: balance,
            totalBurnt: totalBurnt,
            totalEmitted: totalEmitted,
            totalFees: totalFees
        })
        context.setContext({
            "emissionData": {
                'balance': balance,
                'totalBurnt': totalBurnt,
                "totalEmitted": totalEmitted,
                'totalFees': totalFees,
            }
        })
    }


    return (
        <div style={{ marginRight: -50 }}>
            <Gap />
            <H2>STATS</H2>
            <br></br>
            <Text size={16} bold={'TRUE'}>Stats for the Vether Economy</Text><br></br>
            {(loaded === "true") &&
                <div>
                    <Row>
                        <Col xs={24} lg={8}>
                            <Breakpoint small down>
                                <ChartData eraData={eraData}
                                    emissionData={emissionData}
                                    holders={chartData.holderArray.length - 1}
                                    size={12} />
                            </Breakpoint>
                            <Breakpoint medium up>
                                <ChartData eraData={eraData}
                                    emissionData={emissionData}
                                    holders={chartData.holderArray.length - 1}
                                    size={14} />
                            </Breakpoint>
                        </Col>
                        <Col xs={24} lg={16}>
                            <ChartEmission emissionArray={emissionArray} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} xl={12}>
                            <ChartEther claimArray={chartData.claimArray} />
                        </Col>
                        <Col xs={24} xl={12}>
                            <ChartClaim claimArray={chartData.claimArray} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} lg={16}>
                            <ChartDistro holderArray={chartData.holderArray} />
                        </Col>
                        <Col xs={24} lg={8}>
                            <ChartPie holderArray={chartData.holderArray} />
                        </Col>
                    </Row>
                </div>
            }
            <Click><a href='https://github.com/EverexIO/Ethplorer/wiki/Ethplorer-API' rel="noopener noreferrer" title="ETHPlorer link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> DATA FROM ETHPLORER -> </a></Click><br />
            <Click><a href='https://www.chartjs.org/' rel="noopener noreferrer" title="Chartjs link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> CHARTS FROM CHARTJS -> </a></Click>
            <Gap />
        </div>
    )
}

export default Stats