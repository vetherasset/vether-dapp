import React, { useEffect, useState } from 'react'
import {
	Flex, Heading, NumberInput, NumberInputField, Button, Badge, Box, Tooltip,
} from '@chakra-ui/react'
import { getVetherValue } from '../common/ethereum'

export const BurnEther = () => {

	const [amount, setAmount] = useState('')
	const [value, setValue] = useState('')

	useEffect(() => {
		getVetherValue(amount)
			.then(n => setValue(n))
	}, [amount])

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
					onChange={(n) => setAmount(n)}
					clampValueOnBlur={false}
					variant='filled'
				>
					<NumberInputField placeholder='🔥🔥🔥' />
				</NumberInput>
			</Flex>
			<Flex flexFlow='column' h='25%'>
				<Heading as='h3' textAlign='center'>
					{value}
				</Heading>
				<Heading as='span' size='sm' fontWeight='normal' textAlign='center'>Potential Veth value</Heading>
				<Box width='98px'
					m='0 auto'>
					<Tooltip hasArrow
						label='The amount of Veth you get is dependent on how much you burn, compared to how much everyone else burns.'
						placement='bottom'
						color='white'
						bg='rgb(0,0,0)'
						arrowShadowColor='rgb(0,0,0)'>
						<Box textAlign='center'>
							<Badge colorScheme='purple'>What is this?</Badge>
						</Box>
					</Tooltip>
				</Box>
			</Flex>
			<Flex flexFlow='column' h='25%'>
				<Button w="100%">
					Burn
				</Button>
			</Flex>
		</>
	)
}
