import React, { useEffect, useState, useContext } from 'react';
import { Context } from '../../context'
import axios from 'axios'

import emissionArray from '../../data/emissionArray.json';
// import claimArray from '../../data/claimArray.json';
// import holderArray from '../../data/holderArray.json';

import '../../App.css';
import { Row, Col } from 'antd'
import { H2, Text, Gap, Click, Colour } from '../components'
import { ChartEther, ChartClaim, ChartEmission, ChartDistro, ChartPie } from './chart'

const Stats = () => {

    const context = useContext(Context)
    // eslint-disable-next-line
    const [loaded, setLoaded] = useState('false')
    const [chartData, setChartData] = useState({ claimArray: [], holderArray: [] })

    useEffect(() => {
        if (loaded==='false') {
            context.chartData ? getChartData() : loadChartData()
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
        const response2 = await axios.get(baseURL+apiKey+'&limit=1000')
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
    return (
        <div>
            <Gap />
            <H2>STATS</H2>
            <br></br>
            <Text size={16} bold={'TRUE'}>Stats for the Vether Economy</Text><br></br>
            {(loaded==='true') &&
                <div>
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
                    <Row>
                        <Col>
                            <ChartEmission emissionArray={emissionArray} />
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