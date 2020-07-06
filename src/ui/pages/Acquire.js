import React, { useEffect, useState } from 'react'

import { Row } from 'antd'
import { Text, LabelGrey } from '../components'
import { AcquireTable } from './acquire-web3'
// import { GasMineTable } from './acquire-web3'
// import { TokenTable } from './tokens'
import { ClaimTable } from './claim-web3'
import { EraTable } from './era-web3'
// import { WalletCard } from '../ui'

import '../../App.less';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const Acquire = () => {

	const [safari, setSafari] = useState(null)
	const [tab, setTab] = useState('1')
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		setSafari(isSafari)
		let pathname = window.location.pathname.split("/")[1]
		if (pathname === 'claim' && !loaded) {
			setLoaded(true)
			setTab('2')
		}
		// eslint-disable-next-line
	}, [])

	const onChange = key => {
		setTab(key)
	}

	return (
		<>
			<Row style={{marginTop:50}}>
				<EraTable size={'small'}/>
			</Row>

			<Tabs defaultActiveKey='1' activeKey={tab} onChange={onChange} size={'large'} style={{ marginTop: 20, textAlign: "center" }}>
				<TabPane tab="BURN ETHER" key="1" style={{ textAlign: "left" }}>
					<h2>ACQUIRE VETHER</h2>
					<p>Acquire a share of today’s emission by burning Ether.</p>
					{safari &&
						<>
							<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
							<br />
							<a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a>
						</>
					}
					{!safari &&
						<>
							<AcquireTable/>
						</>
					}
				</TabPane>

				<TabPane tab="CLAIM SHARE" key="2" style={{ textAlign: "left" }}>
					<h2>CLAIM VETHER</h2>
					<p>Claim your share of a previous day’s emission. </p><br />
					<Text>Note: you cannot claim on the same day of contribution. Please wait a day. </Text><br />
					{safari &&
						<>
							<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
							<a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a>
						</>
					}
					{!safari &&
						<>
							<ClaimTable/>
						</>
					}
				</TabPane>
			</Tabs>
		</>
	)
}
export default Acquire
