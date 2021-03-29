import React, { useState } from 'react'
import defaults from '../common/defaults'
import { Flex, Accordion, AccordionButton, AccordionItem, AccordionPanel,
	Box, Container, Heading } from '@chakra-ui/react'

export const ActionPanel = (props) => {

	const [isOpen, setIsOpen] = useState(-1)

	return (
		<Flex w='100%'
			bg='accent'
			color='black'
			pos='fixed'
			bottom='0'
			maxWidth={defaults.layout.width}
			minHeight='90px'
			mb='99px'
			borderRadius='30px'
			left='50%'
			transform='translateX(-50%)'
			alignItems='center'
			{...props}>
			<Accordion layerStyle='actionPanel' allowToggle onChange={(n) => setIsOpen(n)}>
				<AccordionItem>
					{({ isExpanded }) => (
						<>
							{isExpanded &&
								<>
									<AccordionButton
										display='block'
										minW='200px'
										maxW='200px'
										m='0 auto'
										justifyContent='center'>
										<Heading as='span' size='sm'>Close</Heading>
									</AccordionButton>
								</>
							}
							<AccordionPanel pb={4}>
								<Box maxW={defaults.layout.width} m='0 auto'>
									<Container minH='600px' />
								</Box>
							</AccordionPanel>
							{!isExpanded && isOpen === -1 &&
								<AccordionButton
									display='block'
									minW='200px'
									maxW='200px'
									m='0 auto'
									justifyContent='center'>
									<Heading as='span' size='sm'>Burn</Heading>
								</AccordionButton>
							}
						</>
					)}
				</AccordionItem>

				<AccordionItem>
					{({ isExpanded }) => (
						<>
							{isExpanded &&
									<AccordionButton
										display='block'
										minW='200px'
										maxW='200px'
										m='0 auto'
										justifyContent='center'>
										<Heading as='span' size='sm'>Close</Heading>
									</AccordionButton>
							}
							<AccordionPanel pb={4}>
								<Box maxW={defaults.layout.width} m='0 auto'>
									<Container minH='600px' />
								</Box>
							</AccordionPanel>
							{!isExpanded && isOpen === -1 &&
								<AccordionButton
									display='block'
									minW='200px'
									maxW='200px'
									m='0 auto'
									justifyContent='center'>
									<Heading as='span' size='sm'>Claim</Heading>
								</AccordionButton>
							}
						</>
					)}
				</AccordionItem>
			</Accordion>
		</Flex>
	)
}
