import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { Menu, Layout, Row, Col } from 'antd';
import { Colour, Center, H1, Sublabel, Icon } from '../components'

import Breakpoint from 'react-socks';

const Header = () => {

    const net = (process.env.REACT_APP_TESTNET === 'TRUE') ? "TESTNET" : "MAINNET"
    const colour = (process.env.REACT_APP_TESTNET === 'TRUE') ? Colour().grey : Colour().gold

    const [page, setPage] = useState(null)

    const menu_items = [
        "overview",
        "acquire",
        "trade",
        "stats",
        "whitepaper"
    ]

    useEffect(() => {
        let pathname = window.location.pathname.split("/")[1]
        if (!pathname) {
            setPage("overview")
        }
        if (menu_items.includes(pathname)) {
            setPage(pathname)
        }
        console.log(window.location.origin)
    }, [menu_items])

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
        paddingBottom: 0,
        height:50
        // textAlign: "centre"
    }

    const menuStyles = {
        width: '100%',
        padding: 0
    }

    const icon_styles = {
        fontSize: "22px",
        color: Colour().gold,
    }

    const selected_styles = {
        fontSize: "22px",
        color: Colour().grey,
    }

    const getIconStyles = (key) => {
        if (key === page) {
            return selected_styles
        } else {
            return icon_styles
        }
    }

    const handleClick = ({ key }) => {
        setPage(key)
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
                    <Menu onClick={handleClick} mode="horizontal" selectedKeys={[page]} style={menuStyles}>
                        {menu_items.map((item) => (
                            <Menu.Item key={item}>
                                <Link to={"/" + item}>
                                    <Icon icon={item} style={getIconStyles(item)} />
                                </Link>
                            </Menu.Item>
                        ))}
                    </Menu>

                    {/* <Row>
                    <Col>
                        <Link to={"/overview"}><Icon icon={"overview"} style={getStyles('overview')} /></Link>&nbsp;
                        <Link to={"/acquire"}><Icon icon={"acquire"} style={getStyles('acquire')} /></Link>&nbsp;
                        <Link to={"/claim"}><Icon icon={"claim"} style={getStyles('claim')} /></Link>&nbsp;
                        <Link to={"/stake"}><Icon icon={"stake"} style={getStyles('stake')} /></Link>&nbsp;
                        <Link to={"/trade"}><Icon icon={"trade"} style={getStyles('trade')} /></Link>&nbsp;
                        <Link to={"/stats"}><Icon icon={"stats"} style={getStyles('stats')} /></Link>&nbsp;
                        <Link to={"/whitepaper"}><Icon icon={"whitepaper"} style={getStyles('whitepaper')} /></Link>
                    </Col>
                </Row> */}
                </Layout.Header>
            </Breakpoint>
        </div >
    )
}

export default Header