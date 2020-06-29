import React from 'react'

import { Row, Col } from 'antd'
import { Colour, Text, Click } from '../components'

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
            }// ,
            // {
            //     title: 'STAKE VETHER',
            //     subtitle: 'Stake Vether to earn trading fees',
            //     link: "/stake"
            // },
            // {
            //     title: 'TRADE VETHER',
            //     subtitle: 'Buy or sell Vether',
            //     link: "/trade"
            // }
         ]
    }

    const cardStyles = {
        marginTop: 10,
        // marginLeft:20,
        padding: 10,
    }

    return (
        <>
            <h2>VETHER UTILITY</h2>
            <p>Use the Vether Asset in its ecosystem</p>
            <Row id="vetherEcosystemCards0">
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
            {/*<Row id="vetherEcosystemCards1">*/}
            {/*    <Col style={cardStyles} xs={12}>*/}
            {/*        <Card title={cardContent()[2].title}*/}
            {/*            subtitle={cardContent()[2].subtitle}*/}
            {/*            link={cardContent()[2].link} />*/}
            {/*    </Col>*/}
            {/*    <Col style={cardStyles} xs={12}>*/}
            {/*        <Card title={cardContent()[3].title}*/}
            {/*            subtitle={cardContent()[3].subtitle}*/}
            {/*            link={cardContent()[3].link} />*/}
            {/*    </Col>*/}
            {/*</Row>*/}
        </>
    )
}
export default Cards

const Card = (props) => {

    const cardStyles = {
        borderWidth: '1px',
        // borderStyle: 'dashed',
        borderRadius: 6,
        // borderColor: Colour().black,
        // margin: 10,
        padding: 20,
        backgroundColor: Colour().black
    }

    return (
        <>
            <Row>
                <Col xs={24} style={cardStyles}>
                    <Click size={18}><a href={window.location.origin + props.link} rel="noopener noreferrer" title={props.title} style={{ color: Colour().gold}}>{props.title}&nbsp;>></a></Click>
                    <br />
                    <Text size={16}>{props.subtitle}</Text>
                    <br />
                </Col>
            </Row>
        </>
    )
}

export const Links = (props) => {
    return (
        <>
            <h2>LINKS AND RESOURCES</h2>
            <p>Useful links and resources</p>
            <Row>
                <Col>
                    <Click><a href='https://etherscan.io/address/0x75572098dc462F976127f59F8c97dFa291f81d8b' rel="noopener noreferrer" title="Etherscan Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}>VETHER CONTRACT -></a></Click>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Click><a href='https://etherscan.io/address/0x0111011001100001011011000111010101100101' rel="noopener noreferrer" title="Burn Address" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}>BURN ADDRESS -></a></Click>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Click><a href="https://uniswap.info/token/0x75572098dc462F976127f59F8c97dFa291f81d8b" rel="noopener noreferrer" title="Pool Analytics" target="_blank" style={{ color: Colour().gold, fontSize: "12px" }}>POOL ANALYTICS -></a></Click>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Click><a href='https://uniswap.exchange/swap/0x75572098dc462F976127f59F8c97dFa291f81d8b' rel="noopener noreferrer" title="Uniswap Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}>VIEW ON UNISWAP -></a></Click>
                </Col>
            </Row>
        </>
    )
}
