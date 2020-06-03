import React from 'react'

import { Row, Col } from 'antd'
import { H2, Subtitle, Gap, Colour, Text, Click } from '../components'

const Cards = () => {

    const cardContent = () => {
        return [
            {
                title: 'ACQUIRE VETHER',
                subtitle: 'Acquire Vether by burning value',
                link: "/acquire"
            },
            {
                title: 'CLAIM VETHER',
                subtitle: 'Claim Vether from a previous day',
                link: "/claim"
            },
            {
                title: 'STAKE VETHER',
                subtitle: 'Stake Vether to earn trading fees',
                link: "/stake"
            },
            {
                title: 'TRADE VETHER',
                subtitle: 'Buy or sell Vether',
                link: "/trade"
            }]
    }

    const cardStyles = {
        marginTop: 10,
        // marginLeft:20,
        padding: 10,
    }

    return (
        <div>
            <Gap />
            <H2>VETHER UTILITY</H2><br />
            <Subtitle>Use the Vether Asset in its ecosystem</Subtitle>
            <Row>
                <Col style={cardStyles} xs={12}>
                    <Card title={cardContent()[0].title}
                        subtitle={cardContent()[0].subtitle}
                        link={cardContent()[0].link} />
                </Col>
                <Col style={cardStyles} xs={12}>
                    <Card title={cardContent()[1].title}
                        subtitle={cardContent()[1].subtitle}
                        link={cardContent()[1].link} />
                </Col>
            </Row>
            <Row>
                <Col style={cardStyles} xs={12}>
                    <Card title={cardContent()[2].title}
                        subtitle={cardContent()[2].subtitle}
                        link={cardContent()[2].link} />
                </Col>
                <Col style={cardStyles} xs={12}>
                    <Card title={cardContent()[3].title}
                        subtitle={cardContent()[3].subtitle}
                        link={cardContent()[3].link} />
                </Col>
            </Row>
        </div>
    )
}
export default Cards

const Card = (props) => {

    const cardStyles = {
        borderWidth: '1px',
        // borderStyle: 'dashed',
        borderRadius: 5,
        // borderColor: Colour().black,
        // margin: 10,
        padding: 20,
        backgroundColor: Colour().black
    }

    return (
        <div>
            <Row>
                <Col xs={24} style={cardStyles}>
                    <Click size={18}><a href={window.location.origin + props.link} rel="noopener noreferrer" title={props.title} style={{ color: Colour().gold}}>{props.title}&nbsp;>></a></Click>
                    <br />
                    <Text size={16}>{props.subtitle}</Text>
                    <br />
                </Col>
            </Row>
        </div>
    )
}

export const Links = (props) => {
    return (
        <div>
            <Gap />
            <H2>LINKS AND RESOURCES</H2><br />
            <Subtitle>Useful links and resources</Subtitle>
            <Gap />
            <Row>
                <Col>
                    <Click><a href='https://etherscan.io/address/0x506d07722744e4a390cd7506a2ba1a8157e63745' rel="noopener noreferrer" title="Etherscan Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>UNISWAP CONTRACT -></a></Click>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Click><a href='https://etherscan.io/address/0x31Bb711de2e457066c6281f231fb473FC5c2afd3' rel="noopener noreferrer" title="Etherscan Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}>VETHER CONTRACT -></a></Click>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Click><a href='https://etherscan.io/address/0x0111011001100001011011000111010101100101' rel="noopener noreferrer" title="Etherscan Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}>BURN ADDRESS -></a></Click>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Click><a href="https://pools.fyi/#/trades/0x506d07722744e4a390cd7506a2ba1a8157e63745?id=101163240114&period=7" rel="noopener noreferrer" title="Etherscan Link" target="_blank" style={{ color: Colour().gold, fontSize: "12px" }}>POOL ANALYTICS -></a></Click>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Click><a href='https://v1.uniswap.exchange/swap?outputCurrency=0x31Bb711de2e457066c6281f231fb473FC5c2afd3' rel="noopener noreferrer" title="Uniswap Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}>VIEW ON UNISWAP V1 -></a></Click>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Click><a href='https://www.coingecko.com/en/coins/vether' rel="noopener noreferrer" title="Coingecko Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}>VIEW ON COINGECKO -></a></Click>
                </Col>
            </Row>


        </div>
    )
}