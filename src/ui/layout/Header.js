import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../../context'
import '@metamask/legacy-web3'

import { Link } from "react-router-dom"
import { Menu, Layout, Row, Col } from 'antd'
import { Colour, Icon, WalletStateIndicator, WalletConnectButton } from '../components'
import logotype from '../../assets/logotype.svg'

import Web3 from 'web3'
import { vetherAddr, vetherAbi,  } from '../../client/web3.js'
import { convertFromWei } from '../../common/utils'

import Breakpoint from 'react-socks'

const Header = () => {

    const context = useContext(Context)

    const [connected, setConnected] = useState(false)
    const [page, setPage] = useState(null)

    const menu_items = [
        "overview",
        "acquire",
        // "swap",
        // "pool",
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
        const accountConnected = (await window.web3.eth.getAccounts())[0]
        if(accountConnected){
            const accounts = await window.web3.eth.getAccounts()
            const address = accounts[0]
            const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
            if(!context.accountData) { await loadAccountData(contract, address) }
            setConnected(true)
        } else {
            setConnected(false)
        }
    }

    const ethConnected = async () => {
        setInterval(async function() {
            const accountConnected = (await window.web3.eth.getAccounts())[0]
            if(accountConnected){
                setConnected(true)
            } else {
                setConnected(false)
            }
        }, 100)
    }

	const ethEnabled = () => {
        console.log('connecting')
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			window.ethereum.enable()
			ethConnected()
			return true
		}
		return false
	}

    const loadAccountData = async (contract_, address) => {
        const ethBalance = convertFromWei(await window.web3.eth.getBalance(address))
		const vethBalance = convertFromWei(await contract_.methods.balanceOf(address).call())
		const uniBalance = 0
		const uniSupply = 0
		const accountData = {
			address: address,
			vethBalance: vethBalance,
			ethBalance: ethBalance,
			uniBalance: uniBalance,
			uniSupply:uniSupply
		}
		context.setContext({'accountData':accountData})
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
                    </Breakpoint>
                </Layout.Header>
        </ >
    )
}

export default Header
