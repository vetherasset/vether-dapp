import React, { useState, useEffect, useCallback, useContext } from 'react'
import { Context } from '../../context'

import Web3 from 'web3';
import { vetherAddr, vetherAbi, infuraAPI, getEtherscanURL } from '../../client/web3.js'
import { getETHPrice, getVETHPriceInEth } from '../../client/market.js'
import {convertFromWei, convertToDate, prettify} from '../utils'

import { Row, Col } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { LabelGrey, Label, Click, Colour } from '../components'

export const VetherTable = () => {

    const context = useContext(Context)

    const [loaded, setLoaded] = useState(null)
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
        setLoaded(true)
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

    const getMarketData = () => {
        setMarketData(context.marketData)
    }
    const loadMarketData = async () => {
        const priceEtherUSD = await getETHPrice()
        const priceVetherEth = await getVETHPriceInEth()
        const priceVetherUSD = priceEtherUSD * priceVetherEth
        setMarketData({
            priceUSD: priceVetherUSD,
            priceETH: priceVetherEth,
            ethPrice: priceEtherUSD
        })
        context.setContext({
            "marketData": {
                'priceUSD': priceVetherUSD,
                'priceETH': priceVetherEth,
                "ethPrice": priceEtherUSD
            }
        })
    }

    function convertToETH(vether) {
        return (vether * marketData.priceETH).toFixed(3)
    }

    function convertToUSD(vether) {
        return (vether * marketData.priceUSD).toFixed(3)
    }

    function convertEthtoUSD(ether) {
        return (ether * marketData.ethPrice).toFixed(3)
    }

    const getLink = useCallback(() => {
        const linkFull = getEtherscanURL().concat('address/').concat(vetherAddr())
        return linkFull
    }, [])

    return (
        <div>

            {!loaded &&
                <Row style={{ paddingTop: 100, paddingBottom: 100 }}>
                    <LoadingOutlined style={{ marginLeft: 20, fontSize: 30 }} />
                </Row>
            }
            {loaded &&
                <div>
                    <Row style={{ marginLeft: 20 }}>
                        <Col xs={21} sm={11} lg={11}>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={24}>
                                    <LabelGrey>NAME: </LabelGrey><br />
                                    <Label>{vetherData.name}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={24}>
                                    <LabelGrey>SYMBOL: </LabelGrey><br />
                                    <Label>{vetherData.symbol}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={24}>
                                    <LabelGrey>TOTAL SUPPLY: </LabelGrey><br />
                                    <Label>{prettify(vetherData.totalSupply)}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={24}>
                                    <LabelGrey>DECIMALS: </LabelGrey><br />
                                    <Label>{vetherData.decimals}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10, marginBottom: 20 }}>
                                <Col xs={24}>
                                    <LabelGrey>GENESIS: </LabelGrey><br />
                                    <Label>{(vetherData.genesis)}</Label>
                                </Col>
                            </Row>
                        </Col>

                        <Col xs={21} sm={13} lg={13}>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={24}>
                                    <LabelGrey>TOTAL EMITTED: </LabelGrey><br />
                                    <Label>{prettify(emissionData.totalEmitted)} VETH | ${prettify(convertToUSD(emissionData.totalEmitted))}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={24}>
                                    <LabelGrey>TOTAL REMAINING: </LabelGrey><br />
                                    <Label>{prettify(vetherData.totalSupply - emissionData.totalEmitted)} VETH | ${prettify(convertToUSD(vetherData.totalSupply - emissionData.totalEmitted))}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={24}>
                                    <LabelGrey>TOTAL BURNT: </LabelGrey><br />
                                    <Label>{prettify(emissionData.totalBurnt)} ETH | ${prettify(convertEthtoUSD(emissionData.totalBurnt))}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={24}>
                                    <LabelGrey>TOTAL MARKET CAP: </LabelGrey><br />
                                    <Label>{prettify(convertToETH(vetherData.totalSupply))} ETH | ${prettify(convertEthtoUSD(convertToETH(vetherData.totalSupply)))}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={24}>
                                    <LabelGrey>VETH VALUE: </LabelGrey><br />
                                    <Label> {prettify(marketData.priceETH)} ETH | ${prettify(marketData.priceUSD)}</Label>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <LabelGrey>{vetherAddr()}</LabelGrey>
                    <br></br>
                    <Click><a href={getLink()} rel="noopener noreferrer" title="Vether Contract Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}> VIEW CONTRACT -> </a></Click>
                </div>
            }
        </div>
    )
}