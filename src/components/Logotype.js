import React from 'react'
import { Image } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import logo from '../assets/svg/logotype.svg'

export const Logotype = (props) => {

	return (
		<Link to='/'>
			<Image src={logo}
				{...props}
			/>
		</Link>
	)
}
