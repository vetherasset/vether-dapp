import React, { useEffect, useState } from 'react'
import {
	Flex, Container, Box, Heading, Badge,
	Progress,
} from '@chakra-ui/react'
import defaults from '../common/defaults'
import {
	getNextDayTime, getCurrentBurn, getUniswapAssetPrice, getEmissionDay, getEmission,
	getEmissionEra, getEmitted,
} from '../common/ethereum'
import { prettifyCurrency } from '../common/utils'
import Countdown from 'react-countdown'
import { ethers } from 'ethers'
import numabbr from 'numabbr'

export const Overview = (props) => {

	const [nextDayTime, setNextDayTime] = useState(undefined)
	const [currentBurn, setCurrentBurn] = useState(undefined)
	const [price, setPrice] = useState(undefined)
	const [ethPrice, setEthPrice] = useState(undefined)
	const [emission, setEmission] = useState(undefined)
	const [emissionDay, setEmissionDay] = useState(undefined)
	const [emissionEra, setEmissionEra] = useState(undefined)
	const [emitted, setEmitted] = useState(undefined)


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
			defaults.network.address.uniswap.veth,
			18,
			18,
			false,
			defaults.network.provider,
		)
			.then(n => setPrice(n))
	}, [])

	useEffect(() => {
		getUniswapAssetPrice(
			defaults.network.address.uniswap.usdc,
			6,
			18,
			true,
			defaults.network.provider,
		)
			.then(n => setEthPrice(n))
	}, [])

	useEffect(() => {
		getEmissionDay(
			defaults.network.provider,
		)
			.then(n => setEmissionDay(n))
	}, [])

	useEffect(() => {
		getEmission(
			defaults.network.provider,
		)
			.then(n => setEmission(n))
	}, [])

	useEffect(() => {
		getEmissionEra(
			defaults.network.provider,
		)
			.then(n => setEmissionEra(n))
	}, [])

	useEffect(() => {
		getEmitted(
			defaults.network.provider,
		)
			.then(n => setEmitted(n))
	}, [])

	return (
		<>
			<Box>
				<Container mb='23px' p='0'>
					<Heading as='h1' size='md'>Overview</Heading>
				</Container>
			</Box>

			<Flex maxWidth='60ch' m='23px auto 9px auto' minH={{ lg: '103.167' }}>
				<Container p='0'>
					<Box textAlign='left'><Badge>Price</Badge></Box>
					<Heading as='h2' fontSize={{ base: '1.1rem', md: '2.3rem', lg: '2.3rem' }} fontWeight='normal' mb='19px' textAlign='left'>
						{price && ethPrice &&
							prettifyCurrency(price * ethPrice, 0, 2)
						}
					</Heading>
				</Container>

				<Container>
					<Box textAlign='left'>
						<Badge layerStyle='badge'>MCAP</Badge>
					</Box>
					<Heading as='h2' fontSize={{ base: '1.1rem', md: '2.3rem', lg: '2.3rem' }} fontWeight='normal' mb='35px' textAlign='left'>
						{price && emitted &&
							'$' + numabbr(emitted * (price * ethPrice))
						}
					</Heading>
				</Container>

				<Container p='0'>
					<Box textAlign='left'>
						<Badge layerStyle='badge'>EMITTED</Badge>
					</Box>
					<Heading as='h2' fontSize={{ base: '1.1rem', md: '2.3rem', lg: '2.3rem' }} fontWeight='normal' mb='35px' textAlign='left'>
						{emitted &&
							numabbr(emitted)
						}
					</Heading>
				</Container>
			</Flex>

			<Flex maxWidth='60ch' m='0px auto' minH='103.167px'>
				<Container padding='0 6px' mb='19px' >
					<Box textAlign='left' mb='5px' minH='24px'>
						{emissionDay &&
							<Badge layerStyle='badge'>DAY {emissionDay.toString()}</Badge>
						}
						{emissionEra &&
							<Badge ml='5px' layerStyle='badge'>ERA {emissionEra.toString()}</Badge>
						}
					</Box>
					<Progress colorScheme='green' height='32px' value={20} borderRadius='13px' hasStripe isAnimated/>
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
							{prettifyCurrency((currentBurn / emission) * ethPrice)}
						</Heading>
					}
				</Container>

				<Container layerStyle='overview'>
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
