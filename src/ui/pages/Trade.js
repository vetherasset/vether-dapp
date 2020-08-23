import React, { useEffect, useState } from 'react'

import { SwapInterface } from '../components/swapInterface'
import { LabelGrey } from '../components'

import '../../App.less'

const Trade = () => {

	const [safari, setSafari] = useState(null)

	useEffect(() => {
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
		setSafari(isSafari)
	}, [])

	return (
		<>
			<h1>TRADE VETHER</h1>
			<p>Buy and Sell using the liquidity pool.</p>
			{safari &&
				<>
					<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
					<a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a>
				</>
			}
			{!safari &&
				<>
					<SwapInterface/>
				</>
			}
		</>
	)
}

export default Trade
