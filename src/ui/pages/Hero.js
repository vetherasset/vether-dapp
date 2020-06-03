import React from 'react'

import { Row, Col } from 'antd'
import { H1, HR, Gap, Subtitle, Center } from '../components'
import { Abstract } from '../content'
import { VetherTable } from './hero-web3'
import Era from './Era'
import Cards, { Links } from './Cards'
import thumbnail from '../../assets/video_thumbnail.png';

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
			<HR />
			<Row>
				<Col xs={4}>
					<Links />
				</Col>
				<Col xs={20}>
					<Center>
						<a href="https://streamable.com/2tjbjp" target='_blank' rel="noopener noreferrer">
							<img src={thumbnail} alt="vether-icon" height={400} style={{ margin: 40 }} />
						</a>
					</Center>
				</Col>
			</Row>

		</div>
	)
}

export default Hero
