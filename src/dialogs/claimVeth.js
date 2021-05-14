import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ethers } from 'ethers'
import defaults from '../common/defaults'
import {
	Flex, Box, Select, Button, Progress,
	useToast, Badge, Spinner,
} from '@chakra-ui/react'
import { useWallet } from 'use-wallet'
import {
	getClaimDayNums, getEmissionEra, getShare, claimShare,
} from '../common/ethereum'
import { getAvailableEras, prettifyCurrency } from '../common/utils'
import { claimed, failed, rejected, walletNotConnected, eraNotSelected, dayNotSelected } from '../messages'

export const ClaimVeth = (props) => {

	ClaimVeth.propTypes = {
		width: PropTypes.string.isRequired,
		visible: PropTypes.number.isRequired,
	}

	const wallet = useWallet()
	const toast = useToast()
	const [emissionEra, setEmissionEra] = useState(undefined)
	const [availableEras, setAvailableEras] = useState(undefined)
	const [eachDayContributed, setEachDayContributed] = useState(undefined)
	const [era, setEra] = useState(undefined)
	const [day, setDay] = useState(undefined)
	const [share, setShare] = useState(undefined)
	const [submitingTx, setSubmitingTx] = useState(false)
	const [gettingClaimDays, setGettingClaimDays] = useState(false)

	useEffect(() => {
		getEmissionEra(defaults.network.provider)
			.then(n => setEmissionEra(n.toNumber()))
	}, [])

	useEffect(() => {
		getAvailableEras(emissionEra)
			.then(a => setAvailableEras(a))
	}, [emissionEra])

	useEffect(() => {
		if(wallet.account) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			if(era) {
				setEachDayContributed(undefined)
				setGettingClaimDays(true)
				getClaimDayNums(era, wallet.account, provider)
					.then(cd => {
						setEachDayContributed(cd)
						setGettingClaimDays(false)
					})
			}
		}
		if (era === '') setEachDayContributed(undefined)
		return () => {
			setShare(undefined)
			setDay(undefined)
		}
	}, [era, wallet])

	useEffect(() => {
		if(wallet.account && era && day) {
			const provider = new ethers.providers.Web3Provider(wallet.ethereum)
			getShare(ethers.BigNumber.from(era), ethers.BigNumber.from(day), wallet.account, provider)
				.then((s) => {
					setShare(ethers.utils.formatEther(s))
				})
		}
		return () => setShare(undefined)
	}, [day, wallet])

	return (
		<>
			<Flex flexFlow='column' width={props.width} display={props.visible === -1 ? 'none' : 'flex'}>
				<Box as='h3' fontSize='1.2rem' fontWeight='bold' size='md' textAlign='center'>CLAIM VETHER</Box>
				<Box as='span' textAlign='center'>Claim previous day’s emission share.</Box>
			</Flex>

			<Flex flexFlow='column' width={props.width}>
				<Box as='h3' fontWeight='bold' size='sm' mb='11px'>Emission Era</Box>
				<Select isRequired
				 placeholder='Select available era'
				 onChange={(event) => {
						setEra(event.target.value)
					}}
				 variant='filled'>
					{availableEras && availableEras.map((e, index) => {
						return (
							<option value={e} key={index}>{e}</option>
						)
					})}
				</Select>
			</Flex>

			<Flex flexFlow='column' width={props.width} display={props.visible === -1 ? 'none' : 'flex'}>
				<Box as='h3' fontWeight='bold' mb='11px'>Emission Day</Box>
				<Select
				 disabled={!eachDayContributed || eachDayContributed.length === 0 || gettingClaimDays}
				 isRequired
				 placeholder={!eachDayContributed || eachDayContributed.length === 0 ? 'No claimable days available' : 'Select available day'}
				 onChange={(event) => {
						setDay(event.target.value)
					}}
				 variant='filled'>
					{eachDayContributed && eachDayContributed.map((d, index) => {
						return (
							<option value={d.toNumber()} key={index}>{d.toString()}</option>
						)
					})}
				</Select>
				<Progress
					visibility={gettingClaimDays ? 'visible' : 'hidden'}
					mt='5px'
					size='sm'
					borderRadius='13px'
					colorScheme='vether'
					isIndeterminate
				/>
			</Flex>

			<Flex flexFlow='column' width={props.width} display={props.visible === -1 ? 'none' : 'flex'}>
				<Box as='h3' fontSize='1.9rem' fontWeight='bold' textAlign='center'>
					{isNaN(share) ? prettifyCurrency(0, 0, 2, 'VETH') : prettifyCurrency(share, 0, 2, 'VETH')}
				</Box>
				<Box textAlign='center'>
					<Badge as='div' background='rgb(214, 188, 250)' color='rgb(128, 41, 251)'>Your Acquired Share</Badge>
				</Box>
			</Flex>

			<Flex flexFlow='column' width={props.width} display={props.visible === -1 ? 'none' : 'flex'}>
				<Button w='100%'
					isLoading={submitingTx}
					loadingText='Submitting'
					spinner={<Spinner size='sm' variant='inverted' />}
					onClick={() => {
						if (!wallet.account) {
							toast(walletNotConnected)
							return
						}
						if (!era) {
							toast(eraNotSelected)
							return
						}
						if (!day) {
							toast(dayNotSelected)
							return
						}
						setSubmitingTx(true)
						const provider = new ethers.providers.Web3Provider(wallet.ethereum)
						claimShare(era, day, provider)
							.then((tx) => {
								tx.wait().then(() => {
									setSubmitingTx(false)
									toast(claimed)
								}).catch((err) => {
									setSubmitingTx(false)
									console.log('Error code is:' + err.code)
									console.log('Error:' + err)
									toast(failed)
								})
							})
							.catch((err) => {
								if(err.code === 4001) {
									setSubmitingTx(false)
									console.log('Transaction rejected: Your have decided to reject the transaction.')
									toast(rejected)
								}
								else {
									setSubmitingTx(false)
									console.log('Error code is:' + err.code)
									console.log('Error:' + err)
									toast(failed)
								}
							})
					}}>
					Claim
				</Button>
			</Flex>
		</>
	)
}
