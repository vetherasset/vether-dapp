import React from 'react'

import { Row, Col } from 'antd'
import { Abstract } from '../components/abstract'
import { VetherTicker } from '../components/vetherTicker'
import { EraIndicator } from '../components/eraIndicator'
import { QuickNavCards } from '../components/quickNavCards'
import { UsefulLinks } from '../components/usefulLinks'

import '../../App.less'

const Hero = (props) => {

	return (
		<div>
			<Row>
				<Col xs={24}>
					<h1>VETHER</h1>
					<span style={{
						marginBottom: "0.56rem",
						display: "block"
					}}>
							A strictly-scarce Ethereum-based asset
					</span>
					<Row>
						<Col xs={24} sm={24}>
							<p style={{
								textAlign: "justify"
							}}>
								<Abstract/>
							</p>
						</Col>
					</Row>
				</Col>
			</Row>
			<VetherTicker/>
			<hr />
			<>
				<h2>CURRENT ERA</h2>
				<p>Today's emission of Vether.</p>
				<EraIndicator/>
				<hr />
			</>
			<>
				<h2>VETHER UTILITY</h2>
				<p>Use the Vether Asset in its ecosystem.</p>
				<QuickNavCards/>
				<hr />
			</>
			<Row>
				<Col sm={8}>
					<h2>LINKS AND RESOURCES</h2>
					<p>Useful links and resources</p>
					<UsefulLinks/>
				</Col>
			</Row>
		</div>
	)
}

export default Hero
