import React, { useEffect, useState } from 'react'

import { SwapPoolsInterface } from './trade-pools-web3'
import { LabelGrey } from '../components'

import '../../App.less'

const Trade = () => {

	const [safari, setSafari] = useState(null)

	useEffect(() => {
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		setSafari(isSafari)
	}, [])

	return (
		<>
			<h1>TRADE VETHER</h1>
			<p>Buy and Sell using the Vether liquidity pool beta V2.</p>
			{safari &&
				<>
					<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
					<a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a>
				</>
			}
			{!safari &&
				<>
					<SwapPoolsInterface />
				</>
			}
		</>
	)
}

export default Trade
