import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Web3 from 'web3';
import BigNumber from 'bignumber.js'

import { Row, Col, Table, Input } from 'antd'
import { vetherAddr, vetherAbi, infuraAPI, uniSwapAddr, getEtherscanURL } from '../../client/web3.js'
import { Text, LabelGrey, Label, Click, Button, Gap, Colour } from '../components'


export const TokenTable = () => {

    const [account, setAccount] = useState(
        { address: '', vethBalance: '', ethBalance: '' })
    const [contract, setContract] = useState(null)
    const [tokenTable, setTokenTable] = useState(null)
    const [approvalAmount, setApprovalAmount] = useState(null)
    const [approved, setApproved] = useState(null)

    useEffect(() => {
        connect()
        // eslint-disable-next-line
    }, [])

    const connect = () => {
        // setWalletFlag('TRUE')
        ethEnabled()
        loadBlockchainData()
        if (!ethEnabled()) {
            alert("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp");
        } else {
            // setEthAmount(account.ethBalance - 0.1)
        }
    }

    const ethEnabled = () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            window.ethereum.enable();
            return true;
        }
        return false;
    }

    const loadBlockchainData = async () => {
        var accounts = await window.web3.eth.getAccounts()
        const account_ = await accounts[0]
        const contract_ = await new window.web3.eth.Contract(vetherAbi(), vetherAddr())
        // refreshAccount(contract_, account_)
        setContract(contract_)
        setAccount({ address: account_ })
        await getTokens(account_)
    }

    const getTokens = async (address) => {
        // const baseURL = "https://api.ethplorer.io/getAddressInfo/"
        // const apiText = "?apiKey=freekey"
        // const link = baseURL.concat(address).concat(apiText)
        // console.log(link)
        // const response = await axios.get(link)
        // //console.log(response.data)
        // let tokenTable_ = []
        // let tokenObject = { address: "", name: "", balance: "", symbol: "", totalSupply: "" }
        // response.data.tokens.forEach(element => {
        //     if (element.tokenInfo.name) {
        //         tokenObject = {
        //             address: element.tokenInfo.address,
        //             name: element.tokenInfo.name,
        //             balance: element.balance,
        //             symbol: element.tokenInfo.symbol,
        //             totalSupply: element.tokenInfo.totalSupply
        //         }
        //         tokenTable_.push(tokenObject)
        //     }
        // });
        // console.log(tokenTable_)
        setTokenTable(dataSource)
    }

    const checkToken = async (record) => {
        console.log("checked", record.checked)
        if (record.checked === false) {
            const newData = [...tokenTable];
            const index = newData.findIndex(item => record.address === item.address);
            const tokenObject = {
                address: record.address,
                name: record.name,
                balance: record.balance,
                symbol: record.symbol,
                totalSupply: record.totalSupply,
                checked: true,
                approved: record.approved
            }
            newData.splice(index, 1, tokenObject);
            setTokenTable(newData)
            console.log(newData)
        }
        const approved = await checkApproval(record)
        console.log('approved', approved)
        if (approved) {
            tableUpdateApproved(record)
        } else {
            //unlockToken(record)
        }
    }

    const checkApproval = async (record) => {
        const tokenContract = new window.web3.eth.Contract(vetherAbi(), record.address)
        const fromAcc = account.address
        const spender = vetherAddr()
        const approval = await tokenContract.methods.allowance(fromAcc, spender).call()
        //const vethBalance = await tokenContract.methods.balanceOf(address).call()
        // setApprovalAmount(approval)
        console.log(approval, record.balance)
        if (+approval >= +record.balance && +record.balance > 0) {
            return true
            //setApproved(true)
        } else {
            return false
        }
    }

    const tableUpdateApproved = async (record) => {
        const newData = [...tokenTable];
        const index = newData.findIndex(item => record.address === item.address);
        const tokenObject = {
            address: record.address,
            name: record.name,
            balance: record.balance,
            symbol: record.symbol,
            totalSupply: record.totalSupply,
            checked: true,
            approved: true
        }
        newData.splice(index, 1, tokenObject);
        setTokenTable(newData)
        console.log(newData)
    }

    const tableUpdateAmount = async (record, amount) => {
        const newData = [...tokenTable];
        const index = newData.findIndex(item => record.address === item.address);
        const tokenObject = {
            address: record.address,
            name: record.name,
            balance: record.balance,
            symbol: record.symbol,
            totalSupply: record.totalSupply,
            checked: true,
            approved: true,
            amount: amount
        }
        newData.splice(index, 1, tokenObject);
        setTokenTable(newData)
        console.log(newData)
    }

    const tableUpdateTx = async (record, txHash) => {
        const newData = [...tokenTable];
        const index = newData.findIndex(item => record.address === item.address);
        const tokenObject = {
            address: record.address,
            name: record.name,
            balance: record.balance,
            symbol: record.symbol,
            totalSupply: record.totalSupply,
            checked: true,
            approved: true,
            amount: record.amount,
            txHash: txHash
        }
        newData.splice(index, 1, tokenObject);
        setTokenTable(newData)
    }

    const unlockToken = async (record) => {
        const tokenContract_ = new window.web3.eth.Contract(vetherAbi(), record.address)
        const fromAcc_ = account.address
        const spender_ = vetherAddr()
        const val_ = convertToWei(record.balance)
        console.log(spender_, val_)
        await tokenContract_.methods.approve(spender_, val_).send({ from: fromAcc_ })
        console.log(fromAcc_, spender_)
        const approval_ = await tokenContract_.methods.allowance(fromAcc_, spender_).call()
        console.log(approval_)
        tableUpdateApproved(record)
    }

    const onAmountChange = (record) => e => {
        // console.log(record, e)
        tableUpdateAmount(record, convertToWei(e.target.value))
    }

    const burnToken = async (record) => {
		const amount = (record.amount).toString()
		console.log(record.address, amount, account.address)
		const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
		const tx = await contract.methods.burnTokens(record.address, amount).send({ from: account.address })
        tableUpdateTx(record, tx.transactionHash)
        // tableUpdateTx(record, "linkToEtherScan")
		// setLoaded2(true)
    }
    
    const getLink = (record) => {
        return getEtherscanURL().concat('tx/').concat(record.txHash)
    }

    function convertFromWei(number) {
        var num = number / 1000000000000000000
        return num.toFixed(2)
    }

    function convertToWei(number) {
        var num = number * 1000000000000000000
        return new BigNumber(num).toFixed(0)
    }

    function prettify(amount) {
        const number = Number(amount)
        var parts = number.toPrecision(8).replace(/\.?0+$/, '').split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    const dataSource = [{ address: "0x31bb711de2e457066c6281f231fb473fc5c2afd3", name: "Vether", balance: 9676430882499553000, symbol: "VETH", totalSupply: "1000000000000000000000000", checked: false },
    { address: "0x3a9fff453d50d4ac52a6890647b823379ba36b9e", name: "Shuffle.Monster V3", balance: 4783930832695759000, symbol: "SHUF", totalSupply: "966560691061295711142359", checked: false },
    { address: "0x519734ec8854b749ba48be4073dfd71e110ceadb", name: "Value2", balance: 5.018066108938801e+21, symbol: "valt2", totalSupply: "1000000000000000000000000", checked: false },
    { address: "0x6b175474e89094c44da98b954eedeac495271d0f", name: "Multi-Collateral DAI", balance: 3576382508375810000, symbol: "DAI", totalSupply: "95883410210926619021526051", checked: false },
    { address: "0x767f7dadaa0398ae75646a5fa48ce5ae95fdebef", name: "VALUE2", balance: 821046826216961100000, symbol: "VAL2", totalSupply: "1000000000000000000000000", checked: false },
    { address: "0xdac17f958d2ee523a2206206994597c13d831ec7", name: "Tether USD", balance: 1000000, symbol: "USDT", totalSupply: "5737970410922098", checked: false },
    { address: "0xe160f2895068a6030c389ed8ffc408d182a9033d", name: "Token", balance: 9.999959e+23, symbol: "TKN", totalSupply: "1000000000000000000000000", checked: false },
    { address: "0xe6b7068b4893be8980961b7a722fc92813931b56", name: "valuetest", balance: 1.9344389272421537e+21, symbol: "valt", totalSupply: "1000000000000000000000000", checked: false }];


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'age',
        },
        // {
        //     title: 'Address',
        //     dataIndex: 'address',
        //     key: 'address',
        // },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
        },
        {
            title: 'Check',
            key: 'check',
            render: (record) => {
                return record.checked ? (
                    <div>
                        {/* <Button onClick={() => checkToken(record)}>CHECK >></Button> */}
                    </div>
                ) : (
                        <div>
                            <Button onClick={() => checkToken(record)}>CHECK >></Button>
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
                var burnt = false
                if(record.txHash){
                    burnt = true
                }
                return (
                    <div>
                        {/* {!checked &&
                            <Button onClick={() => checkToken(record)}>CHECK >></Button>
                        } */}
                        {(approved && checked && !burnt) &&
                            <div>
                                <Input size={'default'} style={{ width: 80, marginRight:10 }} allowClear onChange={onAmountChange(record)} placeholder={prettify(record.balance)} />
                                <Button style={{ marginLeft: 10 }} onClick={() => burnToken(record)}>BURN >></Button>
                            </div>
                        }
                        {(!approved && checked && !burnt) &&
                            <Button onClick={() => unlockToken(record)}>UNLOCK >></Button>
                        }
                        {burnt &&
                            <Click><a href={getLink(record)} rel="noopener noreferrer" title="Etherscan Link" target="_blank" style={{ color: "#D09800", fontSize: 16 }}>VIEW -></a></Click>
                        }
                    </div>)
                // ) : (
                //         <div>
                //             {/* {approved && 
                //         <Button onClick={() => checkToken(record)}>BURN >></Button>
                //         }
                //         {!approved && 
                //             <Button onClick={() => checkToken(record)}>UNLOCK >></Button>
                //         } */}
                //         </div>
                //     )
            }
        },
        // {
        //     title: 'Checked',
        //     dataIndex: 'checked',
        //     key: 'checked',
        // },
        // {
        //     title: 'Approved',
        //     dataIndex: 'approved',
        //     key: 'approved',
        // },
        // {
        //     title: '',
        //     key: 'link',
        //     render: (record) => {
        //         return record.txHash ? (
        //             <div>
        //                 <Click><a href='https://github.com/vetherasset/vether-miner' rel="noopener noreferrer" title="Etherscan Link" target="_blank" style={{ color: "#D09800", fontSize: 16 }}>VIEW -></a></Click>
        //             </div>
        //         ) : (
        //                 <div>
        //                     {/* <Button onClick={() => checkToken(record)}>CHECK >></Button> */}
        //                 </div>
        //             )
        //     }
        // },
    ];

    return (
        <div>
            <Row>
                <Col xs={24} style={{ paddingRight: 50 }}>
                    {/* <Text>{account.address}</Text> */}
                    <Table dataSource={tokenTable} columns={columns} pagination={false} rowKey="address"></Table>
                </Col>
            </Row>
        </div>
    )
}

export default TokenTable