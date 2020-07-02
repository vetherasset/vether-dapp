import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../context'
import axios from 'axios'

import Breakpoint from 'react-socks';

import Web3 from 'web3';
import { vetherAddr, vetherAbi, uniSwapAddr, infuraAPI } from '../../client/web3.js'
import { convertFromWei, getSecondsToGo } from '../utils'
import { getETHPrice } from '../../client/market.js'

import emissionArray from '../../data/emissionArray.json';

import '../../App.less';
import { Row, Col } from 'antd'
import { Click, Colour } from '../components'
import { ChartStyles, ChartEther, ChartClaim, ChartEmission, ChartData, ChartDistro, ChartPie, ChartPrice } from './chart'
import { LoadingOutlined } from '@ant-design/icons';

const Stats = () => {

    const context = useContext(Context)
    // eslint-disable-next-line
    const [loaded, setLoaded] = useState(false)
    const [loadedPrice, setLoadedPrice] = useState(false)
    const [loadedClaims, setLoadedClaims] = useState(false)

    const [chartData, setChartData] = useState({ claimArray: [], holderArray: [] })
    const [claimData, setClaimData] = useState(null)
    const [priceData, setPriceData] = useState(null)
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
        const claimArray = context.claimData ? getClaimData() : await loadClaimData()
        context.chartData ? getChartData() : loadChartData()
        context.priceData ? getPriceData() : loadPriceData(claimArray)
    }

    const getClaimData = async () => {
        setClaimData(context.claimData)
        setLoadedClaims(true)
        return context.claimData
    }

    const loadClaimData = async () => {
        const response = await axios.get('https://raw.githubusercontent.com/vetherasset/vether-dapp/master/src/data/claimArray.json')
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

        const chartData = {
            holderArray: holderArray.holders,
            transfers: transfers,
        }

        setChartData(chartData)
        context.setContext({ 'chartData': chartData })
        setLoaded(true)
    }

    const getPriceData = async () => {
        setPriceData(context.priceData)
        setLoadedPrice(true)
    }

    const loadPriceData = async (claimArray) => {

        const ethPrice = await getETHPrice()

        let dailyPriceData = claimArray?.burns?.map(item => ((item * ethPrice) / 2048).toFixed(2))
        let totalPriceData = claimArray?.totals?.map((item, i) => ((item * ethPrice) / (claimArray?.vether[i])).toFixed(2))

        const baseURL3 = 'https://api.blocklytics.org/pools/v0/liquidity/'+uniSwapAddr()+'/history?key='
        const response4 = await axios.get(baseURL3 + process.env.REACT_APP_BLOCKLYTICS_API)
        let uniswapData = response4.data
        let uniswapPrices = uniswapData.map((item) => ((item.eth_ending_balance / item.token_ending_balance) * ethPrice).toFixed(2))

        const priceData = {
            uniswapPrices: uniswapPrices,
            daily: dailyPriceData,
            totals: totalPriceData,
            days: claimArray?.days
        }

        context.setContext({ 'priceData': priceData })
        setPriceData(priceData)
        setLoadedPrice(true)
    }

    const getEraData = async () => {
        setEraData(context.eraData)
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

    const loadingStyles = {
        paddingTop: 200,
        paddingLeft: 150,
        fontSize: 32
    }

    return (
        <div style={{ marginRight: -50 }}>
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
                                    holders={chartData.holderArray.length - 1}
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
                                    holders={chartData.holderArray.length - 1}
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
                    <ChartEmission emissionArray={emissionArray} />
                </Col>
            </Row>
            <Row>
                {!loadedClaims &&
                    <>
                        <Col xs={24} xl={11} style={ChartStyles}>
                            <LoadingOutlined style={loadingStyles} />
                        </Col>
                        <Col xs={24} xl={11} style={ChartStyles}>
                            <LoadingOutlined style={loadingStyles} />
                        </Col>
                    </>
                }
                {loadedClaims &&
                    <>
                        <Col xs={24} xl={12}>
                            <ChartEther claimArray={claimData} />
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
            <Row>
                {!loadedPrice &&
                    <>
                        <Col xs={24} lg={23} style={ChartStyles}>
                            <LoadingOutlined style={loadingStyles} />
                        </Col>
                    </>
                }
                {loadedPrice &&
                    <>
                        <Col xs={24} style={{ display: 'none'}}>
                            <ChartPrice
                                days={priceData.days}
                                priceData={priceData}
                                uniswapPrices={priceData.uniswapPrices}
                            />
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
