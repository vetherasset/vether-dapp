import React, { useState, useEffect, useCallback } from 'react'

import Web3 from 'web3';
import { vetherAddr, vetherAbi, infuraAPI, getEtherscanURL } from '../../client/web3.js'
import { getETHPrice, getVETHPriceInEth } from '../../client/market.js'

import { Row, Col } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { LabelGrey, Label, Click, Colour } from '../components'

export const VetherTable = () => {
    const [loaded, setLoaded] = useState(null)
    const [tokenData, setTokenData] = useState(
        { name: '', symbol: '', totalSupply: '', decimals: '', genesis: '' })
    const [emissionData, setEmissionData] = useState(
        { balance: '', totalBurnt: '', totalEmitted: '', totalFees: '' })
    const [marketData, setMarketData] = useState(
        { priceUSD: '', priceETH: '', ethPrice: '' })

    useEffect(() => {

        const loadBlockchainData = async () => {

            const web3_ = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
            const contract_ = new web3_.eth.Contract(vetherAbi(), vetherAddr())
            const name_ = await contract_.methods.name().call()
            const symbol_ = await contract_.methods.symbol().call()
            const totalSupply_ = await contract_.methods.totalSupply().call()
            const decimals_ = await contract_.methods.decimals().call()
            const genesis_ = await contract_.methods.genesis().call()

            setTokenData({
                name: name_,
                symbol: symbol_,
                totalSupply: convertFromWei(totalSupply_),
                decimals: decimals_,
                genesis: convertToDate(genesis_)
            })

            const balance_ = await contract_.methods.balanceOf(vetherAddr()).call()
            const totalBurnt_ = await contract_.methods.totalBurnt().call()
            const totalFees_ = await contract_.methods.totalFees().call()
            const totalEmitted_ = +totalSupply_ - +balance_ + +totalFees_

            setEmissionData({
                balance: convertFromWei(balance_),
                totalBurnt: convertFromWei(totalBurnt_),
                totalEmitted: convertFromWei(totalEmitted_),
                totalFees: convertFromWei(totalFees_)
            })

            const priceEtherUSD = await getETHPrice()
		    const priceVetherEth = await getVETHPriceInEth()
		    const priceVetherUSD = priceEtherUSD*priceVetherEth
		    setMarketData({ priceUSD: priceVetherUSD, priceETH: priceVetherEth, ethPrice: priceEtherUSD })

            setLoaded(true)
        }

        loadBlockchainData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function convertFromWei(number) {
        return number / 1000000000000000000
    }

    function convertToDate(date) {
        return new Date(1000 * date).toLocaleDateString("en-GB", { year: 'numeric', month: 'short', day: 'numeric' })
    }

    function prettify(amount) {
        const number = Number(amount)
        var parts = number.toPrecision(8).replace(/\.?0+$/, '').split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
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
                                    <LabelGrey>NAME: </LabelGrey><br/>
                                    <Label>{tokenData.name}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={24}>
                                    <LabelGrey>SYMBOL: </LabelGrey><br/>
                                    <Label>{tokenData.symbol}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={24}>
                                    <LabelGrey>TOTAL SUPPLY: </LabelGrey><br/>
                                    <Label>{prettify(tokenData.totalSupply)}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={24}>
                                    <LabelGrey>DECIMALS: </LabelGrey><br/>
                                    <Label>{tokenData.decimals}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10, marginBottom: 20 }}>
                                <Col xs={24}>
                                    <LabelGrey>GENESIS: </LabelGrey><br/>
                                    <Label>{(tokenData.genesis)}</Label>
                                </Col>
                            </Row>
                        </Col>

                        <Col xs={21} sm={13} lg={13}>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={24}>
                                    <LabelGrey>TOTAL EMITTED: </LabelGrey><br/>
                                    <Label>{prettify(emissionData.totalEmitted)} VETH | ${prettify(convertToUSD(emissionData.totalEmitted))}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={24}>
                                    <LabelGrey>TOTAL REMAINING: </LabelGrey><br/>
                                    <Label>{prettify(tokenData.totalSupply - emissionData.totalEmitted)} VETH | ${prettify(convertToUSD(tokenData.totalSupply - emissionData.totalEmitted))}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={24}>
                                    <LabelGrey>TOTAL BURNT: </LabelGrey><br/>
                                    <Label>{(emissionData.totalBurnt).toFixed(3)} ETH | ${prettify(convertEthtoUSD(emissionData.totalBurnt))}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={24}>
                                    <LabelGrey>TOTAL MARKET CAP: </LabelGrey><br/>
                                    <Label>{prettify(convertToETH(tokenData.totalSupply))} ETH | ${prettify(convertEthtoUSD(convertToETH(tokenData.totalSupply)))}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={24}>
                                    <LabelGrey>VETH VALUE: </LabelGrey><br/>
                                    <Label> {(marketData.priceETH).toFixed(6)} ETH | ${(marketData.priceUSD).toFixed(5)}</Label>
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