import React, { useState, useEffect } from 'react'
import defaults from "../../common/defaults"

import Web3 from 'web3'
import { getVetherPrice } from '../../client/web3.js'
import { getETHPrice } from '../../client/market.js'
import { currency } from '../../common/utils'

import { Row, Col } from 'antd'
import { BurnIndicator } from '../components/burnIndicator'
import '../../App.less'

const NumberTop = (props) => {
	const card = {
		minHeight: 96,
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

	const web3 = new Web3(new Web3.providers.HttpProvider(defaults.infura.api))
	const vether = new web3.eth.Contract(defaults.vether.abi, defaults.vether.address)
	const [distribution, setDistribution] = useState(
		{ era: 0, day: 0, emission: 0, currentBurn: 0, nextDay: 0, nextEra: 0, nextEmission: 0,
			 totalFees: 0, totalBurnt: 0, totalEmitted: 0 })
	const [price, setPrice] = useState({
		eth: { usd: 0 },
		veth: {
			implied: {
				eth: 0, usd: 0
			},
			eth: 0,
			usd: 0,
			cap: 0
		}
	})

	const loadData = async () => {
		try {
			const emission = Web3.utils.fromWei(await vether.methods.getDayEmission().call())
			const day = await vether.methods.currentDay().call()
			const era = await vether.methods.currentEra().call()
			const nextDay = await vether.methods.nextDayTime().call()
			const nextEra = await vether.methods.nextEraTime().call()
			const nextEmission = Web3.utils.fromWei(await vether.methods.getNextEraEmission().call())
			const currentBurn = Web3.utils.fromWei(await vether.methods.mapEraDay_UnitsRemaining(era, day).call())

			const balance = Web3.utils.fromWei(await vether.methods.balanceOf(defaults.vether.address).call())
			const totalBurnt = Web3.utils.fromWei(await vether.methods.totalBurnt().call())
			const totalFees = Web3.utils.fromWei(await vether.methods.totalFees().call())
			const totalEmitted = (+defaults.vether.supply - +balance + +totalFees)

			const distributionData = {
				nextEra: nextEra, nextDay: nextDay,
				emission: emission, nextEmission: nextEmission,
				currentBurn: currentBurn, totalFees: totalFees,
				totalBurnt: totalBurnt,
				totalEmitted: totalEmitted
			}
			setDistribution(distributionData)

			const ethUsd = await getETHPrice()
			const vethEth = await getVetherPrice()
			const vethUsd = vethEth * ethUsd
			const vethCap = totalEmitted * vethUsd
			const impliedEth = currentBurn / emission
			const impliedUsd = impliedEth * ethUsd
			const priceData = {
				eth: { usd: ethUsd },
				veth: {
					implied: {
						eth: impliedEth,
						usd: impliedUsd
					},
					eth: vethEth,
					usd: vethUsd,
					cap: vethCap
				}
			}
			setPrice(priceData)
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		const body = document.getElementsByTagName('body')[0]
		body.classList.add('dark')
		loadData()
		return () => {
			body.classList.remove('dark')
		}
		// eslint-disable-next-line
	}, [])

	return (
		<>
			<h1 style={{ marginBottom: '1.33rem' }}>OVERVIEW</h1>

			<Row type={'flex'} justify={'center'}>
					<Col lg={15}>
						<Row type={'flex'} style={{ marginBottom: '8.44rem' }}>
							<Col sm={8}>
								<NumberTop
									value={currency(distribution.currentBurn, 0, 2, 'ETH')}
									alt={'total value burnt today'} />
							</Col>
							<Col sm={8}>
								<NumberTop value={currency(price.veth.implied.usd)} alt={'implied value today'} />
							</Col>
							<Col sm={8}>
								<NumberTop value={distribution.emission} alt={'current daily emission'} />
							</Col>
						</Row>

						<p style={{ color: defaults.color.gray, marginBottom: '0.9rem' }}>Price</p>
						<span style={{ fontSize: '1.66rem' }}>$</span>
						<p style={{ fontSize: '7rem', lineHeight: '2.28rem', marginLeft: '13px', marginBottom: '1.9rem' }}>
							{currency(price.veth.usd).replace('$', '')}
						</p>
						<span style={{ marginLeft: '2px', fontSize: '1rem', display: 'block' }}>
							{currency(price.veth.eth, 0, 5, 'ETH')}
						</span>
						<NumberBottom value={currency(price.veth.cap, 0, 0)} alt={'MARKET CAP'} />
						<NumberBottom value={currency(distribution.totalEmitted,
							0, 0, 'VETH').replace('VETH','')} alt={'EMITTED'} />
						<NumberBottom value={'1,000,000'} alt={'TOTAL SUPPLY'} />
					</Col>

					<Col lg={9}>
						<BurnIndicator scale={8} titleFontSize={'3.33rem'} />
					</Col>
				</Row>
		</>
	)
}

export default Hero
