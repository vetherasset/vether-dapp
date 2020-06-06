import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../context'
import axios from 'axios'

import Breakpoint from 'react-socks';

import Web3 from 'web3';
import { vetherAddr, vetherAbi, infuraAPI } from '../../client/web3.js'
import { convertFromWei, getSecondsToGo } from '../utils'
import { getETHPrice } from '../../client/market.js'

import emissionArray from '../../data/emissionArray.json';

import '../../App.css';
import { Row, Col } from 'antd'
import { H2, Text, Gap, Click, Colour } from '../components'
import { ChartStyles, ChartLoadingStyles, ChartEther, ChartClaim, ChartEmission, ChartData, ChartDistro, ChartPie, ChartPrice } from './chart'
import { LoadingOutlined } from '@ant-design/icons';

const Stats = () => {

    const context = useContext(Context)
    // eslint-disable-next-line
    const [loaded, setLoaded] = useState(false)
    const [chartData, setChartData] = useState({ claimArray: [], holderArray: [] })
    const [eraData, setEraData] = useState(
        { era: '', day: '', emission: '', currentBurn: '', nextDay: '', nextEra: '', nextEmission: '' })
    const [emissionData, setEmissionData] = useState(
        { balance: '', totalBurnt: '', totalEmitted: '', totalFees: '' })

    useEffect(() => {
        if (!loaded) {
            context.chartData ? getChartData() : loadChartData()
            context.eraData ? getEraData() : loadEraData()
            context.emissionData ? getEmissionData() : loadEmissionData()
        }
        // eslint-disable-next-line
    }, [loaded, chartData, context.chartData])

    const getChartData = () => {
        setChartData(context.chartData)
        setLoaded(true)
    }
    const loadChartData = async () => {
        const ethPrice = await getETHPrice()
        const response = await axios.get('https://raw.githubusercontent.com/vetherasset/vether-dapp/master/src/data/claimArray.json')
        let claimArray = response.data
        let dailyPriceData = claimArray.burns.map(item => ((item * ethPrice) / 2048).toFixed(2))
        let totalPriceData = claimArray.totals.map((item, i) => ((item * ethPrice) / (claimArray.vether[i])).toFixed(2))

        const apiKey = process.env.REACT_APP_ETHPLORER_API
        const baseURL = 'https://api.ethplorer.io/getTopTokenHolders/0x31Bb711de2e457066c6281f231fb473FC5c2afd3?apiKey='
        const response2 = await axios.get(baseURL + apiKey + '&limit=1000')
        let holderArray = response2.data
        const baseURL2 = 'https://api.ethplorer.io/getTokenInfo/0x31Bb711de2e457066c6281f231fb473FC5c2afd3?apiKey='
        const response3 = await axios.get(baseURL2 + apiKey)
        let transfers_ = response3.data.transfersCount

        const baseURL3 = 'https://api.blocklytics.org/pools/v0/liquidity/0x506D07722744E4A390CD7506a2Ba1A8157E63745/history?key='
        const response4 = await axios.get(baseURL3 + process.env.REACT_APP_BLOCKLYTICS_API)
        let uniswapData = response4.data
        let uniswapPrices = uniswapData.map((item) => ((item.eth_ending_balance / item.token_ending_balance) * ethPrice).toFixed(2))

        const chartData = {
            claimArray: claimArray,
            holderArray: holderArray.holders,
            transfers: transfers_,
            
            priceData: {
                daily: dailyPriceData,
                totals: totalPriceData,
                uniswapPrices: uniswapPrices,
                days:claimArray.days
            }
        }

        setChartData(chartData)
        context.setContext({ 'chartData': chartData })
        setLoaded(true)

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

    const loadingStyles = {
        paddingTop: 200,
        paddingLeft: 150,
        fontSize: 32
    }


    return (
        <div style={{ marginRight: -50 }}>
            <Gap />
            <H2>STATS</H2>
            <br></br>
            <Text size={16} bold={'TRUE'}>Stats for the Vether Economy</Text><br></br>
            <ChartEmissionPane />
            <ChartClaimPane />
            {/* {!loaded &&
                <Row>
                    <Col xs={24} lg={7} style={ChartStyles}>
                        <LoadingOutlined style={loadingStyles} />
                    </Col>
                </Row>
            } */}
            {loaded &&
                <div>
                    <ChartDataPane eraData={eraData} emissionData={emissionData} chartData={chartData} />
                    <ChartPricePane chartData={chartData}/>
                    <ChartPrice priceData={chartData.priceData} />
                </div>
            }
            
            


            {/* <div>
                    <Row>
                        <Col xs={24} lg={7} style={ChartStyles}>
                            <LoadingOutlined style={loadingStyles} />
                        </Col>
                        <Col xs={24} lg={15} style={ChartStyles}>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} xl={11} style={ChartStyles}>
                            <LoadingOutlined style={loadingStyles} />
                        </Col>
                        <Col xs={24} xl={11} style={ChartStyles}>
                            <LoadingOutlined style={loadingStyles} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} lg={15} style={ChartStyles}>
                            <LoadingOutlined style={loadingStyles} />
                        </Col>
                        <Col xs={24} lg={7} style={ChartStyles}>
                            <LoadingOutlined style={loadingStyles} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} style={ChartStyles}>
                            <LoadingOutlined style={loadingStyles} />
                        </Col>
                    </Row>
                </div> */}

            {loaded &&
                <div>
                    {/* <Row>
                        <Col xs={24} xl={12}>
                            <ChartEther claimArray={chartData.claimArray} />
                        </Col>
                        <Col xs={24} xl={12}>
                            <ChartClaim claimArray={chartData.claimArray} />
                        </Col>
                    </Row> */}
                    <Row>
                        <Col xs={24} lg={16}>
                            <ChartDistro holderArray={chartData.holderArray} />
                        </Col>
                        <Col xs={24} lg={8}>
                            <ChartPie holderArray={chartData.holderArray} />
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col xs={24}>
                            <ChartPrice
                                days={chartData.claimArray.days}
                                priceData={chartData.priceData}
                                uniswapPrices={chartData.uniswapPrices} />
                        </Col>
                    </Row> */}
                </div>
            }
            <Click><a href='https://github.com/EverexIO/Ethplorer/wiki/Ethplorer-API' rel="noopener noreferrer" title="ETHPlorer link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> DATA FROM ETHPLORER -> </a></Click><br />
            <Click><a href='https://www.chartjs.org/' rel="noopener noreferrer" title="Chartjs link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> CHARTS FROM CHARTJS -> </a></Click>
            <Gap />
        </div>
    )
}

export default Stats

const ChartEmissionPane = () => {

    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
    }, [])

    return (
        <>
            {!loaded &&
                <div>
                    <Row>
                        <Col xs={24} lg={15} style={ChartStyles}>
                            <LoadingOutlined style={ChartLoadingStyles} />
                        </Col>
                    </Row>
                </div>
            }
            {loaded &&
                <div>
                    <ChartEmission emissionArray={emissionArray} />
                </div>
            }
        </>
    )
}

const ChartDataPane = (props) => {

    return (
        <>
            <div>
                <Breakpoint small down>
                    <ChartData eraData={props.eraData}
                        emissionData={props.emissionData}
                        holders={props.chartData.holderArray.length - 1}
                        transfers={props.chartData.transfers}
                        size={12} />
                </Breakpoint>
                <Breakpoint medium up>
                    <ChartData eraData={props.eraData}
                        emissionData={props.emissionData}
                        holders={props.chartData.holderArray.length - 1}
                        transfers={props.chartData.transfers}
                        size={14} />
                </Breakpoint>
            </div>
        </>
    )
}

const ChartClaimPane = () => {

    const context = useContext(Context)

    const [loaded, setLoaded] = useState(false)
    const [claimData, setClaimData] = useState(null)

    useEffect(() => {
        if (!loaded) {
            context.claimData ? getClaimData() : loadClaimData()
        }
        // eslint-disable-next-line
    }, [loaded])

    const getClaimData = () => {
        setClaimData(context.claimData)
        setLoaded(true)
    }

    const loadClaimData = async () => {
        const response = await axios.get('https://raw.githubusercontent.com/vetherasset/vether-dapp/master/src/data/claimArray.json')
        let claimArray = response.data

        setClaimData(claimArray)
        context.setContext({ 'claimData': claimArray })
        setLoaded(true)
    }

    return (
        <>
            {!loaded &&
                <div>
                    <Row>
                        <Col xs={24} xl={11} style={ChartStyles}>
                            <LoadingOutlined style={ChartLoadingStyles} />
                        </Col>
                        <Col xs={24} xl={11} style={ChartStyles}>
                            <LoadingOutlined style={ChartLoadingStyles} />
                        </Col>
                    </Row>
                </div>
            }
            {loaded &&
                <div>
                    <Row>
                        <Col xs={24} xl={12}>
                            <ChartEther claimArray={claimData} />
                        </Col>
                        <Col xs={24} xl={12}>
                            <ChartClaim claimArray={claimData} />
                        </Col>
                    </Row>
                </div>
            }
        </>
    )
}

const ChartPricePane = () => {

    const context = useContext(Context)

    const [loaded, setLoaded] = useState(false)
    // const [uniswapData, setUniswapData] = useState(null)
    const [priceData, setPriceData] = useState(null)
    const [claimData, setClaimData] = useState(null)

    useEffect(() => {
        if (!loaded) {
            loadData()
        }
        // eslint-disable-next-line
    }, [loaded])

    const loadData = async () => {
        const uniswapData = await loadUniswapPrices()
        // context.claimData ? getClaimData() : getClaimData()
        console.log(uniswapData)
        context.priceData ? getPriceData() : await loadPriceData(uniswapData)

    }

    const loadUniswapPrices = async () => {

        const baseURL3 = 'https://api.blocklytics.org/pools/v0/liquidity/0x506D07722744E4A390CD7506a2Ba1A8157E63745/history?key='
        const response4 = await axios.get(baseURL3 + process.env.REACT_APP_BLOCKLYTICS_API)
        let uniswapData = response4.data
        // setUniswapData(uniswapData)
        return uniswapData
    }

    const getPriceData = () => {
        setPriceData(context.priceData)
        setLoaded(true)
    }

    const loadPriceData = async (uniswapData) => {
        const ethPrice = await getETHPrice()
        let dailyPriceData = context.claimArray?.burns.map(item => ((item * ethPrice) / 2048).toFixed(2))
        let totalPriceData = context.claimArray?.totals.map((item, i) => ((item * ethPrice) / (context.claimArray?.vether[i])).toFixed(2))
        let uniswapPrices = uniswapData.map((item) => ((item.eth_ending_balance / item.token_ending_balance) * ethPrice).toFixed(2))
        console.log(uniswapData)
        const priceData = {
            uniswapPrices: uniswapPrices,
            daily: dailyPriceData,
            totals: totalPriceData,
            days: context.claimArray?.days
        }

        setPriceData(priceData)
        context.setContext({ 'priceData': priceData })
        setLoaded(true)
    }

    const getClaimData = () => {
        setClaimData(context.claimData)
    }

    return (
        <>
            {!loaded &&
                <div>
                    <Row>
                        <Col xs={24} style={ChartStyles}>
                            <LoadingOutlined style={ChartLoadingStyles} />
                        </Col>
                    </Row>
                </div>
            }
            {loaded &&
                <div>
                    <Row>
                        <Col xs={24}>
                            <ChartPrice priceData={priceData} />
                        </Col>
                    </Row>
                </div>
            }
        </>
    )
}