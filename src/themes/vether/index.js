import { mode } from '@chakra-ui/theme-tools'
import typography from './typography'
import colors from './colors'
import badge from './badge'
import button from './button'
import input from './input'
import { extendTheme } from '@chakra-ui/react'
import defaults from '../../common/defaults'

const overrides = {
	config: {
		useSystemColorMode: false,
		initialColorMode: defaults.theme.mode,
	},
	styles: {
		global: props => ({
			body: {
				fontFamily: 'Body',
				fontSize: '1em',
				fontWeight: '300',
				bg: mode('#ffffff', '#110D02')(props),
			},
			'button:focus': {
				boxShadow: '0 0 0 3px rgba(206, 150, 0, 0.6)!important',
			},
		}),
	},
	textStyles: typography,
	colors: colors,
	components: {
		Button: button,
		Input: input,
		Badge: badge,
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
