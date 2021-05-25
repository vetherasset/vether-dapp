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
import spinner from './spinner'
import fonts from './fonts'

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
				bg: mode('#ffffff', '#000000')(props),
				'-ms-overflow-style': 'none',
				'scrollbar-width': 'none',
			},
			'html::-webkit-scrollbar': {
				display: 'none',
			},
			'input::placeholder': {
				color: '#000',
			},
			'.chakra-alert button:focus': {
				boxShadow: '0 0 0 3px #ff8ac091',
			},
			'.chakra-toast__inner': {
				width: '30vw',
			},
			'option': {
				color: 'white',
			},
		}),
	},
	fonts: fonts,
	textStyles: typography,
	colors: colors,
	components: {
		Button: button,
		Input: input,
		NumberInput: numberInput,
		Badge: badge,
		Tooltip: tooltip,
		Select: select,
		Progress: {
			baseStyle: {
				background: 'red',
			},
		},
		MenuItem: menuitem,
		Link: link,
		Spinner: spinner,
		Toast: {
			minWidth: '440px',
			baseStyle: {
				bg: 'red',
			},
		},
	},
	layerStyles: {
		overview: {
			bg: '#2a2a2a',
			borderRadius: '11px',
			marginBottom: '17px',
			p: '22px 19px 13px',
			minHeight: '93px',
			border: '1px solid rgba(255, 255, 255, 0.2)',
		},
		actionPanel: {
			display: 'flex',
			width: '100%',
			justifyContent: 'center',
		},
	},
}

export default extendTheme(overrides)
