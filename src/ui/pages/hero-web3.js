import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

import Web3 from 'web3';
import { vetherAddr, vetherAbi, infuraAPI } from '../../client/web3.js'

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
            //console.log(vetherAbi(), vetherAddr())
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

            const ethPrice_ = await getETHPrice()
            const emission_ = await contract_.methods.emission().call()
            var priceETH_ = 0
            var priceUSD_ = 0

            if (totalEmitted_ === 0) {
                priceETH_ = (totalBurnt_ / emission_)
                priceUSD_ = priceETH_ * ethPrice_
            } else {
                priceETH_ = (totalBurnt_ / (totalEmitted_))
                priceUSD_ = priceETH_ * ethPrice_
            }

            setMarketData({
                priceUSD: priceUSD_,
                priceETH: priceETH_,
                ethPrice: ethPrice_
            })

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
        //console.log(ether, marketData.ethPrice, ether * marketData.ethPrice)
        return (ether * marketData.ethPrice).toFixed(3)
    }

    const getETHPrice = async () => {
        // console.log(uniSwapAbi(), uniSwapAddr())
        // const exchangeContract = new web3_.eth.Contract(uniSwapAbi(), uniSwapAddr())
        // const ethBought = await exchangeContract.methods.getTokenToEthInputPrice('1000000000000000000').call()
        // console.log('ethBought', ethBought)
        // return 1/ethBought

        const ethPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        //console.log(ethPrice.data.ethereum.usd)
        return ethPrice.data.ethereum.usd
    }

    const getLink = useCallback(() => {
        const link = "https://rinkeby.etherscan.io/address/"
        const code = "#code"
        const linkFull = link.concat(vetherAddr()).concat(code)
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
                                <Col xs={6}>
                                    <LabelGrey>NAME: </LabelGrey>
                                </Col>
                                <Col xs={18}>
                                    <Label>{tokenData.name}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={6}>
                                    <LabelGrey>SYMBOL: </LabelGrey>
                                </Col>
                                <Col xs={18}>
                                    <Label>{tokenData.symbol}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={6}>
                                    <LabelGrey>TOTAL SUPPLY: </LabelGrey>
                                </Col>
                                <Col xs={18}>
                                    <Label>{prettify(tokenData.totalSupply)}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={6}>
                                    <LabelGrey>DECIMALS: </LabelGrey>
                                </Col>
                                <Col xs={18}>
                                    <Label>{tokenData.decimals}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10, marginBottom: 20 }}>
                                <Col xs={6}>
                                    <LabelGrey>GENESIS: </LabelGrey>
                                </Col>
                                <Col xs={18}>
                                    <Label>{(tokenData.genesis)}</Label>
                                </Col>
                            </Row>
                        </Col>

                        <Col xs={21} sm={13} lg={13}>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={6}>
                                    <LabelGrey>TOTAL EMITTED: </LabelGrey>
                                </Col>
                                <Col xs={18}>
                                    <Label>{prettify(emissionData.totalEmitted)} VETH | ${prettify(convertToUSD(emissionData.totalEmitted))}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={6}>
                                    <LabelGrey>TOTAL REMAINING: </LabelGrey>
                                </Col>
                                <Col xs={18}>
                                    <Label>{prettify(tokenData.totalSupply - emissionData.totalEmitted)} VETH | ${prettify(convertToUSD(tokenData.totalSupply - emissionData.totalEmitted))}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={6}>
                                    <LabelGrey>TOTAL BURNT: </LabelGrey>
                                </Col>
                                <Col xs={18}>
                                    <Label>{(emissionData.totalBurnt).toFixed(3)} ETH | ${prettify(convertEthtoUSD(emissionData.totalBurnt))}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={6}>
                                    <LabelGrey>TOTAL MARKET CAP: </LabelGrey>
                                </Col>
                                <Col xs={18}>
                                    <Label>{prettify(convertToETH(tokenData.totalSupply))} ETH | ${prettify(convertEthtoUSD(convertToETH(tokenData.totalSupply)))}</Label>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: 10 }}>
                                <Col xs={6}>
                                    <LabelGrey>VETH VALUE: </LabelGrey>
                                </Col>
                                <Col xs={18}>
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