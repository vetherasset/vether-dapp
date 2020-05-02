import React from 'react'

import { Row, Col } from 'antd'
import { H1, HR, Gap, Subtitle } from '../components'
import { Abstract, Logo } from '../content'
import { VetherTable } from './hero-web3'
import Era from './Era'

import '../../App.css';

const Hero = (props) => {

	return (
		<div>
			<Gap />
			<Row>
				<Col xs={20}>
					<H1>VETHER</H1>
					<br />
					<Subtitle>A strictly-scarce Ethereum-based asset.</Subtitle>
					<Row style={{ marginRight: 0 }}>
						<Col xs={24} sm={24} >
							<Abstract></Abstract>
						</Col>
					</Row>
				</Col>
				<Col xs={4}>
					<Row style={{ marginTop: 20 }}>
						<Logo></Logo>
					</Row>
				</Col>
			</Row>
			<Gap />
			<VetherTable></VetherTable>
			<HR />
			<Era />
		</div>
	)
}

export default Hero
