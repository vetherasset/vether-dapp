import React from 'react'

import { Row, Col } from 'antd'
import { Abstract } from '../content'
import { VetherTable } from './hero-web3'
import Era from './Era'
import Cards, { Links } from './Cards'
// import thumbnail from '../../assets/video_thumbnail.png';

import '../../App.less';

const Hero = (props) => {

	return (
		<div>
			<Row>
				<Col xs={24}>
					<h1>VETHER</h1>
					<span>A strictly-scarce Ethereum-based asset.</span>
					<Row>
						<Col xs={24} sm={24} style={{ marginBottom: '3rem'}}>
							<Abstract/>
						</Col>
					</Row>
				</Col>
			</Row>
			<VetherTable/>
			<hr />
			<Era />
			<Cards />
			<hr />
			<Row>
				<Col xs={4}>
					<Links />
				</Col>
			</Row>
		</div>
	)
}

export default Hero
