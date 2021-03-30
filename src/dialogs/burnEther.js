import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import defaults from '../common/defaults'
import {
	Flex, Heading, NumberInput, NumberInputField, Button, Badge, Box, Tooltip,
} from '@chakra-ui/react'
import { useWallet } from 'use-wallet'
import { getCurrentBurn, getEmission, burnEther } from '../common/ethereum'
import { getVetherValueStrict } from '../common/utils'

export const BurnEther = () => {

	const wallet = useWallet()
	const [amount, setAmount] = useState('')
	const [value, setValue] = useState(0)
	const [currentBurn, setCurrentBurn] = useState(undefined)
	const [emission, setEmission] = useState(undefined)

	useEffect(() => {
		getCurrentBurn(defaults.network.provider).then(n => setCurrentBurn(Number(ethers.utils.formatEther(n))))
	}, [])

	useEffect(() => {
		getEmission(defaults.network.provider).then(n => setEmission(Number(ethers.utils.formatEther(n))))
	}, [])

	return (
		<>
			<Flex flexFlow='column' h='25%'>
				<Heading as='h3' size='md' textAlign='center' m='-4px 0 11px 0'>ACQUIRE VETHER</Heading>
				<span>Acquire a share of today’s emission by burning Ether.</span>
			</Flex>
			<Flex flexFlow='column' h='25%'>
				<Heading as='h3' size='sm' mb='11px'>Amount Eth to burn</Heading>
				<NumberInput
					min={0}
					value={amount}
					onChange={(n) => {
						setAmount(n)
						getVetherValueStrict(n, currentBurn, emission).then(v => setValue(v))
					}}
					clampValueOnBlur={false}
					variant='filled'
				>
					<NumberInputField placeholder='🔥🔥🔥' />
				</NumberInput>
			</Flex>
			<Flex flexFlow='column' h='25%'>
				<Heading as='h3' textAlign='center'>
					{value === 0 ? value : value.toFixed(5)}
				</Heading>
				<Heading as='span' size='sm' fontWeight='normal' textAlign='center'>Potential Veth value</Heading>
				<Box width='98px'
					m='0 auto'>
					<Tooltip hasArrow
						label='Your share might be different at the end of the day! The final amount of Veth you get is dependent on how much you burn, compared to how much everyone else burns.'
						placement='bottom'
						color='white'
						bg='rgb(0,0,0)'
						arrowShadowColor='rgb(0,0,0)'>
						<Box textAlign='center'>
							<Badge background='rgb(214, 188, 250)' color='rgb(128, 41, 251)'>What is this?</Badge>
						</Box>
					</Tooltip>
				</Box>
			</Flex>
			<Flex flexFlow='column' h='25%'>
				<Button w="100%" onClick={() => { burnEther('0.0001', wallet) }}>
					Burn
				</Button>
			</Flex>
		</>
	)
}
