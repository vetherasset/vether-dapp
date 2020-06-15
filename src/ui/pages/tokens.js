
import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../../context'
import axios from 'axios'
import Web3 from 'web3';

import { Modal, Row, Col, Table, Tooltip } from 'antd'
import { LoadingOutlined, ExclamationCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Text, Click, Button, Colour } from '../components'

import { vetherAddr, vetherAbi, getUniswapTokenPriceEth, getExchangeAddr, getEtherscanURL } from '../../client/web3.js'
import { getGasPrice, getShare } from '../../client/market.js'
import {convertFromWei} from '../utils'



const BigNumber = require('bignumber.js')
require('dotenv').config({ path: "../../../.env" })

export const TokenTable = () => {

    const context = useContext(Context)

    const [account, setAccount] = useState(
        { address: '', vethBalance: '', ethBalance: '' })
    const [tokenTable, setTokenTable] = useState(null)
    const [loadingTable, setLoadingTable] = useState([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        connect()
        // eslint-disable-next-line
    }, [])

    const connect = async () => {
        if (!loaded) {
            window.web3 = new Web3(window.ethereum);
            var accounts = await window.web3.eth.getAccounts()
            const address = await accounts[0]
            await getAccountData()
            context.accountData ? getAccountData() : loadAccountData(address)
            context.tokenData ? getTokenData() : loadTokenData(address)
            // await loadBlockchainData()
            setLoaded(true)
        }
    }

    const getAccountData = async () => {
        setAccount(context.accountData)
    }

    const loadAccountData = async (address) => {
        var ethBalance = convertFromWei(await window.web3.eth.getBalance(address))
        const contract = await new window.web3.eth.Contract(vetherAbi(), vetherAddr())
        const vethBalance = await contract.methods.balanceOf(address).call()
        setAccount({
            address: address,
            vethBalance: vethBalance,
            ethBalance: ethBalance
        })
        context.setContext({
            "accountData": {
                'address': address,
                'vethBalance': vethBalance,
                'ethBalance': ethBalance
            }
        })
    }

    const getTokenData = () => {
        setTokenTable(context.tokenData)
        setLoadingTable(context.tokenData)
    }

    const loadTokenData = async (address) => {
        const baseURL = "https://api.ethplorer.io/getAddressInfo/"
        const apiText = "?apiKey=" + process.env.REACT_APP_ETHPLORER_API
        const link = baseURL.concat(address).concat(apiText)
        const response = await axios.get(link)

        let tokenTable_ = []
        let tokenTableTrimmed = []
        let loadingTable_ = []
        let tokenObject = { address: "", name: "", balance: "", symbol: "", totalSupply: "" }

        if (response.data.tokens) {
            response.data.tokens.forEach(element => {
                if (element.tokenInfo.name) {
                    tokenObject = {
                        address: element.tokenInfo.address,
                        name: element.tokenInfo.name,
                        balance: element.balance,
                        symbol: element.tokenInfo.symbol,
                        totalSupply: element.tokenInfo.totalSupply
                    }
                    tokenTable_.push(tokenObject)
                }
            });

            tokenTable_.forEach(element => {
                if (element.balance > (10 ** 14)) {
                    tokenObject = {
                        address: element.address,
                        name: element.name,
                        balance: element.balance,
                        symbol: element.symbol,
                        totalSupply: element.totalSupply
                    }
                    tokenTableTrimmed.push(tokenObject)
                    loadingTable_.push(true)
                }
            });
        }

        setTokenTable(tokenTableTrimmed)
        setLoadingTable(tokenTableTrimmed)

        context.setContext({
            'tokenData': tokenTableTrimmed
        })
    }

    const checkLoaded = (record) => {
        const index = tokenTable.findIndex(item => record.address === item.address);
        return loadingTable[index]
    }

    const setLoadedTable = (record) => {
        const newData = [...loadingTable];
        const index = tokenTable.findIndex(item => record.address === item.address);
        newData.splice(index, 1, false);
        setLoadingTable(newData)
        context.setContext({
            'tokenData': newData
        })
        // console.log(newData)
    }

    const checkToken = async (record) => {
        tableUpdate(record, true, false, '-', true)
        console.log("checked", record.checked)
        const checked = true
        var approved
        const [balance, approval] = await checkContract(record)
        console.log('contractApproval', approval)
        if (approval === false) {
            console.log("removed")
        } else {
            approved = await checkApproval(record, approval)
            console.log('approved', approved)
            const value = await checkValue(record)
            if (value === 0) {
                await removeToken(record.address)
                handleShowModal()
            } else {
                setLoadedTable(record)
                tableUpdate(record, checked, approved, value, balance, false)
            }
        }
    }

    const checkContract = async (record) => {
        const tokenContract = new window.web3.eth.Contract(vetherAbi(), record.address)
        const fromAcc = account.address
        const spender = vetherAddr()
        const balance = await tokenContract.methods.balanceOf(account.address).call()
        var approval
        try {
            approval = await tokenContract.methods.allowance(fromAcc, spender).call()
            return [balance, approval]
        } catch (err) {
            removeToken(record.address)
            handleShowModal()
            return [balance, false]
        }
    }

    const removeToken = async (token) => {
        let tokenTableTrimmed = []
        tokenTable.forEach(element => {
            if (element.address !== token) {
                const tokenObject = {
                    address: element.address,
                    name: element.name,
                    balance: element.balance,
                    symbol: element.symbol,
                    totalSupply: element.totalSupply
                }
                tokenTableTrimmed.push(tokenObject)
            }
        });
        console.log(tokenTableTrimmed)
        setTokenTable(tokenTableTrimmed)
        context.setContext({
            'tokenData': tokenTableTrimmed
        })
    }

    const checkApproval = async (record, approval) => {
        console.log(approval, record.balance)
        if (+approval >= +record.balance && +record.balance > 0) {
            return true
        } else {
            return false
        }
    }

    const checkValue = async (record) => {
        const exchange = await getExchangeAddr(record.address)
        var value = 0.00;
        if (exchange === "0x0000000000000000000000000000000000000000") {
            const tokenValue = await getGasPrice()
            const valueInVeth = await getShare(tokenValue)
            console.log('value', tokenValue, valueInVeth)
            if (valueInVeth > 0) {
                value = valueInVeth.toFixed(2)
            }
        } else {
            const tokenValue = await getUniswapTokenPriceEth(record.address)
            const valueInVeth = await getShare(tokenValue * convertFromWei(record.balance))
            console.log('value', tokenValue, valueInVeth)
            if (valueInVeth > 0) {
                value = valueInVeth.toFixed(2)
            }
        }
        return value
    }

    const tableUpdate = (record, checked, approved, value, balance, loading) => {
        const newData = [...tokenTable];
        const index = newData.findIndex(item => record.address === item.address);
        const tokenObject = {
            address: record.address,
            name: record.name,
            balance: balance,
            symbol: record.symbol,
            totalSupply: record.totalSupply,
            checked: checked,
            value: value,
            approved: approved,
            amount: record.amount,
            txHash: record.txHash,
            loading: loading
        }
        newData.splice(index, 1, tokenObject);
        setTokenTable(newData)
        context.setContext({
            'tokenData': newData
        })
        console.log(newData)
    }

    const tableUpdateApproved = (record) => {
        const newData = [...tokenTable];
        const index = newData.findIndex(item => record.address === item.address);
        const tokenObject = {
            address: record.address,
            name: record.name,
            balance: record.balance,
            symbol: record.symbol,
            totalSupply: record.totalSupply,
            checked: true,
            value: record.value,
            approved: true,
            amount: record.amount,
            txHash: record.txHash
        }
        newData.splice(index, 1, tokenObject);
        setTokenTable(newData)
        context.setContext({
            'tokenData': newData
        })
        console.log(newData)
    }

    const unlockToken = async (record) => {
        const tokenContract = new window.web3.eth.Contract(vetherAbi(), record.address)
        const fromAcc = account.address
        const spender = vetherAddr()
        const val = await tokenContract.methods.totalSupply().call()
        console.log(spender, val)
        await tokenContract.methods.approve(spender, val).send({ from: fromAcc })
        console.log(fromAcc, spender)
        const approval = await tokenContract.methods.allowance(fromAcc, spender).call()
        console.log(approval)
        tableUpdateApproved(record)
    }

    const burn25 = async (record) => { burnToken(record, 25) }
    const burn50 = async (record) => { burnToken(record, 50) }
    const burn75 = async (record) => { burnToken(record, 75) }
    const burn100 = async (record) => { burnToken(record, 100) }

    const burnToken = async (record, rate) => {
        const tokenContract = new window.web3.eth.Contract(vetherAbi(), record.address)
        const amount = new BigNumber(await tokenContract.methods.balanceOf(account.address).call())
        const burnAmount = (((amount.times(rate)).div(100).integerValue(1))).toString()
        console.log(record.address, amount, burnAmount, account.address)
        const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
        await contract.methods.burnTokens(record.address, burnAmount).send({ from: account.address })
        removeToken(record.address)
    }

    const getLink = (record) => {
        return getEtherscanURL().concat('tx/').concat(record.txHash)
    }

    const { confirm } = Modal

    const handleShowModal = () => {
        confirm({
            title: 'Caution',
            icon: <ExclamationCircleOutlined />,
            content: <p>This token is not compatible with Vether.</p>,
            onOk() { },
            onCancel() { },
        });
    }

    const columns = [
        {
            title: 'Name',
            key: 'name',
            render: (record) => {
                return (
                    <div>
                        <Text size={14} bold={true}>{record.name}</Text>
                    </div>
                )
            }
        },
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'age',
        },
        {
            title: 'Balance',
            key: 'balance',
            render: (record) => {
                return (
                    <div>
                        <Text>{convertFromWei(record.balance)}</Text>
                    </div>
                )
            }
        },
        {
            title: 'Potential Value',
            key: 'check',
            render: (record) => {
                const loading = checkLoaded(record)
                return record.checked ? (
                    <div>
                        {loading &&
                            <LoadingOutlined />
                        }
                        {!loading &&
                            <Text size={14} bold={true}>{record.value} VETH</Text>
                        }
                    </div>
                ) : (
                        <div>
                            <Button
                                backgroundColor="transparent"
                                onClick={() => checkToken(record)}
                            >
                                CHECK >>
                            </Button>
                            <Tooltip placement="right" title="This will check the token for compatibility with Vether">
								&nbsp;<QuestionCircleOutlined style={{color:Colour().grey}}/>
							</Tooltip>
                        </div>
                    )
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => {
                const approved = record.approved
                const checked = record.checked
                var burnable = false
                if (record.value > 0) {
                    burnable = true
                }
                var burnt = false
                if (record.txHash) {
                    burnt = true
                }
                return (
                    <div>
                        {(approved && checked && !burnt && burnable) &&
                            <div>
                                <Text bold={true}>BURN: </Text>&nbsp;
                                <Button backgroundColor="transparent" style={{ marginLeft: 10 }} onClick={() => burn25(record)}>25%</Button>&nbsp;
                                <Button backgroundColor="transparent" style={{ marginLeft: 10 }} onClick={() => burn50(record)}>50%</Button>&nbsp;
                                <Button backgroundColor="transparent" style={{ marginLeft: 10 }} onClick={() => burn75(record)}>75%</Button>&nbsp;
                                <Button backgroundColor="transparent" style={{ marginLeft: 10 }} onClick={() => burn100(record)}>100%</Button>&nbsp;
                                <Tooltip placement="right" title="This will burn the token for Vether">
								    &nbsp;<QuestionCircleOutlined style={{color:Colour().grey}}/>
							    </Tooltip>
                            </div>
                        }
                        {(!approved && checked && !burnt && burnable) &&
                            <div>
                            <Button
                                backgroundColor="transparent"
                                onClick={() => unlockToken(record)}
                            >
                                UNLOCK >>
                            </Button>
                            <Tooltip placement="right" title="This will unlock the token with Vether">
								&nbsp;<QuestionCircleOutlined style={{color:Colour().grey}}/>
							</Tooltip>
                            </div>
                        }
                        {burnt &&
                            <Click><a href={getLink(record)} rel="noopener noreferrer" title="Etherscan Link" target="_blank" style={{ color: "#D09800", fontSize: 16 }}>VIEW -></a></Click>
                        }
                    </div>)
            }
        },
    ];

    return (
        <div>
            <Row>
                <Col xs={24}>
                    <Table dataSource={tokenTable} columns={columns} pagination={false} rowKey="address"></Table>
                </Col>
            </Row>
        </div>
    )
}

export default TokenTable
