import React, { useEffect, useState } from 'react'

import { LabelGrey } from '../components'
import {TradeTable, HistoryTable} from './trade-web3'
//import {PoolTable} from './buysell-web3'

import '../../App.less';

const Trade = () => {

	const [safari, setSafari] = useState(null)

	useEffect(() => {
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		setSafari(isSafari)
	}, [])

	return (
		<>
			<h1>TRADE VETHER</h1>
			<span>Buy and Sell from Uniswap Pool</span>
			<TradeTable/>
			{safari &&
				<>
					<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
					<a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a>
				</>
			}
			{!safari &&
				<>
					{/*<PoolTable />*/}
				</>
			}
			<HistoryTable />
		</>
	)
}
export default Trade
