import React, { useEffect, useState } from 'react'

import { LabelGrey } from '../components'
import {TradeTable, HistoryTable} from './trade-web3'
import {PoolTable} from './buysell-web3'

import '../../App.less';
// import { Button as ButtonD } from 'antd';

const Trade = () => {

	const [safari, setSafari] = useState(null)

	useEffect(() => {
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		setSafari(isSafari)
	}, [])

	return (
		<>
			<h1>TRADE VETHER</h1>
			<span>Buy and Sell Vether using Uniswap</span>
			<TradeTable/>
			{safari &&
				<>
					<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
					<a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a>
				</>
			}
			{!safari &&
				<>
					<PoolTable/>
				</>
			}
			<HistoryTable/>
			<a href='https://v1.uniswap.exchange/swap?outputCurrency=0x31Bb711de2e457066c6281f231fb473FC5c2afd3' rel="noopener noreferrer" title="Uniswap Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>VIEW ON UNISWAP V1 -></a>
			<br/>
			<a href='https://etherscan.io/address/0x506d07722744e4a390cd7506a2ba1a8157e63745' rel="noopener noreferrer" title="Etherscan Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>VIEW ON ETHERSCAN -></a>
		</>
	)
}
export default Trade
