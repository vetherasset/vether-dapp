import React, {useContext, useEffect, useState} from "react"
import { Context } from "../../context"
import Web3 from "web3"
import defaults from "../../common/defaults"

import { ETH, infuraAPI, vaderUtilsAbi, vaderUtilsAddr } from "../../client/web3"
import { convertFromWei, currency } from "../../common/utils"
import { getVetherPrice } from "../../client/web3"
import { getETHPrice } from "../../client/market"
import { Col, Row } from "antd"

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
        const price = await getVetherPrice()
        const age = await utils.methods.getPoolAge(ETH).call()
        const roi = await utils.methods.getPoolROI(ETH).call()
        const apy = await utils.methods.getPoolAPY(ETH).call()
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

    return (
        <div>
            <Row>
                <Col span={24} style={{ marginBottom: '0.25rem' }}>
                    <span style={{ display: 'block', marginBottom: '1.3rem', color: defaults.color.gray }}>Total</span>
                    <p style={{ fontSize: '3.22rem' }}>{currency(15965.68)}</p>
                </Col>
            </Row>
            <Row type={'flex'}>
                <Col style={{ flexBasis: '20%', width: '20%' }}>
                    <span style={{ display: 'block', marginBottom: 0, color: defaults.color.gray }}>Volume</span>
                    <span style={{ fontSize: '1.22rem' }}>{currency(23965.68)}</span>
                </Col>
                <Col style={{ flexBasis: '20%', width: '20%' }}>
                    <span style={{ display: 'block', marginBottom: 0, color: defaults.color.gray }}>Trades</span>
                    <p style={{ fontSize: '1.22rem' }}>{currency(23965.68)}</p>
                </Col>
                <Col style={{ flexBasis: '20%', width: '20%' }}>
                    <span style={{ display: 'block', marginBottom: 0, color: defaults.color.gray }}>Fees</span>
                    <p style={{ fontSize: '1.22rem' }}>{currency(965.68)}</p>
                </Col>
                <Col style={{ flexBasis: '20%', width: '20%' }}>
                    <span style={{ display: 'block', marginBottom: 0, color: defaults.color.gray }}>Price</span>
                    <p style={{ fontSize: '1.22rem' }}>{currency(23.12)}</p>
                </Col>
                <Col style={{ flexBasis: '20%', width: '20%' }}>
                    <span style={{ display: 'block', marginBottom: 0, color: defaults.color.gray }}>Assets</span>
                    <p style={{ fontSize: '1.22rem' }}>3</p>
                </Col>
            </Row>
        </div>
    )
}
