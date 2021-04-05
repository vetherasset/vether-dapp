import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import defaults from '../common/defaults'
import {
	Flex, Heading, Select, Button,
	useToast,
} from '@chakra-ui/react'
import { useWallet } from 'use-wallet'
import {
	getClaimDayNums, getEmissionEra, getShare, claimShare,
} from '../common/ethereum'
import { getAvailableEras, prettifyCurrency } from '../common/utils'
import { claimed, failed, rejected } from '../messages'

export const ClaimVeth = () => {

	const wallet = useWallet()
	const toast = useToast()
	const [emissionEra, setEmissionEra] = useState(undefined)
	const [availableEras, setAvailableEras] = useState(undefined)
	const [eachDayContributed, setEachDayContributed] = useState(undefined)
	const [era, setEra] = useState(undefined)
	const [day, setDay] = useState(undefined)
	const [share, setShare] = useState(undefined)
	const [working, setWorking] = useState(false)

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
				getClaimDayNums(era, wallet.account, provider)
					.then(cd => setEachDayContributed(cd))
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
			<Flex flexFlow='column' h='20%'>
				<Heading as='h3' size='md' textAlign='center' m='-4px 0 11px 0'>CLAIM VETHER</Heading>
				<span>Claim your share of a previous day’s emission.</span>
			</Flex>

			<Flex flexFlow='column' h='20%'>
				<Heading as='h3' size='sm' mb='11px'>Emission Era</Heading>
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

			<Flex flexFlow='column' h='20%'>
				<Heading as='h3' size='sm' mb='11px'>Emission Day</Heading>
				<Select isRequired
				 placeholder='Select available day'
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
			</Flex>

			<Flex flexFlow='column' h='20%'>
				<Heading as='h3' textAlign='center'>
					{isNaN(share) ? prettifyCurrency(0, 0, 2, 'VETH') : prettifyCurrency(share, 0, 2, 'VETH')}
				</Heading>
				<Heading as='span' size='sm' fontWeight='normal' textAlign='center'>Acquired share</Heading>
			</Flex>

			<Flex flexFlow='column' h='20%'>
				<Button w='100%'
					isLoading={working}
					loadingText='Submitting'
					onClick={() => {
						if (wallet.account) {
							setWorking(true)
							const provider = new ethers.providers.Web3Provider(wallet.ethereum)
							claimShare(era, day, provider)
								.then((tx) => {
									tx.wait().then(() => {
										setWorking(false)
										toast(claimed)
									}).catch((err) => {
										setWorking(false)
										console.log('Error code is:' + err.code)
										console.log('Error:' + err)
										toast(failed)
									})
								})
								.catch((err) => {
									if(err.code === 4001) {
										setWorking(false)
										console.log('Transaction rejected: Your have decided to reject the transaction.')
										toast(rejected)
									}
									else {
										setWorking(false)
										console.log('Error code is:' + err.code)
										console.log('Error:' + err)
										toast(failed)
									}
								})
						}
					}}>
					Claim
				</Button>
			</Flex>
		</>
	)
}
