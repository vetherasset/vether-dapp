import { mode } from '@chakra-ui/theme-tools'
import typography from './typography'
import colors from './colors'
import badge from './badge'
import button from './button'
import tooltip from './tooltip'
import input from './input'
import numberInput from './numberinput'
import select from './select'
import menuitem from './menuitem'
import link from './link'
import { extendTheme } from '@chakra-ui/react'
import defaults from '../../common/defaults'

const overrides = {
	config: {
		useSystemColorMode: false,
		initialColorMode: defaults.theme.mode,
	},
	styles: {
		global: props => ({
			html: {
				scrollbarWidth: 'none',
			},
			body: {
				fontFamily: 'Body',
				fontSize: '1em',
				fontWeight: '300',
				bg: mode('#ffffff', '#110D02')(props),
				'-ms-overflow-style': 'none',
				'scrollbar-width': 'none',
			},
			'html::-webkit-scrollbar': {
				display: 'none',
			},
			'input::placeholder': {
				color: '#000',
			},
		}),
	},
	textStyles: typography,
	colors: colors,
	components: {
		Button: button,
		Input: input,
		NumberInput: numberInput,
		Badge: badge,
		Tooltip: tooltip,
		Select: select,
		MenuItem: menuitem,
		Link: link,
	},
	layerStyles: {
		overview: {
			bg: 'black',
			border: '1px solid #ffc300ce',
			borderRadius: '19px',
			marginBottom: '15px',
			p: '19px',
			minHeight: '95px',
			boxShadow: '0px 0px 32px -20px #ffffff9c',
		},
		actionPanel: {
			display: 'flex',
			width: '100%',
			justifyContent: 'center',
		},
	},
}

export default extendTheme(overrides)
