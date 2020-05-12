import React, { useState, useEffect } from 'react'

import { H2, Text, Subtitle, Click, HR, Gap, LabelGrey } from '../components'
import { ClaimTable } from './claim-web3'

import '../../App.css';

const Claim = () => {

	const [safari, setSafari] = useState(null)

	useEffect(() => {
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		setSafari(isSafari)
	}, [])

	return (
		<div>
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
				<ClaimTable></ClaimTable>
			}
			<Gap />
			<HR />
			<Gap />
		</div>
	)
}

export default Claim
