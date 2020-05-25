import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import Web3 from 'web3';
import axios from 'axios'

import { Row, Col, Table } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { LabelGrey, Center, Text, Label } from '../components'
import { PoolCard } from '../ui'

import { vetherAddr, vetherAbi, infuraAPI, getUniswapPriceEth, getUniswapDetails } from '../../client/web3.js'
import { getETHPrice } from '../../client/market.js'
import {prettify} from '../utils'

export const TradeTable = () => {

    const context = useContext(Context)

    const [priceData, setPriceData] = useState({
        priceToday: "",
        priceHistorical: "",
        priceUniswap: "",
        ethPrice: ""
    })
    const [uniswapData, setUniswapData] = useState(
        { "eth": "", "veth": '' })

    useEffect(() => {
        context.priceData ? getPriceData() : loadPriceData()
        context.uniswapData ? getUniswapData() : loadUniswapData()
        // context.marketData ? getMarketData() : loadMarketData()
        //eslint-disable-next-line
    }, [])

    const getPriceData = () => {
        setPriceData(context.priceData)
    }

    const loadPriceData = async () => {
        const web3_ = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
        const contract_ = new web3_.eth.Contract(vetherAbi(), vetherAddr())
        const day_ = await contract_.methods.currentDay().call()
        const era_ = await contract_.methods.currentEra().call()
        const emission_ = await contract_.methods.emission().call()
        const currentBurn_ = await contract_.methods.mapEraDay_UnitsRemaining(era_, day_).call()
        const currentPrice = (currentBurn_ / emission_)

        const totalSupply_ = await contract_.methods.totalSupply().call()
        const balance_ = await contract_.methods.balanceOf(vetherAddr()).call()
        const totalBurnt_ = await contract_.methods.totalBurnt().call()
        const totalFees_ = await contract_.methods.totalFees().call()
        const totalEmitted_ = +totalSupply_ - +balance_ + +totalFees_
        const historicalPrice = (totalBurnt_ / totalEmitted_)

        const priceVetherEth = await getUniswapPriceEth()
        const priceEtherUSD = await getETHPrice()

        setPriceData({
            priceToday: (currentPrice).toFixed(4),
            priceHistorical: (historicalPrice).toFixed(3),
            priceUniswap: (priceVetherEth).toFixed(3),
            ethPrice: (priceEtherUSD).toFixed(2)
        })

        context.setContext({
            "priceData": {
                'priceEth': (currentPrice).toFixed(4),
                'priceHistorical': (historicalPrice).toFixed(3),
                'priceUniswap': (priceVetherEth).toFixed(3),
                'ethPrice': (priceEtherUSD).toFixed(2)
            }
        })
    }

    const getUniswapData = () => {
        setUniswapData(context.uniswapData)
    }

    const loadUniswapData = async () => {
        const uniswapBal = await getUniswapDetails()
        setUniswapData(uniswapBal)
        context.setContext({
            "uniswapData": uniswapBal
        })
    }

    return (
        <div>
            <Row style={{marginTop:20, marginBottom:20}}>
                <Col xs={2}>

                </Col>
                <Col xs={20}>
                        <Center><Text size={30} margin={"0px 0px 0px"}>${prettify(priceData.priceHistorical * priceData.ethPrice)}</Text></Center>
                        <Center><LabelGrey margin={"0px 0px 0px"}>HISTORICAL VALUE</LabelGrey></Center>

                        <Center><Text size={30} margin={"0px 0px 0px"}>${prettify(priceData.priceUniswap * priceData.ethPrice)}</Text></Center>
                        <Center><LabelGrey margin={"0px 0px 0px"}>PRICE ON UNISWAP</LabelGrey></Center>
                </Col>
                <Col xs={2}>

                </Col>
            </Row>
            <Row>
				<Col xs={24} sm={6}>
				</Col>
				    <PoolCard uniswapData={uniswapData} marketData={priceData}/>
				<Col xs={24} sm={6}>
				</Col>
			</Row>
        </div>
    )
}

export const HistoryTable = () => {

    const [tradeTable, setTradeTable] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() =>{
        loadData()
        console.log()
    }, [])

    const loadData = async() =>{
        const baseURL = 'https://api.blocklytics.org/pools/v0/trades/0x506D07722744E4A390CD7506a2Ba1A8157E63745?key='
        // const data = (new Date())
        // &fromDate=1590386548
        const response = await axios.get(baseURL + process.env.REACT_APP_BLOCKLYTICS_API + '&limit=50')
		let returnData = response.data.results
        console.log(returnData)
        console.log(new Date())
		// let returns = returnData.reduce((acc, item) => ((+acc + +item.D7_annualized)/2), 0)
        setTradeTable(returnData)
        setLoading(true)
    }

    const columns = [
        {
            title: 'TYPE',
            key: 'action',
            render: (record) => {
                return (
                    <div>
                        <Text size={14} bold={true}>{record.action}</Text>
                    </div>
                )
            }
        },
        {
            title: 'Quantity',
            key: 'quantity',
            render: (record) => {
                return (
                    <div>
                        <Text size={14}>{(+record.quantity).toFixed(2)}</Text>
                    </div>
                )
            }
        },
        {
            title: 'Slippage',
            key: 'slippage',
            render: (record) => {
                return (
                    <div>
                        <Text size={14}>{(+record.slippage * 100).toFixed(2)} %</Text>
                    </div>
                )
            }
        },
        {
            title: 'Time',
            key: 'timestamp',
            render: (record) => {
                return (
                    <div>
                        <Text size={14}>{record.timestamp}</Text>
                    </div>
                )
            }
        }
    ]

    const loadingStyles = {
        paddingTop: 20,
        paddingLeft: 20,
        fontSize:32
    }

    return(
        <div>
            <Label>Yesterday's Trade History</Label><br/>
            {!loading && 
                <LoadingOutlined  style={loadingStyles}/>
            }
            {loading && 
                <Table dataSource={tradeTable} columns={columns} pagination={false} rowKey="id"></Table>
            }
        </div>
    )
}