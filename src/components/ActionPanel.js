import React, { useState } from 'react'
import PropTypes from 'prop-types'
import defaults from '../common/defaults'
import { Flex, Accordion, AccordionButton, AccordionItem, AccordionPanel,
	Box, Container, Heading } from '@chakra-ui/react'
import { BurnEther } from '../dialogs/burnEther'
import { ClaimVeth } from '../dialogs/claimVeth'

const CloseButton = () => {
	return (
		<AccordionButton
			display='block'
			width={'auto'}
			m='0 auto'
			justifyContent='center'
			borderRadius='md'
			_hover={{ background: 'none' }}
			_focus={{ boxShadow: '0 0 0 3px rgba(206, 150, 0, 0.6)' }}
		>
			<Heading as='span' size='sm'>Close</Heading>
		</AccordionButton>
	)
}

const ActionButton = (props) => {

	ActionButton.propTypes = {
		name: PropTypes.string.isRequired,
	}

	return (
		<AccordionButton
			height='100%'
			width='100%'
			justifyContent='center'
			fontSize={{ base: '0.90rem', sm: '1rem' }}
			p={{ base: '23px 0', sm: '26px 0' }}
			_focus={{ boxShadow: '0 0 0 3px rgba(206, 150, 0, 0.6)' }}
		>
			<Heading as='span' size='1rem' ml='5px'>{props.name}</Heading>
		</AccordionButton>
	)
}

const Body = (props) => {

	Body.propTypes = {
		isOpen: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		children: PropTypes.object.isRequired,
		index: PropTypes.number.isRequired,
	}

	return (
		<AccordionItem
			width={props.isOpen === -1 ? '50%' : props.isOpen === props.index ? '100%' : '0'}
			border='none'>
			{({ isExpanded }) => (
				<>
					{isExpanded &&
								<>
									<CloseButton/>
								</>
					}
					<AccordionPanel p={0} visibility={props.isOpen === -1 ? 'hidden' : 'visible'} width={props.isOpen === -1 ? 0 : 'auto'}>
						<Box maxW={defaults.layout.width} m='0 auto'>
							<Container
								minH='600px'
								maxH='600px'
								display='flex'
								flexFlow='column'
								justifyContent='space-around'
								alignItems='center'>
								{props.children}
							</Container>
						</Box>
					</AccordionPanel>
					{!isExpanded && props.isOpen === -1 &&
								<ActionButton name={props.name}/>
					}
				</>
			)}
		</AccordionItem>
	)
}

export const ActionPanel = (props) => {

	const [isOpen, setIsOpen] = useState(-1)

	const itemProps = {
		width: isOpen === -1 ? '0' : '307px',
		visible: isOpen,
	}

	const items = [
		{
			name: 'Burn',
			content: <BurnEther {...itemProps}/>,
		},
		{
			name: 'Claim',
			content: <ClaimVeth {...itemProps}/>,
		},
	]

	return (
		<Flex w={{ base: '100%', md: '60ch' }}
			bg={isOpen > -1 ? '#fff6d9' : 'accent'}
			color='black'
			pos={isOpen > -1 ? 'fixed' : { base: 'fixed', sm: 'relative' }}
			bottom={isOpen > -1 ? { base: '0', md: '35px' } : '0'}
			maxWidth={'60ch'}
			borderRadius={{ base: isOpen > -1 ? '0.8rem 0.8rem 0 0' : '0', sm: '0.8rem' }}
			left='50%'
			transform='translateX(-50%)'
			alignItems='center'
			{...props}>
			<Accordion
				layerStyle='actionPanel'
				alignItems='middle'
				allowToggle
				onChange={(n) => setIsOpen(n)}>

				{items.map((item, index) => {
					return (
						<Body isOpen={isOpen} name={item.name} index={index} key={index}>
							{item.content}
						</Body>
					)
				})}

			</Accordion>
		</Flex>
	)
}
