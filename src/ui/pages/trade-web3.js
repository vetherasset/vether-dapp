import React, { useState, useEffect } from 'react'
import Web3 from 'web3';

import { Row, Col } from 'antd'
import { LabelGrey, Center, Text } from '../components'

import { vetherAddr, vetherAbi, infuraAPI, getUniswapPriceEth } from '../../client/web3.js'
import { getETHPrice } from '../../client/market.js'

export const TradeTable = () => {
    const [marketData, setMarketData] = useState({
        priceToday:"",
        priceHistorical:"",
        priceUniswap:"",
        ethPrice:""
    })

    useEffect(() => {
        loadBlockchainData()
    }, [])

	const loadBlockchainData = async () => {
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
        
        console.log(currentPrice, historicalPrice, priceVetherEth, priceEtherUSD)

        setMarketData({ 
            priceToday: (currentPrice).toFixed(4), 
            priceHistorical: (historicalPrice).toFixed(3), 
            priceUniswap: (priceVetherEth).toFixed(3), 
            ethPrice: (priceEtherUSD).toFixed(2) })
    }
    
    function prettify(amount) {
        const number = Number(amount)
        var parts = number.toPrecision(8).replace(/\.?0+$/, '').split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }


    return (
        <div>
            <Row>
                    <Col xs={8}>
                   
                   </Col>
                <Col xs={8}>
                    <Center><Text size={30} margin={"20px 0px 0px"}>{prettify(marketData.priceToday)} ETH | ${prettify(marketData.priceToday * marketData.ethPrice)}</Text></Center>
			        <Center><LabelGrey margin={"0px 0px 0px"}>IMPLIED PRICE TODAY</LabelGrey></Center>
                    <Center><Text margin={"0px 0px"}>Based on today's burnt Ether</Text></Center>

                    <Center><Text size={30} margin={"20px 0px 0px"}>{prettify(marketData.priceHistorical)} ETH | ${prettify(marketData.priceHistorical * marketData.ethPrice)}</Text></Center>
			        <Center><LabelGrey margin={"0px 0px 0px"}>HISTORICAL PRICE</LabelGrey></Center>
                    <Center><Text margin={"0px 0px"}>Based on all time burnt Ether</Text></Center>

                    <Center><Text size={30} margin={"20px 0px 0px"}>{prettify(marketData.priceUniswap)} ETH | ${prettify(marketData.priceUniswap * marketData.ethPrice)}</Text></Center>
			        <Center><LabelGrey margin={"0px 0px 0px"}>PRICE ON UNISWAP</LabelGrey></Center>
                    <Center><Text margin={"0px 0px"}>Based on Uniswap liquidity</Text></Center>
                </Col>
                <Col xs={8}>
                    
                </Col>
            </Row>
          
        </div>
    )

}