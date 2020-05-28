import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../../context'

import { Link } from "react-router-dom";
import { Menu, Layout, Row, Col, Drawer } from 'antd';
import { Colour, Center, H1, H2, Sublabel, Icon, Button, LabelGrey, Text } from '../components'
import { prettify } from '../utils'

import Breakpoint from 'react-socks';

const Header = () => {

    const context = useContext(Context)

    const net = (process.env.REACT_APP_TESTNET === 'TRUE') ? "TESTNET" : "MAINNET"
    const colour = (process.env.REACT_APP_TESTNET === 'TRUE') ? Colour().grey : Colour().black

    const [page, setPage] = useState(null)
    const [visible, setVisible] = useState(false);

    const menu_items = [
        "overview",
        "acquire",
        "stake",
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
        // console.log(getUniswapPriceEth(), getETHPrice())
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
        height: 50
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

    const getAddrShort = () => {
        const addr = (context.accountData?.address)? context.accountData.address : '0x000000000'
        const addrShort = addr.substring(0,5) + '...' + addr?.substring(addr.length-3, addr.length)
        return addrShort
    }

    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    const headerDrawerStyles = {
        backgroundColor: Colour().black,
        color: Colour().white,
        height:66,
        fontSize:'20px',
    }
    const drawerStyles = {
        backgroundColor: Colour().black,
        color: Colour().white,

    }


    return (
        <div>
            <Breakpoint medium up>
                <Layout.Header style={headerStyles}>
                    <div>
                        <Row>
                            <Col xs={3}>
                                &nbsp;&nbsp;<H1>VETHERASSET.ORG</H1>
                            </Col>
                            <Col xs={18}>
                                <Center><H2 margin={"-10px 0px"}>{net}</H2></Center>
                                <Center><Sublabel margin={"-40px 0px"}>DEPLOYED ON 12 MAY 2020</Sublabel></Center>
                            </Col>
                            <Col xs={3}>
                                <Button backgroundColor={Colour().black} onClick={showDrawer}>
                                    {getAddrShort()}
                                </Button>
                                <Drawer
                                    title="WALLET"
                                    placement="right"
                                    closable={false}
                                    onClose={onClose}
                                    visible={visible}
                                    headerStyle={headerDrawerStyles}
                                    drawerStyle={drawerStyles}
                                >
                                    <Text size={24}>{prettify(+context.accountData?.ethBalance)}</Text>&nbsp;<Text size={20}>ETH</Text><br/>
                                    <LabelGrey >${prettify(+context.accountData?.ethBalance * +context.marketData?.ethPrice)}</LabelGrey>
                                    <br/><br/>
                                    <Text size={24}>{prettify(+context.accountData?.vethBalance)}</Text>&nbsp;<Text size={20}>VETH</Text><br/>
                                    <LabelGrey >${prettify(+context.accountData?.vethBalance * +context.marketData?.priceUSD)}</LabelGrey>
                                    <br/><br/>
                                    <Text size={24}>{prettify(+context.accountData?.uniBalance)}</Text>&nbsp;<Text size={20}>UNI-V1</Text><br/>
                                    <br/><br/>

                                </Drawer>
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
