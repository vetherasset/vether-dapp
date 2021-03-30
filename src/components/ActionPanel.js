import React, { useState } from 'react'
import PropTypes from 'prop-types'
import defaults from '../common/defaults'
import { Flex, Accordion, AccordionButton, AccordionItem, AccordionPanel,
	Box, Container, Heading, Fade } from '@chakra-ui/react'
import { BurnEther } from '../dialogs/burnEther'

const CloseButton = () => {
	return (
		<AccordionButton
			display='block'
			width={'auto'}
			m='0 auto'
			justifyContent='center'
			borderRadius='md'
			_hover={{ background: 'none' }}
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
		<Fade in={true} height='100%'>
			<AccordionButton height='100%' p='26px 117px'>
				<Heading as='span' size='1rem' ml='5px'>{props.name}</Heading>
			</AccordionButton>
		</Fade>
	)
}

export const ActionPanel = (props) => {

	const [isOpen, setIsOpen] = useState(-1)

	return (
		<Flex w={{ sm: '100%', md: '60ch' }}
			bg={isOpen > -1 ? '#fff5d4' : 'accent'}
			color='black'
			pos='fixed'
			bottom='0'
			maxWidth={defaults.layout.width}
			mb={{ sm: '0', md: '112px' }}
			borderRadius={{ sm: isOpen > -1 ? '0.8rem 0.8rem 0 0' : '0', md: '0.8rem' }}
			left='50%'
			transform='translateX(-50%)'
			alignItems='center'
			{...props}>
			<Accordion
				layerStyle='actionPanel'
				alignItems='middle'
				allowToggle
				onChange={(n) => setIsOpen(n)}>
				<AccordionItem border='none'>
					{({ isExpanded }) => (
						<>
							{isExpanded &&
								<>
									<CloseButton/>
								</>
							}
							<AccordionPanel p={0}>
								<Box maxW={defaults.layout.width} m='0 auto'>
									<Container minH='600px' display='flex' flexFlow='column'>
										<BurnEther/>
									</Container>
								</Box>
							</AccordionPanel>
							{!isExpanded && isOpen === -1 &&
								<ActionButton name='Burn'/>
							}
						</>
					)}
				</AccordionItem>

				<AccordionItem border='none'>
					{({ isExpanded }) => (
						<>
							{isExpanded &&
									<CloseButton/>
							}
							<AccordionPanel p={0}>
								<Container minH='600px' display='flex' flexFlow='column'>
									<BurnEther/>
								</Container>
							</AccordionPanel>
							{!isExpanded && isOpen === -1 &&
								<ActionButton name='Claim'/>
							}
						</>
					)}
				</AccordionItem>
			</Accordion>
		</Flex>
	)
}
