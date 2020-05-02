import React, { useEffect, useState } from 'react'

import { H2, Subtitle, Text, HR, Gap, LabelGrey, Click } from '../components'
import { AcquireTable } from './acquire-web3'

import '../../App.css';
// import { Button as ButtonD } from 'antd';

const Acquire = () => {

	const [safari, setSafari] = useState(null)

	useEffect(() => {
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		setSafari(isSafari)
	}, [])

	return (
		<div>
			<Gap />
			<H2>ACQUIRE VETHER</H2><br />
			<Subtitle>Acquire a share of today’s emission by burning assets, such as Ether or ERC-20 tokens.</Subtitle>
			<br /><br />
			<Text>The value of burnt assets is measured in Ether.</Text>&nbsp;
			<Text>There are three asset types that can be burnt:</Text><br />
			<Text>1) Ether (ETH).</Text><br />
			<Text>2) ERC-20 Tokens with market prices: Value measured in amount of Ether.</Text><br />
			<Text>3) ERC-20 Tokens without market prices: Value measured in amount of gas used to destroy it.</Text>
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
					<AcquireTable></AcquireTable>
				</div>
			}

			<HR />

			<Gap />
			<H2>MINE VETHER</H2><br />
			<Subtitle>Run the mining client to continuously mine Vether. </Subtitle>
			<br /><br />
			<Click><a href='https://https://github.com/strictly-scarce/vether-miner-app' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 16 }}>GET THE CLIENT -></a></Click>
			<Gap />
		</div>
	)
}
export default Acquire
