import React from 'react'
import { Link } from "react-router-dom";
import { Layout, Row, Col } from 'antd';
import { Colour, Center, H1, Sublabel, Icon } from '../components'

import Breakpoint from 'react-socks';

const Header = () => {

    const net = (process.env.REACT_APP_TESTNET === 'TRUE') ? "TESTNET" : "MAINNET"
    const colour = (process.env.REACT_APP_TESTNET === 'TRUE') ? Colour().grey : Colour().gold

    const headerStyles = {
        background: colour,
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

    const headerStylesMobile = {
        background: Colour().black,
        textTransform: "uppercase",
        zIndex: 1,
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        paddingTop: 0,
        paddingBottom: 50,
        // textAlign: "centre"
    }

    const icon_styles = {
        fontSize: "22px",
        color: Colour().gold,
    }

    return (
        <div>
            <Breakpoint medium up>
            <Layout.Header style={headerStyles}>
                <div>

                    <Row>
                        <Col>
                            <Center><H1 margin={"-10px 0px"}>{net}</H1></Center>
                            <Center><Sublabel margin={"-40px 0px"}>DEPLOYED ON 12 MAY 2020</Sublabel></Center>
                        </Col>
                    </Row>
                </div>
            </Layout.Header>
            </Breakpoint>
            <Breakpoint small down>
            <Layout.Header style={headerStylesMobile}>
                <Row>
                    <Col>
                        <Link to={"/overview"}><Icon icon={"overview"} style={icon_styles} /></Link>&nbsp;
                        <Link to={"/acquire"}><Icon icon={"acquire"} style={icon_styles} /></Link>&nbsp;
                        <Link to={"/claim"}><Icon icon={"claim"} style={icon_styles} /></Link>&nbsp;
                        <Link to={"/stake"}><Icon icon={"stake"} style={icon_styles} /></Link>&nbsp;
                        <Link to={"/trade"}><Icon icon={"trade"} style={icon_styles} /></Link>&nbsp;
                        <Link to={"/stats"}><Icon icon={"stats"} style={icon_styles} /></Link>&nbsp;
                        <Link to={"/whitepaper"}><Icon icon={"whitepaper"} style={icon_styles} /></Link>
                    </Col>
                </Row>
                </Layout.Header>
            </Breakpoint>
        </div >
    )
}

export default Header