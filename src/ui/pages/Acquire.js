import React, { useEffect, useState } from 'react'

import { Row } from 'antd'
import { H2, Subtitle, Text, HR, Gap, LabelGrey, Click } from '../components'
import { AcquireTable } from './acquire-web3'
import { TokenTable } from './tokens'
import { ClaimTable } from './claim-web3'
import { EraTable } from './era-web3'
// import { WalletCard } from '../ui'

import '../../App.css';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const Acquire = () => {

	const [safari, setSafari] = useState(null)
	const [tab, setTab] = useState('1')

	useEffect(() => {
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		setSafari(isSafari)
		let pathname = window.location.pathname.split("/")[1]
		if (pathname === 'claim') {
			setTab('3')
		}
	}, [tab])

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


			<Tabs activeKey={tab} size={'large'} style={{ marginTop: 20 }}>
				<TabPane tab="BURN ETHER" key="1">
					<Gap />
					<H2>ACQUIRE VETHER</H2><br />
					<Subtitle>Acquire a share of today’s emission by burning assets, such as Ether or ERC-20 tokens.</Subtitle><br /><br />
					{safari &&
						<div>
							<br />
							<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
							<br />
							<Click><a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a></Click>
						</div>
					}
					{!safari &&
						<div>
							<AcquireTable></AcquireTable>
						</div>
					}
					<HR />
					<Gap />
					<H2>MINE VETHER</H2><br />
					<Subtitle>Run the mining client to continuously mine Vether. </Subtitle>
					<br /><br />
					<Click><a href='https://github.com/vetherasset/vether-miner' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 16 }}>GET THE CLIENT -></a></Click>
					<Gap />
				</TabPane>
				<TabPane tab="BURN TOKENS" key="2">
					<Gap />
					<H2>BURN TOKENS</H2><br />
					<Subtitle>Burn the tokens on your wallet to get VETHER.</Subtitle><br />
					<Text>Note: If there are any errors in your MetaMask, do not proceed, the token is not compatible with Vether.</Text><br /><br />
					{safari &&
						<div>
							<br />
							<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
							<br />
							<Click><a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a></Click>
						</div>
					}
					{!safari &&
						<div>
							<TokenTable></TokenTable>
						</div>
					}
				</TabPane>
				<TabPane tab="CLAIM SHARE" key="3">
					<Gap />
					<H2>CLAIM VETHER</H2><br />
					<Subtitle>Claim your share of a previous day’s emission. </Subtitle><br />
					<Text>Note: you cannot claim on the same day of contribution. Please wait a day. </Text><br />
					<Gap />
					{safari &&
						<div>
							<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
							<br></br>
							<Click><a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a></Click>
						</div>
					}
					{!safari &&
						<div>
							<ClaimTable></ClaimTable>
						</div>
					}
				</TabPane>
			</Tabs>


		</div>
	)
}
export default Acquire
