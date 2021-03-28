import React, { useEffect, useState } from 'react'
import { Flex, Container, Box, Heading, Badge } from '@chakra-ui/react'
import defaults from '../common/defaults'
import { getNextDayTime, getCurrentBurn, getUniswapAssetPrice, getEmission } from '../common/ethereum'
import { prettifyCurrency } from '../common/utils'
import Countdown from 'react-countdown'
import { ethers } from 'ethers'
import numabbr from 'numabbr'

export const Overview = (props) => {

	const [nextDayTime, setNextDayTime] = useState(undefined)
	const [currentBurn, setCurrentBurn] = useState(undefined)
	const [price, setPrice] = useState(undefined)
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
			.then(n => setPrice(n))
	}, [])

	useEffect(() => {
		getEmission(
			defaults.network.provider,
		)
			.then(n => setEmission(n))
	}, [])

	return (
		<>
			<Box>
				<Container mb='23px'>
					<Heading as='h1' size='md'>Overview</Heading>
				</Container>
			</Box>
			<Flex maxWidth='60ch' m='0 auto'>
				<Container>
					<Box textAlign='left'><Badge>Price</Badge></Box>
					<Heading as='h2' size='xl' fontWeight='normal' mb='19px' textAlign='left'>
						{prettifyCurrency(price, 0, 2, 'ETH')}
					</Heading>
				</Container>

				<Container>
					<Box textAlign='left'><Badge>MCAP</Badge></Box>
					<Heading as='h2' size='xl' fontWeight='normal' mb='35px' textAlign='left'>
						${numabbr(13763137)}
					</Heading>
				</Container>

				<Container>
					<Box textAlign='left'><Badge>EMITTED</Badge></Box>
					<Heading as='h2' size='xl' fontWeight='normal' mb='35px' textAlign='left'>
						{numabbr(542830)}
					</Heading>
				</Container>
			</Flex>

			<Flex {...props}>

				<Container layerStyle='overview'>
					<Heading as='h4' size='xs' fontWeight='normal' fontStyle='italic' lineHeight='1' mb='5px'>
					Remaining time
					</Heading>
					{nextDayTime &&
						<Heading as='h3' size='lg'>
							<Countdown
								zeroPadTime={2}
								daysInHours={true}
								date={Number(nextDayTime.toString()) * 1000}>
									 <Box as='span' fontSize='1.3rem'>One more burn to start new day.</Box>
							</Countdown>
						</Heading>
					}
				</Container>

				<Container layerStyle='overview'>
					<Heading as='h4' size='xs' fontWeight='normal' fontStyle='italic' lineHeight='1' mb='5px'>
					Total value burnt today
					</Heading>
					{currentBurn &&
						<Heading as='h3' size='lg'>
							{prettifyCurrency(ethers.utils.formatEther(currentBurn), 0, 2, 'ETH')}
						</Heading>
					}
				</Container>

				<Container layerStyle='overview'>
					<Heading as='h4' size='xs' fontWeight='normal' fontStyle='italic' lineHeight='1' mb='5px'>
					Implied value today
					</Heading>
					{price &&
						<Heading as='h3' size='lg'>
							{prettifyCurrency(price, 0, 5, 'ETH')}
						</Heading>
					}
				</Container>

			s<Container layerStyle='overview'>
					<Heading as='h4' size='xs' fontWeight='normal' fontStyle='italic' lineHeight='1' mb='5px'>
					Current daily emission
					</Heading>
					{emission &&
						<Heading as='h3' size='lg'>
							{prettifyCurrency(ethers.utils.formatEther(emission), 0, 0, 'VETH')}
						</Heading>
					}
				</Container>
			</Flex>
		</>
	)
}
