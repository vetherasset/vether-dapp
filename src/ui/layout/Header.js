import React from 'react'
import '@metamask/legacy-web3'

import { Layout, Row, Col } from 'antd'
import logotype from '../../assets/logotype.svg'

const Header = () => {

    const logotypeStyles = {
        width: 148,
        height: 60,
        display: "flex",
        justifyContent: "flex-start",
        transform: "scale(0.9)"
    }

    return (
        <>
                <Layout.Header>
                        <Row>
                            <Col xs={4}>
                                <a href='https://vetherasset.io/' rel='prerender'>
                                    <img src={logotype} style={logotypeStyles} alt="Vether - A strictly-scarce Ethereum-based asset" />
                                </a>
                            </Col>
                            <Col xs={16} style={{ textAlign: 'center'}}/>
                            <Col xs={4} style={{ textAlign: 'center'}}>
                            </Col>
                        </Row>
                </Layout.Header>
        </ >
    )
}

export default Header
