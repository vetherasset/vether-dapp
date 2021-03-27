import React from 'react'
import defaults from '../common/defaults'
import { Box } from '@chakra-ui/react'

import { Overview } from '../components/Overview'

const Index = () => {

	return (
		<Box maxW={defaults.layout.width} m='0 auto'>
			<Overview />
		</Box>
	)
}

export default Index
