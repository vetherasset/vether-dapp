import React from 'react'
import { Flex, Spacer, useBreakpointValue } from '@chakra-ui/react'

import { Logotype } from './Logotype'
import { WalletConnectionToggle } from './WalletConnectionToggle'


export const Header = (props) => {

	const size = useBreakpointValue({
		base: 'sm',
		sm: 'sm',
		md: 'md',
	})

	return (
		<Flex {...props}>
			<Flex w="33%">
				<Logotype h='60px'
					transform='scale(0.9)' />
			</Flex>
			<Spacer />
			<Flex w="33%"
				justifyContent='flex-end'
				alignItems='center'
			>
				<WalletConnectionToggle
					marginLeft='0.6rem'
					size={size} />
				{/* <ColorModeSwitcher marginLeft='0.6rem' /> */}
			</Flex>
		</Flex>
	)
}
