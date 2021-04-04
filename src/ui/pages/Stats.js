import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../../context'
import axios from 'axios'
import defaults from "../../common/defaults"
import Breakpoint from 'react-socks'

import Web3 from 'web3'
import { vetherAddr, vetherAbi } from '../../client/web3.js'
import { convertFromWei, getSecondsToGo } from '../../common/utils'

import emissionArray from '../../data/emissionArray.json'

import '../../App.less'
import { Row, Col } from 'antd'
import { Click, Colour } from '../components'
import { ChartStyles, ChartEther, ChartClaim, ChartEmission, ChartData, ChartDistro, ChartPie } from '../components/charts'
import { LoadingOutlined } from '@ant-design/icons'

const Stats = () => {

    const context = useContext(Context)

    const [loaded, setLoaded] = useState(false)
    const [loadedClaims, setLoadedClaims] = useState(false)

    const [chartData, setChartData] = useState({ claimArray: [], holderArray: [], holdersCount: 0 })
    const [claimData, setClaimData] = useState(null)
    const [eraData, setEraData] = useState(
        { era: '', day: '', emission: '', currentBurn: '', nextDay: '', nextEra: '', nextEmission: '' })
    const [emissionData, setEmissionData] = useState(
        { balance: '', totalBurnt: '', totalEmitted: '', totalFees: '' })

    useEffect(() => {
        if (!loaded) {
            loadData()
        }
        // eslint-disable-next-line
    }, [loaded, chartData, context.chartData])

    const loadData = async () => {
        context.eraData ? getEraData() : loadEraData()
        context.emissionData ? getEmissionData() : loadEmissionData()
        context.claimData ? getClaimData() : await loadClaimData()
        context.chartData ? getChartData() : loadChartData()
    }

    const getClaimData = async () => {
        setClaimData(context.claimData)
        setLoadedClaims(true)
        return context.claimData
    }

    const loadClaimData = async () => {
        const response = await axios.get('https://vether-stats-helper.herokuapp.com/')
        let claimData = response.data
        context.setContext({ 'claimData': claimData })
        setClaimData(claimData)
        setLoadedClaims(true)
        return claimData
    }

    const getChartData = () => {
        setChartData(context.chartData)
        setLoaded(true)
    }

    const loadChartData = async () => {

        const apiKey = process.env.REACT_APP_ETHPLORER_API
        const baseURL = 'https://api.ethplorer.io/getTopTokenHolders/'+vetherAddr()+'?apiKey='
        const response2 = await axios.get(baseURL + apiKey + '&limit=1000')
        let holderArray = response2.data
        const baseURL2 = 'https://api.ethplorer.io/getTokenInfo/'+vetherAddr()+'?apiKey='
        const response3 = await axios.get(baseURL2 + apiKey)
        let transfers = response3.data.transfersCount
        let holdersCount = response3.data.holdersCount
        const chartData = {
            holderArray: holderArray.holders,
            transfers: transfers,
            holdersCount: holdersCount,
        }

        setChartData(chartData)
        context.setContext({ 'chartData': chartData })
        setLoaded(true)
    }

    const getEraData = async () => {
        setEraData(context.eraData)
    }

    const loadEraData = async () => {
        const web3 = new Web3(new Web3.providers.HttpProvider(defaults.api.url))
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
        const web3 = new Web3(new Web3.providers.HttpProvider(defaults.api.url))
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

    const loadingStyles = {
        paddingTop: 200,
        paddingLeft: 150,
        fontSize: 32
    }

    console.log(chartData.holderArray.length)

    return (
        <div>
            <h1>STATS</h1>
            <span>Stats for the Vether Economy</span>
            <Row>
                {!loaded &&
                    <Col xs={24} lg={9} style={ChartStyles}>
                        <LoadingOutlined style={loadingStyles} />
                    </Col>
                }
                {loaded &&
                    <>
                        <Col xs={24} lg={9}>
                            <Breakpoint small down>
                                <ChartData eraData={eraData}
                                    emissionData={emissionData}
                                    holders={chartData.holdersCount - 1}
                                    transfers={chartData.transfers}
                                    size={12}
                                    style={{
                                        padding: '0 1rem'
                                    }}
                                />
                            </Breakpoint>
                            <Breakpoint medium up>
                                <ChartData eraData={eraData}
                                    emissionData={emissionData}
                                    holders={chartData.holdersCount - 1}
                                    transfers={chartData.transfers}
                                    size={14}
                                    style={{
                                        padding: '0 1rem'
                                    }}
                                />
                            </Breakpoint>
                        </Col>
                    </>
                }
                <Col xs={24} lg={15}>
                    {!loadedClaims &&
                    <>
                        <Col span={24} style={ChartStyles}>
                            <LoadingOutlined style={loadingStyles} />
                        </Col>
                    </>
                    }
                    {loadedClaims &&
                    <>
                        <Col span={24}>
                            <ChartEther claimArray={claimData} />
                        </Col>
                    </>
                    }
                </Col>
            </Row>
            <Row>
                {!loadedClaims &&
                    <>
                        <Col xs={24} xl={11} style={ChartStyles}>
                        </Col>
                        <Col xs={24} xl={11} style={ChartStyles}>
                            <LoadingOutlined style={loadingStyles} />
                        </Col>
                    </>
                }
                {loadedClaims &&
                    <>
                        <Col xs={24} xl={12}>
                            <ChartEmission emissionArray={emissionArray} />
                        </Col>
                        <Col xs={24} xl={12}>
                            <ChartClaim claimArray={claimData} />
                        </Col>
                    </>
                }
            </Row>
            <Row>
                {!loaded &&
                    <>
                        <Col xs={24} lg={15} style={ChartStyles}>
                            <LoadingOutlined style={loadingStyles} />
                        </Col>
                        <Col xs={24} lg={7} style={ChartStyles}>
                            <LoadingOutlined style={loadingStyles} />
                        </Col>
                    </>
                }
                {loaded &&
                    <>
                        <Col xs={24} lg={16}>
                            <ChartDistro holderArray={chartData.holderArray} />
                        </Col>
                        <Col xs={24} lg={8}>
                            <ChartPie holderArray={chartData.holderArray} />
                        </Col>
                    </>
                }
            </Row>

            <Click><a href='https://github.com/EverexIO/Ethplorer/wiki/Ethplorer-API' rel="noopener noreferrer" title="ETHPlorer link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> DATA FROM ETHPLORER -> </a></Click><br />
            <Click><a href='https://www.chartjs.org/' rel="noopener noreferrer" title="Chartjs link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> CHARTS FROM CHARTJS -> </a></Click>
        </div>
    )
}

export default Stats
