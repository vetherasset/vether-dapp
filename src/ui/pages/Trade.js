import React, { useEffect, useState } from 'react'

import { H2, Subtitle, Gap, LabelGrey, Click } from '../components'
import {TradeTable, HistoryTable} from './trade-web3'
import {PoolTable} from './buysell-web3'

import '../../App.css';
// import { Button as ButtonD } from 'antd';

const Trade = () => {

	const [safari, setSafari] = useState(null)

	useEffect(() => {
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		setSafari(isSafari)
	}, [])

	return (
		<div>
			<Gap />
			<H2>TRADE VETHER</H2><br />
			<Subtitle>BUY AND SELL VETHER USING UNISWAP</Subtitle>
			<TradeTable></TradeTable>
			{safari &&
				<div>
					<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
					<br></br>
					<Click><a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a></Click>
				</div>
			}
			{!safari &&
				<div>
					<PoolTable></PoolTable>
				</div>
			}
			<HistoryTable/>
			<br /><br />
			<Click><a href='https://v1.uniswap.exchange/swap?outputCurrency=0x31Bb711de2e457066c6281f231fb473FC5c2afd3' rel="noopener noreferrer" title="Uniswap Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>VIEW ON UNISWAP V1 -></a></Click> <br/>
			<Click><a href='https://etherscan.io/address/0x506d07722744e4a390cd7506a2ba1a8157e63745' rel="noopener noreferrer" title="Etherscan Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>VIEW ON ETHERSCAN -></a></Click>
			

		</div>
	)
}
export default Trade
