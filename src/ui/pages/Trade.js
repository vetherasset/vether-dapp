import React, { useEffect, useState } from 'react'

import {Center, LabelGrey, Text} from '../components'
import {PoolStats, TokenPrice, TradeHistory} from './trade-web3'
import { SwapInterface } from './buysell-web3'

import '../../App.less'
import { Row, Col } from 'antd'
import {prettify} from "../utils";

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
			<PoolStats />
			{safari &&
				<>
					<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
					<a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a>
				</>
			}
			{!safari &&
				<>
					<TokenPrice />
					<SwapInterface />
				</>
			}
			<TradeHistory />
		</>
	)
}
export default Trade
