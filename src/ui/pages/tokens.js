import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Web3 from 'web3';
// import BigNumber from 'bignumber.js'

// import { tokenArray3 } from './tokenArray'

import { Row, Col, Table } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { vetherAddr, vetherAbi, getUniswapTokenPriceEth, getExchangeAddr, getEtherscanURL } from '../../client/web3.js'
import { getGasPrice, getShare } from '../../client/market.js'
import { Text, Click, Button } from '../components'


export const TokenTable = () => {

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
        // setWalletFlag('TRUE')
        ethEnabled()
        if(!loaded){
            await loadBlockchainData()
        }
        setLoaded(true)
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
        // const contract_ = await new window.web3.eth.Contract(vetherAbi(), vetherAddr())
        // refreshAccount(contract_, account_)
        //setContract(contract_)
        setAccount({ address: account_ })
        await getTokens(account_)
    }

    const getTokens = async (address) => {
        const baseURL = "https://api.ethplorer.io/getAddressInfo/"
        const apiText = "?apiKey=freekey"
        const link = baseURL.concat(address).concat(apiText)
        const response = await axios.get(link)

        //const response = tokenArray3()

        let tokenTable_ = []
        let tokenTableTrimmed = []
        let loadingTable_ = []
        let tokenObject = { address: "", name: "", balance: "", symbol: "", totalSupply: "" }

        if (response.data.tokens){

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
            if (element.balance > (10**14)) {
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

        //setTokenTable(dataSource)
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
        console.log(newData)
    }

    const checkToken = async (record) => {
        tableUpdate(record, true, false, '-', true)
        console.log("checked", record.checked)
        const checked = true
        var approved 
        const contractApproval = await checkContractApproval(record)
        console.log('contractApproval', contractApproval)
        if(contractApproval === false ){
            console.log("removed")
        } else {
            approved = await checkApproval(record, contractApproval)
            console.log('approved', approved)
            const value = await checkValue(record)
            setLoadedTable(record)
            tableUpdate(record, checked, approved, value, false)
        } 
    }

    const checkContractApproval = async (record) => {
        const tokenContract = new window.web3.eth.Contract(vetherAbi(), record.address)
        const fromAcc = account.address
        const spender = vetherAddr()
        var approval
        try{
            approval = await tokenContract.methods.allowance(fromAcc, spender).call()
            return approval
        } catch(err){
            removeToken(record.address)
        return false
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
    }

    const checkApproval = async (record, approval) => {
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

    const tableUpdate = (record, checked, approved, value, loading) => {
        const newData = [...tokenTable];
        const index = newData.findIndex(item => record.address === item.address);
        const tokenObject = {
            address: record.address,
            name: record.name,
            balance: record.balance,
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
        console.log(newData)
    }

    // const tableUpdateChecked = (record) => {
    //     const newData = [...tokenTable];
    //     const index = newData.findIndex(item => record.address === item.address);
    //     const tokenObject = {
    //         address: record.address,
    //         name: record.name,
    //         balance: record.balance,
    //         symbol: record.symbol,
    //         totalSupply: record.totalSupply,
    //         checked: true,
    //         value: record.value,
    //         approved: record.approved,
    //         amount: record.amount,
    //         txHash: record.txHash
    //     }
    //     newData.splice(index, 1, tokenObject);
    //     setTokenTable(newData)
    //     console.log(newData)
    // }

    // const tableUpdateValue = (record, value) => {
    //     const newData = [...tokenTable];
    //     const index = newData.findIndex(item => record.address === item.address);
    //     const tokenObject = {
    //         address: record.address,
    //         name: record.name,
    //         balance: record.balance,
    //         symbol: record.symbol,
    //         totalSupply: record.totalSupply,
    //         checked: true,
    //         value: value,
    //         approved: record.approved,
    //         amount: record.amount,
    //         txHash: record.txHash
    //     }
    //     newData.splice(index, 1, tokenObject);
    //     setTokenTable(newData)
    //     console.log(newData)
    // }

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
        console.log(newData)
    }

    // const tableUpdateAmount = (record, amount) => {
    //     const newData = [...tokenTable];
    //     const index = newData.findIndex(item => record.address === item.address);
    //     const tokenObject = {
    //         address: record.address,
    //         name: record.name,
    //         balance: record.balance,
    //         symbol: record.symbol,
    //         totalSupply: record.totalSupply,
    //         checked: true,
    //         value: record.value,
    //         approved: record.approved,
    //         amount: amount,
    //         txHash: record.txHash
    //     }
    //     newData.splice(index, 1, tokenObject);
    //     setTokenTable(newData)
    //     console.log(newData)
    // }

    // const tableUpdateTx = (record, txHash) => {
    //     const newData = [...tokenTable];
    //     const index = newData.findIndex(item => record.address === item.address);
    //     const tokenObject = {
    //         address: record.address,
    //         name: record.name,
    //         balance: record.balance,
    //         symbol: record.symbol,
    //         totalSupply: record.totalSupply,
    //         checked: true,
    //         value: record.value,
    //         approved: record.approved,
    //         amount: record.amount,
    //         txHash: txHash
    //     }
    //     newData.splice(index, 1, tokenObject);
    //     setTokenTable(newData)
    // }

    const unlockToken = async (record) => {
        const tokenContract_ = new window.web3.eth.Contract(vetherAbi(), record.address)
        const fromAcc_ = account.address
        const spender_ = vetherAddr()
        const val_ = (record.balance).toString()
        console.log(spender_, val_)
        await tokenContract_.methods.approve(spender_, val_).send({ from: fromAcc_ })
        console.log(fromAcc_, spender_)
        const approval_ = await tokenContract_.methods.allowance(fromAcc_, spender_).call()
        console.log(approval_)
        tableUpdateApproved(record)
    }

    const burnToken = async (record) => {
        const amount = (record.balance).toString()
        console.log(record.address, amount, account.address)
        const contract = new window.web3.eth.Contract(vetherAbi(), vetherAddr())
        await contract.methods.burnTokens(record.address, amount).send({ from: account.address })
        removeToken(record.address)
        //tableUpdateTx(record, tx.transactionHash)
    }

    const getLink = (record) => {
        return getEtherscanURL().concat('tx/').concat(record.txHash)
    }

    // function convertToWei(number) {
    //     var num = number * (10 ** 18)
    //     return new BigNumber(num).toFixed(0)
    // }

    function convertFromWei(number) {
        var num = (number / (10 ** 18))
        return num.toFixed(2)
    }

    // function prettify(amount) {
    //     const number = Number(amount)
    //     var parts = number.toPrecision(8).replace(/\.?0+$/, '').split(".");
    //     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //     return parts.join(".");
    // }

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
        // {
        //     title: 'Address',
        //     dataIndex: 'address',
        //     key: 'address',
        // },
        {
            title: 'Balance',
            key: 'balance',
            render: (record) => {
                return(
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
                        {/* {!checked &&
                            <Button onClick={() => checkToken(record)}>CHECK >></Button>
                        } */}
                        {(approved && checked && !burnt && burnable) &&
                            <div>
                                {/* <Input size={'default'} style={{ width: 80, marginRight:10 }} allowClear onChange={onAmountChange(record)} placeholder={prettify(record.balance)} /> */}
                                <Button style={{ marginLeft: 10 }} onClick={() => burnToken(record)}>BURN >></Button>
                            </div>
                        }
                        {(!approved && checked && !burnt && burnable) &&
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