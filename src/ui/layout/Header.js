import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../../context'

import { Link } from "react-router-dom";
import { Menu, Layout, Row, Col, Drawer } from 'antd';
import { Colour, Icon, WalletStateIndicator, WalletConnectButton, LabelGrey, Text } from '../components'
import logotype from '../../assets/logotype.svg';

import Web3 from 'web3'
import { vetherAddr, vetherAbi, uniSwapAbi, uniSwapAddr, getUniswapPriceEth } from '../../client/web3.js'
import { getETHPrice } from '../../client/market.js'
import { prettify, convertFromWei } from '../utils'

import Breakpoint from 'react-socks';

const Header = () => {

    const context = useContext(Context)

    // const net = (process.env.REACT_APP_TESTNET === 'TRUE') ? "TESTNET" : "MAINNET"
    // const colour = (process.env.REACT_APP_TESTNET === 'TRUE') ? Colour().grey : Colour().black

    const [connected, setConnected] = useState(false)
    const [page, setPage] = useState(null)
    const [visible, setVisible] = useState(false)
    const [accountData, setAccountData] = useState(
		{ address: '', vethBalance: '', ethBalance: '', uniBalance:'', uniSupply:'' })
    const [marketData, setMarketData] = useState(
		{ priceUSD: '', priceETH: '', ethPrice: '' })

    const menu_items = [
        "overview",
        "acquire",
        //"upgrade",
        //"stake",
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
        // eslint-disable-next-line
    }, [menu_items])

    useEffect(() => {
        connect()
    })

    const connect = async () => {
        window.web3 = new Web3(window.ethereum);
        const accountConnected = (await window.web3.eth.getAccounts())[0];
        if(accountConnected){
            const accounts = await window.web3.eth.getAccounts()
            const address = accounts[0]
            const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
            context.accountData ? getAccountData() : await loadAccountData(contract, address)
            context.marketData ? getMarketData() : loadMarketData()
            setConnected(true)
        } else {
            setConnected(false)
        }
    }

    const ethConnected = async () => {
        setInterval(async function() {
            const accountConnected = (await window.web3.eth.getAccounts())[0];
            if(accountConnected){
                setConnected(true)
            } else {
                setConnected(false)
            }
        }, 100);
    }

	const ethEnabled = () => {
        console.log('connecting')
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			window.ethereum.enable();
			ethConnected()
			return true;
		}
		return false;
	}

    const getAccountData = async () => {
        setAccountData(context.accountData)
    }

    const loadAccountData = async (contract_, address) => {
        const ethBalance = convertFromWei(await window.web3.eth.getBalance(address))
		const vethBalance = convertFromWei(await contract_.methods.balanceOf(address).call())
		const exchangeContract = new window.web3.eth.Contract(uniSwapAbi(), uniSwapAddr())
		const uniBalance = convertFromWei(await exchangeContract.methods.balanceOf(address).call())
		const uniSupply = convertFromWei(await exchangeContract.methods.totalSupply().call())
		const accountData = {
			address: address,
			vethBalance: vethBalance,
			ethBalance: ethBalance,
			uniBalance: uniBalance,
			uniSupply:uniSupply
		}
        setAccountData(accountData)
		context.setContext({'accountData':accountData})
	}

    const getMarketData = async () => {
		setMarketData(context.marketData)
	}
	const loadMarketData = async () => {
		const priceEtherUSD = await getETHPrice()
		const priceVetherEth = await getUniswapPriceEth()
		const priceVetherUSD = priceEtherUSD * priceVetherEth

		const marketData = {
			priceUSD: priceVetherUSD,
			priceETH: priceVetherEth,
			ethPrice: priceEtherUSD
		}

		setMarketData(marketData)
		context.setContext({
			"marketData": marketData
		})
	}

    const logotypeStyles = {
        width: 148,
        height: 60,
        display: "flex",
        justifyContent: "flex-start",
        transform: "scale(0.9)"
    }

    const menuStyles = {
        width: '100%',
        padding: 0,
        textAlign: 'center',
        borderBottom: 'none'
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
        return addr.substring(0,7) + '...' + addr?.substring(addr.length-5, addr.length)
    }

    // const showDrawer = () => {
    //     setVisible(true);
    // };

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
        <>
                <Layout.Header>
                    <Breakpoint medium up>
                        <Row>
                            <Col xs={4}>
                                <img src={logotype} style={logotypeStyles} alt="Vether - A strictly-scarce Ethereum-based asset" />
                            </Col>
                            <Col xs={16} style={{ textAlign: 'center'}}/>
                            <Col xs={4} style={{ textAlign: 'center'}}>
                                <WalletConnectButton
                                    backgroundColor="transparent"
                                    borderColor="#ce9600"
                                    onClick={ethEnabled}>
                                    <WalletStateIndicator
                                        width="10px"
                                        height="10px"
                                        display="inline-block"
                                        margin="0 7px 0 0"
                                        state={connected}
                                    />
                                    {`${connected? getAddrShort() : 'Connect Wallet'}`}
                                </WalletConnectButton>
                                <Drawer
                                    title="WALLET"
                                    placement="right"
                                    closable={false}
                                    onClose={onClose}
                                    visible={visible}
                                    headerStyle={headerDrawerStyles}
                                    drawerStyle={drawerStyles}
                                >
                                    <Text size={24}>{prettify(+accountData?.ethBalance)}</Text>&nbsp;<Text size={20}>ETH</Text><br/>
                                    <LabelGrey >${prettify(+accountData?.ethBalance * +marketData?.ethPrice)}</LabelGrey>
                                    <br/><br/>
                                    <Text size={24}>{prettify(+accountData?.vethBalance)}</Text>&nbsp;<Text size={20}>VETH</Text><br/>
                                    <LabelGrey >${prettify(+accountData?.vethBalance * +marketData?.priceUSD)}</LabelGrey>
                                    <br/><br/>
                                    <Text size={24}>{prettify(+accountData?.uniBalance)}</Text>&nbsp;<Text size={20}>UNI-V1</Text><br/>
                                    <br/><br/>

                                </Drawer>
                            </Col>
                        </Row>
                    </Breakpoint>
                    <Breakpoint small down>
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
                    </Breakpoint>
                </Layout.Header>
        </ >
    )
}

export default Header
