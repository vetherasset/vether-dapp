import React from 'react'
import { Button, Link, Menu, MenuButton, MenuItem, MenuDivider, MenuList, Image } from '@chakra-ui/react'
import { HiDotsHorizontal } from 'react-icons/hi'
import { FaDiscord, FaTelegramPlane, FaGithub } from 'react-icons/fa'
import { IoIosPaper } from 'react-icons/io'
import { IoBarChart } from 'react-icons/io5'
import { MdHelp } from 'react-icons/md'
import UniswapIcon from '../assets/svg/uniswap.svg'

const linkStyle = {
	width: '100%',
	display: 'inline-block',
	padding: '0.4rem 0.8rem',
	_hover: {
		textDecoration: 'none',
	},
}

const iconStyle = {
	display: 'inline-block',
	marginInlineEnd: '0.6rem',
	fontSize: '0.9rem',
	verticalAlign: 'baseline',
}

const menuItemStyle = {
	padding: '0',
}

export const InfoMenu = (props) => {
	return (
		<Menu>
			<MenuButton as={Button} ml={'0.6rem'} fontSize={{ base: '0.65rem', sm: 'sm' }} {...props}>
				<HiDotsHorizontal/>
			</MenuButton>
			<MenuList>
				<MenuItem {...menuItemStyle}>
					<Link {...linkStyle} isExternal href='https://app.uniswap.org/#/swap/0x4ba6ddd7b89ed838fed25d208d4f644106e34279'>
						<Image src={UniswapIcon} display='inline-block' marginInlineEnd='0.5rem' width='14.4px' verticalAlign='baseline' />
						Uniswap
					</Link>
				</MenuItem>
				<MenuItem {...menuItemStyle}>
					<Link {...linkStyle} isExternal href='https://stats.vetherasset.app/'>
						<IoBarChart style={iconStyle}/>
						Analytics
					</Link>
				</MenuItem>
				<MenuItem {...menuItemStyle}>
					<Link {...linkStyle} isExternal href='https://wp.vetherasset.io/'>
						<IoIosPaper style={iconStyle}/>
						Whitepaper
					</Link>
				</MenuItem>
				<MenuItem {...menuItemStyle}>
					<Link {...linkStyle} isExternal href='https://docs.vetherasset.io/'>
						<MdHelp style={iconStyle}/>
						Docs
					</Link>
				</MenuItem>
				<MenuDivider />
				<MenuItem {...menuItemStyle}>
					<Link {...linkStyle} isExternal href='https://discord.com/invite/c5aBC7Q'>
						<FaDiscord style={iconStyle}/>
						Discord
					</Link>
				</MenuItem>
				<MenuItem {...menuItemStyle}>
					<Link {...linkStyle} isExternal href='https://t.me/vaderprotocol'>
						<FaTelegramPlane style={iconStyle}/>
						Telegram
					</Link>
				</MenuItem>
				<MenuItem {...menuItemStyle}>
					<Link {...linkStyle} isExternal href='https://github.com/vetherasset/'>
						<FaGithub style={iconStyle}/>
						Github
					</Link>
				</MenuItem>
			</MenuList>
		</Menu>
	)
}
