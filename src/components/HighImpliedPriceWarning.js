import React from 'react'
import PropTypes from 'prop-types'
import {
	AlertIcon, Box, Alert, AlertTitle, AlertDescription,
	Link, CloseButton, ScaleFade, useBreakpointValue,
} from '@chakra-ui/react'

export const HighImpliedPriceWarning = (props) => {

	HighImpliedPriceWarning.propTypes = {
		impliedValue: PropTypes.string,
		price: PropTypes.string,
		state: PropTypes.any.isRequired,
		setState: PropTypes.any.isRequired,
	}


	return (
		<ScaleFade
			initialScale={0.9}
			in={props.state < 1 ? false : true}
			unmountOnExit>
			<Alert
				status='warning'
				variant='subtle'
				flexDirection='row'
				width='100%'
				justifyContent='center'
				textAlign='justify'
				display={props.state < 1 ? 'none' : 'flex'}
				marginBottom='0.5rem'
			>
				<AlertIcon />
				<Box flex='1'>
					<AlertTitle>Are you sure you want to burn?</AlertTitle>
					<AlertDescription display='block'>
					Implied price {props.impliedValue ? <i>({props.impliedValue})</i> : ''} is already above market{props.price ? <i> ({props.price})</i> : ''}!
						{useBreakpointValue({
							base: ' ',
							sm: <br/>,
						})}
					Consider <Link isExternal href='https://app.uniswap.org/#/swap/0x4ba6ddd7b89ed838fed25d208d4f644106e34279' style={{ textDecoration: 'underline' }}>buying on Uniswap</Link> now instead.
					</AlertDescription>
				</Box>
				<CloseButton position="absolute" right="8px" top="8px" onClick={() => props.setState(0)}/>
			</Alert>
		</ScaleFade>
	)
}
