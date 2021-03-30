import React from 'react'
import { Flex, Heading, NumberInput, NumberInputField, NumberInputStepper,
	NumberIncrementStepper, NumberDecrementStepper, Button } from '@chakra-ui/react'

export const BurnEther = () => {

	return (
		<>
			<Flex flexFlow='column' h='33%'>
				<Heading as='h3' size='md'>ACQUIRE VETHER</Heading>
				<span>Acquire a share of today’s emission by burning Ether.</span>
			</Flex>
			<Flex flexFlow='column' h='33%'>
				<NumberInput
					defaultValue={15}
					max={10}
					keepWithinRange={false}
					clampValueOnBlur={false}
				>
					<Heading as='h3' size='sm'>Amount Ether to burn</Heading>
					<NumberInputField />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>

				<Heading as='h3'>201.51 Veth</Heading>
			</Flex>
			<Flex flexFlow='column' h='33%'>
				<Button w="100%">
					Burn
				</Button>
			</Flex>
		</>
	)
}
