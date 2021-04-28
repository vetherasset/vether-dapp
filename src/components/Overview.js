import React, { useEffect, useState } from 'react'
import {
	Flex, Container, Box, Heading, Badge,
	Progress,
} from '@chakra-ui/react'
import defaults from '../common/defaults'
import {
	getNextDayTime, getCurrentBurn, getUniswapAssetPrice, getEmissionDay, getEmission,
	getEmissionEra, getERC20BalanceOf,
} from '../common/ethereum'
// eslint-disable-next-line no-unused-vars
import { prettifyCurrency, getSecondsToGo } from '../common/utils'
import Countdown from 'react-countdown'
import { ethers } from 'ethers'
import numabbr from 'numabbr'

export const Overview = (props) => {

	// eslint-disable-next-line no-unused-vars
	const [inited, setInited] = useState(-1)
	const [refresh, setRefresh] = useState(undefined)
	// eslint-disable-next-line no-unused-vars
	const [autoRefresh, setAutoRefresh] = useState(true)
	const [pollTime, setPollTime] = useState(defaults.poll.time)
	const [nextDayTime, setNextDayTime] = useState(undefined)
	const [remainingTime, setRemainingTime] = useState(undefined)
	const [dayProgress, setDayProgress] = useState(0)
	const [currentBurn, setCurrentBurn] = useState(undefined)
	const [price, setPrice] = useState(undefined)
	const [ethPrice, setEthPrice] = useState(undefined)
	const [emission, setEmission] = useState(undefined)
	const [emissionDay, setEmissionDay] = useState(undefined)
	const [emissionEra, setEmissionEra] = useState(undefined)
	const [supply, setSupply] = useState(undefined)

	useEffect(() => {
		if (dayProgress >= 100 || dayProgress === 0) {
			getNextDayTime(
				defaults.network.provider,
			)
				.then(n => {
					setNextDayTime(n)
					setInited(prevState => prevState + 1)
				})
		}
	}, [refresh])

	useEffect(() => {
		if (nextDayTime) {
			let p = ((82400 - getSecondsToGo(nextDayTime)) / 82400) * 100
			p = p < 0 ? 0 : p
			setDayProgress(p)
		}
		return () => setDayProgress(0)
	})

	useEffect(() => {
		if (dayProgress > 99.3 && dayProgress < 100) setPollTime(defaults.poll.timePeak)
		return () => setPollTime(defaults.poll.time)
	}, [dayProgress])

	useEffect(() => {
		if (nextDayTime) setRemainingTime(Number(nextDayTime.toString()) * 1000)
	}, [nextDayTime])

	useEffect(() => {
		getERC20BalanceOf(
			defaults.network.address.vether,
			defaults.network.address.vether,
			defaults.network.provider,
		)
			.then(n => {
				setSupply(n)
				setInited(prevState => prevState + 1)
			})
	}, [refresh])

	useEffect(() => {
		getCurrentBurn(
			defaults.network.provider,
		)
			.then(n => {
				setCurrentBurn(n)
				setInited(prevState => prevState + 1)
			})
	}, [refresh])

	useEffect(() => {
		getUniswapAssetPrice(
			defaults.network.address.uniswap.veth,
			18,
			18,
			false,
			defaults.network.provider,
		)
			.then(n => {
				setPrice(n)
				setInited(prevState => prevState + 1)
			})
	}, [refresh])

	useEffect(() => {
		getUniswapAssetPrice(
			defaults.network.address.uniswap.usdc,
			6,
			18,
			true,
			defaults.network.provider,
		)
			.then(n => {
				setEthPrice(n)
				setInited(prevState => prevState + 1)
			})
	}, [refresh])

	useEffect(() => {
		getEmissionDay(
			defaults.network.provider,
		)
			.then(n => {
				setEmissionDay(n)
				setInited(prevState => prevState + 1)
			})
	}, [refresh])

	useEffect(() => {
		getEmission(
			defaults.network.provider,
		)
			.then(n => {
				setEmission(n)
				setInited(prevState => prevState + 1)
			})
	}, [refresh])

	useEffect(() => {
		getEmissionEra(
			defaults.network.provider,
		)
			.then(n => {
				setEmissionEra(n)
				setInited(prevState => prevState + 1)
			})
	}, [refresh])

	useEffect(() => {
		setInited(-1)
	}, [refresh])

	useEffect(() => {
		let r
		if(autoRefresh) {
			r = setInterval(() => {
				setRefresh(!refresh)
			}, pollTime)
		}
		return () => { if (r) clearInterval(r) }
	})

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
					<Heading as='h2' fontSize={{ base: '1.3rem', md: '2.3rem', lg: '2.3rem' }} fontWeight='normal' mb='19px' textAlign='left'>
						{price && ethPrice &&
							prettifyCurrency(price * ethPrice, 0, 2)
						}
					</Heading>
				</Container>

				<Container p='0' ml='51px'>
					<Box textAlign='left'>
						<Badge layerStyle='badge'>MCAP</Badge>
					</Box>
					<Heading as='h2' fontSize={{ base: '1.3rem', md: '2.3rem', lg: '2.3rem' }} fontWeight='normal' mb='35px' textAlign='left'>
						{supply && price && ethPrice &&
							'$' + numabbr((1000000 - Number(ethers.utils.formatEther(supply))) * ((price * ethPrice)))
						}
					</Heading>
				</Container>

				<Container p='0' ml='70px'>
					<Box textAlign='left'>
						<Badge layerStyle='badge'>CIRCULATING</Badge>
					</Box>
					<Heading as='h2' fontSize={{ base: '1.3rem', md: '2.3rem', lg: '2.3rem' }} fontWeight='normal' mb='35px' textAlign='left'>
						{supply &&
							numabbr((1000000 - Number(ethers.utils.formatEther(supply))), { precision: 2 })
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
					<Progress colorScheme='vether'
						height='32px'
						borderRadius='13px'
						value={dayProgress}
						zIndex='-1'
						hasStripe isAnimated/>
				</Container>
			</Flex>

			<Flex {...props}>
				<Container layerStyle='overview'>
					<Heading as='h4' size='xs' fontWeight='normal' fontStyle='italic' lineHeight='1' mb='5px'>
					Remaining time
					</Heading>
					{remainingTime &&
						<Heading as='h3' size='lg'>
							<Countdown
								zeroPadTime={2}
								daysInHours={true}
								date={remainingTime}>
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
							{currentBurn &&
								prettifyCurrency(ethers.utils.formatEther(currentBurn), 0, 2, 'ETH')
							}
						</Heading>
					}
				</Container>

				<Container layerStyle='overview'>
					<Heading as='h4' size='xs' fontWeight='normal' fontStyle='italic' lineHeight='1' mb='5px'>
					Implied value today
					</Heading>
					{price &&
						<Heading as='h3' size='lg'>
							{currentBurn && emission && ethPrice &&
								prettifyCurrency((Number(ethers.utils.formatEther(currentBurn)) / Number(ethers.utils.formatEther(emission))) * ethPrice)
							}
						</Heading>
					}
				</Container>

				<Container layerStyle='overview'>
					<Heading as='h4' size='xs' fontWeight='normal' fontStyle='italic' lineHeight='1' mb='5px'>
					Current daily emission
					</Heading>
					{emission &&
						<Heading as='h3' size='lg'>
							{emission &&
								prettifyCurrency(ethers.utils.formatEther(emission), 0, 0, 'VETH')
							}
						</Heading>
					}
				</Container>
			</Flex>
		</>
	)
}
