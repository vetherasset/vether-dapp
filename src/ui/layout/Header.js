import React from 'react'
import { Layout, Row, Col } from 'antd';
import { Colour, Center, H1, Sublabel } from '../components'

const Header = () => {

    const headerStyles = {
        background: Colour().gold,
        textTransform: "uppercase",
        zIndex: 1,
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        paddingTop: 0,
        paddingBottom: 50,
        textAlign: "centre"
    }

    return (
        <Layout.Header style={headerStyles}>
            <div>
                <Row>
                    <Col>
                        <Center><H1 margin={"-10px 0px"}>MAINNET</H1></Center>
                        <Center><Sublabel margin={"-40px 0px"}>DEPLOYED ON 12 MAY 2020</Sublabel></Center>
                    </Col>
                </Row>
            </div>
        </Layout.Header>
    )
}

export default Header