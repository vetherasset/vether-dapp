import React, { useEffect, useState } from 'react'

import { LabelGrey } from '../components'
import { StakingStats, StakeTable } from './stake-web3'

import '../../App.less';

const Stake = () => {

	const [safari, setSafari] = useState(null)

	useEffect(() => {
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		setSafari(isSafari)
	}, [])

	return (
		<>
			<h1>VETHER LIQUIDITY POOL</h1>
			<span style={{ display: 'block' }}>The Uniswap Liquidity Pool provides liquidity for Vether.</span>
			<StakingStats/>
			<hr/>
			{safari &&
				<>
					<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
					<a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a>
				</>
			}
			{!safari &&
					<StakeTable/>
			}
		</>
	)
}
export default Stake
