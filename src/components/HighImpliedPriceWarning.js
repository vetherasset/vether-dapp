import React from 'react'
import PropTypes from 'prop-types'
import { AlertIcon, Box, Alert, AlertTitle, AlertDescription, Link, CloseButton } from '@chakra-ui/react'

export const HighImpliedPriceWarning = (props) => {

	HighImpliedPriceWarning.propTypes = {
		impliedValue: PropTypes.string,
		price: PropTypes.string,
		setState: PropTypes.any.isRequired,
	}

	return (
		<Alert
			status="warning"
			variant="subtle"
			flexDirection="row"
			alignItems="center"
			justifyContent="center"
			textAlign="justify"
		>
			<AlertIcon />
			<Box flex='1'>
				<AlertTitle>Are you sure you want to burn?</AlertTitle>
				<AlertDescription display='block'>
					Implied price {props.impliedValue ? <i>({props.impliedValue})</i> : ''} is already above market{props.price ? <i> ({props.price})</i> : ''}!
					<br/>
					Consider <Link isExternal href='https://app.uniswap.org/#/swap/0x4ba6ddd7b89ed838fed25d208d4f644106e34279' style={{ textDecoration: 'underline' }}>buying on Uniswap</Link> now instead.
				</AlertDescription>
			</Box>
			<CloseButton position="absolute" right="8px" top="8px" onClick={() => props.setState(0)}/>
		</Alert>
	)
}
