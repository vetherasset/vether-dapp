import React, { useEffect, useState } from 'react'

import { SwapInterface } from '../components/swapInterface'
import { LabelGrey } from '../components'

import '../../App.less'

const Trade = () => {


	return (
		<>
			<h1>TRADE VETHER</h1>
			<p>Buy and Sell using the liquidity pool.</p>
				<SwapInterface/>
			}
		</>
	)
}

export default Trade
