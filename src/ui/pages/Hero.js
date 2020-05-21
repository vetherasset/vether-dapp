import React from 'react'

import { Row, Col } from 'antd'
import { H1, HR, Gap, Subtitle } from '../components'
import { Abstract } from '../content'
import { VetherTable } from './hero-web3'
import Era from './Era'
import Cards from './Cards'

import '../../App.css';

const Hero = (props) => {

	return (
		<div>
			<Gap />
			<Row>
				<Col xs={24}>
					<H1>VETHER</H1>
					<br />
					<Subtitle>A strictly-scarce Ethereum-based asset.</Subtitle>
					<Row>
						<Col xs={24} sm={24} >
							<Abstract></Abstract>
						</Col>
					</Row>
				</Col>
			</Row>
			<Gap />
			<VetherTable></VetherTable>
			<HR />
			<Era />
			<Cards />
		</div>
	)
}

export default Hero
