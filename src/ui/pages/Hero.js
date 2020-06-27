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
			<VetherTable/>
			<hr />
			<Era />
			<Cards />
			<hr />
			<Row>
				<Col sm={8}>
					<Links />
				</Col>
			</Row>
		</div>
	)
}

export default Hero
