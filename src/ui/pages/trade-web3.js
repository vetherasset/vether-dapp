import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import Web3 from 'web3';
import axios from 'axios'
import TimeAgo from 'react-timeago'

import { Row, Col, Table } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { LabelGrey, Center, Text } from '../components'
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
            priceUniswap: (priceVetherEth),
            ethPrice: (priceEtherUSD).toFixed(2)
        })

        context.setContext({
            "priceData": {
                'priceEth': (currentPrice).toFixed(4),
                'priceHistorical': (historicalPrice).toFixed(3),
                'priceUniswap': (priceVetherEth),
                'ethPrice': (priceEtherUSD).toFixed(2)
            }
        })
    }

    const getUniswapData = () => {
        setUniswapData(context.uniswapData)
    }

    const loadUniswapData = async () => {
        const uniswapBal = await getUniswapDetails()
        console.log(uniswapBal)
        setUniswapData(uniswapBal)
        context.setContext({
            "uniswapData": uniswapBal
        })
    }

    return (
        <>
            <Row style={{marginTop:20, marginBottom:20}}>
                <Col xs={2}>
                </Col>
                <Col xs={20}>
                    <Center><Text size={30} margin={"0px 0px 0px"}>${prettify(priceData.priceUniswap * priceData.ethPrice)}</Text></Center>
                    <Center><LabelGrey margin={"0px 0px 0px"}>PRICE ON UNISWAP</LabelGrey></Center>
                    <br/>
                    <Center><Text size={30} margin={"0px 0px 0px"}>${prettify(priceData.priceHistorical * priceData.ethPrice)}</Text></Center>
                    <Center><LabelGrey margin={"0px 0px 0.7rem"}>HISTORICAL VALUE</LabelGrey></Center>
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
        </>
    )
}

export const HistoryTable = () => {

    const [tradeTable, setTradeTable] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() =>{
        loadData()
    }, [])

    const loadData = async() =>{
        const baseURL = 'https://api.blocklytics.org/pools/v1/trades/0x3696fa5ad6e5c74fdcbced9af74379d94c4b775a?key='

        const response = await axios.get(baseURL + process.env.REACT_APP_BLOCKLYTICS_API)
		let returnData = response.data.results
        console.log(returnData)
        setTradeTable(returnData)
        setLoading(true)
    }

    const columns = [
        {
            title: 'Swap',
            key: 'swap',
            render: (record) => {
                const fromSymbol = record.fromSymbol === 'WETH' ? 'ETH' : record.fromSymbol
                const toSymbol = record.toSymbol === 'WETH' ? 'ETH' : record.toSymbol
                return (
                    <>
                        {fromSymbol} for {toSymbol}
                    </>
                )
            }
        },
        {
            title: 'Token Amount',
            key: 'fromAmount',
            render: (record) => {
                return (
                    <>
                        {(+record.fromAmount).toFixed(5)} ETH
                    </>
                )
            }
        },
        {
            title: 'Token Amount',
            key: 'toAmount',
            render: (record) => {
                return (
                    <>
                        {(+record.toAmount).toFixed(5)} VETH
                    </>
                )
            }
        },
        {
            title: 'Time',
            key: 'timestamp',
            render: (record) => {
                return (
                    <>
                        <TimeAgo date={record.timestamp} />
                    </>
                )
            }
        },
        {
            title: 'Transaction',
            key: 'transaction',
            render: (record) => {
                const hash = record.transaction.substring(0,10)
                    + '...'
                    + record.transaction?.substring(record.transaction.length-8, record.transaction.length)
                return (
                    <>
                        <a href={`https://etherscan.io/tx/${record.transaction}`} rel="noopener noreferrer" title="Transaction Link" target="_blank">{hash}</a>
                    </>
                )
            }
        }
    ]

    return(
        <>
            <h2>Trade History</h2>
            {!loading && 
                <LoadingOutlined />
            }
            {loading && 
                <Table dataSource={tradeTable} columns={columns} pagination={true} rowKey="id" />
            }
        </>
    )
}
