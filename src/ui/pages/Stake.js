import React, { useEffect, useState } from 'react'

import { H2, LabelGrey, Click } from '../components'
import { PoolTable, StakeTable } from './stake-web3'

import '../../App.less';

const Stake = () => {

	const [safari, setSafari] = useState(null)

	useEffect(() => {
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		setSafari(isSafari)
	}, [])

	return (
		<div>
			<H2>VETHER LIQUIDITY POOL</H2><br />
			The Uniswap Liquidity Pool provides liquidity for Vether.
			<br /><br />
			<PoolTable></PoolTable>
			<hr/>
			{safari &&
				<div>
					<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
					<br></br>
					<Click><a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a></Click>
				</div>
			}
			{!safari &&
				<div>
					<StakeTable></StakeTable>
				</div>
			}
			<hr />
		</div>
	)
}
export default Stake
