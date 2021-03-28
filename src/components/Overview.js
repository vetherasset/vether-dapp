import React, { useEffect, useState } from 'react'
import { Flex, Container, Heading } from '@chakra-ui/react'
import defaults from '../common/defaults'
import { getNextDayTime, getCurrentBurn, getUniswapAssetPrice, getEmission } from '../common/ethereum'
import { prettifyCurrency } from '../common/utils'
import Countdown from 'react-countdown'
import { ethers } from 'ethers'

export const Overview = (props) => {

	const [nextDayTime, setNextDayTime] = useState(undefined)
	const [currentBurn, setCurrentBurn] = useState(undefined)
	const [impliedValue, setImpliedValue] = useState(undefined)
	const [emission, setEmission] = useState(undefined)

	useEffect(() => {
		getNextDayTime(
			defaults.network.provider,
		)
			.then(n => setNextDayTime(n),
			)
	}, [])

	useEffect(() => {
		getCurrentBurn(
			defaults.network.provider,
		)
			.then(n => setCurrentBurn(n))
	}, [])

	useEffect(() => {
		getUniswapAssetPrice(
			defaults.network.address.uniswapPool,
			defaults.network.provider,
		)
			.then(n => setImpliedValue(n))
	}, [])

	useEffect(() => {
		getEmission(
			defaults.network.provider,
		)
			.then(n => setEmission(n))
	}, [])

	return (
		<Flex {...props}>

			<Container>
				<Heading as='h2' size='xl' fontWeight='normal' mb='30px'>
				$21.75
				</Heading>
			</Container>

			<Container layerStyle='overview'>
				<Heading as='h4' size='sm' fontWeight='normal' fontStyle='italic'>
					Remaining time
				</Heading>
				{nextDayTime &&
						<Heading as='h3' size='xl'>
							<Countdown
								zeroPadTime={2}
								daysInHours={true}
								date={Number(nextDayTime.toString()) * 1000}>
									 <>One more burn to start new day.</>
							</Countdown>
						</Heading>
				}
			</Container>

			<Container layerStyle='overview'>
				<Heading as='h4' size='sm' fontWeight='normal' fontStyle='italic'>
					Total value burnt today
				</Heading>
				{currentBurn &&
						<Heading as='h3' size='xl'>
							{prettifyCurrency(ethers.utils.formatEther(currentBurn), 0, 2, 'ETH')}
						</Heading>
				}
			</Container>

			<Container layerStyle='overview'>
				<Heading as='h4' size='sm' fontWeight='normal' fontStyle='italic'>
					Implied value today
				</Heading>
				{impliedValue &&
						<Heading as='h3' size='xl'>
							{prettifyCurrency(impliedValue, 0, 5, 'ETH')}
						</Heading>
				}
			</Container>

			<Container layerStyle='overview'>
				<Heading as='h4' size='sm' fontWeight='normal' fontStyle='italic'>
					Current daily emission
				</Heading>
				{emission &&
						<Heading as='h3' size='xl'>
							{prettifyCurrency(ethers.utils.formatEther(emission), 0, 0, 'VETH')}
						</Heading>
				}
			</Container>
		</Flex>
	)
}
