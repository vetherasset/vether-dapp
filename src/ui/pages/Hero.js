import React, {useEffect} from 'react'
import defaults from "../../common/defaults"

import { Row, Col } from 'antd'
import { BurnIndicator } from '../components/burnIndicator'

// import { Abstract } from '../components/abstract'
// import { VetherTicker } from '../components/vetherTicker'
// import { EraIndicator } from '../components/eraIndicator'
// import { QuickNavCards } from '../components/quickNavCards'
// import { UsefulLinks } from '../components/usefulLinks'

import '../../App.less'

const NumberTop = (props) => {
	const card = {
		display: 'block',
		fontSize: '2rem',
		textAlign: 'center',
		padding: '10px 0',
		margin: '0 31px 0.8rem 0',
		border: '1px solid',
		borderRadius: 21,
		borderColor: defaults.color.accent,
	}

	const alt = {
		display: 'block',
		textAlign: 'center',
		fontSize: '0.9rem',
		fontStyle: 'italic',
		textTransform: 'lowercase',
		margin: 0
	}

	return (
			<>
				<div style={card}>
						{props.value}
					<span style={alt}>
						{props.alt}
					</span>
				</div>
			</>
	)
}

const NumberBottom = (props) => {
	const number = {
		fontSize: '1.4rem'
	}

	const alt = {
		fontSize: '0.9rem',
		color: defaults.color.gray
	}

	return(
		<>
			<span style={alt}>
				{props.alt}
			</span>
			<p style={number}>
				{props.value}
			</p>
		</>
	)
}



const Hero = () => {

	useEffect(() => {
		const body = document.getElementsByTagName('body')[0]
		body.classList.add('dark')

		return () => {
			body.classList.remove('dark')
		}
	}, [])

	return (
		<>
			<h1 style={{ marginBottom: '1.33rem' }}>OVERVIEW</h1>

			<Row type={'flex'} justify={'center'}>
					<Col lg={15}>

						<Row type={'flex'} style={{ marginBottom: '8.44rem' }}>
							<Col sm={8}>
								<NumberTop value={'12.0 Ξ'} alt={'value burnt today'} />
							</Col>
							<Col sm={8}>
								<NumberTop value={'$2.07'} alt={'implied value today'} />
							</Col>
							<Col sm={8}>
								<NumberTop value={2048} alt={'current emission'} />
							</Col>
						</Row>

						<p style={{ color: defaults.color.gray, marginBottom: '0.9rem' }}>Price</p>
						<div>
							<span style={{ fontSize: '1.66rem' }}>$</span>
							<p style={{ fontSize: '7rem', lineHeight: '2.28rem', margin: '0 0 3rem 13px', }}>
								10.21
							</p>
						</div>
						<NumberBottom value={'$1,463,340'} alt={'MARKET CAP'} />
						<NumberBottom value={'233,199'} alt={'EMITTED'} />
						<NumberBottom value={'1,000,000'} alt={'TOTAL SUPPLY'} />
					</Col>

					<Col lg={9} style={{ paddingTop: '36px' }}>
						<BurnIndicator scale={8} fontSize={'3.33rem'}/>
					</Col>
				</Row>
		</>
	)
}

export default Hero
