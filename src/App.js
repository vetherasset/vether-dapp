import React from 'react'
import { ChakraProvider, theme } from '@chakra-ui/react'

const App = () => {
	return (
		<ChakraProvider theme={theme}>
		</ChakraProvider>
	)
}

export default App