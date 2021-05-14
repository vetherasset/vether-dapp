import React, { useEffect, useState } from 'react'
import {
	Flex, Container, Box, Heading, Badge,
	Progress, ScaleFade, Fade,
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
	const [countDownId, setCountDownId] = useState(-1)
	const [remainingTime, setRemainingTime] = useState(undefined)
	const [dayProgress, setDayProgress] = useState(undefined)
	const [currentBurn, setCurrentBurn] = useState(undefined)
	const [price, setPrice] = useState(undefined)
	const [ethPrice, setEthPrice] = useState(undefined)
	const [emission, setEmission] = useState(undefined)
	const [emissionDay, setEmissionDay] = useState(undefined)
	const [emissionEra, setEmissionEra] = useState(undefined)
	const [supply, setSupply] = useState(undefined)

	useEffect(() => {
		if (dayProgress >= 100 || dayProgress === undefined) {
			getNextDayTime(
				defaults.network.provider,
			)
				.then(n => {
					setNextDayTime(n)
					setCountDownId(n.toString() * 1000)
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
		if (nextDayTime) setRemainingTime(nextDayTime.toString() * 1000)
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

			<Flex maxWidth='60ch' m='23px auto 9px auto' minH={{ base: '86.6667px', sm: '103.167px' }}>
				<Container p='0'>
					<ScaleFade
						initialScale={0.9}
						in={price && ethPrice}>
						<Box textAlign='left'><Badge>Price</Badge></Box>
						<Box fontSize={{ base: '1.3rem', md: '2.3rem', lg: '2.3rem' }} lineHeight='1.2' fontWeight='normal' mb='19px' textAlign='left'>
							{price && ethPrice &&
							prettifyCurrency(price * ethPrice, 0, 2)
							}
						</Box>
					</ScaleFade>
				</Container>

				<Container p='0' ml={{ base: '0', sm: '51px' }}>
					<ScaleFade
						initialScale={0.9}
						in={supply && price && ethPrice}>
						<Box textAlign='left'>
							<Badge layerStyle='badge'>MCAP</Badge>
						</Box>
						<Box fontSize={{ base: '1.3rem', md: '2.3rem', lg: '2.3rem' }} lineHeight='1.2' fontWeight='normal' mb='19px' textAlign='left'>
							{supply && price && ethPrice &&
							'$' + numabbr((1000000 - Number(ethers.utils.formatEther(supply))) * ((price * ethPrice)))
							}
						</Box>
					</ScaleFade>
				</Container>

				<Container p='0' ml={{ base: '0', sm: '70px' }}>
					<ScaleFade
						initialScale={0.9}
						in={supply}>
						<Box textAlign='left'>
							<Badge layerStyle='badge'>CIRCULATING</Badge>
						</Box>
						<Box fontSize={{ base: '1.3rem', md: '2.3rem', lg: '2.3rem' }} lineHeight='1.2' fontWeight='normal' mb='19px' textAlign='left'>
							{supply &&
							numabbr((1000000 - Number(ethers.utils.formatEther(supply))), { precision: 2 })
							}
						</Box>
					</ScaleFade>
				</Container>
			</Flex>

			<Flex maxWidth='60ch' p='0 6px' m='0px auto'>
				<Box mb='5px' minH='24px'>
					<ScaleFade
						initialScale='0.9'
						in={emissionDay && emissionEra}
						unmountOnExit>
						{emissionDay &&
							<Badge layerStyle='badge'>DAY {emissionDay.toString()}</Badge>
						}
						{emissionEra &&
							<Badge ml='5px' layerStyle='badge'>ERA {emissionEra.toString()}</Badge>
						}
					</ScaleFade>
				</Box>
			</Flex>
			<Container padding='0 6px 19.167px' mb='19px' >
				<Progress colorScheme='vether'
					height='32px'
					borderRadius='13px'
					background='#1E1E1E'
					value={dayProgress}
					hasStripe isAnimated/>
			</Container>

			<Flex {...props} justifyContent='center'>
				<Box w='60ch'>
					<Container layerStyle='overview'>
						<Heading as='h4' size='xs' fontWeight='normal' fontStyle='italic' lineHeight='1' mb='5px' opacity='0.8'>
					Remaining time
						</Heading>
						<Fade
							in={remainingTime}
							unmountOnExit>
							{remainingTime &&
						<Box textStyle='overviewItem'>
							<Countdown
								zeroPadTime={2}
								daysInHours={true}
								key={countDownId}
								date={remainingTime}>
									 <Box as='span' fontSize='1.3rem'>One more burn to start new day.</Box>
							</Countdown>
						</Box>
							}
						</Fade>
					</Container>

					<Container layerStyle='overview'>
						<Heading as='h4' size='xs' fontWeight='normal' fontStyle='italic' lineHeight='1' mb='5px' opacity='0.8'>
					Total value burnt today
						</Heading>
						<Fade
							in={currentBurn}
							unmountOnExit>
							{currentBurn &&
								<Box textStyle='overviewItem'>
									{currentBurn &&
										<>
											{prettifyCurrency(ethers.utils.formatEther(currentBurn), 0, 2, 'ETH').replace('Ξ', '')}
											<span style={{ fontFamily: 'arial' }}>Ξ</span>
										</>
									}
								</Box>
							}
						</Fade>
					</Container>

					<Container layerStyle='overview'>
						<Heading as='h4' size='xs' fontWeight='normal' fontStyle='italic' lineHeight='1' mb='5px' opacity='0.8'>
					Implied value today
						</Heading>
						<Fade
							initialScale={0.9}
							in={currentBurn && emission && ethPrice}
							unmountOnExit>
							{currentBurn && emission && ethPrice &&
						<Box textStyle='overviewItem'>
							{currentBurn && emission && ethPrice &&
								prettifyCurrency((Number(ethers.utils.formatEther(currentBurn)) / Number(ethers.utils.formatEther(emission))) * ethPrice)
							}
						</Box>
							}
						</Fade>
					</Container>

					<Container layerStyle='overview'>
						<Heading as='h4' size='xs' fontWeight='normal' fontStyle='italic' lineHeight='1' mb='5px' opacity='0.8'>
					Current daily emission
						</Heading>
						<Fade
							initialScale={0.9}
							in={emission}
							unmountOnExit>
							{emission &&
						<Box textStyle='overviewItem'>
							{emission &&
								prettifyCurrency(ethers.utils.formatEther(emission), 0, 0, 'VETH')
							}
						</Box>
							}
						</Fade>
					</Container>
				</Box>
			</Flex>
		</>
	)
}
