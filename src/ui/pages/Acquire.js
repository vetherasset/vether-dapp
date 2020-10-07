import React, { useEffect, useState } from 'react'

import { Row } from 'antd'
import { AcquireDialog } from '../components/acquireDialog'
import { ClaimDialog } from '../components/claimDialog'
import { EraIndicator } from '../components/eraIndicator'

import '../../App.less'
import { Tabs } from 'antd'

const { TabPane } = Tabs

const Acquire = () => {

	const [tab, setTab] = useState('1')

	useEffect(() => {
		if (window.location.pathname.split("/")[1] === 'claim') setTab('2')
		// eslint-disable-next-line
	}, [])

	return (
		<>
			<Row style={{marginTop:50}}>
				<EraIndicator size={'small'}/>
			</Row>

			<Tabs defaultActiveKey='1' activeKey={tab} size={'large'} style={{ marginTop: 20, textAlign: "center" }}
				  onChange={(key) => setTab(key)}>
				<TabPane tab="BURN ETHER" key="1" style={{ textAlign: "left" }}>
					<h2>ACQUIRE VETHER</h2>
					<p>Acquire a share of today’s emission by burning Ether.</p>
						<AcquireDialog/>
				</TabPane>

				<TabPane tab="CLAIM SHARE" key="2" style={{ textAlign: "left" }}>
					<h2>CLAIM VETHER</h2>
					<p>Claim your share of a previous day’s emission.</p>
						<ClaimDialog/>
				</TabPane>
			</Tabs>
		</>
	)
}

export default Acquire
