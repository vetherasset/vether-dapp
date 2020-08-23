import { Col, Row } from "antd"
import { Click, Colour } from "../components"
import React from "react"

export const UsefulLinks = (props) => {
    return (
        <>
            <Row>
                <Col>
                    <Click><a href='https://etherscan.io/address/0x4ba6ddd7b89ed838fed25d208d4f644106e34279' rel="noopener noreferrer" title="Etherscan Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}>VETHER CONTRACT -></a></Click>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Click><a href='https://etherscan.io/address/0x0111011001100001011011000111010101100101' rel="noopener noreferrer" title="Burn Address" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}>BURN ADDRESS -></a></Click>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Click><a href="https://uniswap.info/token/0x4ba6ddd7b89ed838fed25d208d4f644106e34279" rel="noopener noreferrer" title="Pool Analytics" target="_blank" style={{ color: Colour().gold, fontSize: "12px" }}>POOL ANALYTICS -></a></Click>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Click><a href='https://uniswap.exchange/swap/0x4ba6ddd7b89ed838fed25d208d4f644106e34279' rel="noopener noreferrer" title="Uniswap Link" target="_blank" style={{ color: Colour().gold, fontSize: 12 }}>TRADE ON UNISWAP -></a></Click>
                </Col>
            </Row>
        </>
    )
}