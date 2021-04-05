import React, { useState } from 'react'
import PropTypes from 'prop-types'
import defaults from '../common/defaults'
import { Flex, Accordion, AccordionButton, AccordionItem, AccordionPanel,
	Box, Container, Heading, Fade } from '@chakra-ui/react'
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
			<AccordionButton height='100%'
				p={{ base: '26px 102px', sm: '26px 117px' }}>
				<Heading as='span' size='1rem' ml='5px'>{props.name}</Heading>
			</AccordionButton>
		</Fade>
	)
}

export const ActionPanel = (props) => {

	const [isOpen, setIsOpen] = useState(-1)

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
				<AccordionItem border='none'>
					{({ isExpanded }) => (
						<>
							{isExpanded &&
								<>
									<CloseButton/>
								</>
							}
							<AccordionPanel p={0} visibility={isOpen === -1 ? 'hidden' : 'visible'}>
								<Box maxW={defaults.layout.width} m='0 auto'>
									<Container minH='600px' display='flex' flexFlow='column' justifyContent='space-around'>
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
							<AccordionPanel p={0} visibility={isOpen === -1 ? 'hidden' : 'visible'}>
								<Container minH='600px' display='flex' flexFlow='column' justifyContent='space-around'>
									<ClaimVeth/>
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
