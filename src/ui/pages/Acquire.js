import React, { useEffect, useState } from 'react'

import { Row } from 'antd'
import { Text, LabelGrey } from '../components'
import { AcquireTable } from './acquire-web3'
import { GasMineTable } from './acquire-web3'
import { TokenTable } from './tokens'
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
			setTab('3')
		}
		// eslint-disable-next-line
	}, [])

	const onChange = key => {
		setTab(key)
	}

	return (
		<div>
			<Row style={{marginTop:50}}>
				<EraTable size={'small'}/>
			</Row>
			{/* <Row>
				<Col xs={12}>
					<WalletCard accountData={account} />
				</Col>
			</Row> */}


			<Tabs defaultActiveKey='1' activeKey={tab} onChange={onChange} size={'large'} style={{ marginTop: 20, textAlign: "center" }}>
				<TabPane tab="BURN ETHER" key="1" style={{ textAlign: "left" }}>
					<h2>ACQUIRE VETHER</h2>
					<p>Acquire a share of today’s emission by burning assets, such as Ether or ERC-20 tokens.</p>
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
					{/* <hr />
					<h2>MINE VETHER</h2>
					<p>Run the mining client to continuously mine Vether.</p>
					<a href='https://github.com/vetherasset/vether-miner' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 16 }}>GET THE CLIENT -></a>
				 */}
				</TabPane>
				{/* <TabPane tab="GAS MINE" key="2" style={{ textAlign: "left" }}>
					<h2>ACQUIRE VETHER USING GAS MINING</h2>
					<p>Burn gas to acquire Vether.</p>
					<p>This method will partially refund the user their gas after the transaction.</p>
					{safari &&
						<div>
							<br />
							<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
							<br />
							<a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a>
						</div>
					}
					{!safari &&
						<div>
							<GasMineTable></GasMineTable>
						</div>
					}
				</TabPane>
				<TabPane tab="BURN TOKENS" key="3" style={{ textAlign: "left" }}> */}
					{/* <h2>BURN TOKENS</h2><br />
					<p>Burn the tokens on your wallet to get VETHER.</p><br />
					<Text>Note: If there are any errors in your MetaMask, do not proceed, the token is not compatible with Vether.</Text><br /><br />
					{safari &&
						<>
							<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
							<br />
							<a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a>
						</>
					}
					{!safari &&
						<>
							<TokenTable/>
						</>
					}
				</TabPane> */}
				<TabPane tab="CLAIM SHARE" key="4" style={{ textAlign: "left" }}>
					<h2>CLAIM VETHER</h2><br />
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


		</div>
	)
}
export default Acquire
