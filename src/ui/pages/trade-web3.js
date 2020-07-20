import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import Web3 from 'web3'
import axios from 'axios'
import TimeAgo from 'react-timeago'

import { Row, Col, Table } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { Label, Colour, Text, Center } from '../components'

import { vetherAddr, vetherAbi, infuraAPI, getUniswapPriceEth, getUniswapDetails } from '../../client/web3.js'
import { getETHPrice } from '../../client/market.js'

import { prettify } from '../utils'

export const PoolStats = () => {

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
        loadPriceData()
        loadUniswapData()
        //eslint-disable-next-line
    }, [])


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

    const loadUniswapData = async () => {
        const uniswapBal = await getUniswapDetails()
        console.log(uniswapBal)
        setUniswapData(uniswapBal)
        context.setContext({
            "uniswapData": uniswapBal
        })
    }

    const poolStyles = {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: 6,
        borderColor: Colour().gold,
        marginBottom: '1.3rem',
        padding: '20px',
        backgroundColor: Colour().black,
    }

    const lineStyle = {
        borderLeft: '1px dashed',
        borderColor: '#97948e47',
        paddingLeft: 5
    }

    return (
        <>
            <Row type="flex" justify="center">
                <Col span={12}>
                    <Label display="block" style={{ marginBottom: '1.33rem' }}>Pooled Tokens</Label>
                    <div style={poolStyles}>
                        <Row>
                            <Col xs={12}>
                                <Text size={20} style={{ textAlign: 'left', display: 'block', margin: '0' }}>$VETH</Text>
                                <Center><Text size={30} color={Colour().white} margin={"20px 0px 5px 0px"}>{prettify(uniswapData.veth)}</Text></Center>
                                <Center><Text margin={"5px 0px 30px"}>${prettify(priceData.ethPrice * uniswapData.eth)}</Text></Center>
                            </Col>
                            <Col xs={12} style={lineStyle}>
                                <Text size={20} style={{ textAlign: 'left', display: 'block', margin: '0 0 0 15px' }}>ETH Ξ</Text>
                                <Center><Text size={30} color={Colour().white} margin={"20px 0px 5px 0px"}>{prettify(uniswapData.eth)}</Text></Center>
                                <Center><Text margin={"5px 0px 30px"}>${prettify(priceData.ethPrice * uniswapData.eth)}</Text></Center>
                            </Col>
                        </Row>
                    </div>
                </Col>
			</Row>
        </>
    )
}

export const TradeHistory = () => {

    const [tradeHistory, setTradeHistory] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() =>{
        loadData()
    }, [])

    const loadData = async() =>{
        const baseURL = 'https://api.blocklytics.org/pools/v1/trades/0x3696fa5ad6e5c74fdcbced9af74379d94c4b775a?key='
        const response = await axios.get(baseURL + process.env.REACT_APP_BLOCKLYTICS_API)
		let returnData = response.data.results
        setTradeHistory(returnData)
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
                const symbol = record.fromSymbol === 'WETH' ? 'ETH' : 'VETH'
                return (
                    <>
                        {(+record.fromAmount).toFixed(5)} {symbol}
                    </>
                )
            }
        },
        {
            title: 'Token Amount',
            key: 'toAmount',
            render: (record) => {
                const symbol = record.toSymbol === 'WETH' ? 'ETH' : 'VETH'
                return (
                    <>
                        {(+record.toAmount).toFixed(5)} {symbol}
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
                        <TimeAgo live={true} date={record.timestamp} />
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
            <h2>LAST TRADES</h2>
            {!loading &&
                <LoadingOutlined />
            }
            {loading &&
                <Table dataSource={tradeHistory} columns={columns} pagination={true} rowKey="id" />
            }
        </>
    )
}
