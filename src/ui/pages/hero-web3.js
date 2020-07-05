import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context'

import Web3 from 'web3'
import { vetherAddr, vetherAbi, infuraAPI, getUniswapPriceEth } from '../../client/web3.js'
import { getETHPrice } from '../../client/market.js'
import { convertFromWei, convertToDate, prettify } from '../utils'

import { Row, Col } from 'antd'
import { LabelGrey, Colour, Text } from '../components'
import { Logo } from '../content'

export const VetherTable = () => {

    const context = useContext(Context)

    // const [loaded, setLoaded] = useState(null)
    const [vetherData, setVetherData] = useState(
        { name: '', symbol: '', totalSupply: '', decimals: '', genesis: '' })
    const [emissionData, setEmissionData] = useState(
        { balance: '', totalBurnt: '', totalEmitted: '', totalFees: '' })
    const [marketData, setMarketData] = useState(
        { priceUSD: '', priceETH: '', ethPrice: '' })

    useEffect(() => {

        context.vetherData ? getVetherData() : loadVetherData()
        context.emissionData ? getEmissionData() : loadEmissionData()
        context.marketData ? getMarketData() : loadMarketData()
        // setLoaded(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const getMarketData = async () => {
        setMarketData(context.marketData)
    }
    const loadMarketData = async () => {
        const priceEtherUSD = await getETHPrice()
        const priceVetherEth = await getUniswapPriceEth()
        const priceVetherUSD = priceEtherUSD * priceVetherEth

        const marketData = {
            priceUSD: priceVetherUSD,
            priceETH: priceVetherEth,
            ethPrice: priceEtherUSD}

        setMarketData(marketData)
        context.setContext({
            "marketData": marketData
        })
    }

    function convertToETH(vether) {
        return (vether * marketData.priceETH)
    }

    // function convertToUSD(vether) {
    //     return (vether * marketData.priceUSD).toFixed(3)
    // }

    function convertEthtoUSD(ether, sp) {
        return (+ether * marketData.ethPrice).toFixed(sp)
    }

    // const getLink = useCallback(() => {
    //     const linkFull = getEtherscanURL().concat('address/').concat(vetherAddr())
    //     return linkFull
    // }, [])

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
                        <Text size={32}>${(convertEthtoUSD(marketData.priceETH, 2))}</Text>
                    </div>
                </Col>
                <Col xs={24} sm={16}>
                    <Row>
                        <Col xs={12}>
                            <Text size={32}>{vetherData.name}&nbsp;({vetherData.symbol})</Text>
                            {/* <br /> */}
                            {/* <Link to={"/stats"}><Click size={12}> MORE DATA -></Click></Link> */}
                        </Col>
                        <Col xs={12}>

                        </Col>
                    </Row>

                    <Row style={{marginTop:20}}>
                        <Col xs={24} sm={12}>
                            <LabelGrey size={14}>TOTAL SUPPLY</LabelGrey>
                            <br />
                            <Text size={24}>{prettify(vetherData.totalSupply)} VETH</Text>
                        </Col>
                        <Col xs={24} sm={12}>
                            {/* <LabelGrey size={14}>TOTAL CAP: </LabelGrey><br />
                            <Text size={24}>${prettify((convertEthtoUSD(convertToETH(vetherData.totalSupply), 0)))}</Text> */}
                        </Col>
                    </Row>

                    <Row style={{marginTop:20}}>
                        <Col xs={24} sm={12}>
                            <LabelGrey size={14}>EMITTED</LabelGrey>
                            <br />
                            <Text size={24}>{prettify((+emissionData.totalEmitted).toFixed(0))} VETH</Text>
                        </Col>
                        <Col id="vetherStatsTableCircCap"xs={24} sm={12}>
                            <LabelGrey size={14}>CIRCULATING CAP</LabelGrey>
                            <br />
                            <Text size={24}>${prettify((convertEthtoUSD(convertToETH(emissionData.totalEmitted), 0)))}</Text>
                        </Col>
                    </Row>

                    <p id="vetherStatsTableContractAddress">{vetherAddr()}</p>
                </Col>
            </Row>
    )
}
