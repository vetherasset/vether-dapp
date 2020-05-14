import React, { useEffect, useState } from 'react'

import { H2, Subtitle, HR, Gap, LabelGrey, Click } from '../components'
import { PoolTable, AddLiquidityTable, RemoveLiquidityTable } from './stake-web3'

import '../../App.css';
// import { Button as ButtonD } from 'antd';

const Stake = () => {

	const [safari, setSafari] = useState(null)

	useEffect(() => {
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		setSafari(isSafari)
	}, [])

	return (
		<div>
			<Gap />
			<H2>VETHER LIQUIDITY POOL</H2><br />
			<Subtitle>The Uniswap Liquidity Pool provides liquidity for Vether.</Subtitle>
			<br /><br />
			<Click><a href='https://uniswap.exchange/swap/0x31Bb711de2e457066c6281f231fb473FC5c2afd3' rel="noopener noreferrer" title="Uniswap Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>VIEW ON UNISWAP -></a></Click>
			<PoolTable></PoolTable>
			<HR/>
			<Gap />
			<H2>ADD LIQIDITY</H2><br />
			<Subtitle>Add liquidity to the pool (ETH and VETH) to earn on trade fees</Subtitle><br />
			<br />
			{safari &&
				<div>
					<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
					<br></br>
					<Click><a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a></Click>
				</div>
			}
			{!safari &&
				<div>
					<AddLiquidityTable></AddLiquidityTable>
				</div>
			}
			<HR/>
			<Gap />
			<H2>REMOVE LIQUIDITY</H2><br />
			<Subtitle>Remove liquidity from the pool</Subtitle><br />
			<br /><br />
			{safari &&
				<div>
					<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
					<br></br>
					<Click><a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a></Click>
				</div>
			}
			{!safari &&
				<div>
					<RemoveLiquidityTable></RemoveLiquidityTable>
				</div>
			}
			<HR />
		</div>
	)
}
export default Stake
