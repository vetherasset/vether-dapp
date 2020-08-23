import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import Web3 from 'web3'
import { vetherAddr, vetherAbi, infuraAPI, getVetherPrice } from '../../client/web3.js'
import { getETHPrice } from '../../client/market.js'
import { convertFromWei, convertToDate, currency } from '../../common/utils'

import { Row, Col } from 'antd'
import { LabelGrey, Colour, Text } from '../components'
import { Logo } from './logo'

export const VetherTicker = () => {

    const context = useContext(Context)

    const [vetherData, setVetherData] = useState(
        { name: '', symbol: '', totalSupply: '', decimals: '', genesis: '' })
    const [emissionData, setEmissionData] = useState(
        { balance: '', totalBurnt: '', totalEmitted: '', totalFees: '' })
    const [marketData, setMarketData] = useState(
        { priceUSD: '', priceETH: '', ethPrice: '' })

    useEffect(() => {
        context.vetherData ? getVetherData() : loadVetherData()
        loadEmissionData()
        loadMarketData()
        // eslint-disable-next-line
    }, [])

    const getVetherData = () => {
        setVetherData(context.vetherData)
    }

    const loadVetherData = async () => {
        const name = "Vether"
        const symbol = "VETH"
        const totalSupply = 1000000
        const decimals = 18
        const genesis = convertToDate(1589271741)
        setVetherData({
            name: name,
            symbol: symbol,
            totalSupply: totalSupply,
            decimals: decimals,
            genesis: genesis
        })
        context.setContext({
            "vetherData": {
                'name': name,
                'symbol': symbol,
                "totalSupply": totalSupply,
                'decimals': decimals,
                "genesis": genesis,
            }
        })
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

    const loadMarketData = async () => {
        const priceEtherUSD = await getETHPrice()
        const priceVetherEth = await getVetherPrice()

        const priceVetherUSD = convertFromWei(priceVetherEth) * priceEtherUSD

        const marketData = {
            priceUSD: priceVetherUSD,
            priceETH: priceVetherEth,
            ethPrice: priceEtherUSD
        }

        setMarketData(marketData)
        context.setContext({
            "marketData": marketData
        })
    }

    const vetherStatsStyles = {
        padding: '49px 21px',
        borderRadius: '9px',
        borderColor: Colour().grey,
        backgroundColor: Colour().black,
    }


    return (
        <Row id="vetherStatsTable" style={vetherStatsStyles}>
            <Col id="vetherStatsTableCurrentPrice" xs={24} sm={8}>
                <div style={{marginBottom: '2rem', textAlign: 'center'}}>
                    <Logo/>
                </div>
                <div style={{textAlign: 'center'}}>
                    <Text size={32}>{currency(marketData.priceUSD)}</Text>
                </div>
            </Col>
            <Col xs={24} sm={16}>
                <Row>
                    <Col xs={12}>
                        <Text size={32}>{vetherData.name}&nbsp;({vetherData.symbol})</Text>
                    </Col>
                    <Col xs={12}>
                    </Col>
                </Row>

                <Row style={{marginTop:20}}>
                    <Col xs={24} sm={12}>
                        <LabelGrey size={14}>TOTAL SUPPLY</LabelGrey>
                        <br />
                        <Text size={24}>{currency(vetherData.totalSupply, 0, 0)}</Text>
                    </Col>
                    <Col xs={24} sm={12}>
                    </Col>
                </Row>

                <Row style={{marginTop:20}}>
                    <Col xs={24} sm={12}>
                        <LabelGrey size={14}>EMITTED</LabelGrey>
                        <br />
                        <Text size={24}>{currency(emissionData.totalEmitted,0, 0, 'VETH').replace('VETH', '')}</Text>
                    </Col>
                    <Col id="vetherStatsTableCircCap"xs={24} sm={12}>
                        <LabelGrey size={14}>CIRCULATING CAP</LabelGrey>
                        <br />
                        <Text size={24}>{currency((emissionData.totalEmitted * marketData.priceUSD), 0, 0)}</Text>
                    </Col>
                </Row>

                <p id="vetherStatsTableContractAddress">{vetherAddr()}</p>
            </Col>
        </Row>
    )
}