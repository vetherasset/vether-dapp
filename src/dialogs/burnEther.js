import React from 'react'
import { Flex, Heading, NumberInput, NumberInputField, NumberInputStepper,
	NumberIncrementStepper, NumberDecrementStepper, Button, Badge, Box, Tooltip } from '@chakra-ui/react'

export const BurnEther = () => {

	return (
		<>
			<Flex flexFlow='column' h='25%'>
				<Heading as='h3' size='md' textAlign='center' m='-4px 0 11px 0'>ACQUIRE VETHER</Heading>
				<span>Acquire a share of today’s emission by burning Ether.</span>
			</Flex>
			<Flex flexFlow='column' h='25%'>
				<NumberInput
					defaultValue={15}
					max={10}
					keepWithinRange={false}
					clampValueOnBlur={false}
				>
					<Heading as='h3' size='sm' mb='11px'>Amount Eth to burn</Heading>
					<NumberInputField />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
			</Flex>
			<Flex flexFlow='column' h='25%'>
				<Heading as='h3' textAlign='center'>201.51 Veth</Heading>
				<Heading as='span' size='sm' fontWeight='normal' textAlign='center'>Potential Veth value</Heading>
				<Tooltip hasArrow label='The amount of Veth you get is dependent on how much you burn, compared to how much everyone else burns.' placement='top' color='white' bg='rgba(0,0,0,.85)' arrowShadowColor='rgba(0,0,0,.95)'>
					<Box textAlign='center'><Badge colorScheme='purple'>What is this?</Badge></Box>
				</Tooltip>
			</Flex>
			<Flex flexFlow='column' h='25%'>
				<Button w="100%">
					Burn
				</Button>
			</Flex>
		</>
	)
}
