import React, { useEffect, useState } from 'react'

import { LabelGrey } from '../components'
import { PoolTable, StakeTable } from './stake-web3'
import { SwapPoolsInterface } from './trade-pools-web3'
import { Tabs } from 'antd';
import '../../App.less';

const { TabPane } = Tabs;

const Stake = () => {

	const [safari, setSafari] = useState(null)
	const [tab, setTab] = useState('1')

	useEffect(() => {
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		setSafari(isSafari)
	}, [])

	const onChange = key => {
		setTab(key)
	}

	return (
		<>
			<h1>VETHER LIQUIDITY POOL</h1>
			<span>Try out Vether Pools V0.1 below.</span>
			<PoolTable />
			{safari &&
				<>
					<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
					<a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a>
				</>
			}
			{!safari &&
				<div>
					<Tabs defaultActiveKey='1' activeKey={tab} onChange={onChange} size={'large'} style={{ marginTop: 20, textAlign: "center" }}>
						<TabPane tab="STAKE" key="1" style={{ textAlign: "left" }}>

							<StakeTable />

						</TabPane>

						<TabPane tab="TRADE" key="2" style={{ textAlign: "left" }}>

							<SwapPoolsInterface />

						</TabPane>
					</Tabs>
				</div>
			}
		</>
	)
}
export default Stake
