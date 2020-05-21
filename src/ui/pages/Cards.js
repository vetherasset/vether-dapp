import React from 'react'
import { Link } from "react-router-dom"

import { Row, Col } from 'antd'
import { H2, Subtitle, HR, Gap, Colour, Text, Click } from '../components'

const Cards = () => {

    const cardContent = () => {
        return [
            {
                title: 'GET VETHER',
                subtitle: 'Get Vether by burning value.',
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
        marginTop:10,
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

            <HR />
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
                    <Link to={props.link}><Click size={18}>{props.title}&nbsp;>></Click></Link>
                    <br />
                    <Text size={16}>{props.subtitle}</Text>
                    <br />
                </Col>
            </Row>
        </div>
    )
}