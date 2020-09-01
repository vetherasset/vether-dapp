import React, {useContext, useEffect, useState} from "react"
import { Context } from "../../context"
import Web3 from "web3"
import { ETH, infuraAPI, vaderUtilsAbi, vaderUtilsAddr } from "../../client/web3"
import { convertFromWei, currency } from "../../common/utils"
import { getETHPrice } from "../../client/market"
import { Center, Colour, Text } from "../components"
import { Col, Row, Tooltip } from "antd"
import { QuestionCircleOutlined } from '@ant-design/icons'

export const PoolTicker = () => {

    const context = useContext(Context)

    const [marketData, setMarketData] = useState(
        { priceUSD: '', priceETH: '', ethPrice: '' })
    const [poolData, setPoolData] = useState(
        { "eth": "", "veth": '', 'price': "", "fees": "", "volume": "", "poolUnits": "", "txCount": "", 'age':"", 'roi': "", 'apy': "" })

    useEffect(() => {
        loadPoolData()
        loadMarketData()
        // eslint-disable-next-line
    }, [])

    const loadPoolData = async () => {
        const web3_ = new Web3(new Web3.providers.HttpProvider(infuraAPI()))
        const utils = new web3_.eth.Contract(vaderUtilsAbi(), vaderUtilsAddr())
        const poolData = await utils.methods.getPoolData(ETH).call()
        const age = await utils.methods.getPoolAge(ETH).call()
        const roi = await utils.methods.getPoolROI(ETH).call()
        const apy = await utils.methods.getPoolAPY(ETH).call()
        const price = poolData.tokenAmt / poolData.baseAmt
        const poolData_ = {
            "eth": convertFromWei(poolData.tokenAmt),
            "veth": convertFromWei(poolData.baseAmt),
            "price": price,
            "volume": convertFromWei(poolData.volume),
            "poolUnits": poolData.poolUnits,
            "fees": convertFromWei(poolData.fees),
            "txCount": poolData.txCount,
            "age": age,
            "roi": roi,
            "apy": apy
        }
        setPoolData(poolData_)
        context.setContext({
            "poolData": poolData_
        })
    }

    const loadMarketData = async () => {
        const priceEtherUSD = await getETHPrice()

        const marketData = {
            ethPrice: priceEtherUSD
        }

        setMarketData(marketData)
        context.setContext({
            "marketData": marketData
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
    const topLineStyle = {
        borderTop: '1px dashed',
        borderColor: '#97948e47',
        paddingLeft: 5,
        marginTop: 10,
        paddingTop: 10
    }

    return (
        <div style={{ marginTop: '2rem' }}>
            <Row type="flex" justify="center">
                <Col lg={16} xs={24}>
                    <div style={poolStyles}>
                        <Row>
                            <Col xs={12}>
                                <Text size={20} style={{ textAlign: 'left', display: 'block', margin: '0' }}>VETH</Text>
                                <Center>
                                    <Text size={'1.9rem'} color={Colour().white} margin={"20px 0px 5px 0px"}>
                                        {currency(poolData.veth, 0, 2, 'VETH').replace('VETH', '')}
                                    </Text>
                                </Center>
                                <Center>
									<span style={{ color: '#97948e', margin: 0 }}>
										{currency(poolData.veth * (poolData.price * marketData.ethPrice))}
									</span>
                                </Center>
                            </Col>
                            <Col xs={12} style={lineStyle}>
                                <Text size={20} style={{ textAlign: 'left', display: 'block', margin: '0 0 0 15px' }}>ETH Ξ</Text>
                                <Center><Text size={'1.9rem'} color={Colour().white} margin={"20px 0px 5px 0px"}>{currency(poolData.eth, 0, 2, 'ETH').replace('Ξ', '')}</Text></Center>
                                <Center><span style={{ color: '#97948e', margin: 0 }}>{currency(marketData.ethPrice * poolData.eth)}</span></Center>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Center><Text size={'0.8rem'} style={{ textAlign: 'center', display: 'block', margin: '0' }}>PRICE</Text></Center>
                                <Center>
                                    <Text size={'1.9rem'} color={Colour().white} margin={"5px 0px 5px 0px"}>{currency(poolData.price * marketData.ethPrice)}
                                        <Tooltip placement="right" title="Current market rate">
                                            &nbsp;<QuestionCircleOutlined style={{ color: Colour().grey, margin: 0 }} />
                                        </Tooltip>
                                    </Text>
                                </Center>
                                <Center>
									<span style={{ color: '#97948e', margin: 0 }}>
										{currency(poolData.price, 0, 5, 'ETH')}
									</span>
                                </Center>
                            </Col>
                        </Row>
                        <Row style={topLineStyle}>
                            <Col xs={6}>
                                <Center>
                                    <Text size={'0.8rem'} style={{ textAlign: 'center', display: 'block', margin: '0' }}>
                                        VOL&nbsp;<span style={{ fontSize: '0.7rem', fontStyle: 'italic', color: '#97948e', margin: 0 }}>VETH</span>
                                    </Text>
                                </Center>
                                <Center>
                                    <Text size={'1.1rem'} color={Colour().white} margin={"5px 0px 5px 0px"}>
                                        {currency(poolData.volume, 0, 2, 'VETH').replace('VETH', '')}
                                    </Text>
                                </Center>
                            </Col>
                            <Col xs={6}>
                                <Center>
                                    <Text size={'0.8rem'} style={{ textAlign: 'center', display: 'block', margin: '0' }}>
                                        FEES&nbsp;<span style={{ fontSize: '0.7rem', fontStyle: 'italic', color: '#97948e', margin: 0 }}>VETH</span>
                                    </Text>
                                </Center>
                                <Center>
                                    <Text size={'1.1rem'} color={Colour().white} margin={"5px 0px 5px 0px"}>
                                        {currency(poolData.fees, 0, 2, 'VETH').replace('VETH', '')}
                                    </Text>
                                </Center>
                            </Col>
                            <Col xs={6}>
                                <Center>
                                    <Text size={'0.8rem'} style={{ textAlign: 'center', display: 'block', margin: '0' }}>TRADES</Text>
                                </Center>
                                <Center>
                                    <Text size={'1.1rem'} color={Colour().white} margin={"5px 0px 5px 0px"}>
                                        {poolData.txCount}
                                    </Text>
                                </Center>
                            </Col>
                            <Col xs={6}>
                                <Center>
                                    <Text size={'0.8rem'} style={{ textAlign: 'center', display: 'block', margin: '0' }}>
                                        ROI
                                    </Text>
                                </Center>
                                <Center>
                                    <Text size={'1.1rem'} color={Colour().white} margin={"5px 0px 5px 0px"}>
                                        {poolData.roi/100}%
                                    </Text>
                                </Center>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    )
}