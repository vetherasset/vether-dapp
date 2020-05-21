import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'
import Web3 from 'web3';

import { Row, Col } from 'antd'
import { LabelGrey, Center, Text } from '../components'

import { vetherAddr, vetherAbi, infuraAPI, getUniswapPriceEth } from '../../client/web3.js'
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

    useEffect(() => {
        context.priceData ? getPriceData() : loadPriceData()
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
                'priceToday': (currentPrice).toFixed(4),
                'priceHistorical': (historicalPrice).toFixed(3),
                'priceUniswap': (priceVetherEth).toFixed(3),
                'ethPrice': (priceEtherUSD).toFixed(2)
            }
        })
    }

    return (
        <div>
            <Row style={{paddingRight:50}}>
                <Col xs={2}>

                </Col>
                <Col xs={20}>

                    <Center><Text size={30} margin={"20px 0px 0px"}>{prettify(priceData.priceHistorical)} ETH | ${prettify(priceData.priceHistorical * priceData.ethPrice)}</Text></Center>
                    <Center><LabelGrey margin={"0px 0px 0px"}>HISTORICAL PRICE</LabelGrey></Center>
                    <Center><Text margin={"0px 0px"}>Based on all time burnt Ether</Text></Center>

                    <Center><Text size={30} margin={"20px 0px 0px"}>{prettify(priceData.priceUniswap)} ETH | ${prettify(priceData.priceUniswap * priceData.ethPrice)}</Text></Center>
                    <Center><LabelGrey margin={"0px 0px 0px"}>PRICE ON UNISWAP</LabelGrey></Center>
                    <Center><Text margin={"0px 0px"}>Based on Uniswap liquidity</Text></Center>
                </Col>
                <Col xs={2}>

                </Col>
            </Row>
        </div>
    )
}