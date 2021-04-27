import React from 'react'
import { Flex, Link, useBreakpointValue, Image } from '@chakra-ui/react'
import { FaDiscord, FaTelegramPlane, FaGithub } from 'react-icons/fa'
import { IoIosPaper } from 'react-icons/io'
import { IoBarChart } from 'react-icons/io5'
import { MdHelp } from 'react-icons/md'
import UniswapIcon from '../assets/svg/uniswap.svg'

export const Footer = (props) => {

	return (
		<>
			{useBreakpointValue({
				base: <Links {...props}/>,
				sm: '',
			})}
		</>
	)
}

const Links = (props) => {

	const linkStyle = {
		margin: '10px auto',
	}

	const iconStyle = {
		display: 'inline-block',
		marginInlineEnd: '0.5rem',
		fontSize: '0.83rem',
		verticalAlign: 'baseline',
	}

	return(
		<Flex {...props} w='100%' mb='75px' justifyContent='space-between' flexWrap='wrap'>
			<Link {...linkStyle} isExternal href='https://app.uniswap.org/#/swap/0x4ba6ddd7b89ed838fed25d208d4f644106e34279'>
				<Image src={UniswapIcon} display='inline-block' marginInlineEnd='0.5rem' width='14.4px' verticalAlign='baseline' />
				Uniswap
			</Link>
			<Link {...linkStyle} isExternal href='https://wp.vetherasset.io/'>
				<IoIosPaper style={iconStyle}/>
				Whitepaper
			</Link>
			<Link {...linkStyle} isExternal href='https://stats.vetherasset.app/'>
				<IoBarChart style={iconStyle}/>
				Analytics
			</Link>
			<Link {...linkStyle} isExternal href='https://docs.vetherasset.io/'>
				<MdHelp style={iconStyle}/>
				Docs
			</Link>
			<Link {...linkStyle} isExternal href='https://discord.com/invite/c5aBC7Q'>
				<FaDiscord style={iconStyle}/>
				Discord
			</Link>
			<Link {...linkStyle} isExternal href='https://t.me/vaderprotocol'>
				<FaTelegramPlane style={iconStyle}/>
				Telegram
			</Link>
			<Link {...linkStyle} isExternal href='https://github.com/vetherasset/'>
				<FaGithub style={iconStyle}/>
				Github
			</Link>
		</Flex>
	)
}